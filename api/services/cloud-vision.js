const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();

checkImageAppropriateness = async imageUrl => {
    //Format request for Google Cloud Vision API
    const request = {
        image: {
            source: { imageUri: imageUrl }
        },
        features: [
            {
                type: "TEXT_DETECTION"
            },
            {
                type: "SAFE_SEARCH_DETECTION"
            }
        ]
    };

    const [result] = await client.annotateImage(request);
    if (
        result.textAnnotations.length || 
        checkAdultContent(result.safeSearchAnnotation.adult) ||
        checkAdultContent(result.safeSearchAnnotation.violence) ||
        checkAdultContent(result.safeSearchAnnotation.racy)
        ) {
        return true;
    }

    return false;
}

checkAdultContent = category => {
    if (category == "POSSIBLE" || category == "LIKELY" || category == "VERY_LIKELY") {
        return true;
    } else {
        return false;
    }
}

module.exports = checkImageAppropriateness;