const mongoose = require("mongoose");

//SCHEMA SETUP

let commentSchema = new mongoose.Schema({
	text: String,
	isEdited: {type:Boolean, default: false},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String,
	}
});

let Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;