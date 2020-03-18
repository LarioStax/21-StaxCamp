const express = require("express");
const router = express.Router({mergeParams: true});

const Campground = require("../models/campground.js")
const Comment = require("../models/comment.js")

const middleware = require("../middleware") //automatically requires /index.js if you require a folder

//////////////// ====================================================== 
// COMMENTS ROUTES
//////////////// ====================================================== 

//new comment form
router.get("/new", middleware.isLoggedIn, function(req, res) {
		//find campground by id
		Campground.findById(req.params.id, function(err, campground) {
			if (err) {
				console.log(err);
			} else {
				//send campground through
				res.render("comments/new", {campground: campground});
			}
		})
});

//Comments Create
router.post("/", middleware.isLoggedIn, function(req, res) {
	//find campground by id
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			req.flash("error", "Campground not found.")
			console.log(err);
		} else {
			//create new comment
			Comment.create(req.body.comment, function(err, comment) {
				if (err) {
					req.flash("error", "Something went wrong.")
					console.log(err);
				} else {
					//add username and ID to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					//connect new comment to campground
					campground.comments.push(comment);
					campground.save();
					console.log(comment);
					//redirect to showpage of said campground
					req.flash("success", "Successfully added a new comment.")
					res.redirect("/campgrounds/" + campground._id);
				}
			})

		}
	})
});

//EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if (err || !foundCampground) {
			console.log(err);
			req.flash("error", "Campground not found.");
		} else {
			Comment.findById(req.params.comment_id, function(err, foundComment) {
				if (err) {
					console.log(err);
					req.flash("error", "Comment not found.")
				} else {
					res.render("comments/edit", {campground: foundCampground, comment: foundComment});
				}
			})
		}
	})
	
})

//UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
		if (err) {
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id)
		}
	})
});


//DELETE/DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if (err) {
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted.");
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
})

module.exports = router;