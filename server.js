const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const passport = require("passport");
const flash = require('connect-flash');
const session = require('express-session');


const app = express();

//static file
app.use(express.static('public'));

// Passport Config
require('./config/passport')(passport);

//db config 
const db = require("./config/keys").mongoURI;

//connect to Mongo
mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{
    console.log("MongoDB connected successfully");
})
.catch((err) =>{
    console.log(err);
})

//EJS (view engine set)
app.use(expressLayouts);
app.set("view engine","ejs");

//body-parser (middleware)
app.use(bodyparser.urlencoded({extended : false}));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


//Actual routes
app.use("/",require("./routes/auth"));
app.use("/dashboard",require("./routes/index"));



//connection 
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`server is running at port ${PORT}`);
})
