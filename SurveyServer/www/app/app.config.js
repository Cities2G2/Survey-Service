'use strict';

angular
    .module('clientNR')
    .config(config);

function config($routeProvider){
    $routeProvider

        .when('/login',{
            templateUrl: '/app/user/login.html'

        })
        .when('/register',{
            templateUrl: '/app/user/register.html'

        })
        .otherwise({
            redirectTo: '/login'
        });
}