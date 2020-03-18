const express = require("express");
const router = express.Router();

const Campground = require("../models/campground.js")

const middleware = require("../middleware") //automatically requires /index.js if you require a folder

//CAMPGROUNDS INDEX route - show all campgrounds
router.get("/", function(req, res) {
	//Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds) {
		if (err) {
			console.log(err)
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds, page: 'campgrounds', /* currentUser: req.user */})
		}
	})
	// res.render("campgrounds", {campgrounds: campgrounds});
})


//CREATE route - add new campground to database
router.post("/", middleware.isLoggedIn, function(req, res){
	//get data from form and add it to campgrounds array
	let name = req.body.name;
	let image = req.body.image;
	let descr = req.body.description;
	let price = req.body.price;
	let author = {
		id: req.user._id,
		username: req.user.username
	};
	let newCampground = {name: name, image: image, description: descr, price: price, author: author,}
	console.log(req.user);
	//create a new campground and save to the database
	Campground.create(newCampground, function(err, newlyCreated) {
		if(err) {
			console.log(err);
		} else {
			//redirect back to campgrounds page
			console.log(newlyCreated);
			res.redirect("campgrounds");
		};
	});
	// campgrounds.push(newCampground);
	//redirect back to campgrounds page
	// res.redirect("/campgrounds");
});


//NEW route - Show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
	res.render("campgrounds/new");
})

//SHOW route - read more info about the specific campground
// /campgrounds/:id GET show info about one campground
router.get("/:id", function(req, res) {
	//find the campground with the provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if (err || !foundCampground) {
			console.log(err);
			req.flash("error", "Campground not found");
			return res.redirect("/campgrounds");
		} else {
			//render show template of that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	})
});

//EDIT CAMPGROUND - route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if (err || !foundCampground) {
			req.flash("error", "Campground not found!"); //do it before redirect, flash displays on the next request
			res.redirect("back");
		} else {
			res.render("campgrounds/edit", {campground: foundCampground});	
		}
	});
});

//UPDATE CAMPGROUND - route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
		if (err) {
			req.flash("error", "Update failed!"); //do it before redirect, flash displays on the next request
			red.redirect("back");
		} else {
			res.redirect("/campgrounds/" + updatedCampground._id)
		}
	} )
	//redirect back to showpage (to see changes)
})

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findByIdAndRemove(req.params.id, function(err, removedCampground) {
		if(err) {
			console.log(err);
		} else {
			req.flash("success", "Campground " + removedCampground.name + " deleted!")
			res.redirect("/campgrounds")
		}
	})
})

module.exports = router;