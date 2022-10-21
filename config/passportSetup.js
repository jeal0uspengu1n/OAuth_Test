const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys.js');
const User = require('../models/user-model');

passport.serializeUser((user, done) => {
    done(null,user.id);
});

passport.deserializeUser((id,done) => {
    User.findById(id).then((user) => {
        done(null,user);
    });
});

passport.use(
    new GoogleStrategy({
        clientID: keys.GOOGLE_CLIENT_ID,
        clientSecret: keys.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        // console.log('GoogleStrategy has been fired');
        // console.log(profile);
        // console.log(accessToken);

        // checking if the user already exists in the DB
        User.findOne({googleID: profile.id}).then((currentUser) => {
            if(currentUser){
                console.log('A registered user');
                done(null,currentUser);
            }
            else{
                // if not, saving the user
                new User({
                    username: profile.displayName,
                    googleID: profile.id,
                    profilePhotoURL: profile.photos[0].value
                }).save().then((newUser) => {
                    console.log("User info saved" + newUser)
                    done(null, newUser);
                }).catch((err) => console.log(err))
            }
        }).catch((err) => console.log(err))
    })
);
