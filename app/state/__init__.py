
from ..browser import Browser
from d_types import GroupAnswer, Group, ActionType, GroupType, Chain
from helper import config
import re
import yarl



class State:
    
    def __init__(self, browser:Browser) -> None:
        self.browser = browser
    
    def is_page(self, browser_url, dest_url):
        url1 = yarl.URL(browser_url)
        url2 = yarl.URL(dest_url)
        return url1.host+url1.path==url2.host+url2.path

    def get_whale_survey_url(self, )->str:
        def get_ppm_number(box)->int:
            ppm = self.browser.get_elements(box, ".survey-v2-points-ppm", "")[0]
            number = re.findall(r'\d+', ppm.text)[0]
            return int(number)
        
        boxes = self.browser.get_elements(self.browser, '.survey-v2-group a', "")
        numbers = [get_ppm_number(box) for box in boxes]
        if not numbers:
            return ""
        whale_index = numbers.index(max(numbers))
        print(f"=> whale: {numbers[whale_index]} ppm")
        if config.WHALE_SURVEY_LIMIT <= numbers[whale_index]:
            return boxes[whale_index].get_attribute("href")
        return ""

    def is_group_solvable(self, group:Group):
        if group.type == GroupType.media:
            return False
        if len(group.cables) == 0:
            return False
        return True

    def is_group_single_select(self, group:Group):
        
        if group.type == GroupType.submit:
            return True
        
        chains:list[Chain] = group.get_all_chains()
        if len(chains) == 1 and chains[0].click_only:
            return True
        
        return False

    def is_ai_answer_valid(self, group_answer:GroupAnswer):
        return group_answer.is_answer_valid()
