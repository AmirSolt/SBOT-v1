import time
import random

short_pause = 12.0 
long_pause = 50.0 
break_pause = 400.0 
prob_long_pause = 0.06 
prob_break_pause = 0.02



def pause():
    chance = random.random()

    if chance < prob_break_pause:
        pause_duration = break_pause * (0.5 + random.random()) 
    elif chance < prob_long_pause:
        pause_duration = long_pause * (0.5 + random.random()) 
    else:
        pause_duration = short_pause * (0.5 + random.random()) 

    print(f"waiting for {int(pause_duration)}s")

    time.sleep(pause_duration)





def test_pause():

    pause_duration = 2

    print(f"waiting for {pause_duration}s")

    time.sleep(pause_duration)