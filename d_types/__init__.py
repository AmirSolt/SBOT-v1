


class State:
    
    login = "login"
    menu = "menu"
    popup = "popup"
    form = "form"
    unknown = "unknown"
    
    @classmethod
    def get_all_states(cls):
        attrs = dir(cls)
        return [attr for attr in attrs if not attr.startswith('__')]
    
class Action:
    
    def __init__(self) -> None:
        pass
    
    
    def ask_help(self):
        print("HELP!~!!!!!!!!!")
        
        
    
class ParsedForm:
    pass
