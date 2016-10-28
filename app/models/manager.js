var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var groupSchema = new Schema({
	firstName: { type: String, required: true },
	surname: { type: String, required: true },
	emailAddress: { type: String, required: true, unique: true },
	phoneNumber: { type: String },
});

module.exports = mongoose.model("manager", groupSchema);
