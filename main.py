from app.worker import Worker
from static.profile_manager import ProfileManager
import traceback
import sys

if __name__ == '__main__':

    profile_manager = ProfileManager()

    # run x processes

    profile_seed = profile_manager.get_profile_seed()
        
    worker = Worker(profile_seed)
    try:
        
        is_over = False
        while not is_over:
            
            input(">>> next tick:")
            
            try:
                is_over = not worker.tick()
            except Exception:
                print("===================")
                print("===================")
                print(traceback.format_exc())
                print("===================")
                print("===================")
                # print(sys.exc_info()[2])
                
    finally:
        worker.kill()