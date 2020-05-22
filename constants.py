"""Constants for use across application"""
from environment import TESTENV

GOOGLEPLACESAPI = {
    'urlPrefix': 'https://maps.googleapis.com/maps/api/place/',
    'searchAreaURLSuffix': f"nearbysearch/json?key={TESTENV['googleAPIKey']}&",
    'searchPlaceURLSuffix': f"findplacefromtext/json?key={TESTENV['googleAPIKey']}&"
}

WEXTRACTORAPI = {
    'detailsURLPrefix': f"https://wextractor.com/api/v1/reviews?auth_token={TESTENV['wextractorAPIKey']}&",
    'detailsURLSuffix': "id={id}&offset={offset}&sort=relevancy"
}

GEOCODEXYZAPI = {
    'latLongFromPlaceNameURL': "https://geocode.xyz/{cityName}?json=1"
}


# f"place_id={placeId}&fields=type,vicinity,opening_hours,price_level,rating,review,user_ratings_total"