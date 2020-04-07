
import numpy as np
import matplotlib as mpl
import matplotlib.pyplot as plt

from scipy.sparse import csr_matrix
from sklearn.decomposition import TruncatedSVD

from utilities import saveDataToFileWithName, getDataFromFileWithName
from apiMethods import (buildSinglePlaceSearchRequest, buildCityLocationSearchRequest, buildAreaSearchRequest,
get60ResultsNearLocation, givenCafeArrRetrieveReviews, buildWextractorDetailsRequest, get60CafesNearCity)
from dataProcessing import processAreaSearch, processCafeArray, processReviews, updateWordVectorWithFile
from kMeans import initCentroids, findClosestCentroids, computeNewCentroids, runKMeans, nearestNeighbors

# 
# MAIN PROGRAM
# -----------------------------------------------------------------------------------------------------------------

def givenCafesGetVectors(scaleToNDimensions):
    # cafeArr = getDataFromFileWithName('trainingSet.txt')
    cafeArr = getDataFromFileWithName('tempPhinneyRidgeWAResponse')
    denseX = processCafeArray(cafeArr)
    sparseX = csr_matrix(denseX)

    svd = TruncatedSVD(n_components=scaleToNDimensions, n_iter=10)
    return cafeArr, svd.fit_transform(sparseX)

def givenCafesRunML(scaleToNDimensions, generateNClusters, showGraph=False):
    cafeArr, X = givenCafesGetVectors(scaleToNDimensions)

    centroidMembership, centroids, cost = runKMeans(X, generateNClusters, 10)

    if (showGraph and scaleToNDimensions == 2):
        for idx, item in enumerate(X):
            x = item[0]
            y = item[1]
            plt.scatter(x,y, s=None, c='pink')
            plt.text(x+0.0003, y+0.0003, cafeArr[idx]['name'], fontsize=9)

        for centroid in centroids:
            plt.scatter(centroid[0], centroid[1], s=None, c='red', marker='x')
        plt.show()

    clusteredCafes = {}
    for i in range(generateNClusters):
        clusteredCafes[i] = []

    for idx, cafe in enumerate(cafeArr):
        cafe = cafeArr[idx]
        centroid = centroidMembership[idx]
        clusteredCafes[centroid].append(cafe)
    
    return clusteredCafes

def plotCostChangeOverNClusters(X, clusterRange):
    xAxis = []
    yAxis = []
    for clusterN in range(clusterRange[0], clusterRange[1]):
        totalCost = 0
        for i in range(20):
            centroidMembership, centroids, cost = runKMeans(X, clusterN, 8)
            totalCost += cost
        xAxis.append(clusterN)
        yAxis.append(totalCost/5)
    plt.plot(xAxis, yAxis)
    plt.show()

def testNDimensionsWithNClusters(scaleToNDimensions, clusterRange):
    cafeArr, X = givenCafesGetVectors(scaleToNDimensions)
    plotCostChangeOverNClusters(X, clusterRange)

def getNearestCafesGivenCafe(cityCafes, cafe):
    cityCafes.append(cafe)
    allCafeVecs = processCafeArray(cityCafes)
    cityCafeVecs = allCafeVecs[0:-1]
    targetCafeVec = allCafeVecs[-1]
    mostSimilarCafeTuples = nearestNeighbors(targetCafeVec, cityCafeVecs)
    similarCafes = []
    for i in range(10):
        similarCafes.append(cityCafes[mostSimilarCafeTuples[i][0]])
    return similarCafes
