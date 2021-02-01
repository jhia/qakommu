'use strict'

const _ = require('lodash');

const randToken = require('rand-token');

const { user: User, authorize:Authorize } = require('../../models');
const {Response, ResponseError } = require('../../http');
const { validateEmail, validateLoginPassword } = require('../../helpers/validations');

exports.signUpEmail = async function (req,res) {

    const { email, password } = req.body;
    const response = new Response(res);

    if(!email || !password || !validateEmail(email) || !validateLoginPassword(password)) {
        let validationError = new ResponseError(400)
        return response.send(validationError)
    }

    try {
        const user = await User.findOne({
            where: {
                email,
                active: true,
                emailVerified: true
            },
            attributes: ['id', 'username', 'email', 'password']
        });

        if(!user) {
            let emailError = new ResponseError(400, 'This email is not registered')
            return response.send(emailError)
        }

        if(!user.comparePasswords(password)) {
            let passwordError = new ResponseError(400, 'Email or password incorrect')
            return response.send(passwordError)
        }
        
        const data = {
            user: user.id,
            username: user.username
        }

        const refreshToken = randToken.uid(256)

        const authorize = Authorize.build({
            refreshToken,
            userId: user.id
        })


        let token = authorize.generateAccessToken(req.app.get('secret'))

        await authorize.save()

        return response.send({
            ...token,
            refreshToken
        })

    } catch ({ message }) {
        const connectionError = new ResponseError(403)
        console.log(message)
        return response.send(connectionError)
    }

}