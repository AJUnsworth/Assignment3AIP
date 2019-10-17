const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();
const fetch = require('fetch-base64');

checkImageAppropriateness = async imageUrl => {
    //Format request for Google Cloud Vision API
    const request = {
        source: {
            imageUri: imageUrl
        }
    };
    let formattedRequest = formatRequest(request);

    try {
        let [result] = await client.annotateImage(formattedRequest);

        //Make a second request using downloaded image if S3 url cannot be accessed
        if (result.error) {
            const image = await fetch.remote(imageUrl);

            request = { content: image[0] };
            formattedRequest = formatRequest(request);

            [result] = await client.annotateImage(formattedRequest);
        }

        if (result.error) {
            throw new Error("Vision API check failed for provided image");
        };

        if (result.textAnnotations.length ||
            checkAdultContent(result.safeSearchAnnotation.adult) ||
            checkAdultContent(result.safeSearchAnnotation.violence) ||
            checkAdultContent(result.safeSearchAnnotation.racy)
        ) {
            return true;
        }

        return false;
    } catch (error) {
        throw new Error(error);
    }
}

formatRequest = request => {
    const formattedRequest = {
        image: { ...request },
        features: [
            {
                type: "TEXT_DETECTION"
            },
            {
                type: "SAFE_SEARCH_DETECTION"
            }
        ]
    };

    return formattedRequest;
}

checkAdultContent = category => {
    if (category == "POSSIBLE" || category == "LIKELY" || category == "VERY_LIKELY") {
        return true;
    } else {
        return false;
    }
}

module.exports = checkImageAppropriateness;