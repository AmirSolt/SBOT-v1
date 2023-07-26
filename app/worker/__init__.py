
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

        self.last_group_id = None
    
    def __update_parsed_group(self, parsed_groups):
        r = [group for group in parsed_groups if group["id"] != self.last_group_id][0]
        self.last_group_id = r["id"]
        return r
        
    
    def tick(self)->None:
        
        
        
        print("========== tick starts ==========")
        
    
        vacuum.clean_old_files(self.worker_id)
        # print("====  Test Pause ===")
        pauser.test_pause()
        
        # states
              
        parsed_groups = self.browser.get_parsed_groups()
        
        if len(parsed_groups) == 0:
            print(">> No groups returned <<")
            return
        
        parsed_group = self.__update_parsed_group(parsed_groups)
        
        context = self.profile.get_context(parsed_group["text_only_verbose"])
                
        answer = AI.answer_parsed_group(parsed_group["verbose"], context)

        print("=============")
        print("context:\n",context)
        print("=============")
        print("verbose:\n",parsed_group["verbose"])
        print("=============")
        print("answer:\n",answer)
        print("=============")

        # actor.highlight_answer(self.browser, parsed_group, answer)

    
    
    def kill(self)->None:
        self.browser.kill()