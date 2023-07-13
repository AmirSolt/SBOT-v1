
from ..browser import Browser
from ..profile import Profile



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

        
    
    
    
    def tick(self)->None:
        
        
        
        print("========== tick starts ==========")
        
        vacuum.clean_old_files(self.worker_id)
        
        # print("====  Test Pause ===")
        pauser.test_pause()
              
        parsed_html = self.browser.get_parsed_html()



    
    
    def kill(self)->None:
        self.browser.kill()