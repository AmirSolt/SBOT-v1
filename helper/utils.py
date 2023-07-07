import os









def create_dir_if_not_exist(path):
    if not os.path.exists(path):
        os.makedirs(path)
        
        
def save_file(path:str, content):
    with open(path, "w") as file:
        file.write(content)
    return True
  
    
def read_file(filename, extension):
    with open(f"{filename}.{extension}", "r") as file:
        content = file.read()
    return content
  