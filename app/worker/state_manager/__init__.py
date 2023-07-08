from d_types import State, Action
from ...profile import Profile




class StateManager:
    
    def solve_state(self, state:str, screenshot_path:str, page_html:str, profile:Profile)->Action:
        
        action = Action()

        
        match state:
            
            case State.login:
                return action
                
            case State.menu:
                return action
                
            case State.popup:
                return action
                
            case State.form:
                return action
                
            case State.unknown:
                return action
                

            case _:
                raise Exception(f"current state does not exist in solve_state checks. current state: {state}") 
            
                
        