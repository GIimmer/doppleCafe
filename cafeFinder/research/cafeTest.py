import matplotlib.pyplot as plt

from scipy.sparse import csr_matrix
from sklearn.decomposition import TruncatedSVD

from utilities import getDataFromFileWithName
from dataProcessing import (processAreaSearch, processCafeArray, processReviews,
                        updateWordVectorWithFile)
from kMeans import initCentroids, findClosestCentroids, computeNewCentroids, runKMeans
from nearestNeighbors import nearestNeighbors

# 
# MAIN PROGRAM
# -----------------------------------------------------------------------------------------------------------------

def givenCafesGetVectors(scale_to_n_dimensions):
    # cafeArr = getDataFromFileWithName('trainingSet.txt')
    cafe_arr = getDataFromFileWithName('tempPhinneyRidgeWAResponse')
    dense_x = processCafeArray(cafe_arr)
    sparse_x = csr_matrix(dense_x)

    svd = TruncatedSVD(n_components=scale_to_n_dimensions, n_iter=10)
    return cafe_arr, svd.fit_transform(sparse_x)

def givenCafesRunML(scale_to_n_dimensions, generate_n_clusters, show_graph=False):
    cafe_arr, X = givenCafesGetVectors(scale_to_n_dimensions)

    centroid_membership, centroids, cost = runKMeans(X, generate_n_clusters, 10)

    if (show_graph and scale_to_n_dimensions == 2):
        for idx, item in enumerate(X):
            x = item[0]
            y = item[1]
            plt.scatter(x,y, s=None, c='pink')
            plt.text(x+0.0003, y+0.0003, cafe_arr[idx]['name'], fontsize=9)

        for centroid in centroids:
            plt.scatter(centroid[0], centroid[1], s=None, c='red', marker='x')
        plt.show()

    clustered_cafes = {}
    for i in range(generate_n_clusters):
        clustered_cafes[i] = []

    for idx, cafe in enumerate(cafe_arr):
        cafe = cafe_arr[idx]
        centroid = centroid_membership[idx]
        clustered_cafes[centroid].append(cafe)
    
    return clustered_cafes

def plotCostChangeOverNClusters(X, cluster_range):
    x_axis = []
    y_axis = []
    for cluster_n in range(cluster_range[0], cluster_range[1]):
        total_cost = 0
        for i in range(20):
            centroid_membership, centroids, cost = runKMeans(X, cluster_n, 8)
            total_cost += cost
        x_axis.append(cluster_n)
        y_axis.append(total_cost/5)
    plt.plot(x_axis, y_axis)
    plt.show()

def testNDimensionsWithNClusters(scale_to_n_dimensions, cluster_range):
    cafe_arr, X = givenCafesGetVectors(scale_to_n_dimensions)
    plotCostChangeOverNClusters(X, cluster_range)

def getNearestCafesGivenCafe(city_cafes, cafe):
    city_cafes.append(cafe)
    all_cafe_vecs = processCafeArray(city_cafes)
    city_cafe_vecs = all_cafe_vecs[0:-1]
    target_cafe_vec = all_cafe_vecs[-1]
    most_similar_cafe_tuples = nearestNeighbors(target_cafe_vec, city_cafe_vecs)
    similar_cafes = []
    for i in range(10):
        similar_cafes.append(city_cafes[most_similar_cafe_tuples[i][0]])
    return similar_cafes
