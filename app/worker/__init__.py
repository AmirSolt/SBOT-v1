
from ..browser import Browser
from ..profile import Profile

from .actor import Actor
from .observer import Observer
from .state_manager import StateManager

from d_types import State, Action


class Worker:
    


    def __init__(self, profile_id:str) -> None:
        self.browser = Browser()
        self.profile = Profile(profile_id)
        self.actor = Actor()
        self.observer = Observer()
        self.state_manager = StateManager()
        
        self.browser.open()
    
    
    
    def tick(self)->None:
        
        # vaccum
                
        screenshot_path = self.browser.get_screenshot_path()
        page_html = self.browser.get_page_html()
        
        state:State = self.observer.get_current_states(screenshot_path, page_html)
        
        actions:list[Action] =  self.state_manager.solve_state(state, screenshot_path, page_html, self.profile)
        
        for action in actions:
            self.actor.act(action)
        

    
    
    def kill(self)->None:
        self.browser.close()