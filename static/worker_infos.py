

class WorkerInfo:
    
    def __init__(self, id) -> None:
        self.id = id
        self.memory = {}
    def add_to_memory(self, key, value):
        self.memory[key] = value

def get_worker_infos():

    return [
        get_worker_0(),
    ]
    
    
    
def get_worker_0():
    w = WorkerInfo("william_santino")
    w.add_to_memory("email", "willis32@caspear.com")
    w.add_to_memory("password", "48f&S9cnl6x2")
    w.add_to_memory("first name", "william")
    w.add_to_memory("last name", "santino")
    w.add_to_memory("postal code", "35016")
    w.add_to_memory("country", "united states")
    w.add_to_memory("birth day", "15")
    w.add_to_memory("birth month", "10")
    w.add_to_memory("birth year", "1992")
    w.add_to_memory("gender", "male")
    w.add_to_memory("pets", "dog")
    w.add_to_memory("pets", "cat")
    w.add_to_memory("grocery shopping", "I do all shopping")
    w.add_to_memory("living situation", "own home")
    w.add_to_memory("marital status", "married")
    w.add_to_memory("race", "white western european")
    w.add_to_memory("do you speak spanish", "no")
    w.add_to_memory("do you have children", "no")
    w.add_to_memory("education level", "bachelor's degree")
    w.add_to_memory("salary", "$160,000")
    w.add_to_memory("political affiliation", "democrat")
    w.add_to_memory("employment status", "employed full time")
    w.add_to_memory("what industry do you work in", "computer hardware")
    w.add_to_memory("what is your job title", "manager")
    w.add_to_memory("how many employees work at your organization", "600")
    w.add_to_memory("what is your religious affiliation", "christian")
    
    w.add_to_memory("do you use a smartphone", "yes for personal use")
    w.add_to_memory("what is the service provider for your mobile phone", "T-mobile")
    w.add_to_memory("what is the brand of your mobile phone", "apple")
    w.add_to_memory("how many hours per day do you use your mobile phone for personal use", "4")
    w.add_to_memory("do you have internet service provider at home", "yes")
    w.add_to_memory("which internet provider do you have", "AT&T")
    w.add_to_memory("what type of internet connection do you have at home", "cable")
    w.add_to_memory("where do you usually access the internet", "home and work")
    w.add_to_memory("how often do you go online for personal use", "every day")
    w.add_to_memory("how often do you go online for business use", "every day")
    w.add_to_memory("how many times have you shopped online in last 12 months", "more than 12 times")
    w.add_to_memory("what have you shopped online", "games and hardware and electronics equipments")
    w.add_to_memory("which social media networks are you a memeber of", "twitter and facebook and instagram and youtube")
    w.add_to_memory("how often do you log on social media", "every day")
    w.add_to_memory("do you play online video games", "yes")
    w.add_to_memory("which online publication do you read on a regular basis", "don't read publications")
    w.add_to_memory("which websites do you visit everyday", "cars and computers and music and sports")
    w.add_to_memory("which streaming services are you subscribed to", "netflix and disney+ and amazon prime video")
    return w