var carraigOgRegisterApp = angular.module("carraigOgRegister", 
        ["ngRoute", 
        "ngMessages",
		"appRoutes", 
		"ui.bootstrap",
        "app.directive.passwordConfirm", 
		"app.controller.homeController",
		"app.controller.loginController", 
        "app.controller.playersController",
        "app.controller.managePlayersController",
		"app.service.authenticationService",
		"app.service.homeService",
		"app.service.loginService",
		"app.service.playersService"])
    .factory("httpRequestInterceptor", ["$rootScope", "authenticationService",
        function ($rootScope, authenticationService) {
            return {
                request: function (config) {
                    var token = authenticationService.getToken();

                    if (token) {
                        config.headers.Authorization = "Bearer " + token;
                    }
                    return config;
                },

                response: function (response) {
                    if (response.headers && response.headers("Authorization")) {
                        authenticationService.saveToken(response.headers("Authorization").replace("Bearer ", ""));
                    }

                    $rootScope.payload = authenticationService.readPayload();

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
  	.run(["$rootScope", function ($rootScope) {
        $rootScope.homeURL = "#/";
        $rootScope.payload = null;
                 
    	$rootScope.alerts = [];
	}]);
