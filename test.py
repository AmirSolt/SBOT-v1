import yarl


dest_url = "https://www.python.org/~guido?arg=1#frag"
dest2_url = "https://www.python.org/~guido?arg=1#fragdqw dqwd qwd "

url = yarl.URL(dest_url)
url2 = yarl.URL(dest2_url)

print(url.host+url.path)
print(url.host+url.path==url2.host+url2.path)