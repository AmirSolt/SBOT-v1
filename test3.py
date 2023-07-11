script = """

function getUniqueCssPath(el) {
  if (!el || el.nodeType !== Node.ELEMENT_NODE) {
    return '';
  }

  const path = [];
  while (el.nodeType === Node.ELEMENT_NODE && el.nodeName.toLowerCase() !== 'html') {
    const selector = el.nodeName.toLowerCase() + 
      (el.id ? `#${el.id}` : '') +
      (el.className && typeof el.className === 'string' 
        ? '.' + el.className.trim().replace(/\s+/g, ".") 
        : '');
    path.unshift(selector);
    el = el.parentNode;
  }

  return path.join(' > ');
}

function isElementInvisible(el){
    let rect = el.getBoundingClientRect();
    if(!(rect.width>0 && rect.height>0)){return true}
    let style = window.getComputedStyle(el);
    if(style.display === 'none'){return true}
    if(style.visibility === 'hidden'){return true}
    return false;
}


function getInvisibleChildren(parent){
  let invisibleChildren = Array.from(parent.children).filter(el => {
      return isElementInvisible(el)
  })
  
  return invisibleChildren;
}
let invisibleElements = getInvisibleChildren(document.body);
let invisibleSelectors = invisibleElements.map(getUniqueCssPath);
return invisibleSelectors

"""

from app.browser import Browser
import time
from helper import utils

driver = Browser("id")

driver.get("https://www.google.com/")

time.sleep(5)

r = driver.execute_script(script)


driver.close()

utils.write_file("test.json", r)



