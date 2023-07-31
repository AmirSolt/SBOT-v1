
from app.browser import Browser
from d_types import ParsedInputAnswer, ActionType
from funcs import AI




class Actor:
    
    def __init__(self, browser:Browser) -> None:
        self.browser=browser
    
    def help(self, reason):
        print("===== HELP =====")
        print(f"===== {reason} =====")
        print("==========")
        input("===== continue? =====")
        
    def login_survey_junkie(self):
        print("logging in ....")
        pass

    def solve_input_answer(self, parsed_input_answer:ParsedInputAnswer):
        
        match parsed_input_answer.ielement.action_type:
            case ActionType.field:
                self.solve_field(parsed_input_answer.ielement.path, parsed_input_answer.answer, parsed_input_answer.context_path)
            case ActionType.select:
                self.solve_select_type(parsed_input_answer.ielement.path, parsed_input_answer.context_path)
            case ActionType.dropdown:
                self.solve_dropdown(parsed_input_answer.ielement.path, parsed_input_answer.option, parsed_input_answer.ielement.options, parsed_input_answer.context_path)


    def solve_field(self, element_path:str, answer:str, context_path:str):
        self.browser.fill_field(element_path, context_path, answer)
        pass

    def solve_select_type(self, element_path:str, context_path:str):
        self.browser.click_element(element_path, context_path)

    def solve_dropdown(self, element_path:str, chosen_option:str, options:list[str], context_path:str):
        index = AI.get_highest_fuzzy_match_index(chosen_option, options)
        self.browser.choose_option(element_path, context_path, index)
    

    
    def go_to(self, url):
        self.browser.get(url)