
## Update Cloudflare IPs to Apache2 mod_remoteip
### Script

```python
# -*- coding: utf-8 -*-
import requests
from pathlib import Path
import subprocess
import logging
from sys import exit

# Error handling
FORMAT = "%(asctime)s |%(levelname)s |%(message)s"
logging.basicConfig(level=logging.WARNING,filename="remoteip_update.error.log",filemode="a",format=FORMAT)

def UpdateRemoteIPConfig():
    # Config
    Apache2RemoteipConfig = Path("/etc/apache2/conf-available/remoteip.conf")
    try:
        # Link to Cloudflare API
        IPsResponse = requests.get("https://api.cloudflare.com/client/v4/ips",timeout=30)
        # HTTP status code check
        if IPsResponse.status_code != 200:
            raise RuntimeError(f"Unable download IPs form Cloudflare |HTTP {IPsResponse.status_code}")
        # Success
        IPsDict = IPsResponse.json()
        # Check API response
        if not IPsDict.get('success'):
            IPsError = IPsDict.get("errors")
            raise RuntimeError(f"Unable download IPs form Cloudflare | {IPsError}")
        # Merge
        IPs4 = IPsDict.get('result',{}).get('ipv4_cidrs',[])
        IPs6 = IPsDict.get('result',{}).get('ipv6_cidrs',[])
        if not IPs4 or not IPs6:
            raise RuntimeError("Cloudflare API returned an empty CIDR list")
        # Config text
        Lines = [f"RemoteIPTrustedProxy {Addr}" for Addr in (IPs4 + IPs6)]
        Lines.insert(0,"RemoteIPHeader CF-Connecting-IP")
        NewConfigContent = "\n".join(Lines) + "\n"
        # Backup
        BackupContent = (
            Apache2RemoteipConfig.read_text(encoding="utf-8")
            if Apache2RemoteipConfig.exists()
            else None)
        # Write into Apache2 config
        Apache2RemoteipConfig.write_text(NewConfigContent,encoding="utf-8")
        # Validate
        CheckStatus = subprocess.run(["apache2ctl","configtest"],capture_output=True,text=True)
        if CheckStatus.returncode != 0:
            # Redo
            if BackupContent is not None:
                Apache2RemoteipConfig.write_text(BackupContent,encoding="utf-8")
            else:
                Apache2RemoteipConfig.unlink(missing_ok=True)
            ConfigtestStdout = CheckStatus.stdout.strip()
            ConfigtestStderr = CheckStatus.stderr.strip()
            raise RuntimeError(f"Apache2 Remoteip config error |{ConfigtestStdout} |{ConfigtestStderr}")
        # Reload Apache2
        ReloadStatus = subprocess.run(["systemctl","reload","apache2.service"],capture_output=True,text=True)
        if ReloadStatus.returncode != 0:
            ReloadStdout = ReloadStatus.stdout.strip()
            ReloadStderr = ReloadStatus.stderr.strip()
            raise RuntimeError(f"apache2.service reload failed |{ReloadStdout} |{ReloadStderr}")
        # Success
        return Lines
    except Exception as UpdateRemoteIPConfigError:
        raise RuntimeError(f"Unable to update remoteip.conf |{UpdateRemoteIPConfigError}") from UpdateRemoteIPConfigError

# Runtime
try:
    UpdateRemoteIPConfig()
    exit(0)
except Exception as RunTimeError:
    logging.warning(f"Unable update RemoteIp config |{RunTimeError}")
    exit(1)

```

## Resources
### Cloudflare Docs
- [Restoring original visitor IPs](https://developers.cloudflare.com/support/troubleshooting/restoring-visitor-ips/restoring-original-visitor-ips/)
