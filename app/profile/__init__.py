from helper import utils
from funcs import AI




class Profile:
    
    """
    perm_memory and survey_memory both have the same interface which is
    {
            "question":*,
            "answer":*,
            "embedding":*,
    }
        
    """
    
    
    
    def __init__(self, worker_dir:str) -> None:
        
        self.perm_memory:list[dict] = []
        self.survey_memory:list[dict] = []
        self.perm_memory_path = self.profile_dir+"perm_memory.json"
        self.survey_memory_path = self.profile_dir+"survey_memory.json"
        
        self.__init_filesys(worker_dir)
        

   
        
        
    def __init_filesys(self,worker_dir):

        self.profile_dir = worker_dir+"profile/"
        utils.create_dir_if_not_exist(self.profile_dir)
                
        if utils.does_file_exist(self.perm_memory_path): 
            self.perm_memory = utils.read_file(self.perm_memory_path)
        if utils.does_file_exist(self.survey_memory_path):
            self.survey_memory = utils.read_file(self.survey_memory_path)
        
        if not self.perm_memory:
            self.__generate_perm_memory()
            utils.save_file(self.perm_memory_path, self.perm_memory)
        
        
    def get_context(self, text:str)->list[str]:
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
        indices = AI.get_similar_indecies(embeddings, target_embedding)
        return [memory[i] for i in indices]
        
        
        
    def add_to_survey_memorys(self, question:str, answer:str):
        self.survey_memory.append({
            "question":question,
            "answer":answer,
            "embedding":self.__embed_memory_item(question, answer),
        })
        
    def reset_survey_memory(self):
        self.survey_memory = {}
        

    def __generate_perm_memory(self):
        # email
        # print password
        self.__add_to_perm_memory("what is your first name?", "jack")
        
    
    def __add_to_perm_memory(self, question:str, answer:str):
        embedding = self.__embed_memory_item(question, answer)
        self.perm_memory.append({
             "question":question,
             "answer":answer,
             "embedding":embedding
        })
    
    
    def __embed_memory_item(self, question:str, answer:str):
        return AI.embed_str(f"{question} {answer}")
    

    def kill(self):
        utils.save_file(self.perm_memory_path, self.perm_memory)
        utils.save_file(self.survey_memory_path, self.survey_memory)
    
    
    
