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

//Enable some CORS Requests
const allowed = [
	  'http://localhost:3000',
	  'https://localhost:3000',
          'https://backoffice-front.vercel.app'
];
app.use(cors({
	origin: function(origin, cb) {
		if(!origin) return cb(null, true);
		if(allowed.indexOf(origin) === -1) {
			const msg = 'The CORS policy for this site does not ' +
	                'allow access from the specified Origin.';
			return cb(new Error(msg), false);
		}
		return cb(null, true);
	},
    credentials: true,
    exposedHeaders: ['set-cookies', 'set-cookie', 'Authorization', 'Set-Cookie']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));
app.set('secret', process.env.SECRET || 'secret')
app.use('/uploads', express.static('upload'));



const login = require('./modules/login/login.router')
const authorize = require('./modules/authorize/authorize.router');
app.use('/auth', login);
app.use('/authorize', authorize);
app.use(auth)

app.use('/api', api_router);

module.exports = app;

