var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var playerSchema = new Schema({
	firstName: { type: String, required: true },
	surname: { type: String, required: true },
	addressLine1: { type: String },
	addressLine2: { type: String },
	addressLine3: { type: String },
	addressLine4: { type: String },
	dateOfBirth: { type: Date, required: true },
	yearOfBirth: { type: Number, required: true },
	medicalConditions: { type: String },
	contactName: { type: String },
	contactMobileNumber: { type: String },
	contactHomeNumber: { type: String },
	contactEmailAddress: { type: String},
	school: { type: String },
	lastRegisteredDate: { type: Date, required: true },
	lastRegisteredYear: { type: Number, required: true }
});

module.exports = mongoose.model("player", playerSchema);

