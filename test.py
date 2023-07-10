
from app.zoup import Zoup
from funcs import task_parser
from helper import utils

html_page = utils.read_file("./saves/workers/worker_id/browser/pages/1688962332.html")

zoup = Zoup(html_page, "xml")

r = task_parser.get_parsed_form_group(zoup)

print(r)