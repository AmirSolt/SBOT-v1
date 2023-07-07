
from ..browser import Browser
from ..profile import Profile

from .actor import Actor
from .observer import Observer
from .state_manager import StateManager

from d_types import State, Action
from helper import utils

class Worker:
    


    def __init__(self, worker_id:str) -> None:
        
        
        self.worker_dir = f"./saves/workers/{worker_id}/"
        utils.create_dir_if_not_exist(self.worker_dir)
        
        
        self.browser = Browser(self.worker_dir, headless=False)
        self.profile = Profile(self.worker_dir)
        self.actor = Actor()
        self.observer = Observer()
        self.state_manager = StateManager()
        
    
    
    
    def tick(self)->None:
        
        # vaccum
        
        # pause
              
        screenshot_path = self.browser.get_current_screenshot_path()
        page_html = self.browser.get_current_page_html()
        state:State = self.observer.get_current_states(screenshot_path, page_html)
        action:Action =  self.state_manager.solve_state(state, screenshot_path, page_html, self.profile)

        self.actor.act(self.browser, action)
    

    
    
    def kill(self)->None:
        self.browser.kill()