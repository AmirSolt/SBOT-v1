
from ..browser import Browser
from ..profile import Profile


from helper import utils, config
from funcs import pauser, vacuum, AI, actor

from static.worker_infos import WorkerInfo


class Worker:
    
    ID_RETENTION_COUNT = 40
    

    def __init__(self, worker_info:WorkerInfo) -> None:
        
        self.worker_id = worker_info.id
        self.worker_dir = config.WORKER_DIR.format(worker_id=self.worker_id)
        utils.create_dir_if_not_exist(self.worker_dir)
        
        
        self.browser = Browser(self.worker_id, headless=False, use_subprocess=True)
        self.profile = Profile(self.worker_id, worker_info)

        self.last_group_ids = []
    
    def __update_parsed_group(self, parsed_groups):
        if len(parsed_groups) == 0:
            return None
        
        r = [group for group in parsed_groups if group["id"] not in self.last_group_ids][0]
        self.last_group_ids = self.last_group_ids[:self.ID_RETENTION_COUNT].append(r["id"])
        return r
        
    
    def tick(self)->None:
        
        
        
        print("========== tick starts ==========")
        
    
        vacuum.clean_old_files(self.worker_id)
        pauser.test_pause()
        
        # >>> state url and some conditions
        parsed_groups = self.browser.get_parsed_groups()
        parsed_group = self.__update_parsed_group(parsed_groups)
        
        # >>> state if parsed response is None or has only one Ielement or has Media
        
        # if AI response needed?
        context = self.profile.get_context(parsed_group["search_verbose"])
        answer = AI.answer_parsed_group(parsed_group["chat_verbose"], context)
        # find answer
        
        # >>> state if answer was not valid

        print("=============")
        print("context:\n",context)
        print("=============")
        print("verbose:\n",parsed_group["chat_verbose"])
        print("=============")
        print("answer:\n",answer)
        print("=============")
        


    
    
    def kill(self)->None:
        self.browser.kill()