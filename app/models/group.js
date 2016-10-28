var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var groupSchema = new Schema({
	name: { type: String, required: true, unique: true },
	yearOfBirth: { type: Number, required: true, unique: true },
	footballManager: String,
	hurlingManager: String
});

module.exports = mongoose.model("group", groupSchema);
