var express = require('express');
var router = express.Router();

// import User model
var User = require('../models/user');
var Passport = require('passport');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Home',
    user: req.user,
    isIndexView: true, //If the user views the index page or another page
  });
});

//GET handler for /login
router.get('/login', (req, res, next) => {
  // extract messages from session or create an empty list if these don't exist
  let msg = req.session.messages || [];
  // clear messages
  req.session.messages = [];
  // pass messages to the view
  res.render('login', {
    title: 'Log in Your Account',
    messages: msg,
  });
});

//POST handler for /login
router.post('/login', Passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureMessage: 'Invalid Login Information',
}));

//GET handler for /register
router.get('/register', (req, res, next) => {
  res.render('register', { title: 'Create a New Account', });
});

//POST handler for /register
router.post('/register', (req, res, next) => {
  // Create a new user based on the info sent
  User.register(
    new User({// new user object with info from the request
      username: req.body.username,
      // role: 'admin',
      role: 'user', //Users newly registered will be added a "user" role
    }),
    req.body.password,// password (so that it can be encrypted)
    (err, newUser) => {// callback function to handle success/fail
      // If there's an error we'll send the user back to register
      if (err) {
        console.log(err);
        res.redirect('/register');
      } else {
        // else log the user in and redirect to /projects
        req.login(newUser, (err) => { res.redirect('/') })
      }
    }
  );
});


//GET handler for /logout
router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    res.redirect('/login');
  });
});


// GET handler for /github
// calls passport authenticate and pass the name of the strategy
router.get('/github',
  Passport.authenticate('github', {
    scope: ['user.email']
  })
);

// GET handler for /github/callback
// this is the url they come back to after login in github.com
router.get('/github/callback',
  Passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res, next) => {
    res.redirect('/');
  });


module.exports = router;
