'use strict';

angular
    .module('surveyApp')
    .service('loginService', loginService);

function loginService($http, $q){

    this.postLogin = function(userLogin, passwordLogin){
        var deferred = $q.defer(),
            uri = 'http://localhost:3002/user/login',
            user = {
                "username": userLogin,
                "password": passwordLogin
            };

        $http({
            method: 'POST',
            url: uri,
            data: JSON.stringify(user),
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function successCallback(response){
            deferred.resolve(response);
        }, function errorCallback(response){
            deferred.reject(response);
        });

        return deferred.promise;
    };
}