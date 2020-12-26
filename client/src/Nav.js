import React, {Component} from "react";
import {Link, NavLink} from "react-router-dom";
import Login from "./login";
import {signout, signup} from "./APICalls";
import {BrowserRouter as Router, Route ,Switch , Redirect} from "react-router-dom";
import {  getAuthStatusListener } from './APICalls'


class Nav extends Component {
    isAuthenticated = false;

    componentDidMount() {

        this.authListenerSubs = getAuthStatusListener()
            .subscribe(isAuthenticated => {
                console.log('IAM OBSEVALE IN REACT (initialtion-once for all)====>', isAuthenticated);
                this.isAuthenticated = isAuthenticated;
            });
    }

    render() {
        const {state, logoutDone} = this.props;
        const activeStyle = {color: "#000000"};

        return (
            <header>
                <nav>
                    <ul>
                            <li>
                                <NavLink activeStyle={activeStyle} exact to="/">Authentication</NavLink>
                            </li>

                        {/*{(!state.loggedInUser || !state.signup || state.login) && (*/}
                        {/*    <li>*/}
                        {/*        <NavLink activeStyle={activeStyle} to="/login">Login</NavLink>*/}
                        {/*    </li>*/}
                        {/*)}*/}
                        {/*{state.signup && (*/}
                        {/*    <li>*/}
                        {/*        <NavLink activeStyle={activeStyle} to="/signup">Sign Up</NavLink>*/}
                        {/*    </li>*/}
                        {/*)}*/}
                        {/*<li>*/}
                        {/*    {(!state.loggedInUser) ? <button className="signup" onClick={() => logoutDone() }*/}
                        {/*        >Sign-out</button> :*/}
                        {/*        (state.signup) ? <NavLink activeStyle={activeStyle} to="/signup"> Sign up </NavLink> :*/}
                        {/*            (state.loggedInUser)?  <NavLink activeStyle={activeStyle} to="/login"> Login </NavLink>:*/}
                        {/*    <NavLink activeStyle={activeStyle} exact to="/">Home</NavLink>}*/}
                        {/*</li>*/}
                    </ul>
                </nav>
            </header>
        );
    }
}

export default Nav;
