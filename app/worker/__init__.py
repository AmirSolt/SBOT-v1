
from ..browser import Browser
from ..profile import Profile
from ..actor import Actor
from ..state import State

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
        self.actor = Actor(self.browser, self.profile)
        self.state = State(self.browser)

        self.last_url = ""
        self.last_group_ids = []
    
    def __filter_parsed_groups(self, groups:list[Group])->Group|None:
        if not groups:
            return None
        
        clean_groups = [group for group in groups if group.id not in self.last_group_ids]
        if not clean_groups:
            return None
        r = clean_groups[0]
        self.last_group_ids = self.last_group_ids[-self.ID_RETENTION_COUNT:]
        self.last_group_ids.append(r.id)
        return r
        
    
    def tick(self)->bool:
        
        
        print("========== tick starts ==========")
        
    
        vacuum.clean_old_files(self.worker_id)
        pauser.test_pause()
        
        browser_url = self.browser.current_url
        print("browser_url",browser_url)
        if self.state.is_page(browser_url, config.CHROME_WELCOME_URL):
            self.actor.go_to(config.LOGIN_URL)
            return True
        
        if self.state.is_page(browser_url, config.LOGIN_URL):
            self.actor.login_survey_junkie()
            return True
        
        if self.state.is_page(browser_url, config.MENU_URL):
            try:
                self.profile.reset_survey_memory()
                self.actor.go_to(config.MENU_URL)
                pauser.test_pause()
                whale_url = self.state.get_whale_survey_url()
                if whale_url:
                    self.actor.go_to(whale_url)
                    pauser.test_pause()
                    return True
                else:
                    print(">> No whale found exiting..")
                    return False
            except Exception:
                # add to tries
                self.actor.help("Can't go to survey")
                return True
        
        # if url changes reset group ids in memory
        if browser_url != self.last_url:
            self.last_group_ids = []
            
        self.last_url = browser_url
        parsed_groups = self.browser.get_parsed_groups()
        groups = [convert_to_group(p) for p in parsed_groups]
        group = self.__filter_parsed_groups(groups)
        
        if not group:
            self.actor.help("No group")
            return True
        
        if not self.state.is_group_solvable(group):
            self.actor.help("Group not solvable")
            return True
        
        if self.state.is_group_single_select(group):
            self.actor.solve_select_type(group.ielements[0].path, group.context_path)
            return True
        
        context = self.profile.get_context(group.search_verbose)
        answer = AI.answer_parsed_group(group.chat_verbose, self.worker_id, context)
        parsed_input_answers:list[ParsedInputAnswer] = get_parsed_input_answers(group, answer)
        
        print("=============")
        print("context:\n",context)
        print("=============")
        print("verbose:\n",group.chat_verbose)
        print("=============")
        print("answer:\n",answer)
        print("=============")
        
        for parsed_input_answer in parsed_input_answers:
            if not self.state.is_ai_answer_valid(parsed_input_answer):
                print("parsed_input_answer:",parsed_input_answer)
                self.actor.help("AI answer is not valid")
            else:
                self.actor.solve_input_answer(parsed_input_answer)

        return True
        


    
    
    def kill(self)->None:
        self.profile_seed.kill()
        self.browser.kill()