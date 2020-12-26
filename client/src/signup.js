import React, { useState } from "react";
import Home from "./home";
import { signup } from './APICalls'
import {Redirect} from 'react-router-dom';
import { useHistory } from "react-router-dom";

const STATUS = {
    IDLE: "IDLE",
    SUBMITTED: "SUBMITTED",
    SUBMITTING: "SUBMITTING",
    COMPLETED: "COMPLETED",
};

// Declaring outside component to avoid recreation on each render
const emptyLogin = {
    name: '',
    email: "",
    password: "",
};

export default function Signup({ backToLogin, signupDone }) {
    const [login, setLogin] = useState(emptyLogin);
    const [status, setStatus] = useState(STATUS.IDLE);
    const [saveError, setSaveError] = useState(null);
    const [touched, setTouched] = useState({});
    const history = useHistory();
    // Derived state
    const errors = getErrors(login);
    const isValid = Object.keys(errors).length === 0;

    function handleChange(e) {
        e.persist(); // persist the event
        setLogin((curLogin) => {
            return {
                ...curLogin,
                [e.target.id]: e.target.value,
            };
        });
    }

    function handleBlur(event) {
        event.persist();
        setTouched((cur) => {
            return { ...cur, [event.target.id]: true };
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setStatus(STATUS.SUBMITTING);
        if (isValid) {
            try {
               const  user = await signup(login.name,login.email,login.password);
                setStatus(STATUS.COMPLETED);
                 signupDone();
                 // history.push("/login");

            } catch (e) {
                setSaveError(e);
            }
        } else {
            setStatus(STATUS.SUBMITTED);
        }
    }

    function getErrors(login) {
        const result = {};
        if (!login.name) result.name = "Name is required";

        if (!login.email) result.email = "Email is required";
        if (!login.password) result.password = "Password is required";
        return result;
    }

    if (saveError) throw saveError;
    if (status === STATUS.COMPLETED) {
        return <Home/>;
    }

    return (
        <>
            <h1>Sign Up Form</h1>
            {!isValid && status === STATUS.SUBMITTED && (
                <div role="alert">
                    <p>Please fix the following errors:</p>
                    <ul>
                        {Object.keys(errors).map((key) => {
                            return <li key={key}>{errors[key]}</li>;
                        })}
                    </ul>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name</label>
                    <br />
                    <input
                        id="name"
                        type="text"
                        value={login.name}
                        onBlur={handleBlur}
                        onChange={handleChange}
                    />
                    <p role="alert">
                        {(touched.name || status === STATUS.SUBMITTED) && errors.name}
                    </p>
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <br />
                    <input
                        id="email"
                        type="text"
                        value={login.email}
                        onBlur={handleBlur}
                        onChange={handleChange}
                    />
                    <p role="alert">
                        {(touched.email || status === STATUS.SUBMITTED) && errors.email}
                    </p>
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <br />
                    <input
                        id="password"
                        value={login.password}
                        onBlur={handleBlur}
                        onChange={handleChange}
                    />
                    <p role="alert">
                        {(touched.password || status === STATUS.SUBMITTED) && errors.password}
                    </p>
                </div>

                <div>
                    <input
                        type="submit"
                        className="btn btn-primary"
                        value="Save signup"
                        disabled={status === STATUS.SUBMITTING}
                    />
                </div>
                {/*<button className="login-link" onClick={() =>history.push("/login")}>Sign-in</button>*/}

                <button className="login-link" onClick={() => { backToLogin() }}>Sign-in</button>
            </form>
        </>
    );
}
