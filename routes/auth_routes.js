const router = require('express').Router();
const passport = require('passport');
const CLIENT_HOME_PAGE_URL = process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:3000';

router.get("/login/success", (req, res) => {
    if (req.user) {
        res.json({
            success: true,
            message: "user has successfully authenticated",
            user: req.user
        });
    }
});

router.get("/login/failed", (req, res) => {
    res.status(401).json({
        success: false,
        message: "user failed to authenticate."
    });
});

router.get("/logout", (req, res) => {
    req.logout();
    req.session = null;
    res.redirect(CLIENT_HOME_PAGE_URL);
});

router.get("/twitter", passport.authenticate("twitter"));

router.get('/twitter/redirect', 
  passport.authenticate('twitter', { failureRedirect: '/auth/login/failed', successRedirect: CLIENT_HOME_PAGE_URL })
);

module.exports = router;