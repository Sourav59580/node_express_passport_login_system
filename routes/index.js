const express = require("express");
const router = express.Router();
const  { ensureAuthenticated }  = require("../config/authenticate");


//@type GET
//$route /
//@desc route for welcome page
//@access PUBLIC
// Dashboard
router.get('/', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);


module.exports = router;