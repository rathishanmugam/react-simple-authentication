const jwt = require('jsonwebtoken')
const Users = require('../models/Users-model')

const auth =  (req, res, next) => {
    const secret = { 'key':'mernsecure'}
    process.env.JWT_SECRET = secret.key;
  console.log('THE COOKIES IN LOGOUT IN AUTH=====>',req.cookies['todo-jt'] );
    console.log('THE SECRECT KEY IN AUTH=======>',process.env.JWT_SECRET );
    // try {
        // const token = req.header('Authorization').replace('Bearer ', '')
        const token = req.cookies['todo-jt']

        if (token === '') {
            res.redirect(401, '/login')
        }
        const decoded_token = jwt.verify(token, process.env.JWT_SECRET)
    console.log('THE DECODED TOKEN IN AUTH  -======>', decoded_token);

    // const user = await Users.findOne({ _id: decoded_token._id, 'tokens.token': token })
        Users.findOne({ _id: decoded_token._id, 'tokens.token': token }).exec().then(user => {
            console.log('THE USER IN AUTH FFROM TABLE -======>', user);
            if (!user) {
                throw new Error()
            }
            req.token = token
            req.user = user
            console.log('I AM IN AUTH =======>',req.token,req.user );

            next()
        })
            .catch(err => res.status(401).send({ error: 'Please login first.' }))


    //     if (!user) {
    //         throw new Error()
    //     }
    //
    //     req.token = token
    //     req.user = user
    //
    //     next()
    // } catch (e) {
    //     res.status(401).send({ error: 'Please login first.' })
    // }
}
module.exports = auth

