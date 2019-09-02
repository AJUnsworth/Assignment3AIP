const validator = require("validator");
const isEmpty = require("is-empty");

const User = require('../models/user')

module.exports = function validateRegisterInput(data) {
    //From https://blog.bitsrc.io/build-a-login-auth-app-with-mern-stack-part-1-c405048e3669
    let errors = {};

    //Change empty fields to empty strings to use with validator functions
    data.username = !isEmpty(data.username) ? data.username : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.confirmPassword = !isEmpty(data.confirmPassword) ? data.confirmPassword: "";
    
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

    if (!validator.isLength(data.password, {min: 6})) {
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