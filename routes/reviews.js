const express = require('express');
const router = express.Router();
const Review = require('../models/review');

//Check if the user logs in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // carry on with the next middleware function
    }
    res.redirect('/login');
}

// GET handlers for /Review
router.get('/', (req, res, next) => {
    Review.find((err, reviews) => {
        if (err) { console.log(err); }
        else {
            res.render('reviews/index', {
                title: 'Recipe Reviews',
                dataset: reviews,
                user: req.user,
            });
        }
    }).sort({ postedDate: -1 });
});

// GET handler for /Review/Add
router.get('/add/:_id', isLoggedIn, (req, res, next) => {
    res.render('reviews/add', {
        title: 'Write Your Recipe Review',
        recipeId: req.params._id,
        user: req.user,
    });
});

// POST handler for /Review/Add
router.post('/add/:_id', isLoggedIn, (req, res, next) => {
    var today = new Date();
    Review.create(
        {
            recipeId: req.params._id,
            username: req.body.username,
            postedDate: today,
            review: req.body.review,
        },
        (err, newRecipe) => {
            if (err) { console.log(err); }
            else {
                res.redirect('/reviews');
            }
        }
    );
});


// GET handler for /review/Edit/_id
router.get('/edit/:_id', isLoggedIn, (req, res, next) => {
    Review.findById(req.params._id, (err, review) => {
        if (err) { console.log(err); }
        else {
            res.render('reviews/edit', {
                title: 'Edit Your Reviews',
                review: review,
                user: req.user,
            });
        }
    }).sort({ postedDate: -1 });
});


// POST handler for /reviews/Edit/:_id
router.post('/edit/:_id', isLoggedIn, (req, res, next) => {
    Review.findOneAndUpdate(
        {
            _id: req.params._id
        },
        {
            username: req.body.username,
            postedDate: req.body.postedDate,
            review: req.body.review,
        },
        (err, updatedReview) => {
            if (err) { console.log(err); }
            else {
                res.redirect('/reviews');
            }
        }
    );
});

// GET handler for /Projects/Delete/_id
router.get('/delete/:_id', isLoggedIn, (req, res, next) => {
    Review.remove({
        _id: req.params._id
    },
        (err) => {
            if (err) { console.log(err); }
            else {
                res.redirect('/reviews');
            }
        })
});



module.exports = router;