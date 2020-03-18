const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local");
const methodOverride = require("method-override");
const flash = require("connect-flash");

const Campground = require("./models/campground");
const Comment = require("./models/comment");
const User = require("./models/user");

//requiring routes
const commentRoutes = require("./routes/comments");
const campgroundRoutes = require("./routes/campgrounds");
//all other routes
const indexRoutes = require("./routes/index");

const seedDB = require("./seeds");

// seedDB(); //seed the database

//MONGOOSE CONFIG

mongoose.connect(process.env.DATABASEURL,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false 
	});

// console.log(process.env.DATABASEURL);
// console.log(process.env.PORT);


//APP CONFIG
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIG
app.use(require("express-session")({
	secret: "This is a secret!",
	resave: false,
	saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	//Middleware to pass currentUser object to all routes whenever we use "app.use("someroute");?
	res.locals.currentUser = req.user;
	//Midleware to pass error obj to all routes
	res.locals.error = req.flash("error");
	//Midleware to pass succes obj to all routes
	res.locals.success = req.flash("success");
	next();
})

//add moment.js in all view files via variable moment
app.locals.moment = require("moment");



// We can use this and leave full routes in routes files
// app.use(indexRoutes);
// app.use(campgroundRoutes);
// app.use(commentRoutes);

//or we can shorten them by including identical route path sections here
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
	console.log("$taxCamp has started!");
});