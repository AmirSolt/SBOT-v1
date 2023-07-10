
from d_types import ParsedFormGroup, PFGTypeException

from ...browser import Browser
from ...profile import Profile
from ...zoup import Zoup


from funcs import task_parser 
from funcs import task_solver

class Actor:
    

    
    def ask_help(self):
        print("Help!!!")
    
    
    def form_act(self, browser:Browser, profile:Profile, page_html:str):
        
        print("Form Act !!!")
        
        # try:
        
        #     zoup = Zoup()
            
        #     form_group:ParsedFormGroup = task_parser.form_group_parser(zoup)
            
        #     task_solver.solve_form_group(profile, form_group)
            
      
        #     # use browser to act the answer
            
        # except PFGTypeException as e:
        #     print("This form group type is not supported")
        #     self.ask_help()
        #     return None
            
        
        
        
        