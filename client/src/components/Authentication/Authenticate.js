import React from "react";
import { Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

//From https://medium.com/@faizanv/authentication-for-your-react-and-express-application-w-json-web-tokens-923515826e0
function authenticate(ComponentToProtect) {
    return class extends React.Component {
        constructor() {
            super();
            this.state = {
                loading: true,
                redirectTo: ""
            };
        }

        componentDidMount() {
            fetch("/users/checkAdmin")
                .then(res => {
                    if (res.status === 200) {
                        this.setState({ loading: false });
                    } else if (res.status === 403) {
                        this.setState({ loading: false, redirectTo: "/" });
                    } else {
                        this.setState({ loading: false, redirectTo: "/login" });
                    }
                });
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

export default authenticate;