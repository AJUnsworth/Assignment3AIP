const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();
const fetch = require('fetch-base64');

checkImageAppropriateness = async imageUrl => {
    //Format request for Google Cloud Vision API
    let request = {
        image: {
            source: {
                imageUri: imageUrl
            }
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

    let [result] = await client.annotateImage(request);

    //Make a second request using downloaded image if S3 url cannot be accessed
    if (result.error) {
        const image = await fetch.remote(imageUrl);
        request = {
            image: {
                content: image[0]
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

        [result] = await client.annotateImage(request);
    }

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