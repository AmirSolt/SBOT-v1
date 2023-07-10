import os
import pickle
import json





def get_all_dirs(directory_path):
    return [d for d in os.listdir(directory_path) if os.path.isdir(os.path.join(directory_path, d))]


def create_dir_if_not_exist(path):
    if not os.path.exists(path):
        os.makedirs(path)
        
        
def does_file_exist(filename):
    return os.path.isfile(filename)
        

def get_filename(path:str)->str:
    return os.path.basename(path)



        

supported_files = ["json", "pickle", "html"]

def write_file(path:str, content):
    ext = os.path.splitext(path)[-1].lower()[1:]
    if ext=="html":
        write_html(path, content)
    elif ext=="json":
        write_json(path, content)
    elif ext=="pickle":
        write_pickle(path, content)
    else:
        print(f"Cannot write {ext} filetype.")

def read_file(path:str):
    ext = os.path.splitext(path)[-1].lower()[1:]
    if ext=="html":
        return read_html(path)
    elif ext=="json":
        return read_json(path)
    elif ext=="pickle":
        return read_pickle(path)
    else:
        print(f"Cannot read {ext} filetype.")

def write_html(path, content):
    with open(path, 'w', encoding="utf-8") as file:
        file.write(content)

def read_html(path):
    with open(path, 'r') as file:
        return file.read()

def write_json(path, content):
    with open(path, 'w') as file:
        json.dump(content, file)

def read_json(path):
    with open(path, 'r') as file:
        return json.load(file)

def write_pickle(path, content):
    with open(path, 'wb') as file:
        pickle.dump(content, file)

def read_pickle(path):
    with open(path, 'rb') as file:
        return pickle.load(file)