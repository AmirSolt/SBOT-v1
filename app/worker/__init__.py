
from ..browser import Browser
from ..profile import Profile



from helper import utils, config
from funcs import pauser, vacuum, AI, actor

from static.worker_infos import WorkerInfo


class Worker:
    

    def __init__(self, worker_info:WorkerInfo) -> None:
        
        self.worker_id = worker_info.id
        self.worker_dir = config.WORKER_DIR.format(worker_id=self.worker_id)
        utils.create_dir_if_not_exist(self.worker_dir)
        
        
        self.browser = Browser(self.worker_id, headless=False, use_subprocess=True)
        self.profile = Profile(self.worker_id, worker_info)

        
    
    
    
    def tick(self)->None:
        
        
        
        print("========== tick starts ==========")
        
    
        vacuum.clean_old_files(self.worker_id)
        # print("====  Test Pause ===")
        pauser.test_pause()
        
        # states
              
        parsed_group = self.browser.get_parsed_group()
        
        context = self.profile.get_context(parsed_group["text_only_verbose"])
                
        answer = AI.answer_parsed_group(parsed_group["verbose"], context)

        print("=============")
        print("context:",context)
        print("verbose:",parsed_group["verbose"])
        print("answer:",answer)
        print("=============")

        # actor.highlight_answer(self.browser, parsed_group, answer)

    
    
    def kill(self)->None:
        self.browser.kill()