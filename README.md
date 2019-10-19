# SceneIt
SceneIt is a web-based MERN stack appliucation that allows users to upload images and interact with other posts. 
It was created as part of the Advanced Internet Programming subject at UTS. (Subject Coordinator - Benjamin Johnston)

# Libraries
The following libraries have primarily been used during the process of creating this application:
* React
* React-Bootstrap 
* Mongoose
* Express
* Mocha - Server Testing
* Cypress - Client Testing

# File Structure
The file structure for this project can be broken up as follows:
* api/
    * controllers/ - Business logic for API calls that interact with the database
    * models/ - Database schemas for MongoDB collections
    * routes/ - API routes which link up to controllers
    * services/ - Utilities or logic for accessing external services such as S3 or Google Cloud Vision API
    * validation/ - Input validation for login and registration
* client/
    * public/ - Contains automatically generated react files such as index.html or the favicon
    * src/
        * components/ - All components used within the project
        * images/ - All images used throughout the project that were not user generated
* test/
    * client/ - Frontend functional tests
    * api/ - Backend unit tets

# .env and Credential access
Any sensitive information has been stored securely in a .env file that has not been included in this repository for security reasons. 
Additionally, access to credentials for deployment are also contained in a separate file that has not been included in this repository.

For access to either of these files, please contact the following developers:
* Andrew Unsworth
* Joshua Chan
* Chloe Dizon

# Installation and Running the Project
* In the root folder (/Assignment3AIP), install all dependencies by running the command - npm install
* To launch the dev environment and start both the backend (:4000) and frontend (:3000), run the command - npm run dev
* To start the backend server only - npm run start:server
* To start the frontend only - npm run start:client
* To build the frontend of the project, run the command - npm run build
* To start the server in production mode (:4000), run the command - npm start
* To run all tests, run the command - npm test
* To test the backend, run the command - npm run test:server
* To test the frontend, run the command - npm run test:client
* To run frontend tests without automatically starting the website - npm run cy

# Deploying the Project
1. Build the frontend in the root folder (/Assignment3AIP) by running the command - npm run build
2. Check if this worked by going to localhost:4000 in a web browser after running the command - npm start
3. Ensure there is access to the Google Applications Credentials file
4. Install the Google Cloud SDK (https://cloud.google.com/sdk/docs/downloads-interactive)
5. In the SDK shell, run the command - gcloud app login - and login to an account with access to the project
6. Run the command - gcloud init - and select the project "sceneit-1"
7. Run the command - gcloud app deploy --stop-previous-version
8. Access the deployed website (https://sceneit-1.appspot.com)

# Code Style and Design Guidelines
* Avoid using inline styling, instead implement styling within the associated css file
* Avoid using !important for CSS unless overriding a framework style
* If a line is too long, i.e. 100 characters long, separate it into multiple lines instead
* Use typechecking with proptypes
* Variables should be defined in lower camel case e.g. newUser
* An export default statements must be located at the end of each component, not in the class or function definition
* Component files must be separated into their categorised folder within the components folder 
    e.g. HomeContent component would be located in /Home/Content
* Comments should only be used to explain code where necessary
* If code can be resused elsewhere, it should be made as a component or separate method
* Tabs must be equal to 4 spaces
* Use double quotes for strings not in fetch requests
* Use template literals through back-ticks (``) in fetch requests only if using URI query string or parameters
* Break up import statements by external imports (e.g. Packages) then internal imports (e.g. Custom components)
* Use arrow functions wherever possible
* Always attribute code if taken from an external source using comments
* Always use const static variables and let for dynamic variables
* Use async/await instead of JavaScript Promises to make error handling simpler

# Credits
The following developers (JAC Tech) were reponsible for creating this web application.
* Andrew Unsworth - 12876797
* Joshua Chan - 12876811
* Chloe Dizon - 12876304