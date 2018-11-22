"use strict";

var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

var Schema = mongoose.Schema;

var userSchema = new Schema({
	firstName: { type: String, required: true },
	surname: { type: String, required: true },
	emailAddress: { type: String, required: true, unique: true },
	phoneNumber: { type: String },
	password: { type: String },
	isAdministrator: { type: Boolean, required: true },
	createdBy: { type: String, required: true },
	createdDate: { type: Date, required: true },
	updatedBy: { type: String, required: true },
	updatedDate: { type: Date, required: true }
});

userSchema.virtual("modifiedBy").set(function (userId) {
	var user = this,
		currentDate = new Date();

	if (user.isNew) {
		user.createdBy = userId;
		user.createdDate = currentDate;
	}

	user.updatedBy = userId;
	user.updatedDate = currentDate;
});

userSchema.pre("save", function (next) {
	var user = this;

	var createSalt = function () {
		var promise = new Promise(function (resolve, reject) {
			bcrypt.genSalt(10, function (error, salt) {
				try {
					if (error) {
						reject(error);
					}

					resolve(salt);
				}
				catch (error) {
					reject(error);
				}
			});
		});

		return promise;
	};
	var createPasswordHash = function (salt) {
		var promise = new Promise(function (resolve, reject) {
			bcrypt.hash(user.password, salt, function (error, hash) {
				try {
					if (error) {
						reject(error);
					}

					resolve(hash);
				}
				catch (error) {
					reject(error);
				}
			});
		});

		return promise;
	}

	if (!user.isNew && user.isModified("password")) {
		createSalt()
			.then(function (salt) {
        return createPasswordHash(salt);
      })
			.then(function (hash) {
				user.password = hash;

				return next();
			})
			.catch(function (error) {
				return next(error);
			});
	}
	else {
		return next();
	}
});

userSchema.methods.comparePassword = function (password) {
	var user = this;

	var promise = new Promise(function (resolve, reject) {
		bcrypt.compare(password, user.password, function (error, isMatch) {
			try {
				if (error) {
					reject(error);
				}

				if (isMatch) {
					resolve(user);
				}
				else {
					resolve(null);
				}
			}
			catch (error) {
				reject(error);
			}
		});
	});

	return promise;
};

module.exports = mongoose.model("user", userSchema);

