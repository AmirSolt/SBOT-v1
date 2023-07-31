



WORKER_DIR = "./saves/workers/{worker_id}/"

STATIC_DIR = "./static/"

BROWSER_DIR = WORKER_DIR + "browser/"
BROWSER_COOKIES_DIR = BROWSER_DIR + "cookies/"
BROWSER_COOKIES_FILE = BROWSER_COOKIES_DIR +  "cookies.pickle"
BROWSER_LOGS = BROWSER_DIR + "logs/"  # .GITIGNORE
BROWSER_SCREENSHOTS_DIR = BROWSER_LOGS + "screenshots/" # .GITIGNORE
BROWSER_PAGES_DIR = BROWSER_LOGS + "pages/" # .GITIGNORE
BROWSER_PARSED_HTML_DIR = BROWSER_LOGS + "parsed_html/" # .GITIGNORE

PROFILE_DIR = WORKER_DIR + "profile/"
PROFILE_SEED_FILE = PROFILE_DIR + "seed.json"
PROFILE_MEMORY_DIR = PROFILE_DIR + "memory/"  # .GITIGNORE
PROFILE_PERM_MEM_FILE = PROFILE_MEMORY_DIR + "perm_memory.json" # .GITIGNORE
PROFILE_SURVEY_MEM_FILE = PROFILE_MEMORY_DIR + "survey_memory.json" # .GITIGNORE


SCRIPT_MAIN_PATH = "C:/Users/killo/Desktop/SBOT/helper/scripts/main.js"

CHROME_WELCOME_URL = "chrome://welcome/"
LOGIN_URL = "https://www.surveyjunkie.com/?login"
MENU_URL = "https://www.surveyjunkie.com/member"

WHALE_SURVEY_LIMIT = 1
CHAT_TEMPERATURE = 0.3