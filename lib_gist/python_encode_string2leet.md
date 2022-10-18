## Leet interpreter

### Reading 1337 dictionary, setting interpreter
```python
import json
def leek_translation(string):
    #Reading leet dictionary
    try:
        with open("leet.json", "r") as leet_dictionary:
            leet_book = json.load(leet_dictionary)
    #If file not found
    except FileNotFoundError:
        print("leet dictionary not found !")
    #Split string
    temporarily = []
    temporarily[:] = string
    #Encode
    try:
        for index, data in enumerate(temporarily):
            for key, value in leet_book.items():
                if key in data:
                    temporarily[index]=data.replace(key, leet_book[key])
        #Join again
        result_string = "".join(temporarily)
        return result_string
    except Exception:
        return None
```

### Using it
```python
string = input("Enter Raw String: ")
output = leek_translation(string)

#Result
print(f"{string} | {output}")
```

### List mode
```python
for string in string_list:
    print(leek_translation(string))
```