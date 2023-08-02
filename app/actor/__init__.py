
from app.browser import Browser
from app.profile import Profile
from d_types import GroupAnswer, ActionType
from funcs import AI, pauser



class Actor:
    
    def __init__(self, browser:Browser, profile:Profile) -> None:
        self.browser=browser
        self.profile=profile
    
    def help(self, reason):
        print("===== HELP =====")
        print(f"===== {reason} =====")
        self.profile.print_info()
        input("===== continue? =====")
        
    def login_survey_junkie(self):
        print("logging in ....")
        email = self.profile.email
        password = self.profile.password
        self.browser.fill_field(".login-popup input[type=email]", "", email)
        self.browser.fill_field(".login-popup input[type=password]", "", password)
        self.browser.click_element(".login-popup button", "")
        

    def solve_input_answer(self, group_answer:GroupAnswer):
        
        for chain in group_answer.chains:
            
            for action in chain.actions:
        
                match action.action_type:
                    case ActionType.field:
                        self.solve_field(action.path, chain.answer, group_answer.group.context_path)
                    case ActionType.select:
                        self.solve_select_type(action.path, group_answer.group.context_path)
                    case ActionType.dropdown:
                        self.solve_dropdown_by_index(action.path, action.option_index, group_answer.group.context_path)


    def solve_field(self, element_path:str, answer:str, context_path:str):
        if self.browser.fill_field(element_path, context_path, answer):
            print("action: [solve_field]")
            pauser.action_pause()
        else:
            print("failed action: [solve_field]")
        

    def solve_select_type(self, element_path:str, context_path:str):
        if self.browser.click_element(element_path, context_path):
            print("action: [solve_select_type]")
            pauser.action_pause()
        else:
            print("failed action: [solve_select_type]")


    def solve_dropdown_by_index(self, element_path:str, index:int, context_path:str):
        if self.browser.choose_option(element_path, context_path, index):
            print("action: [solve_dropdown]")
            pauser.action_pause()
        else:
            print("failed action: [solve_dropdown by index]")

    def solve_dropdown(self, element_path:str, chosen_option:str, options:list[str], context_path:str):
        index = AI.get_highest_fuzzy_match_index(chosen_option, options)
        if self.browser.choose_option(element_path, context_path, index):
            print("action: [solve_dropdown]")
            pauser.action_pause()
        else:
            print("failed action: [solve_dropdown by option]")
    

    
    def go_to(self, url):
        print("action: [go_to]")
        self.browser.get(url)
        pauser.action_pause()