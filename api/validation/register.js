const validator = require("validator");
const isEmpty = require("is-empty");

const User = require("../models/user");

//Based on tutorial from Rishi Prasad on Medium.com
//See https://medium.com/@faizanv/authentication-for-your-react-and-express-application-w-json-web-tokens-923515826e0

module.exports = async function validateRegisterInput(data) {
    let errors = {};

    //Change empty fields to empty strings to use with validator functions
    data.username = !isEmpty(data.username) ? data.username : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.confirmPassword = !isEmpty(data.confirmPassword) ? data.confirmPassword : "";

    if (validator.isEmpty(data.username)) {
        errors.username = "Username field is required";
    }

    if (!validator.isAlphanumeric(data.username)) {
        errors.username = "Username can only contain letters and numbers";
    }

    //Only check if username exists if no other username validation errors occur to reduce the amount of queries
    if(!errors.username) {
        const user = await User.findOne({ username: data.username });
        if (user) {
            errors.username = "Username is already registered";
        } 
    }

    if (!validator.isLength(data.username, { min: 6, max: 16 })) {
        errors.username = "Username must be between 6 and 16 characters long";
    }

    if (!validator.isEmail(data.email)) {
        errors.email = "Please enter a valid email address";
    }

    //Only check if email exists if no other email validation errors occur to reduce the amount of queries
    if(!errors.email) {
        const user = await User.findOne({ email: data.email });
        if (user) {
            errors.email = "Email address is already registered";
        } 
    }

    if (validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }

    if (validator.isEmpty(data.confirmPassword)) {
        errors.confirmPassword = "Confirm password field is required";
    }

    if (!validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "Password must be between 6 and 30 characters long";
    }

    if (!validator.equals(data.password, data.confirmPassword)) {
        errors.confirmPassword = "Passwords must be identical";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}