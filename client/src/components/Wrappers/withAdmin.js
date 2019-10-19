import React from "react";
import { Redirect } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

//From https://medium.com/@faizanv/authentication-for-your-react-and-express-application-w-json-web-tokens-923515826e0
function withAdmin(ComponentToProtect) {
    return class extends React.Component {
        constructor() {
            super();
            this.state = {
                loading: true,
                redirectTo: ""
            };
        }

        async componentDidMount() {
            //Checks if the current user is an admin
            //Redirects to login if user is not logged in, or or home if they are not an admin 
            const response = await fetch("/api/users/checkAdmin");
            if (response.status === 403) {
                this.setState({ redirectTo: "/" });
            } else if (response.status === 404 || response.status === 500) {
                this.setState({ redirectTo: "/login" });
            }
            
            this.setState({ loading: false });
        }

        render() {
            if (this.state.loading) {
                return <FontAwesomeIcon id="loading" className="fa-5x loadingPostIcon" icon={faSpinner} spin />;
            }

            if (this.state.redirectTo) {
                return <Redirect to={this.state.redirectTo} />
            }

            return (
                <React.Fragment>
                    <ComponentToProtect {...this.props} />
                </React.Fragment>
            )
        }
    }
}

export default withAdmin;