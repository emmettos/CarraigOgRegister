var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var playerSchema = new Schema({
	firstName: { type: String, required: true },
	surname: { type: String, required: true },
	addressLine1: { type: String, required: true },
	addressLine2: { type: String, required: true },
	addressLine3: { type: String },
	dateOfBirth: { type: Date, required: true },
	medicalConditions: { type: String },
	school: { type: String },
	contactName: { type: String, required: true },
	contactMobileNumber: { type: String },
	contactHomeNumber: { type: String },
	contactEmailAddress: { type: String},
	lastDateRegistered: { type: Date, required: true }
});

module.exports = mongoose.model("player", playerSchema);

