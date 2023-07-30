
from ..browser import Browser
from d_types import ParsedInputAnswer


class State:
    
    def __init__(self, browser:Browser) -> None:
        self.browser = browser
    
    def is_other_page(self, ):
        pass

    def is_login_page(self, ):
        pass

    def is_menu_page(self, ):
        pass

    def get_whale_survey_url(self, ):
        pass

    def is_group_solvable(self, group):
        pass

    def is_group_single_option(self, group):
        pass

    def is_ai_answer_valid(self, parsed_input_answers:list[ParsedInputAnswer]):
        pass
