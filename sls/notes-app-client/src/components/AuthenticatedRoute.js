import React from "react";
import { Route, Redirect } from "react-router-dom";

/**
 * Set up Secure Pages
 * https://serverless-stack.com/chapters/setup-secure-pages.html
 *
 * Create a Route That Redirects
 * https://serverless-stack.com/chapters/create-a-route-that-redirects.html
 *
 * @param C
 * @param appProps
 * @param rest
 * @returns {*}
 * @constructor
 */
export default function AuthenticatedRoute({ component: C, appProps, ...rest }) {
    return (
        <Route
            {...rest}
            render={props =>
                appProps.isAuthenticated
                    ? <C {...props} {...appProps} />
                    : <Redirect
                        to={`/login?redirect=${props.location.pathname}${props.location.search}`}
                    />}
        />
    );
}
