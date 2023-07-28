


import string
import random
from helper import utils, config



class ProfileSeed:
    
    def __init__(
        self, 
        email,
        first_name,
        last_name,
        password=None,
        ) -> None:
        self.info = {}
        self.id = self.get_id(first_name, last_name)
        
        self.email = email
        self.password = self.generate_password(password)
        self.first_name = first_name
        self.last_name = last_name
        
        self.profile_dir = config.PROFILE_DIR.format(worker_id=self.id)
        self.profile_info_path = config.PROFILE_INFO_FILE.format(worker_id=self.id)
        
        self.load_info()
        
    def load_info(self):
        utils.create_dir_if_not_exist(self.profile_dir)
        if utils.does_file_exist(self.profile_info_path): 
            self.info = utils.read_file(self.profile_info_path)
            
        if not self.info:
            self.__generate_info()
            utils.write_file(self.profile_info_path, self.info)
           
    def get_id(self, first_name, last_name)->str:
        return f"{first_name} {last_name}"
    
    def generate_password(self, current_password, length=12):
        if current_password:
            return current_password
        password_characters = string.ascii_letters + string.digits + string.punctuation
        password = ''.join(random.choice(password_characters) for _ in range(length))
        return password
        
    def __generate_info(self):
        self.__add_to_info("email", self.email)
        self.__add_to_info("password", self.password)
        self.__add_to_info("first name", self.first_name)
        self.__add_to_info("last name", self.last_name)
        
        self.__add_to_info("postal code", "L7B0A7")
        self.__add_to_info("country", "canada")
        self.__add_to_info("birth day", "14")
        self.__add_to_info("birth month", "8")
        self.__add_to_info("birth year", "1991")
        self.__add_to_info("gender", "male")
        self.__add_to_info("pets", "dog")
        self.__add_to_info("pets", "cat")
        self.__add_to_info("grocery shopping", "I do all shopping")
        self.__add_to_info("living situation", "own home")
        self.__add_to_info("marital status", "married")
        self.__add_to_info("race", "white western european")
        self.__add_to_info("do you speak spanish", "no")
        self.__add_to_info("do you have children", "no")
        self.__add_to_info("education level", "bachelor's degree")
        self.__add_to_info("salary", "$80,000")
        self.__add_to_info("political affiliation", "democrat")
        self.__add_to_info("employment status", "employed full time")
        self.__add_to_info("what industry do you work in", "computer software")
        self.__add_to_info("what is your job title", "manager")
        self.__add_to_info("how many employees work at your organization", "600")
        self.__add_to_info("what is your religious affiliation", "christian")
        
        self.__add_to_info("do you use a smartphone", "yes for personal use")
        self.__add_to_info("what is the service provider for your mobile phone", "T-mobile")
        self.__add_to_info("what is the brand of your mobile phone", "apple")
        self.__add_to_info("how many hours per day do you use your mobile phone for personal use", "4")
        self.__add_to_info("do you have internet service provider at home", "yes")
        self.__add_to_info("which internet provider do you have", "AT&T")
        self.__add_to_info("what type of internet connection do you have at home", "cable")
        self.__add_to_info("where do you usually access the internet", "home and work")
        self.__add_to_info("how often do you go online for personal use", "every day")
        self.__add_to_info("how often do you go online for business use", "every day")
        self.__add_to_info("how many times have you shopped online in last 12 months", "more than 12 times")
        self.__add_to_info("what have you shopped online", "games and hardware and electronics equipments")
        self.__add_to_info("which social media networks are you a memeber of", "twitter and facebook and instagram and youtube")
        self.__add_to_info("how often do you log on social media", "every day")
        self.__add_to_info("do you play online video games", "yes")
        self.__add_to_info("which online publication do you read on a regular basis", "don't read publications")
        self.__add_to_info("which websites do you visit everyday", "cars and computers and music and sports")
        self.__add_to_info("which streaming services are you subscribed to", "netflix and disney+ and amazon prime video")
        
    def __add_to_info(self, key, value):
        self.info[key] = value

    def activate(self):
        pass
    
    def kill(self):
        pass

class ProfileManager:
    
    def __init__(self) -> None:
        
        self.profile_seeds = [
            ProfileSeed(
                email="ram4hus@caspear.com",
                first_name="rami",
                last_name="huston",
                password="48f&S2cnl1x2"),
        ]
        
    def get_seeds(self, num:int)->list[ProfileSeed]:
        if num > len(self.profile_seeds):
            raise Exception(f"==== only {len(self.profile_seeds)} seeds are available. You asked for {num} ====")
        # sort by oldest active
        # filter out active
        # return num
        
    def get_oldest_active(self):
        pass