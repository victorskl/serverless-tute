/*
import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
*/
import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import "./App.css";
import Routes from "./Routes";
import { LinkContainer } from "react-router-bootstrap";
import { Auth } from "aws-amplify";

function App(props) {
    const [isAuthenticating, setIsAuthenticating] = useState(true); // We start with the value set to true because as we first load our app, it'll start by checking the current authentication state.
    const [isAuthenticated, userHasAuthenticated] = useState(false);

    /**
     * The useEffect hook take a function and an array of variables. The function will be called every time the component is rendered.
     * And the array of variables tell React to only re-run our function if the passed in array of variables have changed.
     * This allows us to control when our function gets run. This has some neat consequences:
     *      If we don't pass in an array of variables, our hook get's executed everytime our component is rendered.
     *      If we pass in some variables, on every render React will first check if those variables have changed, before running our function.
     *      If we pass in an empty list of variables, then it'll only run our function on the FIRST render.
     * In our case, we only want to check the user's authentication state when our app first loads.
     * So we'll use the third option; just pass in an empty list of variables — [].
     */
    useEffect(() => {
        onLoad();
    }, []);

    /**
     * When we refresh the page, we load the user session from the browser Local Storage (using Amplify)
     * @returns {Promise<void>}
     */
    async function onLoad() {
        try {
            await Auth.currentSession(); // The Auth.currentSession() method throws an error No current user if nobody is currently logged in.
            userHasAuthenticated(true);
        }
        catch(e) {
            if (e !== 'No current user') {
                alert(e);
            }
        }

        setIsAuthenticating(false);
    }

    async function handleLogout() {
        await Auth.signOut(); // AWS Amplify has a Auth.signOut() method that helps clear session out.
        userHasAuthenticated(false); // only removing the user session from our app's state
        props.history.push("/login");
    }

    return (
        !isAuthenticating &&
        <div className="App container">
            <Navbar fluid collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to="/">Scratch</Link>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav pullRight>
                        {isAuthenticated
                            ? <NavItem onClick={handleLogout}>Logout</NavItem>
                            : <>
                                <LinkContainer to="/signup">
                                    <NavItem>Signup</NavItem>
                                </LinkContainer>
                                <LinkContainer to="/login">
                                    <NavItem>Login</NavItem>
                                </LinkContainer>
                            </>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <Routes appProps={{ isAuthenticated, userHasAuthenticated }} />
        </div>
    );
}

/**
 * However, the App component does not have access to the router props directly since it is not rendered inside a Route component.
 * To be able to use the router props in our App component we will need to use the withRouter Higher-Order Component (or HOC).
 * You can read more about the withRouter HOC here.
 * https://reacttraining.com/react-router/web/api/withRouter
 */
//export default App;
export default withRouter(App);
