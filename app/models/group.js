"use strict";

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var groupSchema = new Schema({
	name: { type: String, required: true, unique: true },
	yearOfBirth: { type: Number, required: true, unique: true },
	footballManager: String,
	hurlingManager: String,
    lastUpdatedDate: { type: Date, required: true },
    createdBy: { type: String, required: true },
    createdDate: { type: Date, required: true },
    updatedBy: { type: String, required: true },
    updatedDate: { type: Date, required: true }
});

module.exports = mongoose.model("group", groupSchema);
