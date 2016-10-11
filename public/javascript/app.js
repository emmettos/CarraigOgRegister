var carraigOgRegisterApp = angular.module("carraigOgRegister", 
		["ngRoute", 
		"appRoutes", 
		"ui.bootstrap", 
		"homeController", 
		"groupController", 
		"homeService"])
	.config(["$httpProvider", function ($httpProvider) {
    $httpProvider.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
	}])
  .run(function ($rootScope) {
    $rootScope.alerts = [];
});
