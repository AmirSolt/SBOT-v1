
import numpy as np
from sklearn.neighbors import NearestNeighbors
import os
import openai
from InstructorEmbedding import INSTRUCTOR
from dotenv import load_dotenv
load_dotenv()
# from PIL import Image
# import timm
# import torch


CHAT_INSTRUCTIONS = "only answer the question. choose one or multiple options or answer in full if it's an input field."


print("... loading models")
model = INSTRUCTOR('hkunlp/instructor-base')

# openai.organization = "org-asd"
openai.api_key = os.getenv("OPENAI_API_KEY")





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
   
   print(f"Similarity scores: {distances}")
   
   filtered_indices = indices_of_nearest_neighbors[0][ (1-distances[0]) > distance_threshold]
   

   return filtered_indices





def answer_parsed_group(group_verbose, context):
    messages = get_chat_messages(group_verbose, context)
    chat_completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=messages)
    answer = chat_completion.choices[0].message.content    
    return answer

def get_chat_messages(group_verbose, context):
    messages = []
    
    system_message = CHAT_INSTRUCTIONS 
    system_message += "" if not context else f" context: {context}"
    
    messages.append(
    {"role": "system", "content": system_message}
    )
    messages.append(
    {"role": "user", "content": group_verbose}
    )
    return messages
