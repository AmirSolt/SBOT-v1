from helper import utils, config
from funcs import AI



COUNT_RETURNED_MEMORY = 4


class Profile:
    
    """
    perm_memory and survey_memory both have the same interface which is
    {
        "question":*,
        "answer":*,
        "embedding":*,
    }
        
    """
    
    
    
    def __init__(self, worker_id:str) -> None:
        
        
        self.perm_memory:list[dict] = []
        self.survey_memory:list[dict] = []
        
        self.profile_dir = config.PROFILE_DIR.format(worker_id=worker_id)
        self.profile_memory_dir = config.PROFILE_MEMORY_DIR.format(worker_id=worker_id)
        self.profile_seed_path = config.PROFILE_SEED_FILE.format(worker_id=worker_id)
        self.perm_memory_path = config.PROFILE_PERM_MEM_FILE.format(worker_id=worker_id)
        
        
        self.id = ""
        self.is_active = ""
        self.last_active = ""
        self.email = ""
        self.password = ""
        
        self.__init_filesys()
        
        if len(self.perm_memory) > 0:
            print("Profile memory loaded")
        else:
            raise Exception("Perm memory is empty")
        
        self.print_info()
            
        

    def __init_filesys(self):

        utils.create_dir_if_not_exist(self.profile_dir)
        utils.create_dir_if_not_exist(self.profile_memory_dir)
                
        if utils.does_file_exist(self.perm_memory_path): 
            self.perm_memory = utils.read_file(self.perm_memory_path)
        
        if utils.does_file_exist(self.profile_seed_path):
            self.__load_perm_memory(not self.perm_memory)
            if not self.perm_memory:
                utils.write_file(self.perm_memory_path, self.perm_memory)
        else:
            raise Exception(f"======= Profile info does not exist path: {self.profile_seed_path}")
            
        
        

    def print_info(self):
        print("********************************************")
        print(f"id: {self.id}")
        print(f"Email: {self.email}")
        print(f"password: {self.password}")
        
        # print(f"first name: {self.get_memory_by_question('first name')}")
        # print(f"last name: {self.get_memory_by_question('last name')}")
        # print(f"last name: {self.get_memory_by_question('last name')}")
        # print(f"postal code: {self.get_memory_by_question('postal code')}")
        # print(f"birth day: {self.get_memory_by_question('birth day')}")
        # print(f"birth month: {self.get_memory_by_question('birth month')}")
        # print(f"birth year: {self.get_memory_by_question('birth year')}")
        # print(f"gender: {self.get_memory_by_question('gender')}")
        print("********************************************")
        
        
    def get_context(self, text:str)->str|None:
        contexts = self.get_all_contexts(text)[:COUNT_RETURNED_MEMORY]
        if len(contexts) == 0:
            return None
        return "\n".join(contexts)
        
    def get_all_contexts(self, text:str)->list[str]:
        """
        returns a list of strings. each string is a context item that is related to the given text.
        """
        
        target_embedding = AI.embed_str(text)
        
        memory_items = []
        memory_items.extend(self.__memory_lookup(self.perm_memory, target_embedding))
        memory_items.extend(self.__memory_lookup(self.survey_memory, target_embedding))
        
        return [item['value'] for item in memory_items]
        

    
    def __memory_lookup(self, memory:list[dict], target_embedding:list[float])->list[dict]:
        """
        returns memory items close to target_embedding
        """
        embeddings = [memory_item["embedding"] for memory_item in memory]
        
        if not embeddings:
            return []
        
        memory_items = AI.get_similar_items(memory, embeddings, target_embedding, 0, "cosine")
        return memory_items
        
        
        
    def add_to_survey_memorys(self, value:str):
        self.survey_memory.append({
            "value":value,
            "embedding":self.__embed_memory_item(value),
        })
        
    def reset_survey_memory(self):
        self.survey_memory = {}
        
    def set_from_seed_dict(self, seed):
        self.id = seed["id"]
        self.is_active = seed["is_active"]
        self.last_active = seed["last_active"]
        self.email = seed["email"]
        self.password = seed["password"]
        
    def __load_perm_memory(self, do_load_info:bool):
        profile_seed = utils.read_file(self.profile_seed_path)
        self.set_from_seed_dict(profile_seed)
        if do_load_info:
            for value in profile_seed["info"]:
                self.__add_to_perm_memory(value)
            
        
    
    def __add_to_perm_memory(self, value:str):
        embedding = self.__embed_memory_item(value)
        self.perm_memory.append({
            "value":value,
            "embedding":embedding
        })
    
    
    def __embed_memory_item(self, value:str):
        return AI.embed_str(value)
    


    def kill(self):
        utils.write_file(self.perm_memory_path, self.perm_memory)
    
    
    
