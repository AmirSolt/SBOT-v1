
import pickle
import undetected_chromedriver as uc
from helper import utils, config
import time
import os
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException, ElementClickInterceptedException, ElementNotSelectableException
from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.select import Select
from selenium.webdriver.support.color import Color



HIGHLIGHT_SCRIPT = 'let target=document.querySelector(arguments[0]);target.style.borderColor=arguments[1],target.style.borderStyle="solid";var container=document.createElement("div");container.style.position="relative";var label=document.createElement("div");label.textContent=arguments[2],label.style.position="absolute",label.style.top="-40px",label.style.left="0",label.style.borderColor="red",label.style.borderStyle="solid",container.insertBefore(label,container.firstChild),target.insertBefore(container,target.firstChild);'


PARSER_ELEMENTS_SCRIPT = utils.convert_script_return(config.SCRIPT_MAIN_PATH)


class Browser(uc.Chrome):
    


    def __init__(self, worker_id:str, options=None, user_data_dir=None, driver_executable_path=None, browser_executable_path=None, port=0, enable_cdp_events=False, desired_capabilities=None, advanced_elements=False, keep_alive=True, log_level=0, headless=False, version_main=None, patcher_force_close=False, suppress_welcome=True, use_subprocess=True, debug=False, no_sandbox=True, user_multi_procs: bool = False, **kw):

        self.browser_dir = config.BROWSER_DIR.format(worker_id=worker_id)
        self.browser_logs_dir = config.BROWSER_LOGS.format(worker_id=worker_id)
        self.screenshots_dir = config.BROWSER_SCREENSHOTS_DIR.format(worker_id=worker_id)
        self.pages_dir = config.BROWSER_PAGES_DIR.format(worker_id=worker_id)
        self.parsed_html_dir = config.BROWSER_PARSED_HTML_DIR.format(worker_id=worker_id)
        self.cookies_dir = config.BROWSER_COOKIES_DIR.format(worker_id=worker_id)
        self.cookies_path = config.BROWSER_COOKIES_FILE.format(worker_id=worker_id)
        
        options = self.__get_options()
        super().__init__(options, user_data_dir, driver_executable_path, browser_executable_path, port, enable_cdp_events, desired_capabilities, advanced_elements, keep_alive, log_level, headless, version_main, patcher_force_close, suppress_welcome, use_subprocess, debug, no_sandbox, user_multi_procs, **kw)
        
        
        
        self.__init_filesys()


    def __get_options(self):
        options = Options()
        options.add_argument("--disable-web-security")
        options.add_argument("--start-maximized")
        options.page_load_strategy = 'eager'
        return options        
    
    def __init_filesys(self):

        utils.create_dir_if_not_exist(self.browser_dir)
        utils.create_dir_if_not_exist(self.browser_logs_dir)
                
        if utils.does_file_exist(self.cookies_path):
            self.__load_cookies()
    
    
    def choose_option(self, selector_path:str, iframe_path:str, index:int)->list[WebElement]:
        self.context_switch(iframe_path)
        try:
            element = self.find_element(By.CSS_SELECTOR, selector_path)
            Select(element).select_by_index(index)
        except NoSuchElementException:
            return False
        except ElementNotSelectableException:
            return False
        self.context_switch("")
        return True
    
    
    def fill_field(self, selector_path:str, iframe_path:str, text:str)->list[WebElement]:
        self.context_switch(iframe_path)
        try:
            element = self.find_element(By.CSS_SELECTOR, selector_path)
            element.send_keys(text)
        except NoSuchElementException:
            return False
        self.context_switch("")
        return True
    
    
    def click_element(self, selector_path:str, iframe_path:str)->list[WebElement]:
        self.context_switch(iframe_path)
        try:
            element = self.find_element(By.CSS_SELECTOR, selector_path)
            element.click()
        except NoSuchElementException:
            return False
        except ElementClickInterceptedException:
            return False

        self.context_switch("")
        
        return True
    
    
    def get_elements(self, selector_path:str, iframe_path:str)->list[WebElement]:
        
        self.context_switch(iframe_path)
            
        elements = []  
        try:
            elements = self.find_elements(By.CSS_SELECTOR, selector_path)
        except NoSuchElementException:
            elements = []

        self.context_switch("")
        
        return elements
    

    def context_switch(self, iframe_path):
        if iframe_path:
            iframe = self.find_element(iframe_path, "")
            self.switch_to.frame(iframe)
        else:
            self.switch_to.default_content()
            
            
    
    def highlight_element(self, selector_path:str, iframe_path:str, color:str, label:str)->bool:
        if iframe_path:
            iframe = self.find_element(iframe_path, "")
            self.switch_to.frame(iframe)
            
        self.execute_script(HIGHLIGHT_SCRIPT, selector_path, color, label )
    
        self.switch_to.default_content()
        

    
    def get_current_screenshot_path(self)->str:
        print("taking a screenshot")
        utils.create_dir_if_not_exist(self.screenshots_dir)
        path = self.__save_screenshot()
        return path
    
    def get_current_page_html(self)->str:
        page_html = self.page_source
        utils.create_dir_if_not_exist(self.pages_dir)
        self.__save_page_html(page_html)
        return page_html
    
    def get_parsed_groups(self)->list[dict]:
        parsed_groups = self.execute_script(PARSER_ELEMENTS_SCRIPT)
        if not parsed_groups:
            parsed_groups = []
        utils.create_dir_if_not_exist(self.parsed_html_dir)
        self.__save_parsed_html(parsed_groups)
        return parsed_groups
        
        
    
    def wait_till_page_loads(self):
        WebDriverWait(self, 10).until(EC.presence_of_element_located((By.TAG_NAME, "body")))
    
        
    
    def kill(self):
        """
        Saves cookies and Kills the browser with close()
        """
        self.__save_cookies()
        self.close()
    
    

    
    def __save_screenshot(self):
        path =  self.screenshots_dir+ str(int(time.time()))+".png"
        self.wait_till_page_loads()
        self.get_screenshot_as_file(path)
        return path
    
    def __save_page_html(self, page_html:str):
        path = self.pages_dir+str(int(time.time()))+".html"
        utils.write_file(path, page_html)
    
    def __save_parsed_html(self, parsed_html):
        path = self.parsed_html_dir+str(int(time.time()))+".json"
        utils.write_file(path, parsed_html)
  


    def __load_cookies(self):
        cookies = None
        
        if os.path.getsize(self.cookies_path) > 0:   
            with open(self.cookies_path, 'rb') as f:
                cookies = pickle.load(f)
        
        if cookies:
            current_time = time.time()
            for cookie in cookies:
                if not ("domain" in cookie and cookie["domain"] == self.current_url.split("//")[-1].split("/")[0]):
                    continue
                    
                if 'expiry' in cookie:
                    if current_time > cookie['expiry']:
                        continue
                    
                self.add_cookie(cookie)
            

    def __save_cookies(self):
        
        utils.create_dir_if_not_exist(self.cookies_dir)
        with open(self.cookies_path, 'wb') as f:
            pickle.dump(self.get_cookies(), f, protocol=pickle.DEFAULT_PROTOCOL)
       
