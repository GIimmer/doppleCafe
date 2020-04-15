import numpy as np

def nearestNeighbors(cafe_vec, city_arr_vec, nearest_n=10):
    bitwise_distance = np.square(cafe_vec - city_arr_vec).sum(axis=1)
    distance_with_idx = list(enumerate(bitwise_distance)) 
    closest_cafe_vecs = sorted(distance_with_idx, key=lambda cafe_tuple: cafe_tuple[1])
    return closest_cafe_vecs