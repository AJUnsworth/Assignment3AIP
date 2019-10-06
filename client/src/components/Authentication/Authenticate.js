import React from "react";
import { Redirect } from 'react-router-dom';

//From https://medium.com/@faizanv/authentication-for-your-react-and-express-application-w-json-web-tokens-923515826e0
function authenticate(ComponentToProtect) {
    return class extends React.Component {
        constructor() {
            super();
            this.state = {
                loading: true,
                redirectLogin: false,
                redirectHome: false
            };
        }

        componentDidMount() {
            fetch("/users/checkAdmin")
                .then(res => {
                    if (res.status === 200) {
                        this.setState({ loading: false });
                    } else if (res.status === 403) {
                        this.setState({ loading: false, redirectHome: true });
                    } else {
                        this.setState({ loading: false, redirectLogin: true });
                    }
                });
        }

        render() {
            if (this.state.loading) {
                return null;
            }

            if (this.state.redirectLogin) {
                return <Redirect to="/login" />
            }

            if (this.state.redirectHome) {
                return <Redirect to="/" />
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