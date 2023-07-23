
from app.browser import Browser
# from ..AI import 


def highlight_answer(browser:Browser, parsed_group:dict, answer:str):
    # if option get answer_path
    # ...
    browser.highlight_element(answer_path, parsed_group["context_path"])

def act_on_answer(browser:Browser, parsed_group:dict, answer:str)->None:
    pass

def find_answer_path(parsed_group:dict, answer:str):
    # do semantic search for answer
    pass