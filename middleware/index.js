const Campground = require("../models/campground");
const Comment = require("../models/comment");

// all the middleware goes here
let middlewareObject = {};

middlewareObject.checkCampgroundOwnership = function(req, res, next) {
	//midleware to check wether the user owns the campground to allow him to edit it
	if(req.isAuthenticated()) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if(err || !foundCampground) {
			req.flash("error", "Campground not found!"); //do it before redirect, flash displays on the next request
			res.redirect("/campgrounds");
		} else {
			//does the logged in user own the campground?	
			if (foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) {
				next();
			} else {
				req.flash("error", "You don't have permission to do that!"); //do it before redirect, flash displays on the next request
				res.redirect("back");
			};	
		}
	});
	} else {
		req.flash("error", "You have to be logged in to do that!"); //do it before redirect, flash displays on the next request
		res.redirect("back");
	}
}


middlewareObject.checkCommentOwnership = function(req, res, next) {
	//is the user logged in?
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if(err || !foundComment) {
				req.flash("error", "Comment not found!"); //do it before redirect, flash displays on the next request
				res.redirect("/campgrounds/" + req.params._id);
			} else {
				//does the logged in user own the comment?	
				if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that!"); //do it before redirect, flash displays on the next request
					res.redirect("back");
				};	
			}
		});
	} else {
		req.flash("error", "You have to be logged in to do that!"); //do it before redirect, flash displays on the next request
		res.redirect("back");
	}
}

//middleware to check wether user is logged in to block some functions
middlewareObject.isLoggedIn = function(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You have to be logged in to do that!"); //do it before redirect, flash displays on the next request
	res.redirect("/login")
};

module.exports = middlewareObject;