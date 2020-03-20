const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require("passport");

//User model
const User = require("../models/User");

//@type GET
//$route /
//@desc route for welcome page
//@access PUBLIC
router.get("/", (req, res) => {
    res.render('welcome');
})

//@type GET
//$route /login
//@desc route for get login page
//@access PUBLIC
router.get("/login", (req, res) => {
    res.render('login');
})

//@type GET
//$route /register
//@desc route for get register
//@access PUBLIC
router.get("/register", (req, res) => {
    res.render("register");
})

//@type POST
//$route /register
//@desc route for post register
//@access PUBLIC
router.post("/register", (req, res) => {
    const {
        name,
        email,
        password,
        password2
    } = req.body;
    let errors = [];

    //check password match
    if (password !== password2) {
        errors.push({
            msg: "Password do not match"
        });
    }

    //check password length 
    if (password.length < 6) {
        errors.push({
            msg: "Password is too weak"
        });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        User.findOne({
                email: email
            })
            .then((user) => {
                if (user) {
                    //user exists
                    errors.push({
                        msg: "User already exits"
                    });

                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    })
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password,salt, (err, hash) => {
                          if(err) throw err;
                          newUser.password = hash;
                          newUser.save()
                          .then(user =>{
                              req.flash("success_msg" , "You are now registered you can login");
                              res.redirect('/login');
                          })
                          .catch(err =>console.log(err));
                        })
                    )
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }
})

//@type POST
//$route /login
//@desc route for post login
//@access PRIVATE
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/login',
      failureFlash: true
    })(req, res, next);
  });

//@type GET
//$route /logout
//@desc route for post logout
//@access PUBLIC
router.get("/logout",(req,res)=>{
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect("/login");
})

module.exports = router;