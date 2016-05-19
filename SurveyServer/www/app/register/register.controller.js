'use strict';

angular
    .module('surveyApp')
    .controller('registerController', registerController);

function registerController($window, $scope, $http, bigInt){

    var vm = this;
    vm.postRegister = postRegister;
    vm.getData = getData;

    function postRegister(){
        var uri = 'http://localhost:3002/user/register',
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
            $window.location.href = '#/login'
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