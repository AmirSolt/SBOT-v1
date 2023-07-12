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




function isElementVisible(el){
    let rect = el.getBoundingClientRect();
    if(!(rect.width>0 && rect.height>0)){return false}
    let style = window.getComputedStyle(el);
    if(style.display === 'none'){return false}
    if(style.visibility === 'hidden'){return false}
    return true;
}


function getVisibleChildren(parent){
  let visibleChildren = Array.from(parent.children).filter(el => {
      return isElementInvisible(el)
  })
  
  return visibleChildren;
}
let visibleElements = getVisibleChildren(document.body);
let visibleSelectors = visibleElements.map(getUniqueCssPath);
return visibleSelectors

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


# https://www.samplicio.us/s/AgeCheck.aspx?SID=6826afef-c83d-44c2-9ba2-a3cedb1ed7dc&mid=fa821e99d20443b2baba76e4d7512592&PID=24873315&79378=9&79348=4&42=29&43=1&auth_code=FfagdlK1QINWcOlGHkbdDvEjgtI

# https://mrs.surveyjunkie.com/v2/redirect?metadata=1.7zERkAD_MEq4UpAD6HtVAVNVBlUJVRwIVwgGHAVVAwQcCQNVUBxSAVVUUFUCUwEBBQVubgQGVVMFAQUBHAQFVQQcBQIGCRwIU1NXHFRTBAUIBlUEBFQACJAC6BVSUFIFUlMIUhxSBQAHHAUHBggcCAcIVBxUUgcIBwNSBwACAQKQBaDoFQQGVVMFAQUBHAQFVQQcBQIGCRwIU1NXHFRTBAUIBlUEBFQACJAEJZAHhXVQWF1IEWVDUFJaVEMRYkRDR1RIkAbojFlFRUFCCx4eQkRDR1RIQh9YX0JYVllFQhxFXlVQSB9SXlweRwAeQkRDR1RIHlRfRUNIDlNYVW5YVQxVAVNVBlUJVRwIVwgGHAVVAwQcCQNVUBxSAVVUUFUCUwEBBQUXQkRBQV1YVENuWFUMCFRUBVcBBwQcAVRQBRwFAAkDHAgDCQQcAwkIBwQBVAdTVQVVF0BEXkVQblhVDAQGVVMFAQUBHAQFVQQcBQIGCRwIU1NXHFRTBAUIBlUEBFQACJAJcJAI-3ExMTGTAAEjkwAA-3GkZi-TAAO0k1hBnAYHHwYAHwACBx8DBAOXVVRHWFJU8ZhEQlRDcFZUX0XoC3ZES0tdVB4EHwIfABFSRENdHgYfBQYfARFheWEeBh8BHwICHAFEU0RfRUQBHwAHHwEFHwAHGlRCXAefUFJSVEFFfVBfVkRQVlTxmVlQQnddUEJZ85MABPOTAAbzmFdYXUVUQ3hVQqCWdXR3cGR9ZZMDBS-TAwT7c_kxMZMDB_tz-TExkwMJ-3P5MTGTAgMwkwII85MFAPtxMTExkwUDkmRidZMFAvsOsTExkwUFkmRidZMFBPOTBQcwkwUGM5MFCbKTAgSQBpADkAOaR1hDRURQXR9QVlSTAwiTBAOUYnscZGKTBAeyh1BdXW5FVENcWF9QRVheX25BXlhfRUKQAoNdVFZQUkhuQkFQbkNeXV1eREWWUl5fRUNeXZtDVFxeR1RuVEFSk15fkwQGsQ.fTKA-ToKVF-vclC3fEmKTKEzRFs&amp;clientAppId=SJ-US&amp;sessionId=1689050296&amp;sessionTypeId=1&amp;cd=eyJpbXByZXNzaW9uX3Bvc2l0aW9uIjozLCJpbXByZXNzaW9uX2NvbHVtbiI6MywiaW1wcmVzc2lvbl9yb3ciOjEsImRldmljZV9kaXNwbGF5X3dpZHRoIjoxOTUxLCJkZXZpY2VfZGlzcGxheV9oZWlnaHQiOjEyNzksImZwIjo5MDEzMTE4Nzl9


# 1001018--BirthDate