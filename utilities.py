import json

def saveDataToFileWithName(name, data):
    with open(name, 'w') as write_file:
        json.dump(name + '.txt', write_file)

def getDataFromFileWithName(name):
    with open(name + '.txt') as json_file:
        return json.load(json_file)