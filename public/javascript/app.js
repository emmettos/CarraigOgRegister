var carraigOgRegisterApp = angular.module("carraigOgRegister", 
		["ngRoute", 
		"appRoutes", 
		"ui.bootstrap", 
		"homeController", 
		"playersSummaryController", 
		"homeService",
		"playersService"])
	.config(["$httpProvider", function ($httpProvider) {
    $httpProvider.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
	}])
  .run(function ($rootScope) {
  	$rootScope.currentYear = 2016;
  	
    $rootScope.alerts = [];
});
