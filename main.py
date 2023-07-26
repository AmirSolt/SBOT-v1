from app.worker import Worker
from static.worker_infos import get_worker_infos

if __name__ == '__main__':


    # parralell
    for worker_info in get_worker_infos()[0]:
        
        worker = Worker(worker_info)
        try:
            for i in range(1_000_000):
                
                input(">>> next tick:")
                
                worker.tick()
        finally:
            worker.kill()