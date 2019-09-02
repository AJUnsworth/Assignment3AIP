# SceneIt
SceenIt is a web-based MERN stack appliucation that allows users to upload images and interact with other posts. 

# Installation and Running the Project
In the root folder, run the command - npm install
To run the website regularly (simultaneously launch both servers) - npm start
To start the backend server only - npm run start:server
To start the frontend only - npm run start:client

#Code Style and Design Guidelines
* Avoid using inline styling, instead implement styling within the associated css file
* Avoid using !important for CSS unless overriding a framework style
* If a line is too long, i.e. 100 characters long, separate it into multiple lines instead
* Use typechecking with proptypes
* Variables should be defined in lower camel case e.g. newUser
* An export default statement must be added to the end of each component
* Component files must be separated into their categorised folder within the components folder e.g. registration component would be located in /Component/User/
* Comments should only be used to explain code where necessary
* If code can be resused elsewhere, it should be made as a component or separate method
* Tabs must be equal to 4 spaces
