const dotenv = require("dotenv");
dotenv.config();
const path = require('path')
const express = require('express')
const app = express()
const passport = require('passport')
const mysql = require('mysql')
const db_config = require('./config/db_config')
const connection = mysql.createConnection({...db_config, multipleStatements: true})
require("./config/passport_setup")(connection)
const port = process.env.PORT || 8080;


app.use(
    require('cookie-session')({
        name: "polls-session",
        keys: [process.env.COOKIE_KEY],
        maxAge: 30 * 60 * 1000,
    })
);

app.use(require('body-parser').json());
app.use(require('cookie-parser')());
app.use(passport.initialize());
app.use(passport.session());

app.use(
    require('cors')({
      origin: "http://localhost:3000",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true
    })
);

app.use(express.static(path.join(__dirname, 'dist')));

const authCheck = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        isAuthenticated: false,
        message: "user has not been authenticated"
      });
    }
    next();
};

app.use("/auth", require("./routes/auth_routes"));
app.use("/api", require("./routes/api_routes")(connection, authCheck));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});