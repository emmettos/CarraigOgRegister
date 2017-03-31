var carraigOgRegisterApp = angular.module("carraigOgRegister", 
        ["ngRoute", 
        "ngMessages",
		"appRoutes", 
		"ui.bootstrap", 
		"homeController",
		"loginController", 
        "playersController",
        "managePlayersController",
		"authenticationService",
		"homeService",
		"loginService",
		"playersService"])
    .factory("httpRequestInterceptor", ["$rootScope", "AuthenticationService",
        function ($rootScope, AuthenticationService) {
            return {
                request: function (config) {
                    var token = AuthenticationService.getToken();

                    if (token) {
                        config.headers.Authorization = "Bearer " + token;
                    }
                    return config;
                },

                response: function (response) {
                    if (response.headers && response.headers("Authorization")) {
                        AuthenticationService.saveToken(response.headers("Authorization").replace("Bearer ", ""));
                    }

                    $rootScope.payload = AuthenticationService.readPayload();

                    return response;			
                }
            }
        }
    ])
	.config(["$httpProvider", function ($httpProvider) {
        $httpProvider.defaults.cache = false;
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }
        $httpProvider.defaults.headers.get["If-Modified-Since"] = "0";
        
		$httpProvider.interceptors.push("httpRequestInterceptor");
		$httpProvider.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
	}])
  	.run(["$rootScope", "AuthenticationService", function ($rootScope, AuthenticationService) {
        $rootScope.homeURL = "#/";
        $rootScope.payload = null;
                 
    	$rootScope.alerts = [];
	}]);
