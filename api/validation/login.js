const Validator = require("validator");
const isEmpty = require("is-empty");

const errors = require("../services/errors");

//Based on tutorial from Rishi Prasad on Medium.com
//See https://medium.com/@faizanv/authentication-for-your-react-and-express-application-w-json-web-tokens-923515826e0
module.exports = function validateLoginInput(data) {
    let validationErrors = {};

    //Change empty fields to empty strings to use with validator functions
    data.username = !isEmpty(data.username) ? data.username : "";
    data.password = !isEmpty(data.password) ? data.password : "";

    if (Validator.isEmpty(data.username)) {
        validationErrors.username = errors.FIELD_REQUIRED;
    }

    if (Validator.isEmpty(data.password)) {
        validationErrors.password = errors.FIELD_REQUIRED;
    }

    return {
        validationErrors,
        isValid: isEmpty(validationErrors)
    };
}