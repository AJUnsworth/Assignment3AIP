const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateRegisterInput(data) {
    //From https://blog.bitsrc.io/build-a-login-auth-app-with-mern-stack-part-1-c405048e3669
    let errors = {};

    //Change empty fields to empty strings to use with validator functions
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.confirmPassword = !isEmpty(data.confirmPassword) ? data.confirmPassword: '';
    data.firstName = !isEmpty(data.firstName) ? data.firstName : '';
    data.lastName = !isEmpty(data.lastName) ? data.lastName : '';

    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }

    if (Validator.isEmpty(data.confirmPassword)) {
        errors.confirmPassword = 'Confirm password field is required';
    }

    if (!Validator.isLength(data.password, {min: 6})) {
        errors.password = 'Password must be at least 6 characters long';
    }

    if (!Validator.equals(data.password, data.confirmPassword)) {
        errors.confirmPassword = 'Passwords must be identical';
    }

    if (Validator.isEmpty(data.firstName)) {
        errors.firstName = 'First name field is required';
    }

    if (Validator.isEmpty(data.lastName)) {
        errors.lastName = 'Last name field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}