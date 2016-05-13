'use strict';

angular
    .module('surveyApp')
    .controller('loginController', loginController);

function loginController($window, $scope, bigInt, loginService){

    var vm = this;
    vm.postLogin = postLogin;

    function postLogin(){
        loginService.postLogin(vm.userLogin, vm.passwordLogin)
            .then(function successCallback(response){
                $scope.$parent.$broadcast('getSubjects', response.data.subjects);
                $scope.$parent.$broadcast('getN', response.data.nTTP);
                $scope.$parent.$broadcast('getE', response.data.eTTP);
                $scope.mainCtrl.pageLocation="subjects";
                $window.location.href = '#/subjects'
            })
            .catch(function errorCallback(response){
                console.log(response);
            });
    }
}
