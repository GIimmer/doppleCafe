import CONSTS from '../constants/Constants'

export function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

export function genGooglePlacePhoto(photo) {
    return photo.fromGoogle ? 
    `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.ref}&key=${CONSTS.PHOTOS_EMBED_KEY}`
    :
    photo.ref
}

export function snakeToCamel(str) {
    return str.replace(
        /([-_][a-z])/g,
        (group) => group.toUpperCase()
                        .replace('-', '')
                        .replace('_', '')
    );
}