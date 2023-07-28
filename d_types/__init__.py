

class ParsedAnswer:

    def __init__(self, raw_answer:str) -> None:
        self.raw_answer = raw_answer
        self.__parse_answer(raw_answer)

    def __parse_answer(self, raw_answer:str):
        # split \n
        # id: X
        # answer: X
        pass