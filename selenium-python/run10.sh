#!/bin/bash


for ((i=1; i<=$1; i++)); do
    python chrome_draw_robot.py $i &
done
