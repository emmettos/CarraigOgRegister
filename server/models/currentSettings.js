"use strict";

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var currentSettingsSchema = new Schema({
	year: { type: Number, required: true },
    groupYears: [ { type: Number }],
    createdBy: { type: String, required: true },
    createdDate: { type: Date, required: true },
    updatedBy: { type: String, required: true },
    updatedDate: { type: Date, required: true }
}, { collection: "currentSettings"});

module.exports = mongoose.model("currentSettings", currentSettingsSchema);

