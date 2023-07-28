



WORKER_DIR = "./saves/workers/{worker_id}/"

STATIC_DIR = "./static/"
STATE_IMAGES_DIR = STATIC_DIR + "state_images/" 
STATE_IMAGES_EMBEDDING_PATH = STATIC_DIR+"state_images_embeddings.json"


BROWSER_DIR = WORKER_DIR + "browser/"
BROWSER_COOKIES_DIR = BROWSER_DIR + "cookies/"
BROWSER_COOKIES_FILE = BROWSER_COOKIES_DIR +  "cookies.pickle"
BROWSER_LOGS = BROWSER_DIR + "logs/"
BROWSER_SCREENSHOTS_DIR = BROWSER_LOGS + "screenshots/"
BROWSER_PAGES_DIR = BROWSER_LOGS + "pages/"
BROWSER_PARSED_HTML_DIR = BROWSER_LOGS + "parsed_html/"

PROFILE_DIR = WORKER_DIR + "profile/"
PROFILE_INFO_FILE = PROFILE_DIR + "info.json"
PROFILE_PERM_MEM_FILE = PROFILE_DIR + "perm_memory.json"
PROFILE_SURVEY_MEM_FILE = PROFILE_DIR + "survey_memory.json"

LOGS_DIR = WORKER_DIR + "logs/"

SCRIPT_MAIN_PATH = "C:/Users/killo/Desktop/SBOT/helper/scripts/main.js"


CHAT_TEMPERATURE = 0.3