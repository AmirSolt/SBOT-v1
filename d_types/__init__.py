
from funcs import AI
import re



class ActionType:
    field = "field"
    select = "select"
    dropdown = "dropdown"



class IElement:
    
    def  __init__(self, action_type:str, path:str, options:list[str]|None) -> None:
        self.action_type = action_type
        self.path = path
        self.options = options

class Group:
    
    def __init__(self,
        id:str,
        context_path:str,
        chat_verbose:str,
        search_verbose:str,
        is_media_group:bool,
        ielements:list[dict],
    ) -> None:
        self.id = id 
        self.context_path = context_path 
        self.chat_verbose = chat_verbose 
        self.search_verbose = search_verbose 
        self.is_media_group = is_media_group 
        self.ielements = [IElement(e["action_type"], e["path"], e.get("options")) for e in ielements] 
        

def convert_to_group(parsed_group:dict)->Group:
    return Group(
        id=parsed_group["id"],
        context_path=parsed_group["context_path"],
        chat_verbose=parsed_group["chat_verbose"],
        search_verbose=parsed_group["search_verbose"],
        is_media_group=parsed_group["is_media_group"],
        ielements=parsed_group["ielements"],   
    )



# =========================================================================================================================


class ParsedInputAnswer:

    def __init__(self, context_path:str, ielements:list[IElement], raw_input_answer:str) -> None:
        self.raw_input_answer = raw_input_answer
        parsed_dict = self.__parse_answer(raw_input_answer)
        self.id:str|None = parsed_dict.get("id")
        self.answer:str|None = parsed_dict.get("answer")
        self.option:str|None = parsed_dict.get("option")
        
        self.context_path = context_path
        self.ielement:IElement = None if int(self.id) < len(ielements) else ielements[int(self.id)]
        
    def is_answer_valid(self)->bool:
        if not self.ielement:        
            return False
        if self.ielement.action_type == ActionType.select:
            return self.id
        if self.ielement.action_type == ActionType.field:
            return self.id and self.answer
        if self.ielement.action_type == ActionType.dropdown:
            if not (self.id and self.option):
                return False
            if not self.ielement.options:
                return False
            fuzzy_matches = [AI.is_fuzzy_match(self.option, opt) for opt in self.ielement.options]
            return True in fuzzy_matches

        return False
    
    def __parse_answer(self, text:str)->dict:
        """
        "id:1 answer:hello world" -> {"id":1, "answer":"hello world"}
        """
        r = {}
        keys = ['id:', 'answer:', 'option:']
        parts = re.split("|".join(keys), text)
        parts = [part.strip() for part in parts if part.strip()!=""]
        key_indexes = [{"key":key,"index":text.find(key)} for key in keys if text.find(key)!=-1]
        key_indexes.sort(key=lambda x: x["index"], reverse=False)
        for i, key_index in enumerate(key_indexes):
            key = key_index["key"].replace(":","")
            r[key] = parts[i]
            
        return r
    
    def __repr__(self):
        return f"{self.id=}|{self.answer=}|{self.option=}| has ielement {self.ielement!=None}| {self.context_path=}"
    
  
    
    
def get_parsed_input_answers(group:Group, raw_answer:str)->list[ParsedInputAnswer]:
    if not raw_answer:
        return []
    raw_input_answers = raw_answer.split("\n")
    return [ParsedInputAnswer(group.context_path, group.ielements, raw_input_answer) for raw_input_answer in raw_input_answers if raw_input_answer.strip()!=""]



# =========================================================================================================================



