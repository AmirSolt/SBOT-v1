


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







    
class ParsedForm:
    pass




class QuestionTypes:
    pass

class InputTypes:
    pass