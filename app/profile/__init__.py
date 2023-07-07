from helper import utils





class Profile:
    
    def __init__(self, worker_dir:str) -> None:
        
        self.profile_dir = worker_dir+"profile/"
        utils.create_dir_if_not_exist(self.profile_dir)
        
        self.info_path = self.profile_dir+"info.json"
        
        self.info = utils.read_file(self.info_path)
        if not self.info:
            self.info = self.generate_basic_info()
        
        
    def add_to_info(self, key:str, value:any):
        self.info[key] = value
        
        
    def generate_basic_info(self):
        # email
        # print password
        pass
    
    
    
    def kill(self):
        utils.save_file(self.info_path, self.info)
    