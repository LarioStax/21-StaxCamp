const mongoose = require("mongoose");

//SCHEMA SETUP

let campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	price: String,
	description: String,
	createdAt: {
		type: Date,
		default: Date.now,
	},
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
		{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Comment"
		}
	],
});

let Campground = mongoose.model("Campground", campgroundSchema);
module.exports = Campground;