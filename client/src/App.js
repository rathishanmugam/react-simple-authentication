// import './App.css';
// import Nav from "./Nav";
// import Footer from "./Footer";
// import {  Route } from "react-router-dom";
// import Login from "./login";
// import Home from "./home";
// import Signup from "./signup";
// import {useState} from "react";
// const emptyState = {
//     init: true,
//     loggedInUser: '',
//     token: '',
//     todos: [],
//     signup: false
// };
// function App() {
//     const [state, setState] = useState(emptyState);
//   return (
//       <>
//           <Nav/>
//           <main>
//
//                   {/*<Route path="/" element={<h1>Welcome to Carved Rock Fitness</h1>} />*/}
//                   {/*<Route path="/:category" element={<Products />} />*/}
//                   {/*<Route*/}
//                   {/*    path="/:category/:id"*/}
//                   {/*    element={<Detail addToCart={addToCart} />}*/}
//                   {/*/>*/}
//               <Route
//                   path="/"  exact
//                   component={Home}
//               />
//               <Route
//                   path="/signup"
//                   component={Signup}
//               />
//                   <Route
//                       path="/login"
//                       component={Login}
//                   />
//                   {/*<Route*/}
//                   {/*    path="/checkout"*/}
//                   {/*    element={<Checkout cart={cart} emptyCart={emptyCart} />}*/}
//                   {/*/>*/}
//           </main>
//       </>
//   );
// }
//
// export default App;

import React, { Component, Fragment } from 'react';
import PageLoader from './PageLoader/PageLoader'
import Nav from './Nav'
import Login from './login'
import { init,signout, getAuthStatusListener } from './APICalls'
import Signup from './signup'
import './App.css'
import Home from "./home";
import {BrowserRouter as Router, Route ,Switch , Redirect} from "react-router-dom";
import {AuthService} from "./auth-service";
import {Form} from './rxjs/fform';
class App extends Component {
    state = {
        init: false,
        loggedInUser: '',
        token: '',
        todos: [],
        login: false,
        signup: false,
        logout: false,
    }


    componentDidMount() {
        this.authListenerSubs = getAuthStatusListener()
            .subscribe(isAuthenticated => {
                console.log('IAM OBSEVALE IN REACT (initialtion-once for all)====>', isAuthenticated);
            });
        init()
            .then(user => {

                this.setState({
                    init: true,
                    loggedInUser: user,
                })
                console.log(' IAM IN FRONT END COMPONENT DID MOUNT===>',user.user ,this.state.init);

            })
            .catch(error => {
                this.setState({
                    init: false,

                })
            })
    }
    componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        this.authListenerSubs.unsubscribe();
    }
    toggleSignup = () => {
        this.setState((ps) => (
            { signup: !ps.signup }
        ))
    }

    toggleLogout = () => {
        this.setState((ps) => (
            { logout: !ps.logout,
                loggedInUser: "",
                token: "",
                init: !ps.init,
            }
        ))
    }

    logout = () => {
        this.setState((ps) => ({
            loggedInUser: "",
            token: ""
        }))
    }
     handleSignout = () => {
        signout()
            .then(user => {
                console.log('IAM IN HANDLE LOG OUT home page',user);
                this.setState((ps) => (
                    { logout: !ps.logout }
                ))
            })
            .catch(error => { console.log(error);
            })
    }
    handleLogin = (user) => {
        console.log('THE USER I GOT IN APP FFORM ======>', user);
        this.setState((ps) => ({
            loggedInUser: user,
            signup: false,
            init: false,
            login: false,
             logout: false,
        }))
    }

    backToLogin = () => {
        this.setState({
            signup: false
        })
    }


    render() {
        // {(this.state.logout || !this.state.init) && <Redirect to='/login'/>}


        const userName = (this.state.loggedInUser) ? this.state.loggedInUser.user.name : ""
        console.log('THE LOGGED IN USER NAME IS =========>', userName,this.state.logout,this.state.init);
        return <div className="app-main">
            <Nav state = {this.state} logoutDone={this.handleSignout} />
            {/*<Form/>*/}
            {(this.state.logout || !this.state.init) && <Redirect to="/login"/>}
            {(this.state.init && !this.state.logout) ?
                <Home userName={userName} user = {this.state.loggedInUser} logoutDone={this.handleSignout}/>
                : (this.state.signup)
                    ? <Signup backToLogin={this.backToLogin} signupDone={this.toggleSignup} />
                    : (  this.state.logout ||!this.state.loggedInUser )
                        ? <Login handleLogin={this.handleLogin} signup={this.toggleSignup} />
                        : (
                            <Fragment>
                                {/*{(this.state.logout) && <Redirect to="/login"/>}*/}

                                <Home userName={this.state.loggedInUser.user.name} logoutDone={this.handleSignout} />
                            </Fragment>
                        )
            }
            {/*<Switch>*/}
            {/*<Route path='/' exact component={Home} />*/}
            {/*<Route path='/login' component={Login} />*/}
            {/*<Route path='/signup' component={Signup} />*/}
            {/*<Route path='/' render = {()=> <div>404</div>}/>*/}
            {/*</Switch>*/}
        </div>

    }
}


export default App;
