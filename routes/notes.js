const express = require('express');
const router = express.Router();
const Note = require('../models/note');

//Check if the user logs in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // carry on with the next middleware function
    }
    res.redirect('/login');
}

// GET handlers for /Review
router.get('/', isLoggedIn, (req, res, next) => {
    Note.find((err, notes) => {
        // console.log(notes)
        if (err) { console.log(err); }
        else {
            res.render('notes/index', {
                title: 'Your Shopping Note',
                dataset: notes,
                user: req.user,
            });
        }
    });
});

// GET handler for /Review/Add
router.get('/add/:_id', isLoggedIn, (req, res, next) => {
    res.render('notes/add', {
        title: 'Add Ingredients to Your Shopping Note',
        user: req.user,
        recipeId: req.params._id,
    });
});

// POST handler for /Review/Add
router.post('/add/:_id', isLoggedIn, (req, res, next) => {
    var today = new Date();
    Note.create(
        {
            username: req.body.username,
            addedDate: today,
            note: req.body.note,
        },
        (err, newNote) => {
            if (err) { console.log(err); }
            else {
                res.redirect('/notes');
            }
        }
    );
});


// GET handler for /Projects/Delete/_id
router.get('/delete/:_id', isLoggedIn, (req, res, next) => {
    Note.remove({
        _id: req.params._id
    },
        (err) => {
            if (err) { console.log(err); }
            else {
                res.redirect('/notes');
            }
        })
});



module.exports = router;