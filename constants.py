from environment import testEnv

googlePlacesAPI = {
    'urlPrefix': 'https://maps.googleapis.com/maps/api/place/',
    'searchAreaURLSuffix': f"nearbysearch/json?key={testEnv['googleAPIKey']}&",
    'searchPlaceURLSuffix': f"findplacefromtext/json?key={testEnv['googleAPIKey']}&"
}

wextractorAPI = {
    'detailsURLPrefix': f"https://wextractor.com/api/v1/reviews?auth_token={testEnv['wextractorAPIKey']}&",
    'detailsURLSuffix': "id={id}&offset={offset}&sort=relevancy"
}

geocodeXYZAPI = {
    'latLongFromPlaceNameURL': "https://geocode.xyz/{cityName}?json=1"
}


# f"place_id={placeId}&fields=type,vicinity,opening_hours,price_level,rating,review,user_ratings_total"