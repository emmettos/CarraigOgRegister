"use strict";

module.exports = function () {
    switch (process.env.NODE_ENV) {
        case 'production': 
            return {
	            secret: "T2LgbxgyG#RwvMeo",
	            database: "mongodb://admin:q6iMFDa.@ds137530.mlab.com:37530/carraig_og_register"
            };
        default: 
            return {
	            secret: "Carra1g0gisTheb3ST",
	            database: "mongodb://localhost:27017/CarraigOgRegister"
            }
    }
}();
