"use strict";

module.exports = function () {
  return {
    port: process.env.PORT || 8081,
    secret: process.env.SECRET || "Carra1g0gisTheb3ST",
    database: process.env.DATABASE || "mongodb://localhost:27017/CarraigOgRegister"
  }
}();
