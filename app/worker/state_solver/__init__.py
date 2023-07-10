from d_types import State
from ...profile import Profile
from ...browser import Browser

from ..actor import Actor
from ..observer import Observer


class StateSolver:
    
    
    def __init__(self) -> None:
        self.observer = Observer()
        self.actor = Actor()
    
    def solve(self, browser:Browser, profile:Profile, screenshot_path:str, page_html:str)->None:
        print("Solving the current state")
        

        
        state:str = self.observer.get_current_state(screenshot_path, page_html)
        
        
        match state:
            
            case State.login:
                self.actor.ask_help()
                
            case State.menu:
                profile.reset_survey_memory()
                self.actor.ask_help()
                
            case State.popup:
                self.actor.ask_help()
                
            case State.form:
                # self.actor.form_act(browser, profile, page_html)
                self.actor.ask_help()
                
            case State.unknown:
                self.actor.ask_help()
                

            case _:
                raise Exception(f"current state does not exist in solve_state checks. current state: {state}") 
            
                
        