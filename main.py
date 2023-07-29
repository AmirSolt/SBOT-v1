from app.worker import Worker
from static.profile_manager import ProfileManager

if __name__ == '__main__':

    profile_manager = ProfileManager()

    # run x processes

    profile_seed = profile_manager.get_profile_seed()
        
    worker = Worker(profile_seed)
    try:
        while True:
            
            # if state allows (whales remaining)
            
            input(">>> next tick:")
            
            worker.tick()
    finally:
        worker.kill()