
from ..browser import Browser
from ..profile import Profile


from .state_solver import StateSolver

from d_types import State
from helper import utils, config
from funcs import pauser, vacuum



class Worker:
    

    def __init__(self, worker_id:str) -> None:
        
        self.worker_id = worker_id
        self.worker_dir = config.WORKER_DIR.format(worker_id=worker_id)
        utils.create_dir_if_not_exist(self.worker_dir)
        
        
        self.browser = Browser(self.worker_id, headless=False, use_subprocess=True)
        self.profile = Profile(self.worker_id)

        self.state_solver = StateSolver()
        
    
    
    
    def tick(self)->None:
        
        
        input("Next tick")
        
        print("========== tick starts ==========")
        
        vacuum.clean_old_files(self.worker_id)
        
        pauser.pause()
              
        screenshot_path = self.browser.get_current_screenshot_path()
        page_html = self.browser.get_current_page_html()
        
        
        self.state_solver.solve(self.browser, self.profile, screenshot_path, page_html)



    
    
    def kill(self)->None:
        self.browser.kill()