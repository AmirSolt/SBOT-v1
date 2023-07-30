from app.worker import Worker
from static.profile_manager import ProfileManager

if __name__ == '__main__':

    profile_manager = ProfileManager()

    # run x processes

    profile_seed = profile_manager.get_profile_seed()
        
    worker = Worker(profile_seed)
    try:
        
        is_over = False
        while not is_over:
            
            input(">>> next tick:")
            
            if not worker.tick():
                is_over = True
            
    finally:
        worker.kill()