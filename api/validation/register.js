const validator = require("validator");
const isEmpty = require("is-empty");

const User = require("../models/user");

const errors = require("../services/errors");

//Based on tutorial from Rishi Prasad on Medium.com
//See https://medium.com/@faizanv/authentication-for-your-react-and-express-application-w-json-web-tokens-923515826e0

module.exports = async function validateRegisterInput(data) {
    let validationErrors = {};

    //Change empty fields to empty strings to use with validator functions
    data.username = !isEmpty(data.username) ? data.username : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.confirmPassword = !isEmpty(data.confirmPassword) ? data.confirmPassword : "";

    if (validator.isEmpty(data.username)) {
        validationErrors.username = errors.FIELD_REQUIRED;
    }

    if (!validator.isAlphanumeric(data.username)) {
        validationErrors.username = errors.USERNAME_NOT_ALPHANUMERIC;
    }

    //Only check if username exists if no other username validation errors occur to reduce the amount of queries
    if (!validationErrors.username) {
        const user = await User.findOne({ username: data.username });
        if (user) {
            validationErrors.username = errors.USERNAME_EXISTS;
        }
    }

    if (!validator.isLength(data.username, { min: 6, max: 16 })) {
        validationErrors.username = errors.INVALID_USERNAME_LENGTH;
    }

    if (!validator.isEmail(data.email)) {
        validationErrors.email = errors.INVALID_EMAIL;
    }

    //Only check if email exists if no other email validation errors occur to reduce the amount of queries
    if (!errors.email) {
        const user = await User.findOne({ email: data.email });
        if (user) {
            validationErrors.email = errors.EMAIL_EXISTS;
        }
    }

    if (validator.isEmpty(data.password)) {
        validationErrors.password = errors.FIELD_REQUIRED;
    }

    if (!validator.isLength(data.password, { min: 6, max: 30 })) {
        validationErrors.password = errors.INVALID_PASSWORD_LENGTH;
    }

    if (validator.isEmpty(data.confirmPassword)) {
        validationErrors.confirmPassword = errors.FIELD_REQUIRED;
    }

    if (!validator.equals(data.password, data.confirmPassword)) {
        validationErrors.confirmPassword = errors.PASSWORDS_MUST_MATCH;
    }

    return {
        validationErrors,
        isValid: isEmpty(validationErrors)
    };
}