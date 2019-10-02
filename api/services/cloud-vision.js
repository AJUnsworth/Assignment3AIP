const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();

async function checkImageAppropriateness(imageUrl) {
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
    if (result.textAnnotations.length) {
        return true;
    }

    if (checkAdultContent(result.safeSearchAnnotation.adult)) {
        return true;
    }

    if (checkAdultContent(result.safeSearchAnnotation.violence)) {
        return true;
    }

    if (checkAdultContent(result.safeSearchAnnotation.racy)) {
        return true;
    }

    return false;
}

function checkAdultContent(category) {
    if (category == "POSSIBLE" || category == "LIKELY" || category == "VERY_LIKELY") {
        return true;
    } else {
        return false;
    }
}

module.exports = checkImageAppropriateness;