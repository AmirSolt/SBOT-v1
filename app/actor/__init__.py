
from app.browser import Browser
from d_types import ParsedInputAnswer, ActionType





class Actor:
    
    def __init__(self, browser:Browser) -> None:
        self.browser=browser
    

    def solve_input_answer(self, parsed_input_answer:ParsedInputAnswer):
        
        match parsed_input_answer.ielement.action_type:
            case ActionType.field:
                self.solve_field(parsed_input_answer.ielement.path, parsed_input_answer.answer)
            case ActionType.select:
                self.solve_select_type(parsed_input_answer.ielement.path, )
            case ActionType.dropdown:
                self.solve_dropdown(parsed_input_answer.ielement.path, parsed_input_answer.option)

    def switch_context(self):
        pass

    def solve_field(self, element_path:str, answer:str):
        # find element. value = answer
        pass

    def solve_select_type(self, element_path:str):
        # click
        pass

    def solve_dropdown(self, element_path:str, chosen_option:str):
        # find select and pick option similar to chosen_option
        pass