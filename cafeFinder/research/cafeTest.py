import matplotlib.pyplot as plt
from django.core.cache import caches
import numpy as np

from scipy.sparse import csr_matrix
from sklearn.decomposition import TruncatedSVD

from research.dataProcessing import (getTFVectorsFromCafeArr, getIDFFromTFVectors,
                                     vectorizeCafeReviews)
from research.kMeans import runKMeans
from research.nearestNeighbors import nearestNeighbors

CACHE = caches['city_vecs']

#
# MAIN PROGRAM
# --------------------------------------------------------------------------------------------------

def givenVecsRunPCA(dense_x, scale_to_n_dimensions):
    sparse_x = csr_matrix(dense_x)
    svd = TruncatedSVD(n_components=scale_to_n_dimensions, n_iter=10)
    return svd.fit_transform(sparse_x)

def givenCityGetVectors(city, target_cafe=None):
    city_cafes = list(city.cafe_set.all())
    city_id = str(getattr(city, 'id'))

    city_cafe_tf_vecs = CACHE.get('vector_for_' + city_id)
    if city_cafe_tf_vecs is None:
        city_cafe_tf_vecs = getTFVectorsFromCafeArr(city_cafes, city_id)

    if target_cafe is not None:
        target_cafe_tf_vec = vectorizeCafeReviews(target_cafe).reshape(1, -1)
        all_tf_vectors = np.append(city_cafe_tf_vecs, target_cafe_tf_vec, axis=0)
    else:
        all_tf_vectors = city_cafe_tf_vecs
    all_cafe_vecs = getIDFFromTFVectors(all_tf_vectors)

    return city_cafes, city_id, all_cafe_vecs

def givenCityRunML(city, scale_to_n_dimensions, generate_n_clusters, show_graph=False):
    city_cafes, city_id, dense_x = givenCityGetVectors(city)
    X = givenVecsRunPCA(dense_x, scale_to_n_dimensions)

    centroid_membership, centroids, _ = runKMeans(X, generate_n_clusters, 10)

    if (show_graph and scale_to_n_dimensions == 2):
        for idx, item in enumerate(X):
            x = item[0]
            y = item[1]
            plt.scatter(x,y, s=None, c='pink')
            plt.text(x+0.0003, y+0.0003, city_cafes[idx]['name'], fontsize=9)

        for centroid in centroids:
            plt.scatter(centroid[0], centroid[1], s=None, c='red', marker='x')
        plt.show()

    clustered_cafes = {}
    for i in range(generate_n_clusters):
        clustered_cafes[i] = []

    for idx, cafe in enumerate(city_cafes):
        cafe = city_cafes[idx]
        centroid = centroid_membership[idx]
        clustered_cafes[centroid].append(cafe)
  
    return clustered_cafes

def plotCostChangeOverNClusters(X, cluster_range):
    x_axis = []
    y_axis = []
    for cluster_n in range(cluster_range[0], cluster_range[1]):
        total_cost = 0
        for i in range(20):
            _, _, cost = runKMeans(X, cluster_n, 8)
            total_cost += cost
        x_axis.append(cluster_n)
        y_axis.append(total_cost/5)
    plt.plot(x_axis, y_axis)
    plt.show()

def testNDimensionsWithNClusters(city, scale_to_n_dimensions, cluster_range):
    _, _, dense_x = givenCityGetVectors(city)
    X = givenVecsRunPCA(dense_x, scale_to_n_dimensions)
    plotCostChangeOverNClusters(X, cluster_range)

def getNearestCafesGivenCafe(city, cafe):
    city_cafes, _, all_cafe_vecs = givenCityGetVectors(city, cafe)

    city_cafe_vecs = all_cafe_vecs[0:-1]
    target_cafe_vec = all_cafe_vecs[-1]

    most_similar_cafe_tuples = nearestNeighbors(target_cafe_vec, city_cafe_vecs)
    similar_cafes = []
    for i in range(10):
        similar_cafes.append(city_cafes[most_similar_cafe_tuples[i][0]])
    return similar_cafes
