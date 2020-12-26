import React, { useState } from "react";
import Home from "./home";
import {loginForm} from "./APICalls";

const STATUS = {
    IDLE: "IDLE",
    SUBMITTED: "SUBMITTED",
    SUBMITTING: "SUBMITTING",
    COMPLETED: "COMPLETED",
};

// Declaring outside component to avoid recreation on each render
const emptyLogin = {
    email: "",
    password: "",
};

export default function Login({handleLogin,signup}) {
    const [login, setLogin] = useState(emptyLogin);
    const [status, setStatus] = useState(STATUS.IDLE);
    const [saveError, setSaveError] = useState(null);
    const [touched, setTouched] = useState({});

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
                const user = await loginForm(login.email,login.password);
                if (user.status !== 500){
                    setStatus(STATUS.COMPLETED);
                    console.log('THE TOKEN GET FROM BACK END =======>', user.data);
                    handleLogin(user);
                }else {
                    console.log('I AM GOING TO CALL SIGN IN');
                    signup() }
            } catch (e) {
                setSaveError(e);
            }
        } else {
            setStatus(STATUS.SUBMITTED);
        }
    }

    function getErrors(login) {
        const result = {};
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
            <h1>Log In Form</h1>
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
                        value="Save Login"
                        disabled={status === STATUS.SUBMITTING}
                    />
                </div>
            </form>
            <button className="signup" onClick={() => { signup() }}>Signup</button>

        </>
    );
}
