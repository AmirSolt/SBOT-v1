script = """

function getVisibleChildren(parent){
  let visibleChildren = Array.from(parent.children).filter(el => {
    let rect = el.getBoundingClientRect();
    if(!(rect.width>0 && rect.height>0)){return false}
    let style = window.getComputedStyle(el);
    if(style.display === 'none'){return false}
    if(style.visibility === 'hidden'){return false}
    return true;
  }).map(el => ({
    el: el,
    children: getVisibleChildren(el)
  }));
  
  return visibleChildren;
}

let visibleElements = getVisibleChildren(document.body);
return visibleElements

"""

from app.browser import Browser
import time
from helper import utils

driver = Browser("id")

driver.get("https://www.google.com/")

time.sleep(5)

r = driver.execute_script(script)


driver.close()

utils.write_file("test.html", r)