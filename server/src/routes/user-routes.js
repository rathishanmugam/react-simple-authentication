const express = require('express')
const Users = require('../models/Users-model')
const auth = require('../middlewares/auth')
const routes = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// User create (signup)
routes.post('/signup', function (req, res) {
    // let user = new Users(req.body)
    console.log('the req is ======>',req.body);
    bcrypt.hash(req.body.password, 10, function (err, hash) {
        if (err) {
            console.log(err);
        }
        req.body.password = hash;
        console.log('the hash is ======>',req.body.password,hash);
        let newUser = new Users({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            tokens:[]
        })
        console.log('THE USER STORE IN DATABASE ====>', newUser);
        newUser.save(function (err, user) {
            if (err) return console.log(err)
            res.status(200).json(user)
        })
    })
});
// check if previously loggeding
routes.post('/init', auth, (req, res) => {
    try {
        const cookieOptions = {
            httpOnly: true,
        };
        console.log('I AM IN INIT===>', req.user);
        console.log('IAM IN INIT====>', req.token);
        const { token, user } = req
        if (token && user) {
            res.cookie('todo-jt', req.token, cookieOptions).send({ user, token })
        }
    } catch (e) {
        res.status(400).send()
    }
})

// Login user
routes.post('/login', (req, res) => {
    const cookieOptions = {
        httpOnly: true,
    };
    Users.findOne({email: req.body.email}).exec().then(user => {
            console.log('THE FFOUND USER IS =====>', user);
            const secret = {'key': 'mernsecure'}
            process.env.JWT_SECRET = secret.key;
            const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET,{expiresIn: '1h'});
            console.log('the GENERATED TOKEN IS =======>', token);
            user.tokens = user.tokens.concat({token})
            console.log('THE TOKENS IN LOGIN=======>', user, user.tokens);
            user.save(error => {
                if (error) console.log(error);
                res.cookie('todo-jt', token, cookieOptions).send({user, token})
            })
    })
        .catch(err => res.status(500)
            .json({
                error: err
            }))
})
//logout user
routes.post('/logout', auth,  (req, res) => {
    console.log('THE LOGOUT REQ====>', req.user);
    console.log('THE LOGOUT TOKEN====>', req.token);

    const { user, token } = req
    user.tokens = user.tokens.filter((t) => t.token !== token)
    // user.tokens=[];
    user.save(error => {
        if (error) console.log(error);
        res.clearCookie('todo-jt')
        res.status(201).json({
            message: `User token deleted successfully`
        });
    });
    // try {
    //     const { user, token } = req
    //
    //     user.tokens = user.tokens.filter((t) => t.token !== token)
    //     await user.save()
    //
    //     res.clearCookie('todo-jt')
    //
    //     res.send()
    // } catch (e) {
    //     res.status(400).send()
    // }
})

module.exports = routes
