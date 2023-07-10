
from d_types import ParsedFormGroup
from app.zoup import Zoup


def get_parsed_form_group(zoup:Zoup)->ParsedFormGroup:
    

    # Find the first form that is not hidden
    visible_forms = [form for form in zoup.find_all('form') if is_valid_element(form)]

    if visible_forms:
        form = visible_forms[0]

        # Find the first form group that is not answered yet
        unanswered_form_groups = [form_group for form_group in form.find_all('div', attrs={'class': 'form-group'}) if not form_group.find('input', attrs={'value': True})]

        if unanswered_form_groups:
            first_unanswered_form_group = unanswered_form_groups[0]
            return ParsedFormGroup()
        else:
            print('No form group found.')
    else:
        print('No visible form found.')

 
  


def is_valid_element(element):
    return True