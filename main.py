from app.worker import Worker
from static.profile_manager import ProfileManager


    
    
def init_worker(profile_seed):
    worker = Worker(profile_seed)
    is_over = False
    while not is_over:
        input(">>> next tick:")
        is_over = not worker.tick()
    worker.kill()
    
    
    
if __name__ == '__main__':

    profile_manager = ProfileManager()
    
    while True:
        profile_seed = profile_manager.get_profile_seed()
        init_worker(profile_seed)