


def read_js(path):
    data = ""
    with open(path, 'r') as file:
        data = file.read().rstrip()
        
    return data


def getGroupScript():
    text = read_js("C:/Users/killo/Desktop/SBOT/helper/scripts/group.js")
    
    text += "return result"
    
    return text
    
print(getGroupScript())