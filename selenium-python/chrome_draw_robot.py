import time
from random import random
from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains

def drawWithLag(driver, element, lag, offsetx, offsety):
    actions = ActionChains(driver)
    actions.move_to_element(element)
    actions.click_and_hold(element)
    actions.move_by_offset(offsetx, offsety)
    actions.release()
    actions.perform()
    time.sleep(lag)


def drawOnCanvas(driver, lag):
    canvas = driver.find_element_by_css_selector("canvas[id^='origin_']")
    drawWithLag(driver, canvas, lag, -155, 0)
    drawWithLag(driver, canvas, lag, 0, -50)
    drawWithLag(driver, canvas, lag, 55, 0)
    drawWithLag(driver, canvas, lag, 0, 20)
    drawWithLag(driver, canvas, lag, 55, 0)
    drawWithLag(driver, canvas, lag, 0, 20)
    drawWithLag(driver, canvas, lag, 100, 0)
    drawWithLag(driver, canvas, lag, 55, 100)
    drawWithLag(driver, canvas, lag, 57, 100)
    drawWithLag(driver, canvas, lag, 59, 100)
    drawWithLag(driver, canvas, lag, 66, 100)
    drawWithLag(driver, canvas, lag, 54, 110)
    drawWithLag(driver, canvas, lag, 52, 120)
    drawWithLag(driver, canvas, lag, 78, 103)
    drawWithLag(driver, canvas, lag, -100, 20)
    drawWithLag(driver, canvas, lag, -255, -10)
    drawWithLag(driver, canvas, lag, 0, -120)
    drawWithLag(driver, canvas, lag, 55, -121)
    drawWithLag(driver, canvas, lag, 0, -11)
    drawWithLag(driver, canvas, lag, 100, -133)
    drawWithLag(driver, canvas, lag, -100, 20)
    drawWithLag(driver, canvas, lag, -253, 10)
    drawWithLag(driver, canvas, lag, -133, -120)
    drawWithLag(driver, canvas, lag, -55, -121)
    drawWithLag(driver, canvas, lag, -50, -131)
    drawWithLag(driver, canvas, lag, 100, -133)
    drawWithLag(driver, canvas, lag, 55, -121)
    drawWithLag(driver, canvas, lag, 155, -221)
    drawWithLag(driver, canvas, lag, 134, -121)
    drawWithLag(driver, canvas, lag, 132, -11)
    drawWithLag(driver, canvas, lag, 78, -71)
    drawWithLag(driver, canvas, lag, 55, -121)
    drawWithLag(driver, canvas, lag, 55, -121)
    drawWithLag(driver, canvas, lag, -253, 10)
    drawWithLag(driver, canvas, lag, -203, 110)
    drawWithLag(driver, canvas, lag, -233, 310)
    drawWithLag(driver, canvas, lag, -153, 100)
    drawWithLag(driver, canvas, lag, -258, 234)
    drawWithLag(driver, canvas, lag, -253, 10)
    drawWithLag(driver, canvas, lag, -253, 10)
    drawWithLag(driver, canvas, lag, 255, 300)
    drawWithLag(driver, canvas, lag, 357, 100)
    drawWithLag(driver, canvas, lag, 159, 200)
    drawWithLag(driver, canvas, lag, 366, 100)
    drawWithLag(driver, canvas, lag, 454, 110)
    drawWithLag(driver, canvas, lag, 352, 120)
    drawWithLag(driver, canvas, lag, 178, 203)

def clearCanvas(driver):
    clearBtn = driver.find_element_by_id("clearBtn")
    ActionChains(driver).click(clearBtn).perform()


def drawRobot(driver):
    while True:
        t = 5 * random()
        drawOnCanvas(driver, 0.02)
        time.sleep(t)
        clearCanvas(driver)

if __name__ == "__main__":
    from sys import argv
    if len(argv) < 2:
        robot_no = 1
    else:
        robot_no = argv[1]

    driver = webdriver.Chrome()
    driver.implicitly_wait(30)

    driver.get("http://0.0.0.0:3000/welcome/write?user_id=" + str(robot_no))
    driver.maximize_window()

    drawRobot(driver)
    
    driver.quit()

