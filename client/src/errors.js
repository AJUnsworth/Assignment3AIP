import { NotificationManager } from "react-notifications";

//Dictionary of error messages and titles by type
const Errors = {
    SERVER_ERROR: {
        title: "Internal server error",
        message: "It appears something has gone wrong! Please try again later"
    },
    POST_NOT_FOUND: {
        title: "Post not found",
        message: "Post could not be located or has been deleted"
    },
    USER_NOT_FOUND: {
        title: "User not found",
        message: "User could not be located or has been deleted"
    },
    INVALID_PERMISSIONS: {
        title: "Insufficient permissions",
        message: "It appears you do not have the right to access this page"
    },
    INVALID_USER: {
        title: "Cannot complete action",
        message: "It appears that this post belongs to another user"
    },
    CANNOT_EDIT_POST: {
        title: "Cannot edit post",
        message: "It appears someone has liked or responded to this post already"
    },
    POST_ALREADY_REPORTED: {
        title: "Post already reported",
        message: "It appears you have already reported this post before"
    },
    POTENTIAL_SOCKPUPPET: {
        title: "Too many logins",
        message: "Too many accounts have logged in from the same location in the past 24 hours, please use one of the previously used accounts"
    },
    CANNOT_UPLOAD_IMAGE: {
        title: "Cannot upload image",
        message: "It appears the image you submitted could not be uploaded correctly, please try again later"
    },
    FIELD_REQUIRED: {
        title: "Field required",
        message: "This field is required"
    },
    USERNAME_EXISTS: {
        title: "Username exists",
        message: "Username already exists"
    },
    PASSWORD_EXISTS: {
        title: "Password exists",
        message: "Password already exists"
    },
    PASSWORDS_MUST_MATCH: {
        title: "Passwords must match",
        message: "Password fields must match"
    },
    INVALID_USERNAME_LENGTH: {
        title: "Invalid username length",
        message: "Username must be between 6 and 16 characters long"
    },
    INVALID_PASSWORD_LENGTH: {
        title: "Invalid password length",
        message: "Password must be between 6 and 30 characters long"
    },
    INVALID_EMAIL: {
        title: "Invalid email",
        message: "Please enter a valid email address"
    },
    USERNAME_NOT_ALPHANUMERIC: {
        title: "Username not alphanumeric",
        message: "Usernames can only contain numbers and letters"
    },
    INCORRECT_USERNAME_OR_PASSWORD: {
        title: "Incorrect username or password",
        message: "Username or password is incorrect"
    },
    INVALID_TOKEN: {
        title: "Invalid token",
        message: "Session is invalid or has expired"
    },
    TOKEN_NOT_FOUND: {
        title: "Token not found",
        message: "Could not find a token"
    }
}

//Locates error message from dictionary of error types
const getError = errorType => {
    const error = Errors[errorType];

    //Returns default error message if error does not exist in dictionary
    if (!error)
        return Errors.SERVER_ERROR;

    return error;
}

//Displays error message and title from dictionary in a notification
const showError = errorType => {
    const error = getError(errorType);

    NotificationManager.error(
        error.message,
        error.title,
        5000
    );
}

export { getError, showError };