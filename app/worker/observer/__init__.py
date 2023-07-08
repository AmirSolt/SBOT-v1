
from helper import config, utils
from d_types import State
from funcs import AI
import glob


class Observer:
    
    """
    state_images: list of dicts:
    {
        "image_path":embedding
    }
    """
    
    
    def __init__(self) -> None:
        
        self.state_image_embeddings:dict = {}
        
        self.__init_state_image_embeddings()
        
    
    
    def get_current_states(self, screenshot_path:str, page_html:str)->str:
        state:str = State.unknown
        
        target_embedding = AI.embed_image(screenshot_path)
        close_image_paths = AI.get_similar_items(self.state_image_embeddings.keys(), self.state_image_embeddings.values(), target_embedding, 0.1, "cosine")
        
        if len(close_image_paths) > 0:
            state = self.__get_state_from_path(close_image_paths[0])
        
        return state
    
    
    
    def __get_state_from_path(self, image_path:str):
        filename = image_path.split("/")[-1]
        code = filename.split("_")[0]
        
        if not code in State.get_all_states():
            raise Exception(f"code: {code} is not in state codes: {State.get_all_states()}")
        
        return code
    
    def __init_state_image_embeddings(self):
        utils.create_dir_if_not_exist(config.STATE_IMAGES_DIR)
        
        if not utils.does_file_exist(config.STATE_IMAGES_EMBEDDING_PATH):
            state_images = glob.glob(config.STATE_IMAGES_DIR + '*')
            self.state_image_embeddings = {image_path:AI.embed_image(image_path) for image_path in state_images}
            utils.save_file(config.STATE_IMAGES_EMBEDDING_PATH, self.state_image_embeddings)
        else:
            self.state_image_embeddings = utils.read_file(config.STATE_IMAGES_EMBEDDING_PATH)