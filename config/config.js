"use strict";

module.exports = function () {
    return {
        secret: process.env.SECRET || "Carra1g0gisTheb3ST",
        database: process.env.DATABASE || "mongodb://localhost:27017/CarraigOgRegister"
    }
}();
