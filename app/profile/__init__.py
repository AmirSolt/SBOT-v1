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
        self.survey_memory_path = config.PROFILE_SURVEY_MEM_FILE.format(worker_id=worker_id)
        
        self.__init_filesys()
        
        if len(self.perm_memory) > 0:
            print("Profile memory loaded")
        else:
            raise Exception("Perm memory is empty")
        

            
        

    def __init_filesys(self):

        utils.create_dir_if_not_exist(self.profile_dir)
        utils.create_dir_if_not_exist(self.profile_memory_dir)
                
        if utils.does_file_exist(self.perm_memory_path): 
            self.perm_memory = utils.read_file(self.perm_memory_path)
        if utils.does_file_exist(self.survey_memory_path):
            self.survey_memory = utils.read_file(self.survey_memory_path)
        
        if not self.perm_memory:
            if utils.does_file_exist(self.profile_seed_path):
                self.__load_perm_memory()
                utils.write_file(self.perm_memory_path, self.perm_memory)
            else:
                raise Exception(f"======= Profile info does not exist path: {self.profile_seed_path}")
            
        self.print_info()
        

    def print_info(self):
        print(f"Email: {self.__get_memory_by_question('email')}")
        print(f"Password: {self.__get_memory_by_question('password')}")
        print(f"first name: {self.__get_memory_by_question('first name')}")
        print(f"last name: {self.__get_memory_by_question('last name')}")
        print(f"postal code: {self.__get_memory_by_question('postal code')}")
        print(f"birth day: {self.__get_memory_by_question('birth day')}")
        print(f"birth month: {self.__get_memory_by_question('birth month')}")
        print(f"birth year: {self.__get_memory_by_question('birth year')}")
        print(f"gender: {self.__get_memory_by_question('gender')}")
        
        
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
        
        return [f"{item['question']} {item['answer']}" for item in memory_items]
        

    
    def __memory_lookup(self, memory:list[dict], target_embedding:list[float])->list[dict]:
        """
        returns memory items close to target_embedding
        """
        embeddings = [memory_item["embedding"] for memory_item in memory]
        
        if not embeddings:
            return []
        
        memory_items = AI.get_similar_items(memory, embeddings, target_embedding, 0, "cosine")
        return memory_items
        
        
        
    def add_to_survey_memorys(self, question:str, answer:str):
        self.survey_memory.append({
            "question":question,
            "answer":answer,
            "embedding":self.__embed_memory_item(question, answer),
        })
        
    def reset_survey_memory(self):
        self.survey_memory = {}
        

    def __load_perm_memory(self):
        profile_seed = utils.read_file(self.profile_seed_path)
        for key, value in profile_seed["info"].items():
            self.__add_to_perm_memory(key, value)
        
    
    def __add_to_perm_memory(self, question:str, answer:str):
        embedding = self.__embed_memory_item(question, answer)
        self.perm_memory.append({
            "question":question,
            "answer":answer,
            "embedding":embedding
        })
    
    
    def __embed_memory_item(self, question:str, answer:str):
        return AI.embed_str(f"{question} {answer}")
    
    def __get_memory_by_question(self, question):
        items = [item["answer"] for item in self.perm_memory if item["question"] == question]
        if not items:
            return None
        return items[0]

    def kill(self):
        utils.write_file(self.perm_memory_path, self.perm_memory)
        utils.write_file(self.survey_memory_path, self.survey_memory)
    
    
    
