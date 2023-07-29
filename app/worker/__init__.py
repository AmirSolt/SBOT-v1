
from ..browser import Browser
from ..profile import Profile
from ..actor import Actor

from d_types import ParsedInputAnswer, get_parsed_input_answers, Group, convert_to_group
from static.profile_manager import ProfileSeed
from helper import utils, config
from funcs import pauser, vacuum, AI



class Worker:
    
    ID_RETENTION_COUNT = 40
    

    def __init__(self, profile_seed:ProfileSeed) -> None:
        
        self.profile_seed= profile_seed
        self.profile_seed.activate()
        
        self.worker_id = profile_seed.id
        self.worker_dir = config.WORKER_DIR.format(worker_id=self.worker_id)
        utils.create_dir_if_not_exist(self.worker_dir)
        
        
        self.browser = Browser(self.worker_id, headless=False, use_subprocess=True)
        self.profile = Profile(self.worker_id)
        self.actor = Actor(self.browser)

        self.last_group_ids = []
    
    def __update_parsed_group(self, groups:list[Group])->Group|None:
        if not groups:
            return None
        
        clean_groups = [group for group in groups if group.id not in self.last_group_ids]
        if not clean_groups:
            return None
        r = clean_groups[0]
        self.last_group_ids = self.last_group_ids[-self.ID_RETENTION_COUNT:]
        self.last_group_ids.append(r.id)
        return r
        
    
    def tick(self)->None:
        
        
        print("========== tick starts ==========")
        
    
        vacuum.clean_old_files(self.worker_id)
        pauser.test_pause()
        
        # >>> state url and some conditions
        parsed_groups = self.browser.get_parsed_groups()
        groups = [convert_to_group(p) for p in parsed_groups]
        group = self.__update_parsed_group(groups)
        
        if not group:
            print("======= No group ======")
            return
        
        # >>> state
        # if Media
        # if no ielements
        # if one ielement is type select
        
        context = self.profile.get_context(group.search_verbose)
        answer = AI.answer_parsed_group(group.chat_verbose, self.worker_id, context)
        parsed_input_answers:list[ParsedInputAnswer] = get_parsed_input_answers(group.ielements, answer)
        # >>> state if answer was not valid
        
        # change context
        # solve input
        

        print("=============")
        print("context:\n",context)
        print("=============")
        print("verbose:\n",group.chat_verbose)
        print("=============")
        print("answer:\n",answer)
        print("=============")
        


    
    
    def kill(self)->None:
        self.profile_seed.kill()
        self.browser.kill()