from app.worker import Worker



worker = Worker("profile")

try:
    for i in range(100):
        worker.tick()
finally:
    worker.kill()