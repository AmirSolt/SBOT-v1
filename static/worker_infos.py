

class WorkerInfo:
    
    def __init__(self, id) -> None:
        self.id = id
        self.memory = {}
    def add_to_memory(self, key, value):
        self.memory[key] = value

def get_worker_infos():

    return [
        get_worker_0(),
    ]
    
    
    
def get_worker_0():
    w = WorkerInfo()
    w.add_to_memory("email", "willis32@caspear.com	")
    w.add_to_memory("password", "48f&S9cnl6x2")
    w.add_to_memory("first name", "william")
    w.add_to_memory("last name", "santino")
    return w