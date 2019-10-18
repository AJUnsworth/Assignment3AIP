# SceneIt
SceneIt is a web-based MERN stack appliucation that allows users to upload images and interact with other posts. 

# Installation and Running the Project
* In the root folder (/Assignment3AIP), install all dependencies by running the command - npm install
* To launch the dev environment and start both the backend (:4000) and frontend (:3000), run the command - npm run dev
* To start the backend server only - npm run start:server
* To start the frontend only - npm run start:client
* To build the frontend of the project, run the command - npm run build
* To start the server in production mode (:4000), run the command - npm start
* To test the backend, run the command - npm run test:server
* To test the frontend, run the command - npm run test:client

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
* Use back-ticks (``) in fetch requests to allow for use of template literals 
* Break up import statements by external imports (e.g. Packages) then internal imports (e.g. Custom components)
* Use arrow functions wherever possible
* Always attribute code if taken from an external source using comments
* Always use const static variables and let for dynamic variables
* Use async/await instead of JavaScript Promises to make error handling simpler