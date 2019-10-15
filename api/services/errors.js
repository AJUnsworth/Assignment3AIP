//Dictionary of error codes
const errors = {
    SERVER_ERROR: "SERVER_ERROR",
    POST_NOT_FOUND: "POST_NOT_FOUND",
    USER_NOT_FOUND: "USER_NOT_FOUND",
    INVALID_PERMISSIONS: "INVALID_PERMISSIONS",
    INVALID_USER: "INVALID_USER",
    CANNOT_EDIT_POST: "CANNOT_EDIT_POST",
    POST_ALREADY_REPORTED: "POST_ALREADY_REPORTED",
    POTENTIAL_SOCKPUPPET: "POTENTIAL_SOCKPUPPET",
    CANNOT_UPLOAD_IMAGE: "CANNOT_UPLOAD_IMAGE",
    FIELD_REQUIRED: "FIELD_REQUIRED",
    USERNAME_EXISTS: "USERNAME_EXISTS",
    PASSWORD_EXISTS: "PASSWORD_EXISTS",
    PASSWORDS_MUST_MATCH: "PASSWORDS_MUST_MATCH",
    INVALID_USERNAME_LENGTH: "INVALID_USERNAME_LENGTH",
    INVALID_PASSWORD_LENGTH: "INVALID_PASSWORD_LENGTH",
    INVALID_EMAIL: "INVALID_EMAIL",
    USERNAME_NOT_ALPHANUMERIC: "USERNAME_NOT_ALPHANUMERIC",
    INCORRECT_USERNAME_OR_PASSWORD: "INCORRECT_USERNAME_OR_PASSWORD",
    INVALID_TOKEN: "INVALID_TOKEN",
    TOKEN_NOT_FOUND: "TOKEN_NOT_FOUND"
}

module.export = errors;