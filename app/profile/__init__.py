from helper import utils





class Profile:
    
    def __init__(self, worker_dir:str) -> None:
        
        self.profile_dir = worker_dir+"profile/"
        utils.create_dir_if_not_exist(self.profile_dir)
        
        self.info_path = self.profile_dir+"info.json"
        
        self.info = utils.read_file(self.info_path)
        if not self.info:
            self.info = self.generate_basic_info()
        
        
    def generate_basic_info():
        # email
        # print password
        pass
    
    