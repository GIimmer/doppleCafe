
import numpy as np
import matplotlib as mpl
import matplotlib.pyplot as plt

from utilities import saveDataToFileWithName, getDataFromFileWithName
from apiMethods import (buildSinglePlaceSearchRequest, buildCityLocationSearchRequest, buildForAreaSearchRequest,
get60ResultsNearLocation, givenCafesRetrieveReviews, buildWextractorDetailsRequest)
from dataProcessing import processAreaSearch, processCafeArray, processReviews, updateWordVector
from kMeans import initCentroids, findClosestCentroids, computeNewCentroids, runKMeans

# 
# MAIN PROGRAM
# -----------------------------------------------------------------------------------------------------------------



cafeArr = getDataFromFileWithName('trainingSet.txt')

X = processCafeArray(cafeArr)
centroidMembership, centroids = runKMeans(X, 4, 5)




