import numpy as np
import copy

def initCentroids(X, K):
    centroidIdxs = np.random.choice(X.shape[0], K, replace=False)
    centroids = copy.deepcopy(X[centroidIdxs])
    return centroids

def findClosestCentroids(X, centroids):
    reviewCount = X.shape[0]
    centroidNum = centroids.shape[0]
    closestCentroidVector = np.zeros(reviewCount, dtype=np.int8)
    cost = 0
    for i in range(reviewCount):
        dupedReview = np.repeat(X[i].reshape(1,-1), centroidNum, 0)
        bitwiseDistance = np.square(dupedReview - centroids).sum(axis=1)
        idxOfClosest = np.argmin(bitwiseDistance)
        cost += bitwiseDistance[idxOfClosest]
        closestCentroidVector[i] = idxOfClosest
    return (closestCentroidVector, cost)

def computeNewCentroids(X, membership, K):
    m, n = X.shape

    arrMembership = membership.reshape(-1,1)
    intComparator = np.arange(K).reshape(1,-1)
    logicalFilter = np.equal(arrMembership, intComparator)

    vectorSum = np.dot(np.transpose(logicalFilter), X)
    membershipTotal = logicalFilter.sum(axis=0).reshape(-1,1)
    newCentroids = np.divide(vectorSum, membershipTotal)
    return newCentroids

def runKMeans(X, K, maxIterations):
    m, n = X.shape
    cost = np.zeros(maxIterations)
    centroids = initCentroids(X, K)
    prevCentroids = centroids
    centroidMembership = np.zeros(m, dtype=np.int8)

    for i in range(maxIterations):
        centroidMembership, cost[i] = findClosestCentroids(X, centroids)
        centroids = computeNewCentroids(X, centroidMembership, K)
    
    return (centroidMembership, centroids, cost[maxIterations - 1])