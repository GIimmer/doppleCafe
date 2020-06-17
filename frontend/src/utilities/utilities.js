import CONSTS from '../constants/Constants'

export function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

export function genGooglePlacePhoto(photo) {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.ref}&key=${CONSTS.PHOTOS_EMBED_KEY}`
}

export function snakeToCamel(str) {
    return str.replace(
        /([-_][a-z])/g,
        (group) => group.toUpperCase()
                        .replace('-', '')
                        .replace('_', '')
    );
}

export function parseQueryString(qs) {
    const qsValArray = qs.split(/[&?]/);
    const qsValMap = {}
    qsValArray.forEach((str)=> {
        if (str !== "") {
            const keyValArr = str.split("=");
            qsValMap[keyValArr[0]] = keyValArr[1];
        }
    })
    return qsValMap;
}