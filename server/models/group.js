"use strict";

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var groupSchema = new Schema({
	year: { type: Number, required: true },
	name: { type: String, required: true },
	yearOfBirth: { type: Number, required: true },
	footballCoach: { type: String, required: true },
	hurlingCoach: { type: String, required: true },
  lastUpdatedDate: { type: Date, required: true },
  createdBy: { type: String, required: true },
  createdDate: { type: Date, required: true },
  updatedBy: { type: String, required: true },
  updatedDate: { type: Date, required: true }
});

groupSchema.index({ year: 1, yearOfBirth: 1}, { unique: true });

groupSchema.virtual("modifiedBy").set(function (userId) {
	var group = this,
		  currentDate = new Date();

	if (group.isNew) {
		group.createdBy = userId;
		group.createdDate = currentDate;
	}

	group.updatedBy = userId;
	group.updatedDate = currentDate;
});

module.exports = mongoose.model("group", groupSchema);
