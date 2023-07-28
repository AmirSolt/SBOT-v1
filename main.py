from app.worker import Worker
from static.profile_manager import ProfileManager

if __name__ == '__main__':

    profile_manager = ProfileManager()
    # parralell
    for profile_seed in profile_manager.get_oldest_active():
        
        worker = Worker(profile_seed.id)
        try:
            while True:
                
                input(">>> next tick:")
                
                worker.tick()
        finally:
            worker.kill()