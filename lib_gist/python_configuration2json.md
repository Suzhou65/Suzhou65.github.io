
## Configuration_to_JSON

### Import lib
```python
import csv
import json
from getpass import getpass

import datetime
#Time
def current_time():
    today = datetime.datetime.now()
    return today.strftime("%Y-%m-%d %H:%M")
```

### Example Dict
```python
exp_config = {"ipb_member_id":"",
    "ipb_pass_hash":"",
    "sender":"",
    "scepter":"",
    "receiver":""}
```

### Function
```python
#Sign in
def configuration( update_config=() ):
    if bool(update_config) is False:
        #Read data from file
        try:
            with open("config.json", "r") as configuration_file:
                #Return dictionary
                return json.load(configuration_file)
        #If data not found
        except FileNotFoundError:
            #Stamp
            time_initialize = current_time()
            #Initialization
            print("Configuration not found, please initialize.")
            ipb_member_id = input("Please enter the ipb_member_id: ")
            ipb_pass_hash = getpass("Please enter the ipb_pass_hash: ")
            initialize_config = {
                "last_update_time":time_initialize,
                "ipb_member_id":ipb_member_id,
                "ipb_pass_hash":ipb_pass_hash,
                }
            #Save
            with open("config.json", "w") as configuration_file:
                json.dump(initialize_config, configuration_file, indent=2)
                configuration_file.close()
                #Return dictionary after initialize
                return initialize_config
    #Update
    elif bool(update_config) is True:
        with open("config.json", "w") as configuration_file:
            json.dump(update_config, configuration_file, indent=2)
            configuration_file.close()
            #Return dictionary after update
            return update_config
```

### Check
```python
table = configuration()
table

#Abstract
table["ipb_pass_hash"]
```

### Update
```python
update_config = table
time_update = current_time()
update_config["last_update_time"] = time_update
update_config["ipb_pass_hash"] = "nyaaaaaa"
configuration(update_config)
```

### Check Again
```python
table = configuration()
table
```

### Adding Configuration
```python
mail_config = table
try:
    sender_account = mail_config["sender"]
    sender_password = mail_config["scepter"]
    receiver = mail_config["receiver"]
#If configuration not found
except KeyError:
    #Initialization
    update_config = mail_config
    print("Mail Configuration not found, please initialize.\r\n")
    sender_account = input("Please enter the sender account: ")
    sender_password = getpass("Please enter the sender password: ")
    receiver = input("Please enter the receiver address: ")
    update_config["sender"] = sender_account
    update_config["scepter"] = sender_password
    update_config["receiver"] = receiver
    #Stamp
    time_mail_config_add = current_time()
    update_config["last_update_time"] = time_mail_config_add
    #Update configuration
    configuration(update_config)
```