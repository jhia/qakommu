const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const api_router = require('./routes');
const cors = require('cors');
const auth = require('./middleware/auth');
const fileUpload = require('express-fileupload');


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
app.uset('secret', process.env.SECRET || 'secret')
app.use('/uploads', express.static('upload'));



const login = require('./modules/login/login.router')
app.use('/auth', login);

app.use(auth)

app.use('/api', api_router);

module.exports = app;

