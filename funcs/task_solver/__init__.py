

from app.profile import Profile
from d_types import ParsedFormGroup, PFGTypeException



def solve_form_group(profile:Profile, form_group:ParsedFormGroup)->ParsedFormGroup:
    
    # outsource to text, image, ... solvers
    
    # if media question throw error PFGTypeException
    
    
    
    return form_group




def solve_text_form_group(profile:Profile, form_group:ParsedFormGroup)->ParsedFormGroup:
    
    # after answer
    
    profile.add_to_survey_memorys()
    return form_group