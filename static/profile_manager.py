


import string
import random
from helper import utils, config
import time 


class ProfileSeed:
    
    def __init__(
        self, 
        email,
        first_name,
        last_name,
        password=None,
        ) -> None:
        
        self.is_active = False
        self.last_active = int(time.time())
        self.id = self.get_id(first_name, last_name)
        
        self.email = email
        self.password = self.generate_password(password)
        self.first_name = first_name
        self.last_name = last_name
        
        self.profile_dir = config.PROFILE_DIR.format(worker_id=self.id)
        self.profile_seed_path = config.PROFILE_SEED_FILE.format(worker_id=self.id)
        
        self.load_seed()
        
    def load_seed(self):
        seed = {}
        utils.create_dir_if_not_exist(self.profile_dir)
        if utils.does_file_exist(self.profile_seed_path): 
            seed = utils.read_file(self.profile_seed_path)
            self.set_from_dict(seed)
            
        if not seed.get("info"):
            info = {}
            info = self.__generate_info(info)
            seed = self.get_dict(info)
            utils.write_file(self.profile_seed_path, seed)

    def set_from_dict(self, seed):
        self.id= seed["id"]
        self.is_active= seed["is_active"]
        self.last_active= seed["last_active"]
        self.email = seed["email"]
        self.password = seed["password"]

    def get_dict(self, info):
        return {
            "id":self.id,
            "email":self.email,
            "password":self.password,
            "is_active":self.is_active,
            "last_active":self.last_active,
            "info":info,
        }

    def update_seed_file(self):
        seed = utils.read_file(self.profile_seed_path)
        seed = self.get_dict(seed["info"])
        utils.write_file(self.profile_seed_path, seed)
           
    def get_id(self, first_name, last_name)->str:
        return f"{first_name} {last_name}"
    
    def generate_password(self, current_password, length=12):
        if current_password:
            return current_password
        password_characters = string.ascii_letters + string.digits + string.punctuation
        password = ''.join(random.choice(password_characters) for _ in range(length))
        return password
        
    def __generate_info(self, info):
        self.__add_to_info(info,"email", self.email)
        self.__add_to_info(info,"password", self.password)
        self.__add_to_info(info,"first name", self.first_name)
        self.__add_to_info(info,"last name", self.last_name)
        
        self.__add_to_info(info,"postal code", "L7B 0A7")
        self.__add_to_info(info,"first half of postal code", "L7B")
        self.__add_to_info(info,"second half of postal code", "0A7")
        self.__add_to_info(info,"country", "canada")
        self.__add_to_info(info,"province", "ontario")
        self.__add_to_info(info,"birth day", "14")
        self.__add_to_info(info,"birth month", "8")
        self.__add_to_info(info,"birth year", "1991")
        self.__add_to_info(info,"age", "33 years old")
        self.__add_to_info(info,"gender", "male")
        self.__add_to_info(info,"do you have a dog pet", "yes")
        self.__add_to_info(info,"do you have a cat pet", "yes")
        self.__add_to_info(info,"do you like baking", "yes")
        self.__add_to_info(info,"do you like computers", "yes")
        self.__add_to_info(info,"do you travel", "yes")
        self.__add_to_info(info,"do you cook", "yes")
        self.__add_to_info(info,"grocery shopping", "I do all shopping")
        self.__add_to_info(info,"living situation", "own home")
        self.__add_to_info(info,"marital status", "married")
        self.__add_to_info(info,"race", "white western european")
        self.__add_to_info(info,"do you speak spanish", "no")
        self.__add_to_info(info,"do you have children", "no")
        self.__add_to_info(info,"education level", "bachelor's degree")
        self.__add_to_info(info,"salary", "$80,000")
        self.__add_to_info(info,"political affiliation", "democrat")
        self.__add_to_info(info,"employment status", "employed full time")
        self.__add_to_info(info,"what industry do you work in", "computer software")
        self.__add_to_info(info,"what is your job title", "manager")
        self.__add_to_info(info,"how many employees work at your organization", "600")
        self.__add_to_info(info,"what is your religious affiliation", "christian")
        
        self.__add_to_info(info,"do you use a smartphone", "yes for personal use")
        self.__add_to_info(info,"what is the service provider for your mobile phone", "T-mobile")
        self.__add_to_info(info,"what is the brand of your mobile phone", "apple")
        self.__add_to_info(info,"how many hours per day do you use your mobile phone for personal use", "4")
        self.__add_to_info(info,"do you have internet service provider at home", "yes")
        self.__add_to_info(info,"which internet provider do you have", "AT&T")
        self.__add_to_info(info,"what type of internet connection do you have at home", "cable")
        self.__add_to_info(info,"where do you usually access the internet", "home and work")
        self.__add_to_info(info,"how often do you go online for personal use", "every day")
        self.__add_to_info(info,"how often do you go online for business use", "every day")
        self.__add_to_info(info,"how many times have you shopped online in last 12 months", "more than 12 times")
        self.__add_to_info(info,"what have you shopped online", "games and hardware and electronics equipments")
        self.__add_to_info(info,"which social media networks are you a memeber of", "twitter and facebook and instagram and youtube")
        self.__add_to_info(info,"how often do you log on social media", "every day")
        self.__add_to_info(info,"do you play online video games", "yes")
        self.__add_to_info(info,"which online publication do you read on a regular basis", "don't read publications")
        self.__add_to_info(info,"which websites do you visit everyday", "cars and computers and music and sports")
        self.__add_to_info(info,"which streaming services are you subscribed to", "netflix and disney+ and amazon prime video")
        
        return info
        
    def __add_to_info(self, info, key, value):
        info[key] = value

    def activate(self):
        self.last_active = int(time.time())
        self.is_active = True
        self.update_seed_file()
    
    def kill(self):
        self.last_active = int(time.time())
        self.is_active = False
        self.update_seed_file()

class ProfileManager:
    
    def __init__(self) -> None:
        
        self.profile_seeds = [
            ProfileSeed(
                email="ram4hus@caspear.com",
                first_name="rami",
                last_name="huston",
                password="48f&S2cnl1x2"),
        ]
        
    def get_profile_seed(self)->ProfileSeed|None:
        self.__refresh_seeds()
        self.__sort_seeds()
        non_active_seeds = [seed for seed in self.profile_seeds if not seed.is_active]
        if not non_active_seeds:
            return None
        return non_active_seeds[0]
    
    def __refresh_seeds(self):
        [seed.load_seed() for seed in self.profile_seeds]
    
    def __sort_seeds(self):
        self.profile_seeds.sort(key=lambda x: x.last_active, reverse=False)
    