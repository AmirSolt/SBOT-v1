

import numpy as np
from sklearn.neighbors import NearestNeighbors

from InstructorEmbedding import INSTRUCTOR
from PIL import Image
import timm
import torch



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

   # create KNN object using scikit-learn
   if distance_metric == "cosine":
      knn = NearestNeighbors(n_neighbors=len(array_embeddings), metric="cosine", n_jobs=-1)
   else:
      knn = NearestNeighbors(n_neighbors=len(array_embeddings), metric="euclidean", algorithm="ball_tree", n_jobs=-1)

   # fit embeddings to KNN object
   knn.fit(array_embeddings)

   # get the embedding of the source string
   query_embedding = target_embedding.reshape(1, -1)

   # search for nearest neighbors using KNN object
   distances, indices_of_nearest_neighbors = knn.kneighbors(query_embedding, return_distance=True)
   # indices_of_nearest_neighbors = indices_of_nearest_neighbors
   
   print(f"Similarity scores: {distances}")
   
   filtered_indices = indices_of_nearest_neighbors[0][ (1-distances[0]) > distance_threshold]
   

   return filtered_indices


model = INSTRUCTOR('hkunlp/instructor-base')

search_text = "thriller chris hemsworth"
texts = ["sdqwd", 'thats righ', "thriller chris hemsworth"]

embeddings = [model.encode(text) for text in texts]
search_embedding = model.encode(search_text, normalize_embeddings=True)
r = get_similar_items(texts, embeddings, search_embedding, 0.9, "cosine")
print(r)