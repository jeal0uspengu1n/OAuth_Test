const express = require('express');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const passportSetup = require('./config/passportSetup');
const mongoose = require('mongoose');
const keys = require('./config/keys.js');
const passport = require('passport');
// const cookieSession = require('cookie-session');
const session = require('express-session');

const app = express();

// setting up the view engine
app.set('view engine','ejs');

// setting up the cookie session
app.use(session({
    secret: keys.COOKIEKEY,
    saveUninitialized: false,
    resave: false,
    cookie: {
        secure: false, // if true: only transmit cookie over https
        httpOnly: true, // if true: prevents client side JS from reading the cookie
        maxAge: 1000*60*60*60*100, // session max age in milliseconds
        sameSite: 'lax' // make sure sameSite is not none
    }
}));
app.use(passport.initialize());
app.use(passport.session());

// connecting to the mongoDB
mongoose.connect(keys.MONGODB_URL).then((result) => console.log('connected to mongoDB')).catch((err) => console.log(err));

// setup the routes
app.use('/auth', authRoutes);

// setup the profile routes
app.use('/profile', profileRoutes);

// home route
app.get('/', (req,res) => {
    res.render('home', {user: req.user});
});

// listening to the port
app.listen(process.env.PORT || 6969, () => {
    console.log('listening');
});
