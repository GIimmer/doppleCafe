# doppleCafe

## Purpose
"Dopple Cafe" is my attempt to produce something useful for myself and the digital nomad community while also practicing my skills in two areas of personal interest; Machine Learning and React.

The goal of the application is to allow digital nomads to find cafes great for remote work while travelling abroad. At present users can either explore cafes grouped by similarity within cities which have already been loaded, or input a target cafe (one that they would like to find a doppleganger of) and the city to which they are exploring. 

## Technology used
Python on Django (Great for Machine Learning)
React with Redux - after pivoting from basic flux architecture (I wanted to share a single store object)
KMeans, PCA, Text processing


## Next Steps
- [ ] On Cache miss, run k-means n times and vectorize best outcome. (Currently only text vectors are cached)
- [ ] Weight atmosphere and food terminology higher than other words, optionally allow user-informed weighting
- [ ] User authorization flow - allow one newly loaded city per user
- [ ] Updates to cafes when they become out of date (not a worry at this stage)
- [ ] Flag to signify probably digital nomad ready (mentions of wifi, outlets, laptop, etc. open hours at least 9 - 5)
- [ ] Using PCA include visualization of cafes placement in 3D space
- [ ] Convert from K-Means to doc2vec?  :scream:

## In Depth

##### Query Input View
Upon searching a cafe or city, the api uses google or geocoding to provide options in response. User must then lock correct options, setting search params. 

![Query Input View](https://i.imgur.com/b54rdUx.png)

Once the request is received by the backend partially RESTful API it...
1. Checks if the cafe is already in the db, if not retrieves details and up to 80 reviews via API
1. Checks if the city is already in the db, if not pulls 60 cafes within 2km of city center and retrieves 80 cafes **from each** (this takes a while) via API
1. Takes target and city cafes and runs text processing (combining all each cafes <=80 reviews into one string, splitting, removing stopwords, converting to word bag and running tf-idf).
1. Uses simple math to find most similar city-cafe vectors


##### Explore Input View
User can peruse preloaded cities across the globe, and select the one which they would like to explore further via its grouped cafes.

![Explore Input View](https://i.imgur.com/pHI78ej.jpg)

Once the city is selected the backend API...
1. Checks if the cites cafes have been vectorized and cached
  * If not processes using above described steps
1. Because K-Means does not work well with sparse high-dimensional data, run PCA to compress cafe text to 5d representations
1. Run K-Means to group cafes by similarity


##### Output View
The output is similar for both explore and query view. The user is given a series of cafe preview options (either ranked similarity or in groups), and some sparse information about each as well as a word cloud (the top 100 highest value words). The user can load more details about any cafe which interests them (an API call in most cases), or highlight it on the map - found at the top of the page

*Query Outcome Initial View*
![Outcome Initial View](https://i.imgur.com/NIbcDk4.jpg)
  
*Explore Outcome Details View*
![Outcome Details View](https://i.imgur.com/bgRDuG8.png)
