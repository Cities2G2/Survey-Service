'use strict';

angular
    .module('surveyApp')
    .controller('loginController', loginController);

function loginController($window, $scope, $http, BigInteger, rsaFunctions, bigInt){

    var vm = this;
    vm.postLogin = postLogin;
    vm.getData = getData;

    function postLogin(){
        var uri = 'http://localhost:3002/user/login',
            user = {
                "username": vm.userLogin,
                "password": vm.passwordLogin
            };

        return $http({
            method: 'POST',
            url: uri,
            data: JSON.stringify(user),
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function successCallback(response){
            console.log(response);
            $scope.$parent.$broadcast('getSubjects', response);
            $window.location.href = '#/asignaturas'
        }, function errorCallback(response){
            console.log(response);
        });
    }


    function getData(){
        var uri = 'http://localhost:3002/object/data';

        return $http({
            method: 'GET',
            url: uri,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function succesCallback(response){
            vm.n=bigInt(response.data.data);

            console.log(vm.n);
        }, function errorCallback(response){
            vm.res = "error" + response;
        });
    }
}
