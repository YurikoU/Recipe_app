var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//Import Mongoose
var mongoose = require('mongoose');
var config = require('./config/globals');//config string
var hbs = require('hbs');
var User = require('./models/user');

// Import Passport and Session modules and User model
var passport = require('passport');
var session = require('express-session');
var githubStrategy = require('passport-github2').Strategy;

var indexRouter = require('./routes/index');
var reviewsRouter = require('./routes/reviews');
var notesRouter = require('./routes/notes');
// var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Initialize and configure the session object
app.use(session({
  secret: 'recipeSearchApp',
  resave: false,
  saveUninitialized: false,
}));

//Before route declaration
//Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Link passport to the user model to implement local strategy (username/password)
passport.use(User.createStrategy());
//Set passport to write/read user data 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//GitHub OAuth
//Configure the passport strategy
passport.use(new githubStrategy({
  clientID: config.github.clientId,
  clientSecret: config.github.clientSecret,
  callbackURL: config.github.callbackUrl
},
  async (accessToken, refreshToken, profile, done) => {
    // is this a new user in my db?
    const user = await User.findOne({ oauthId: profile.id });
    if (user) {
      // user exists in db, so just continue the process
      return done(null, user);
    }
    else {
      // this is the first time user logs in with github
      const newUser = new User({
        username: profile.username,
        oauthId: profile.id,
        role: 'user',
        oauthProvider: 'GitHub',
        created: Date.now(),
      });
      const savedUser = await newUser.save();
      return done(null, savedUser);
    }
  }
));


app.use('/', indexRouter);
app.use('/reviews', reviewsRouter);
app.use('/notes', notesRouter);
// app.use('/users', usersRouter);

// Configure mongoose
mongoose.connect(
  config.bd, // connection string of MongoDB
  {
    useNewUrlParser: true, // options object
    useUnifiedTopology: true,
  })
  .then((message) => console.log('\nConnected to MongoDB!!')) // callback for when connection is successful
  .catch((error) => console.error('\nFail to connect to MongoDB :(\n', error)); // callback for when connection fails

//HBS helper for formatting dates
hbs.registerHelper('toShortDate', (longDateValue) => {
  return new hbs.SafeString(longDateValue.toLocaleDateString('en-CA'));
});
//HBS helper for checking if two values are the same
hbs.registerHelper('if_eq', function (a, b, opts) {
  if (a == b) {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
