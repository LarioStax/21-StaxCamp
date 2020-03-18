const express = require("express");
const router = express.Router();
const passport = require("passport");


const Campground = require("../models/campground.js")
const Comment = require("../models/comment.js")
const User = require("../models/user.js")

//root route
router.get("/", function(req, res) {
	res.render("landing");;
})

//////////////// ====================================================== 
// AUTH ROUTES
//////////////// ====================================================== 

//show register form
router.get("/register", function(req, res) {
	res.render("register", {page: 'register'});
})

//handle sign up/register logic
router.post("/register", function(req, res) {
	let newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user) {
		if (err) {
			req.flash("error", err.message);
			return res.redirect("register");
		} else {
			passport.authenticate("local")(req, res, function() {
				req.flash("success", "Welcome to $taxCamp, " + user.username + "!")
				res.redirect("/campgrounds");
			})
		}
	});
});

//show login form
router.get("/login", function(req, res) {
	res.render("login", {page: 'login'});
});

//handle log in logic
//router.post("/login", middleware, callback)
router.post("/login", passport.authenticate("local", 
	{
		// successRedirect: "/campgrounds", //moving this to the callback allows me to use req.user.username!
		// successFlash: "Welcome!",
		failureRedirect: "/login",
		failureFlash: true
	}), function(req, res) {
		req.flash("success", "Welcome back, " + req.user.username + "!");
		res.redirect("/campgrounds");
});

//LOGOUT ROUTE
router.get("/logout", function(req, res) {
	req.logout();
	req.flash("success", "See you later!");
	res.redirect("/campgrounds");
})

module.exports = router;