import React from "react";
import { Redirect } from 'react-router-dom';

//From https://medium.com/@faizanv/authentication-for-your-react-and-express-application-w-json-web-tokens-923515826e0
function authenticate(ComponentToProtect) {
    return class extends React.Component {
        constructor() {
            super();
            this.state = {
                loading: true,
                redirect: false,
            };
        }

        componentDidMount() {
            fetch("/users/checkToken")
                .then(res => {
                    if (res.status === 200) {
                        this.setState({ loading: false });
                    } else {
                        const error = new Error(res.error);
                        throw error;
                    }
                })
                .catch(err => {
                    console.log(err);
                    this.setState({ loading: false, redirect: true });
                });
        }

        render() {
            if (this.state.loading) {
                return null;
            }
            if (this.state.redirect) {
                return <Redirect to="/login" />
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