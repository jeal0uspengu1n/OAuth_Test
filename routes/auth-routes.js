const router = require('express').Router();
const passport = require('passport');

// Login
router.get('/login', (req,res) => {
    res.render('login');
});

// Logout
router.get('/logout', (req,res) => {
    // res.send("Logging out");
    req.logout((function(err){
        if(err) { return next(err); }
        req.session.destroy();
        res.redirect('/');
    }));
});

// auth with Google
router.get('/google', passport.authenticate("google", {
    scope: ['profile'],
    prompt: 'select_account'
}));

// redirecting from /auth/google/redirect
router.get('/google/redirect', passport.authenticate('google'), (req,res) => {
    // res.send(req.user);
    res.redirect('/profile');
});

module.exports = router;
