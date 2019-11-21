import React from "react";
import {Button, Glyphicon} from "react-bootstrap";
import "./LoaderButton.css";

/**
 * Create a Loader Button component
 * https://serverless-stack.com/chapters/give-feedback-while-logging-in.html
 *
 * This is a really simple component that takes an isLoading flag and the text that the button displays in the two states
 * (the default state and the loading state). The disabled prop is a result of what we have currently in our Login button.
 * And we ensure that the button is disabled when isLoading is true.
 *
 * This makes it so that the user can't click it while we are in the process of logging them in.
 *
 * @param isLoading
 * @param className
 * @param disabled
 * @param props
 * @returns {*}
 * @constructor
 */
export default function LoaderButton({
     isLoading,
     className = "",
     disabled = false,
     ...props
 }) {
    return (
        <Button
            className={`LoaderButton ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Glyphicon glyph="refresh" className="spinning"/>}
            {props.children}
        </Button>
    );
}
