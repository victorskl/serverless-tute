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
/*
export default function UnauthenticatedRoute({ component: C, appProps, ...rest }) {
    return (
        <Route
            {...rest}
            render={props =>
                !appProps.isAuthenticated
                    ? <C {...props} {...appProps} />
                    : <Redirect to="/" />}
        />
    );
}
*/

/**
 * Redirect on Login
 * https://serverless-stack.com/chapters/redirect-on-login.html
 *
 * @param name
 * @param url
 * @returns {string|null}
 */
function querystring(name, url = window.location.href) {
    name = name.replace(/[[]]/g, "\\$&");

    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i");
    const results = regex.exec(url);

    if (!results) {
        return null;
    }
    if (!results[2]) {
        return "";
    }

    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export default function UnauthenticatedRoute({ component: C, appProps, ...rest }) {
    const redirect = querystring("redirect");
    return (
        <Route
            {...rest}
            render={props =>
                !appProps.isAuthenticated
                    ? <C {...props} {...appProps} />
                    : <Redirect
                        to={redirect === "" || redirect === null ? "/" : redirect}
                    />}
        />
    );
}
