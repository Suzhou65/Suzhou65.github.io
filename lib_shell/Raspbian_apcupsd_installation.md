# Raspberry Setup APC UPS
**What is this?**
Raspberry Pi OS (Raspbian) install apcupsd Installation guide

**What is apcupsd?**
apcupsd is a open source UPS mangement and controlling software, it allows the computer to interact with APC UPSes.

## Install apcupsd
First, install apcupsd utility, and the dynamic web page monitor.
```shell
sudo apt-get -y install apcupsd apcupsd-cgi
```

Then backup the configuration file.
```shell
sudo cp /etc/apcupsd/apcupsd.conf /etc/apcupsd/apcupsd.orig
sudo cd /etc/apcupsd/
```

Using vim editor to editing the configuration file.
```shell
sudo vim apcupsd.conf
```

If you are using APC BN650M1 series, and connect to raspberry by USB cable, the configuration file will be like this:
```conf
## apcupsd.conf v1.1 ##
UPSNAME BN650M1-TW

# UPSCABLE <cable>
UPSCABLE usb

# UPSTYPE
UPSTYPE usb
DEVICE

# POLLTIME <int>
#POLLTIME 60

# LOCKFILE <path to lockfile>
LOCKFILE /var/lock

# SCRIPTDIR <path to script directory>
SCRIPTDIR /etc/apcupsd

# PWRFAILDIR <path to powerfail directory>
PWRFAILDIR /etc/apcupsd

# NOLOGINDIR <path to nologin directory>
NOLOGINDIR /etc

# During power failures
ONBATTERYDELAY 6
BATTERYLEVEL 15

MINUTES 10
TIMEOUT 0

ANNOY 60
ANNOYDELAY 60

# NOLOGON <string> [ disable | timeout | percent | minutes | always ]
NOLOGON disable
# KILLDELAY <seconds>  0 disables
KILLDELAY 0

# Network Information Server
# NETSERVER [ on | off ] on enables, off disables the network
NETSERVER on

# NISIP <dotted notation ip address>
NISIP 0.0.0.0

# NISPORT <port> IANA
NISPORT 3551

EVENTSFILE /var/log/apcupsd.events
EVENTSFILEMAX 10

# Configuration statements used if sharing
# UPSCLASS
UPSCLASS standalone

# UPSMODE
UPSMODE disable
```

After saving the configuration file, start (or restart) apcupsd service.
```shell
sudo service apcupsd start
```

Running commond, if everything goes right, you will saw the UPS status.
```shell
apcaccess
```

## Install Apache
If you want to monitoring your UPS online (via LAN network), please follow the instructions below.

Install Apache 2.4.
```shell
sudo apt-get -y install apache2

```

Then backup the configuration file.
```shell
sudo cp /etc/apache2/apache2.conf /etc/apache2/apache2.orig
sudo cp /etc/apache2/sites-available/000-default.conf /etc/apache2/sites-available/000-default.orig
```

Using vim editor to editing the apache configuration file.
```shell
sudo cd /etc/apache2/
sudo vim apache2.conf
```

The configuration file section at **Directory** will be like this:
```apacheconf
<Directory /var/www/>
	Options Indexes FollowSymLinks
	AllowOverride None
	Require all granted
</Directory>

#	apcupsd
ScriptAlias /apcupsd/ /usr/lib/cgi-bin/apcupsd/
<Directory "/usr/lib/cgi-bin/apcupsd">
	DirectoryIndex upsstats.cgi
	Options +FollowSymLinks +ExecCGI
	AddHandler cgi-script .cgi
	DirectoryIndex upsstats.cgi
	Require all granted
</Directory>
```

Using vim editor to editing the website configuration file.
```shell
sudo cd /etc/apache2/sites-available/
sudo vim 000-default.conf
```

The configuration file section at **serve-cgi-bin.conf** will be like this:
```apacheconf
Include conf-available/serve-cgi-bin.conf

	# apcupsd-cgi
	ScriptAlias /apcupsd/ /usr/lib/cgi-bin/apcupsd/
	<Directory "/usr/lib/cgi-bin/apcupsd">
		DirectoryIndex multimon.cgi
		Options +FollowSymLinks +ExecCGI
		AddHandler cgi-script .cgi
		DirectoryIndex upsstats.cgi
		Require all granted
	</Directory>
```

Enable the CGI module
```shell
sudo a2enmod cgi
```

After saving the configuration file, running configtest to check syntax errors, if everything goes right, you will saw Syntax OK
```shell
pi@raspberry:/etc/apache2 $ sudo apache2ctl configtest
Syntax OK
```

If you saw this error, please follow the instructions below.
```shell
pi@raspberry:/etc/apache2 $ sudo apache2ctl configtest
apache2: Could not reliably determine the server's fully qualified domain name, using 127.0.1.1 for ServerName
Syntax OK
```

Go back to apache configuration file.
```shell
sudo cd /etc/apache2/
sudo vim apache2.conf
```

Add this section
```shell
ServerName localhost
```

After saving the configuration file, start (or restart) apcupsd service.
```shell
sudo service apache2 start
```
```shell
sudo service apache2 reload
```
Now you can check the CGI monitor
```html
http://your.server.ipaddress/apcupsd/
```

## Tips
If you have multi-APC UPSes which can broadcasting data, then you can choice multimon function into index as default.

Please modify the section below
```apacheconf
DirectoryIndex upsstats.cgi
```
into
```apacheconf
DirectoryIndex multimon.cgi
```
