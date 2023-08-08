
from funcs import AI
import re



class ActionType:
    click = "click"
    dropdown = "dropdown"
    set_value = "set_value"
    field = "field"
    range = "range"

class Context:
    def __init__(self, e:dict) -> None:
        self.instruction:str = e["instruction"]
        self.label:str = e["label"]
        self.media_srcs:list[str] = e["mediaSrcs"]

class Action:
    def __init__(self, e:dict) -> None:
        self.type:str = e["type"]
        self.path:str = e["path"]
        self.option_index:int|None = e.get("optionIndex")

    def __repr__(self):
        return f"\n{self.action_type=}|\n{self.path=}"
 
class Chain:
    
    def __init__(self, chain:dict) -> None:
        self.label:str|None = chain.get("label")
        self.wire:str|None = chain.get("wire")
        self.actions:list[Action] = [Action(action) for action in chain["actions"]]
        self.is_only_click:bool = chain.get("isOnlyClick")
        self.answer:str|None = None
    
    def set_answer(self, answer):
        self.answer = answer
    
    def __repr__(self):
        return f"\n{self.wire=} {self.label=}"
  

class Cable:
    
    def __init__(self, cable:dict) -> None:
        self.context:Context = cable["context"]
        self.input_guide:str = cable["inputGuide"]
        self.is_comparable:bool = cable["isComparable"]
        self.chains:list[Chain] = [Chain(chain) for chain in cable["chains"]]
 
    def needsAI(self)->bool:
        return len(self.chains) == 1 and self.chains[0].is_only_click
        
 
    def __repr__(self):
        return f"\n{self.chains=}"
    



class Group:
    
    def __init__(self,
        parsed_group:dict
    ) -> None:
        self.id=parsed_group["id"]
        self.context_path=parsed_group["context_path"]
        
        self.instruction=parsed_group["instruction"]
        
        self.search_verbose=parsed_group["search_verbose"]
        self.chat_verbose=parsed_group["chat_verbose"]
        
        self.type=parsed_group["type"]
        self.cables:list[Cable] = [Cable(cable) for cable in parsed_group["cables"]]
        
    def get_all_chains(self):
        return [chain  for cable in self.cables for chain in cable.chains]
        




    def __repr__(self):
        return f"\n{self.instruction=}\n{self.cables=}"
    



# =========================================================================================================================


class GroupAnswer:

    def __init__(self, group:Group, raw_answer:str) -> None:
        self.group = group
        self.raw_answer = raw_answer
        self.answer_lines = [ans for ans in raw_answer.split("\n") if ans.strip()!=""]
        self.chains:list[Chain] = self.__get_chains()
        
        
    def __get_chains(self) -> list[Chain] :
        valid_chains:list[Chain] = []
        for cable, answer in zip(self.group.cables, self.answer_lines):
            if cable.is_comparable:
                texts = [chain.text for chain in cable.chains]
                match_index = AI.get_highest_fuzzy_match_index(answer, texts, 70)
                valid_chain = cable.chains[match_index]
                valid_chains.append(valid_chain)
            else:
                valid_chain = cable.chains[0]
                valid_chain.set_answer(answer)
                valid_chains.append(valid_chain)
        return valid_chains
                
                
    def is_answer_valid(self)->bool:
        return len(self.chains) == len(self.answer_lines)
    
    def __repr__(self):
        return f"\n{self.group=}"
    
    
    
class IAnswer:
    pass
    
    
# =========================================================================================================================



