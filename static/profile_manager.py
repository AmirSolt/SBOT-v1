


import string
import random
from helper import utils, config
import time 
import random
import datetime



CURRENT_YEAR = datetime.datetime.now().year

class GH:

    @staticmethod
    def generate_postal_code():
        half = "L7B"
        half2 = random.choice(["1L3", "1G2", "1G1", "1J1"])
        return half + " " + half2
    
    @staticmethod
    def generate_day():
        return random.randint(1, 25)
    @staticmethod
    def generate_month():
        return random.randint(1, 10)
    @staticmethod
    def generate_year():
        return random.randint(1980, 1995)
    @staticmethod
    def generate_salary():
        return random.choice([50, 60, 70, 80, 90])
    @staticmethod
    def generate_org_employee():
        return random.choice([50, 100, 200, 400, 700])
    @staticmethod
    def generate_job():
        jobs = ["computer software", "sales", "police officer", "market research analyst", "medical secretary", "coach"]
        return random.choice(jobs)

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
            info = []
            info = self.__generate_info(info)
            info = list(set(info))
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
        
        year = GH.generate_year()
        
        self.__add_to_info(info,f"email: {self.email}")
        self.__add_to_info(info,f"password: {self.password}")
        self.__add_to_info(info,f"first name: {self.first_name}")
        self.__add_to_info(info,f"last name: {self.last_name}")
        
        self.__add_to_info(info,f"postal code: {GH.generate_postal_code()}")
        self.__add_to_info(info,"country: canada")
        self.__add_to_info(info,"province: ontario")
        self.__add_to_info(info,"city: toronto")
        self.__add_to_info(info,f"birth day: {GH.generate_day()}")
        self.__add_to_info(info,f"birth month: {GH.generate_month()}")
        self.__add_to_info(info,f"birth year: {year}")
        self.__add_to_info(info,f"age: {CURRENT_YEAR - year} years old")
        self.__add_to_info(info,"gender: male")
        self.__add_to_info(info,"pets: one dog and one cat")
        self.__add_to_info(info,"do you like baking: yes")
        self.__add_to_info(info,"do you like computers: yes")
        self.__add_to_info(info,"do you travel: yes")
        self.__add_to_info(info,"do you cook: yes")
        self.__add_to_info(info,"grocery shopping: I do all shopping")
        self.__add_to_info(info,"living situation: own home")
        self.__add_to_info(info,"marital status: married")
        self.__add_to_info(info,"race: white western european")
        self.__add_to_info(info,"do you speak spanish: no")
        self.__add_to_info(info,"do you have children: no")
        self.__add_to_info(info,"education level: bachelor's degree")
        self.__add_to_info(info,f"salary: ${GH.generate_salary()},000")
        self.__add_to_info(info,"political affiliation: democrat")
        self.__add_to_info(info,"employment status: employed full time")
        self.__add_to_info(info,f"what industry do you work in: {GH.generate_job()}")
        self.__add_to_info(info,"what is your job title: manager")
        self.__add_to_info(info,f"how many employees work at your organization: {GH.generate_org_employee()}")
        self.__add_to_info(info,"what is your religious affiliation: christian")
        
        self.__add_to_info(info,"do you use a smartphone: yes for personal use")
        self.__add_to_info(info,"what is the service provider for your mobile phone: T-mobile")
        self.__add_to_info(info,"what is the brand of your mobile phone: apple")
        self.__add_to_info(info,"how many hours per day do you use your mobile phone for personal use: 4")
        self.__add_to_info(info,"do you have internet service provider at home: yes")
        self.__add_to_info(info,"which internet provider do you have: AT&T")
        self.__add_to_info(info,"what type of internet connection do you have at home: cable")
        self.__add_to_info(info,"where do you usually access the internet: home and work")
        self.__add_to_info(info,"how often do you go online for personal use: every day")
        self.__add_to_info(info,"how often do you go online for business use: every day")
        self.__add_to_info(info,"how many times have you shopped online in last 12 months: more than 12 times")
        self.__add_to_info(info,"what have you shopped online: games and hardware and electronics equipments")
        self.__add_to_info(info,"which social media networks are you a memeber of: twitter and facebook and instagram and youtube")
        self.__add_to_info(info,"how often do you log on social media: every day")
        self.__add_to_info(info,"do you play online video games: yes")
        self.__add_to_info(info,"which online publication do you read on a regular basis: don't read publications")
        self.__add_to_info(info,"which websites do you visit everyday: cars and computers and music and sports")
        self.__add_to_info(info,"which streaming services are you subscribed to: netflix and disney+ and amazon prime video")
        
        return info
        
    def __add_to_info(self, info:list[str], value:str):
        info.append(value)

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
                email="dwswr32@caspear.com",
                first_name="daniel",
                last_name="weston",
                password="48f&S2cnl1x2"),
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
    