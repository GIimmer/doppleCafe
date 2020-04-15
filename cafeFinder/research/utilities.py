"""General functions for use anywhere"""
import json
import requests

def saveDataToFileWithName(data, name):
    with open(name, 'w') as write_file:
        json.dump(data, write_file)

def getDataFromFileWithName(name):
    with open(name) as json_file:
        return json.load(json_file)

def makeAPIRequest(request):
    return requests.get(request).json()
