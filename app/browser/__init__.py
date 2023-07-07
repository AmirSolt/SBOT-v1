
import pickle
import undetected_chromedriver as uc
from helper import utils
import time



class Browser(uc.Chrome):
    


    def __init__(self, worker_dir:str, options=None, user_data_dir=None, driver_executable_path=None, browser_executable_path=None, port=0, enable_cdp_events=False, desired_capabilities=None, advanced_elements=False, keep_alive=True, log_level=0, headless=False, version_main=None, patcher_force_close=False, suppress_welcome=True, use_subprocess=True, debug=False, no_sandbox=True, user_multi_procs: bool = False, **kw):

        self.browser_dir = worker_dir+"browser/"
        utils.create_dir_if_not_exist(self.browser_dir)

        super().__init__(options, user_data_dir, driver_executable_path, browser_executable_path, port, enable_cdp_events, desired_capabilities, advanced_elements, keep_alive, log_level, headless, version_main, patcher_force_close, suppress_welcome, use_subprocess, debug, no_sandbox, user_multi_procs, **kw)
        self.__load_cookies()

    
    def get_current_screenshot_path(self)->str:
        path = self.browser_dir+"screenshots/"+str(int(time.time()))+".png"
        self.__save_screenshot(path)
        return path
    
    def get_current_page_html(self)->str:
        page_html = self.page_source
        self.__save_page_html(page_html)
        return page_html
    
    
    def kill(self):
        """
        Saves cookies and Kills the browser with quit()
        """
        self.__save_cookies()
        self.quit()
    
    

    
    def __save_screenshot(self, image_path:str):
        self.get_screenshot_as_file(image_path)
    
    def __save_page_html(self, page_html:str):
        path = self.browser_dir+"pages/"+str(int(time.time()))+".html"
        utils.save_file(path, page_html)
    
    
  


    def __load_cookies(self):
        cookies = None
        with open(self.browser_dir+'cookies.pickle', 'rb') as f:
            cookies = pickle.load(f)
        
        if cookies:
            for cookie in cookies:
                self.add_cookie(cookie)
            

    def __save_cookies(self):
        
            
        with open(self.browser_dir+'cookies.pickle', 'wb') as f:
            pickle.dump(self.get_cookies(), f, protocol=pickle.DEFAULT_PROTOCOL)
       
