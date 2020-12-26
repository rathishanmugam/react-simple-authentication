import React,{Component} from 'react';
import {signout} from "./APICalls";
import PropTypes from 'prop-types';
import {BrowserRouter as Router, Route ,Switch , Redirect} from "react-router-dom";

export default function Home({ userName,logoutDone }) {
console.log('I am in home -user name is ====>',userName);
        return (
            <div>
                <h1> Home </h1>
                <span  >{`Welcome ${userName}`}</span>
                <button className="signup" onClick={() => logoutDone() }>Sign-out</button>
            </div>
        );
}

