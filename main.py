from app.worker import Worker


if __name__ == '__main__':

    worker = Worker("worker_id")


    try:
        for i in range(1_000_000):
            
            input(">>> next tick:")
            
            worker.tick()
    finally:
        worker.kill()