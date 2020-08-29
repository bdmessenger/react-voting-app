module.exports = (connection) => {
    const passport = require('passport')
    const TwitterStrategy = require('passport-twitter').Strategy

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
        connection.query("SELECT `id`, `name` FROM `users` WHERE `id`=?", id, (err, rows) => {
            if(err) return done(new Error("Failed to deserialize an user"));
            done(null, rows[0]);
        });
    });

    passport.use(
        new TwitterStrategy(
            {
                consumerKey: process.env.TWITTER_CONSUMER_KEY,
                consumerSecret: process.env.CONSUMER_SECRET,
                callbackURL: '/auth/twitter/redirect'
            },
            async (token, tokenSecret, profile, done) => {
                connection.query("SELECT `id`, `name` FROM `users` WHERE `id`=?", profile._json.id, (err, result) => {
                    if(err) return done(new Error("Failed to deserialize an user"));
                    if(result.length > 0) return done(null, result[0]);

                    const { id, screen_name, name} = profile._json;
                    connection.query("INSERT INTO `users` (`id`,`username`,`name`) VALUES (?,?,?)", [id, screen_name, name], (err, result) => {
                        if(result.affectedRows > 0)
                        return done(null, {id, name});
                    });
                });
            }
        )
    );
}