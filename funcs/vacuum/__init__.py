
from helper import utils, config
import os
import glob


def clean_old_files(worker_id:str):
    dirs = [
        config.BROWSER_SCREENSHOTS_DIR.format(worker_id=worker_id),
        config.BROWSER_PAGES_DIR.format(worker_id=worker_id)
    ]

    for dir in dirs:
        files = glob.glob(dir + '*')
        files.sort(key=os.path.getctime)
        if len(files) > 100:
            for i in range(0, 60):
                os.remove(files[i])

