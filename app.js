const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const api_router = require('./routes/index');
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
app.use(auth);

//LOGIN
const login_router = require('./routes/login');
app.use('/auth', login_router);
//API ROUTES
app.use('/api', api_router);


module.exports = app;
