
from ..browser import Browser
from d_types import ParsedInputAnswer, Group, IElement, ActionType
from helper import config
import re
import yarl



class State:
    
    def __init__(self, browser:Browser) -> None:
        self.browser = browser
    
    def is_page(self, browser_url, dest_url):
        return yarl.URL(browser_url) == yarl.URL(dest_url)

    def get_whale_survey_url(self, )->str:
        whale_url = ""
        boxes = self.browser.get_elements(self.browser, '.survey-v2-group a', "")
        for box in boxes:
            ppm = self.browser.get_elements(box, ".survey-v2-points-ppm", "")[0]
            number = re.findall(r'\d+', ppm.text)[0]
            if config.WHALE_SURVEY_LIMIT >= int(number):
                whale_url = box.get_attribute("href")
                return whale_url
        
        return whale_url

    def is_group_solvable(self, group:Group):
        if group.is_media_group:
            return False
        if len(group.ielements) == 0:
            return False
        return True

    def is_group_single_select(self, group:Group):
        if len(group.ielements) != 1:
            return False
        return group.ielements[0].action_type == ActionType.select

    def is_ai_answer_valid(self, parsed_input_answer:ParsedInputAnswer):
        return parsed_input_answer.is_answer_valid()
