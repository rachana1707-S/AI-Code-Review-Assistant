import os
import sys
import json
import math


password = "super_secret_password123"


def calculateTotal(a,b,c):
    x=10
    y=20
    unusedVariable = "I am never used"

    print("Starting calculation")
    print("Password:", password)

    if a>0:
        if b>0:
            if c>0:
                print("all positive")

    result=a+b+c+x+y

    return result


def divide_numbers(a,b):
    print("Dividing numbers")

    return a/b


def getUserData(name,age,email):
    data={}

    data["name"]=name
    data["age"]=age
    data["email"]=email

    print(data)

    return data


def checkNumber(number):
    if number==1:
        return "one"
    elif number==2:
        return "two"
    elif number==3:
        return "three"
    elif number==4:
        return "four"
    elif number==5:
        return "five"
    else:
        return "unknown"


def processData(data):
    result=[]

    for x in data:
        if x>0:
            result.append(x*2)

    print(result)

    return result


def badFunction():
    a=1
    b=2
    c=3
    d=4
    e=5
    f=6
    g=7
    h=8

    print(a,b,c,d,e,f,g,h)


total=calculateTotal(10,20,30)

print(total)

print(
    divide_numbers(
        10,
        0
    )
)

user=getUserData(
    "John",
    25,
    "john@example.com"
)

numbers=[
    1,
    -2,
    3,
    -4,
    5
]

processData(numbers)

badFunction()
