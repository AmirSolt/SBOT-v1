

import re



class ActionType:
    field = "field"
    select = "select"
    dropdown = "dropdown"



class IElement:
    
    def  __init__(self, action_type:str, path:str) -> None:
        self.action_type = action_type
        self.path = path

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
        self.ielements = [IElement(e["action_type"], e["path"]) for e in ielements] 
        

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

    def __init__(self, ielements:list[IElement], raw_input_answer:str) -> None:
        self.raw_input_answer = raw_input_answer
        parsed_dict = self.__parse_answer(raw_input_answer)
        self.id = parsed_dict.get("id")
        self.answer = parsed_dict.get("answer")
        self.option = parsed_dict.get("option")
        
        self.ielement:IElement = ielements[self.id]

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
    
    
def get_parsed_input_answers(ielements:list[IElement], raw_answer:str)->list[ParsedInputAnswer]:
    if not raw_answer:
        return []
    raw_input_answers = raw_answer.split("\n")
    return [ParsedInputAnswer(ielements, raw_input_answer) for raw_input_answer in raw_input_answers if raw_input_answer.strip()!=""]



# =========================================================================================================================



