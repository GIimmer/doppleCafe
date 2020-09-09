"""Constants for use across application"""
from globalVals.environment import TESTENV

GOOGLEPLACESAPI = {
    'urlPrefix': 'https://maps.googleapis.com/maps/api/place/',
    'searchAreaURLSuffix': f"nearbysearch/json?key={TESTENV['googleAPIKey']}&",
    'searchPlaceURLSuffix': f"findplacefromtext/json?key={TESTENV['googleAPIKey']}&",
    'placeDetailsURLSuffix': f"details/json?key={TESTENV['googleAPIKey']}&",
    'placeDetailsRequestedFeatures'
        : "place_id={cafe_id}&fields=type,geometry,plus_code,website,formatted_phone_number,opening_hours,price_level,rating,user_ratings_total,photo,formatted_address",
    'placeBasicDetailsRequestedFeatures': "place_id={cafe_id}&fields=address_component,adr_address,formatted_address,geometry,name,photo,plus_code,type,url"
}

WEXTRACTORAPI = {
    'detailsURLPrefix': f"https://wextractor.com/api/v1/reviews?auth_token={TESTENV['wextractorAPIKey']}&",
    'detailsURLSuffix': "id={id}&offset={offset}&sort=relevancy&translate=1"
}

GEOCODEXYZAPI = {
    'latLongFromPlaceNameURL': "https://geocode.xyz/{cityName}?json=1"
}


# f"place_id={placeId}&fields=type,vicinity,opening_hours,price_level,rating,review,user_ratings_total"