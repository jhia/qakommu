const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const api_router = require('./routes');
const db = require('./models');
const loadtables = require('./seeders')
const cors = require('cors');
const auth = require('./middleware/auth');
const fileUpload = require('express-fileupload');



db.sequelize.sync( {force: true} )
.then(loadtables)

const app = express();
//MIDDLEWARE
app.use(logger('dev'));
//Enable All CORS Requests
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));
app.use('/uploads', express.static('community_name'));
console.log(express.static('community_name'))
//const user = require('./modules/user/user.router')
//app.use('/user', user);


const register = require('./modules/register/register.router')
app.use('/register', register);

const login = require('./modules/login/login.router')
app.use('/auth', login);

app.use(auth)

app.use('/api', api_router);

module.exports = app;

