from d_types import State
from ...profile import Profile
from ...browser import Browser

from ..actor import Actor
from ..observer import Observer


class StateSolver:
    
    
    def __init__(self) -> None:
        self.observer = Observer()
        self.actor = Actor()
    
    def solve(self, browser:Browser, profile:Profile, screenshot_path:str, page_html:str)->Action:
        

        
        state:str = self.observer.get_current_state(screenshot_path, page_html)
        
        
        match state:
            
            case State.login:
                self.actor.act(browser)
                
            case State.menu:
                self.actor.act(browser)
                
            case State.popup:
                self.actor.act(browser)
                
            case State.form:
                self.actor.act(browser)
                
            case State.unknown:
                self.actor.act(browser)
                

            case _:
                raise Exception(f"current state does not exist in solve_state checks. current state: {state}") 
            
                
        