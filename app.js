var express = require('express');
var path = require('path');
// Init App
var app = express();
var db = require("./models");
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
require('dotenv').config();
var exphbs = require("express-handlebars");
var cookieParser = require('cookie-parser');
var PORT = process.env.PORT || 8000;

//For BodyParser

app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// For passport
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));


app.use(passport.initialize());
app.use(passport.session());

//For Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set('views', './views')



// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));



// Express Messages Middleware
app.use(flash());
app.use(function (req, res, next) {
  res.locals.message = req.flash('message');
  res.locals.lmessage = req.flash('lmessage');
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// Passport Config
require('./config/passport')(passport, db.User);

//routes
require('./routes/users.js')(app, passport);


db.sequelize.sync().then(function () {
  app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
  });
});