
import pickle
import undetected_chromedriver as uc
from helper import utils, config
import time
import os
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By


INVIS_ELEMENTS_SCRIPT = 'function getUniqueCssPath(e){if(!e||e.nodeType!==Node.ELEMENT_NODE)return"";let t=[];for(;e.nodeType===Node.ELEMENT_NODE&&"html"!==e.nodeName.toLowerCase();){let n=e.nodeName.toLowerCase();if(e.parentNode){let i=Array.from(e.parentNode.children),l=i.filter(e=>e.nodeName.toLowerCase()===n);l.length>1&&(n+=`:nth-child(${i.indexOf(e)+1})`)}n+=e.id?`#${e.id}`:"",n+=e.className&&"string"==typeof e.className?"."+e.className.trim().replace(/\s+/g,"."):"",t.unshift(n),e=e.parentNode}return t.join(" > ")}function getAllAttrs(e){let t={};for(let n=0;n<e.attributes.length;n++)t[e.attributes[n].name]=e.attributes[n].value;return t}function getElementText(e){let t="";for(let n=0;n<e.childNodes.length;n++)3===e.childNodes[n].nodeType&&(t+=e.childNodes[n].nodeValue);return t}function isElementVisible(e,t){if(!(t.width>0&&t.height>0))return!1;let n=window.getComputedStyle(e);return"none"!==n.display&&"hidden"!==n.visibility}function getZIndex(e){return parseInt(e.style.zIndex?e.style.zIndex:0)}function verifyIframe(e){}function getChildrenInfo(e,t=""){return Array.from(e.children).map(e=>{let n=e.getBoundingClientRect();if(!isElementVisible(e,n))return null;let i=e,l="";if("IFRAME"==e.tagName)try{i=e.contentWindow.document.body,l=getUniqueCssPath(e)}catch(r){return null}return{iframe_path:t,path:getUniqueCssPath(e),name:e.tagName,width:n.width,height:n.height,attrs:getAllAttrs(e),text:getElementText(e).trim(),allText:e.innerText,z_index:getZIndex(e),children:getChildrenInfo(i,l)}}).filter(e=>e)}let elementsInfo=getChildrenInfo(document.body);return elementsInfo'



class Browser(uc.Chrome):
    


    def __init__(self, worker_id:str, options=None, user_data_dir=None, driver_executable_path=None, browser_executable_path=None, port=0, enable_cdp_events=False, desired_capabilities=None, advanced_elements=False, keep_alive=True, log_level=0, headless=False, version_main=None, patcher_force_close=False, suppress_welcome=True, use_subprocess=True, debug=False, no_sandbox=True, user_multi_procs: bool = False, **kw):

        self.browser_dir = config.BROWSER_DIR.format(worker_id=worker_id)
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
        
        
        
                
        if utils.does_file_exist(self.cookies_path):
            self.__load_cookies()
    
    
    
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
    
    def get_parsed_html(self):
        parsed_html = self.execute_script(INVIS_ELEMENTS_SCRIPT)
        utils.create_dir_if_not_exist(self.parsed_html_dir)
        self.__save_parsed_html(parsed_html)
        return parsed_html
        
        
    
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
       
