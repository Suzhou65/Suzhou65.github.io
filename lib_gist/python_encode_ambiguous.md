## Ambiguous interpreter

```python
import json
def ambiguous(string):
    #Reading dictionary
    try:
        with open("ambiguous.json", "r") as leet_dictionary:
            leet_book = json.load(leet_dictionary)
    #If file not found
    except FileNotFoundError:
        print("Dictionary not found !")
    #Separate check
    separate = "_"
    #Split string
    temporarily = []
    temporarily[:] = string
    #Encode
    try:
        if separate in string:
            for index, data in enumerate(temporarily):
                for key, value in leet_book.items():
                    if key in data:
                        temporarily[index]=data.replace(key, leet_book[key])
            #Join again
            result_string = "".join(temporarily)
            return result_string
        else:
            return True
    except Exception:
        return None
```

### Using it
```python
string = input("Enter Raw String: ")
output = ambiguous(string)

#Result
print(f"{string} | {output}")
```

### List mode
```python
for string in string_list:
    print(ambiguous(string))
```