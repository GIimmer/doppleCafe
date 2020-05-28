# doppleCafe

## Purpose
"Dopple Cafe" is my attempt to produce something useful for myself and the digital nomad community while also practicing my skills in two areas of personal interest; Machine Learning and React.

The goal of the application is to allow digital nomads to find cafes great for remote work while travelling abroad. At present users can either explore cafes grouped by similarity within cities which have already been loaded, or input a target cafe (one that they would like to find a doppleganger of) and the city to which they are exploring. 

## Technology used
Python on Django (Great for Machine Learning)
React with Redux - after pivoting from basic flux architecture (I wanted to share a single store object)

#### Process In Depth

###### Query View
Upon searching a cafe or city, the api uses google or geocoding to provide options in response. User must then lock correct options, setting search params. 
![Query Input View](https://drive.google.com/file/d/1lQ1wHTfFaJzt6wNibzXFxeiuK12xgPpu/view?usp=sharing)
