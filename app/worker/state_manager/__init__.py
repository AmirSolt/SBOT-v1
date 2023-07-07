from d_types import State, Action
from ...profile import Profile

class StateManager:
    
    def solve_state(self, state:State, screenshot_path:str, page_html:str, profile:Profile)->Action:
        return None