







def embed_str(text:str)->list[float]:
    return 


def embed_image(image_path:str)->list[float]:
    pass


def get_similar_indecies(embeddings:list[list[float]], target:list[float], threshold:float, method:str)->list[int]:
    
    return []

def get_similar_items(items:list, embeddings:list[list[float]], target:list[float], threshold:float, method:str):
    indecies = get_similar_indecies(embeddings, target, threshold, method)
    return [items[i] for i in indecies]