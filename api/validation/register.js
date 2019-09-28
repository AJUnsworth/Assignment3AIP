const validator = require("validator");
const isEmpty = require("is-empty");

//Based on tutorial from Rishi Prasad on Medium.com
//See https://medium.com/@faizanv/authentication-for-your-react-and-express-application-w-json-web-tokens-923515826e0

module.exports = function validateRegisterInput(data) {
    let errors = {};

    //Change empty fields to empty strings to use with validator functions
    data.username = !isEmpty(data.username) ? data.username : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.confirmPassword = !isEmpty(data.confirmPassword) ? data.confirmPassword : "";

    if (validator.isEmpty(data.username)) {
        errors.username = "Username field is required";
    }

    if (!validator.isEmail(data.email)) {
        errors.email = "Please enter a valid email address";
    }

    if (validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }

    if (validator.isEmpty(data.confirmPassword)) {
        errors.confirmPassword = "Confirm password field is required";
    }

    if (!validator.isLength(data.password, { min: 6 })) {
        errors.password = "Password must be at least 6 characters long";
    }

    if (!validator.equals(data.password, data.confirmPassword)) {
        errors.confirmPassword = "Passwords must be identical";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}