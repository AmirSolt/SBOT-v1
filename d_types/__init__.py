
from funcs import AI
import re



class ActionType:
    field = "field"
    select = "select"
    dropdown = "dropdown"

class GroupType:
    list="list"
    grid="grid"
    submit="submit"
    media="media"
    other="other"


class Action:
    def __init__(self, e:dict) -> None:
        self.action_type:str = e["action_type"]
        self.path:str = e["path"]
        self.option_index:int|None = e.get("option_index")

    def __repr__(self):
        return f"\n{self.action_type=}|\n{self.path=}"
 
class Chain:
    
    def __init__(self, chain:dict) -> None:
        self.text:str|None = chain.get("text")
        self.answer:str|None = None
        self.actions:list[Action] = [Action(action) for action in chain["actions"]]
        self.click_only = all(action.action_type == ActionType.select for action in self.actions)
    
    def set_answer(self, answer):
        self.answer = answer
    
    def __repr__(self):
        return f"\n{self.text=}"
  

class Cable:
    
    def __init__(self, cable:dict) -> None:
        self.is_comparable = cable["is_comparable"]
        self.chains:list[Chain] = [Chain(chain) for chain in cable["chains"]]
 
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
        return [chain for chain in [cable.chains for cable in self.cables]]
        
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



