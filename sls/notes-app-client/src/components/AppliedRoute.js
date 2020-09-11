import React from "react";
import { Route } from "react-router-dom";

// create a new component that’ll extend the standard Route component and apply the appProps.
export default function AppliedRoute({ component: C, appProps, ...rest }) {
    return (
        <Route {...rest} render={props => <C {...props} {...appProps} />} />
    );
}
