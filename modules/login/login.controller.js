'use strict'

const randToken = require('rand-token');

const { user: User, authorize:Authorize } = require('../../models');
const { ResponseError } = require('../../http');
const { validateEmail, validateLoginPassword } = require('../../helpers/validations');

exports.signUpEmail = async function (req, res) {

    const { email, password } = req.body;

    if(!email || !password || !validateEmail(email) || !validateLoginPassword(password)) {
        let validationError = new ResponseError(400)
        return res.send(validationError)
    }

    try {
        const user = await User.findOne({
            where: {
                email,
                active: true
            },
            attributes: ['id', 'username', 'email', 'password']
        });

        if(!user) {
            let emailError = new ResponseError(400, 'This email is not registered')
            return res.send(emailError)
        }

        if(!user.emailVerified) {
            let verificationError = new ResponseError(401, 'Please verify your email address')
            return res.send(verificationError)
        }

        if(!user.comparePasswords(password)) {
            let passwordError = new ResponseError(400, 'Email or password incorrect')
            return res.send(passwordError)
        }

        const refreshToken = randToken.uid(256)

        const authorize = Authorize.build({
            refreshToken,
            userId: user.id
        })


        let token = authorize.generateAccessToken(req.app.get('secret'))

        await authorize.save()

        return res.send({
            ...token,
            refreshToken
        })

    } catch ({ message }) {
        process.stdout.write(message)
        const connectionError = new ResponseError(503, 'Try again later')
        return res.send(connectionError)
    }

}