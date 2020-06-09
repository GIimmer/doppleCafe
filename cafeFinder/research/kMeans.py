import copy
import numpy as np

def initCentroids(X, K):
    centroid_idxs = np.random.choice(X.shape[0], K, replace=False)
    centroids = copy.deepcopy(X[centroid_idxs])
    return centroids

def findClosestCentroids(X, centroids):
    review_count = X.shape[0]
    centroid_num = centroids.shape[0]
    closest_centroid_vector = np.zeros(review_count, dtype=np.int8)
    cost = 0
    for i in range(review_count):
        duped_review = np.repeat(X[i].reshape(1,-1), centroid_num, 0)
        bitwise_distance = np.square(duped_review - centroids).sum(axis=1)
        idx_of_closest = np.argmin(bitwise_distance)
        cost += bitwise_distance[idx_of_closest]
        closest_centroid_vector[i] = idx_of_closest
    return (closest_centroid_vector, cost)

def computeNewCentroids(X, membership, K):
    arr_membership = membership.reshape(-1, 1)
    int_comparator = np.arange(K).reshape(1, -1)
    logical_filter = np.equal(arr_membership, int_comparator)

    vector_sum = np.dot(np.transpose(logical_filter), X)
    membership_total = logical_filter.sum(axis=0).reshape(-1, 1)
    new_centroids = np.divide(vector_sum, membership_total)
    return new_centroids

def runKMeans(X, K, max_iterations):
    m, n = X.shape
    best_cost = 20
    best_centroids = None
    best_centroid_membership = None

    for seed in range(max_iterations):
        cost = np.zeros(max_iterations)
        centroids = initCentroids(X, K)
        centroid_membership = np.zeros(m, dtype=np.int8)

        for i in range(10):
            centroid_membership, cost[i] = findClosestCentroids(X, centroids)
            if (i > 0 and cost[i] == cost[i-1]):
                break
            centroids = computeNewCentroids(X, centroid_membership, K)

        if cost[i] < best_cost:
            best_cost = cost[i]
            best_centroids = centroids
            best_centroid_membership = centroid_membership

    return (best_centroid_membership, best_centroids, best_cost)
