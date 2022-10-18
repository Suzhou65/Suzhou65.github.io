# Python Playground

## Markdown title
```python
#README.md
text = input()

print("#" + text.lower().replace(" ","_"))
```

## Scheduled
```python
import time
import schedule

def notification():
    print("tick")

#Scheduled
schedule.every(5).seconds.do(notification)
#Loop
try:
    while True:
        schedule.run_pending()
        time.sleep(1)
#Crtl+C to exit
except KeyboardInterrupt:
    print("tick-tock")
#Error
except Exception:
    print("Error")
```

## Function
### Exception
```python
def plus(a, b):
    try:
        return a + b
    except Exception as error_status:
        return error_status
```
### Tuple
```python
def plus( a=(), b=(), c=() ):
    list_int = [1, 3, 5, 7, 9, 11]

    if bool(c) is False:
        print(bool(c) is False)
        return list_int
    else:
        print(bool(c) is False)
        return int(a) + int(b) + list_int[4]
```
Tset it.
```python
#Default
plus()

#Adding
plus( 7 ,9 ,True)
```

## Type checker
### Int or Float
```python
if type(t) is int:
    t = float(t)
elif type(t) is float:
    pass
else:
    print("t should be int or float")
```
### Bool
```python
if bool(result) is True:
    print("BT")

elif bool(result) is False:
    print("BF")
else:
    print("O")
```
### Int, Str, list, bool or neither
```python
if result is None:
    print("NoneType")
elif type(result) is str:
    print("String")
elif type(result) is int:
    print("Integer")
elif type(result) is float:
    print("Float")
elif type(result) is list:
    print("List")
elif type(result) is bool:
    if bool(result) is True:
        print("Bool, True")
    elif bool(result) is False:
        print("Bool, False")
else:
    print("Neither !")
```

## List
### Serach
```python
#List
listA = [["A"], [11, 8.0],[-4,434,0]]
#Element
search_element = "A"

#Srearching
if any(search_element in sublist for sublist in listA):
   print("Present")
else:
   print("Not Present")
```
### List operating
```python
list_a = ["1","2",3,"4",5,"6","7","8",9,"10"]

#Adding
list_a.append('AHA')

#Remove
list_a = list_a[:10]
```
### Remove element from list using loop
```python
list_s = ['29259 S sshd:pi@pts/0', '29571 S sshd:pi@notty', '29573 Ss /usr/lib/openssh/sftp-server', '31378 S sshd:pi@notty', '31380 Ss /usr/lib/openssh/sftp-server', '31431 S+ grep-issh']

#Check origin
list_s
#Remove element
list_s = [x for x in list_s if "grep" not in x]
#Check change
list_s
```
### Compare bool list
```python
list_b = [False, False]
list_2t = [True, True]
list_2f = [False, False]

#Check
if list_b == list_2t:
    print("a")
elif list_b == list_2f:
    print("b")
else:
    print("c")
```
