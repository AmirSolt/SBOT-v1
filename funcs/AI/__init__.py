
import numpy as np
from sklearn.neighbors import NearestNeighbors
from helper import config
import os
import openai
from InstructorEmbedding import INSTRUCTOR
from dotenv import load_dotenv
load_dotenv()
# from PIL import Image
# import timm
# import torch


CHAT_INSTRUCTIONS = """Role play as {name}. 
if you are aksed a question about you, use the information given to answer.
To answer the question pay attention to [input:... id:...].
if there's an input similar to "continue" or "next" only choose that.
You can only respond in the following formats for each input. 
if input type is Submit, only respond with "id"
if input type is Select, only respond with "id"
if input type is Field, respond with "id" and "answer"
if input type is Dropdown, respond with "id" and "option"
example response:
id:x
id:x answer:...
id:x option:...

some information about you:
{context}
"""


print("... loading models")
model = INSTRUCTOR('hkunlp/instructor-base')

# openai.organization = "org-asd"
openai.api_key = os.getenv("OPENAI_API_KEY")



# ================================================================================
# search

def embed_str(text:str)->list[float]:
    return model.encode(text).tolist()


def get_similar_items(items:list, embeddings:list[list[float]], target:list[float], threshold:float, method:str):
    indecies = get_similar_indecies(embeddings, target, threshold, method)
    return [items[i] for i in indecies]

def get_similar_indecies(embeddings:list[list[float]], target:list[float], threshold:float, method:str)->list[int]:
    
    array_embeddings = np.array(embeddings, dtype="float32")
    target_embeddings = np.array(target, dtype="float32")
    
    result_indecies = recommendations_from_embeddings(array_embeddings, target_embeddings, threshold, method)
    
    return result_indecies.tolist()

def recommendations_from_embeddings(
   array_embeddings: np.ndarray,
   target_embedding: np.ndarray,
   distance_threshold:float,
   distance_metric: str ,
) -> np.ndarray:

   if distance_metric == "cosine":
      knn = NearestNeighbors(n_neighbors=len(array_embeddings), metric="cosine", n_jobs=-1)
   else:
      knn = NearestNeighbors(n_neighbors=len(array_embeddings), metric="euclidean", algorithm="ball_tree", n_jobs=-1)

   knn.fit(array_embeddings)

   query_embedding = target_embedding.reshape(1, -1)

   distances, indices_of_nearest_neighbors = knn.kneighbors(query_embedding, return_distance=True)
   
#    print(f"Similarity scores: {distances}")
   
   filtered_indices = indices_of_nearest_neighbors[0][ (1-distances[0]) > distance_threshold]
   

   return filtered_indices






# ================================================================================
# chatgpt



def answer_parsed_group(group_verbose, worker_name:str, context)->str:
    messages = get_chat_messages(group_verbose, worker_name, context)
    chat_completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=messages, temperature=config.CHAT_TEMPERATURE)
    answer = chat_completion.choices[0].message.content
    return answer


def get_chat_messages(group_verbose, worker_name:str, context):
    messages = []
    
    context = "" if not context else context
    system_message = CHAT_INSTRUCTIONS.format(name=worker_name, context=context)
    
    messages.append(
    {"role": "system", "content": system_message}
    )
    messages.append(
    {"role": "user", "content": group_verbose}
    )
    return messages


# ================================================================================
# fuzzy matching


from thefuzz import fuzz
FUZZY_THRESH = 70   

def is_fuzzy_match(t1:str, t2:str)->bool:
    similarity_ratio = fuzz.ratio(t1.lower(), t2.lower())
    return similarity_ratio >= FUZZY_THRESH
 
def get_highest_fuzzy_match_index(t1:str, texts:list[str])->int:
   scores = [fuzz.ratio(t1.lower(), text.lower()) for text in texts]
   return scores.index(max(scores))