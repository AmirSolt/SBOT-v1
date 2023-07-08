import os






def get_all_dirs(directory_path):
    return [d for d in os.listdir(directory_path) if os.path.isdir(os.path.join(directory_path, d))]


def create_dir_if_not_exist(path):
    if not os.path.exists(path):
        os.makedirs(path)
        
        
def does_file_exist(filename):
    return os.path.isfile(filename)
        
        
def save_file(path:str, content):
    with open(path, "w") as file:
        file.write(content)
    return True
  
    
def read_file(filename, extension):
    with open(f"{filename}.{extension}", "r") as file:
        content = file.read()
    return content
  