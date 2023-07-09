


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



class PFGTypeException(Exception):
    pass



    
class ParsedFormGroup:
    
    def __init__(self, question:str, inputs:list[str]) -> None:
        self.question = question
        self.inputs = inputs
        # path
        # type of input
        # answer
        # answer_index



class ParsedInput:
    pass