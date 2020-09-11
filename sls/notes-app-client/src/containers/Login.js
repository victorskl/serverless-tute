// https://serverless-stack.com/chapters/create-a-login-page.html
import React, { useState } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "./Login.css";
import { Auth } from "aws-amplify";
import LoaderButton from "../components/LoaderButton";
import {useFormFields} from "../libs/hooksLib";

export default function Login(props) {
    //const [email, setEmail] = useState("");
    //const [password, setPassword] = useState("");
    const [fields, handleFieldChange] = useFormFields({
        email: "",
        password: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    function validateForm() {
        //return email.length > 0 && password.length > 0;
        return fields.email.length > 0 && fields.password.length > 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setIsLoading(true);

        // https://serverless-stack.com/chapters/login-with-aws-cognito.html
        try {
            //await Auth.signIn(email, password);
            await Auth.signIn(fields.email, fields.password);
            console.log("Logged in");

            props.userHasAuthenticated(true);

            /**
             * Redirect on Login
             * https://serverless-stack.com/chapters/redirect-on-login.html
             *
             * Commented as redirect on successful login logic move to UnauthenticatedRoute component
             * with pass in redirect path parameter for destination.
             */
            //props.history.push("/");

        } catch (e) {
            alert(e.message);
            setIsLoading(false);
        }
    }

    return (
        <div className="Login">
            <form onSubmit={handleSubmit}>
                <FormGroup controlId="email" bsSize="large">
                    <ControlLabel>Email</ControlLabel>
                    <FormControl
                        autoFocus
                        type="email"
                        //value={email}
                        //onChange={e => setEmail(e.target.value)}
                        value={fields.email}
                        onChange={handleFieldChange}
                    />
                </FormGroup>
                <FormGroup controlId="password" bsSize="large">
                    <ControlLabel>Password</ControlLabel>
                    <FormControl
                        type="password"
                        //value={password}
                        //onChange={e => setPassword(e.target.value)}
                        value={fields.password}
                        onChange={handleFieldChange}
                    />
                </FormGroup>
{/*
                <Button block bsSize="large" disabled={!validateForm()} type="submit">
                    Login
                </Button>
*/}
                <LoaderButton block type="submit" bsSize="large" isLoading={isLoading} disabled={!validateForm()}>
                    Login
                </LoaderButton>
            </form>
        </div>
    );
}
