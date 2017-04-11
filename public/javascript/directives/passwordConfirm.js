angular.module("app.directive.passwordConfirm", []).directive("passwordConfirm", function() {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, element, attributes, modelController) {
            if (!attributes.passwordConfirm) {
                console.error("The passwordConfirm directive expects a model as an argument");
                
                return;
            }

            scope.$watch(attributes.passwordConfirm, function (value) {
                if (modelController.$viewValue !== undefined && modelController.$viewValue !== "") {
                    modelController.$setValidity("passwordConfirm", value = modelController.$viewValue);
                }
            });

            modelController.$parsers.push(function (value) {
                var isValid = false;

                if (value === undefined || value === "") {
                    modelController.$setValidity("passwordConfirm", true);
                    
                    return value;
                }

                isValid = value === scope.$eval(attributes.passwordConfirm);
                modelController.$setValidity("passwordConfirm", isValid);
                
                return isValid ? value : undefined;
            });
        }
    };
});


