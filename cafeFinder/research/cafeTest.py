import matplotlib.pyplot as plt
from django.core.cache import caches
import numpy as np

from scipy.sparse import csr_matrix
from sklearn.decomposition import TruncatedSVD

from research.dataProcessing import (
    getTFVectorsFromCafeArr, getIDFFromTFVectors,
    vectorizeCafeReviews, generateWeightedVecs)
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

def givenCityGetVectors(city, target_cafe, weight_balance):
    ambience_wt = 4
    food_wt = 4
    if weight_balance == 'ambience':
        ambience_wt = 10
        food_wt = 2
    elif weight_balance == 'food':
        ambience_wt = 2
        food_wt = 10

    city_cafes = list(city.cafe_set.all())
    city_id = str(getattr(city, 'id'))

    city_cafe_tf_vecs = CACHE.get('vector_for_' + city_id)
    if city_cafe_tf_vecs is None:
        city_cafe_tf_vecs = getTFVectorsFromCafeArr(city_cafes, city_id)
    else:
        usable_cafe_map = CACHE.get("cafe_ids_for_" + city_id)
        city_cafes = [x for x in city_cafes if usable_cafe_map.get(x.place_id, False)]

    if target_cafe is not None:
        target_cafe_tf_vec = vectorizeCafeReviews(target_cafe).reshape(1, -1)
        all_tf_vectors = np.append(city_cafe_tf_vecs, target_cafe_tf_vec, axis=0)
    else:
        all_tf_vectors = city_cafe_tf_vecs
    all_cafe_vecs = getIDFFromTFVectors(all_tf_vectors)
    weight_vec = generateWeightedVecs(ambience_wt, food_wt)
    weighted_cafe_vecs = all_cafe_vecs * weight_vec

    return city_cafes, weighted_cafe_vecs

def givenCityRunML(city, scale_to_n_dimensions, generate_n_clusters, weight_balance, show_graph=False):
    centroid_membership = CACHE.get('centroid_membership_' + weight_balance + '_' + str(getattr(city, 'id')))

    city_cafes, sparse_x = givenCityGetVectors(city, None, weight_balance)
    for idx, cafe_vec in enumerate(sparse_x):
        top_100 = cafe_vec.argsort()[-100:][::-1]
        setattr(city_cafes[idx], 'raw_word_cloud', [(int(val), float(cafe_vec[val])) for val in top_100])

    if centroid_membership is None:
        X = givenVecsRunPCA(sparse_x, scale_to_n_dimensions)

        centroid_membership, centroids, _ = runKMeans(X, generate_n_clusters, 10)
        CACHE.set('centroid_membership_' + weight_balance + '_' + str(getattr(city, 'id')), centroid_membership, None)

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
        clustered_cafes[i] = {
            'cafes': [],
            'common_terms':  None
        }

    for idx, cafe in enumerate(city_cafes):
        cafe = city_cafes[idx]
        centroid = centroid_membership[idx]
        cafe_cluster = clustered_cafes[centroid]
        cafe_cluster['cafes'].append(cafe)
        updateCentroidCommonTerms(cafe_cluster, cafe.raw_word_cloud, idx)
  
    return clustered_cafes

def updateCentroidCommonTerms(cafe_cluster, word_bag, idx=None):
    common_term_map = cafe_cluster.get('common_terms', None)
    if (common_term_map is None):
        cafe_cluster['common_terms'] = {term_tuple[0]: 0 for term_tuple in word_bag}
    else:
        for term_tuple in word_bag:
            term = term_tuple[0]
            if term in common_term_map:
                common_term_map[term] = idx
        for key in list(common_term_map):
            if (common_term_map[key] != idx):
                del common_term_map[key]

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
    _, dense_x = givenCityGetVectors(city, None, 'normal')
    X = givenVecsRunPCA(dense_x, scale_to_n_dimensions)
    plotCostChangeOverNClusters(X, cluster_range)

def getNearestCafesGivenCafe(city, cafe, weight_balance):
    city_cafes, all_cafe_vecs = givenCityGetVectors(city, cafe, weight_balance)

    city_cafe_vecs = all_cafe_vecs[0:-1]
    target_cafe_vec = all_cafe_vecs[-1]

    similar_cafe_wrapper = {
        'similar_cafes': [],
        'common_terms': None
    }

    setWordCloudForCafe(cafe, target_cafe_vec)
    updateCentroidCommonTerms(similar_cafe_wrapper, cafe.raw_word_cloud, 1)

    most_similar_cafe_tuples = nearestNeighbors(target_cafe_vec, city_cafe_vecs)
    for i in range(10):
        vec_for_cafe = all_cafe_vecs[most_similar_cafe_tuples[i][0]]
        cafe_to_add = city_cafes[most_similar_cafe_tuples[i][0]]

        setWordCloudForCafe(cafe_to_add, vec_for_cafe)

        similar_cafe_wrapper['similar_cafes'].append(cafe_to_add)

    return similar_cafe_wrapper

def setWordCloudForCafe(cafe, cafe_vec):
    top_100 = cafe_vec.argsort()[-100:][::-1]
    setattr(cafe, 'raw_word_cloud', [(int(val), float(cafe_vec[val])) for val in top_100])
