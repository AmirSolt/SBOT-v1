from app.worker import Worker


if __name__ == '__main__':

    worker = Worker("worker_id")

    try:
        for i in range(100):
            worker.tick()
    finally:
        worker.kill()