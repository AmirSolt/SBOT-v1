
from funcs import AI
import re



class ActionType:
    field = "field"
    select = "select"
    dropdown = "dropdown"

class IAction:
    def __init__(self, e:dict) -> None:
        self.action_type:str = e["action_type"]
        self.context_path:str = e["context_path"]
        self.path:str = e["path"]
        self.text:str|None = e.get("text")
        self.option_index:int|None = e.get("option_index")
        self.answer:str|None = None

    def set_answer(self, answer):
        self.answer = answer

    def __repr__(self):
        return f"\n{self.action_type=}|\n{self.path=}|\n{self.text=}"
    

class IActionCluster:
    
    def __init__(self, iaction_cluster:list[IAction]) -> None:
        self.iactions:list[IAction] = iaction_cluster
        self.is_comparable = self.iactions[0]["action_type"] != ActionType.field
 

    def __repr__(self):
        return f"\n{self.iactions=}"
    



class Group:
    
    def __init__(self,
        parsed_group:dict
    ) -> None:
        self.id=parsed_group["id"]
        self.context_path=parsed_group["context_path"]
        
        self.instruction=parsed_group["instruction"]
        
        self.search_verbose=parsed_group["search_verbose"]
        self.chat_verbose=parsed_group["chat_verbose"]
        
        self.is_media_group=parsed_group["is_media_group"]
        self.iaction_clusters:list[IActionCluster] = [IActionCluster(iaction_cluster) for iaction_cluster in parsed_group["iaction_clusters"]]
        
    def __repr__(self):
        return f"\n{self.instruction=}\n{self.iaction_clusters=}"
    



# =========================================================================================================================


class GroupAnswer:

    def __init__(self, group:Group, raw_answer:str) -> None:
        self.group = group
        self.raw_answer = raw_answer
        self.answer_lines = [ans for ans in raw_answer.split("\n") if ans.strip()!=""]
        self.iactions:list[IAction] = self.__get_iactions()
        
        
    def __get_iactions(self):
        valid_iactions = []
        for iaction_cluster, answer in zip(self.group.iaction_clusters, self.answer_lines):
            if iaction_cluster.is_comparable:
                texts = [iaction.text for iaction in iaction_cluster.iactions]
                match_index = AI.get_highest_fuzzy_match_index(answer, texts, 70)
                valid_iaction = iaction_cluster.iactions[match_index]
                valid_iactions.append(valid_iaction)
            else:
                valid_iaction = iaction_cluster.iactions[0]
                valid_iaction.set_answer(answer)
                valid_iactions.append(valid_iaction)
        return valid_iactions
                
                
    def is_answer_valid(self)->bool:
        return len(self.iactions) == len(self.answer_lines)
    
    def __repr__(self):
        return f"\n{self.group=}"
    
    
    
class IAnswer:
    pass
    
    
# =========================================================================================================================



