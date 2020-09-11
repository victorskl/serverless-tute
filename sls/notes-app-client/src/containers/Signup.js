import React, { useState } from "react";
import {
    HelpBlock,
    FormGroup,
    FormControl,
    ControlLabel
} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { useFormFields } from "../libs/hooksLib";
import "./Signup.css";
import { Auth } from "aws-amplify";

/**
 * Create the Signup Form
 * https://serverless-stack.com/chapters/create-the-signup-form.html
 *
 * @param props
 * @returns {*}
 * @constructor
 */
export default function Signup(props) {
    const [fields, handleFieldChange] = useFormFields({
        email: "",
        password: "",
        confirmPassword: "",
        confirmationCode: ""
    });
    const [newUser, setNewUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    function validateForm() {
        return (
            fields.email.length > 0 &&
            fields.password.length > 0 &&
            fields.password === fields.confirmPassword
        );
    }

    function validateConfirmationForm() {
        return fields.confirmationCode.length > 0;
    }

    /**
     * Signup with AWS Cognito
     * https://serverless-stack.com/chapters/signup-with-aws-cognito.html
     *
     * The flow here is pretty simple:
     * 1. In handleSubmit we make a call to signup a user. This creates a new user object.
     * 2. Save that user object to the state using setNewUser.
     * 3. In handleConfirmationSubmit use the confirmation code to confirm the user.
     * 4. With the user now confirmed, Cognito now knows that we have a new user that can login to our app.
     * 5. Use the email and password to authenticate exactly the same way we did in the login page.
     * 6. Update the App’s state using the userHasAuthenticated function.
     * 7. Finally, redirect to the homepage.
     *
     * @param event
     * @returns {Promise<void>}
     */
    async function handleSubmit(event) {
        event.preventDefault();

        setIsLoading(true);

        try {
            const newUser = await Auth.signUp({
                username: fields.email,
                password: fields.password
            });
            setIsLoading(false);
            setNewUser(newUser);
        } catch (e) {
            alert(e.message);
            setIsLoading(false);
        }
    }

    /**
     * A quick note on the signup flow here. If the user refreshes their page at the confirm step, they won't be able
     * to get back and confirm that account. It forces them to create a new account instead. We are keeping things
     * intentionally simple but here are a couple of hints on how to fix it.
     * 1. Check for the UsernameExistsException in the handleSubmit function’s catch block.
     * 2. Use the Auth.resendSignUp() method to resend the code if the user has not been previously confirmed.
     *      Here is a link to the Amplify API docs. https://aws-amplify.github.io/amplify-js/api/classes/authclass.html#resendsignup
     * 3. Confirm the code just as we did before.
     *
     * @param event
     * @returns {Promise<void>}
     */
    async function handleConfirmationSubmit(event) {
        event.preventDefault();

        setIsLoading(true);

        // Signup with AWS Cognito
        try {
            await Auth.confirmSignUp(fields.email, fields.confirmationCode);
            await Auth.signIn(fields.email, fields.password);

            props.userHasAuthenticated(true);
            props.history.push("/");
        } catch (e) {
            alert(e.message);
            setIsLoading(false);
        }
    }

    function renderConfirmationForm() {
        return (
            <form onSubmit={handleConfirmationSubmit}>
                <FormGroup controlId="confirmationCode" bsSize="large">
                    <ControlLabel>Confirmation Code</ControlLabel>
                    <FormControl
                        autoFocus
                        type="tel"
                        onChange={handleFieldChange}
                        value={fields.confirmationCode}
                    />
                    <HelpBlock>Please check your email for the code.</HelpBlock>
                </FormGroup>
                <LoaderButton
                    block
                    type="submit"
                    bsSize="large"
                    isLoading={isLoading}
                    disabled={!validateConfirmationForm()}
                >
                    Verify
                </LoaderButton>
            </form>
        );
    }

    function renderForm() {
        return (
            <form onSubmit={handleSubmit}>
                <FormGroup controlId="email" bsSize="large">
                    <ControlLabel>Email</ControlLabel>
                    <FormControl
                        autoFocus
                        type="email"
                        value={fields.email}
                        onChange={handleFieldChange}
                    />
                </FormGroup>
                <FormGroup controlId="password" bsSize="large">
                    <ControlLabel>Password</ControlLabel>
                    <FormControl
                        type="password"
                        value={fields.password}
                        onChange={handleFieldChange}
                    />
                </FormGroup>
                <FormGroup controlId="confirmPassword" bsSize="large">
                    <ControlLabel>Confirm Password</ControlLabel>
                    <FormControl
                        type="password"
                        onChange={handleFieldChange}
                        value={fields.confirmPassword}
                    />
                </FormGroup>
                <LoaderButton
                    block
                    type="submit"
                    bsSize="large"
                    isLoading={isLoading}
                    disabled={!validateForm()}
                >
                    Signup
                </LoaderButton>
            </form>
        );
    }

    return (
        <div className="Signup">
            {newUser === null ? renderForm() : renderConfirmationForm()}
        </div>
    );
}
