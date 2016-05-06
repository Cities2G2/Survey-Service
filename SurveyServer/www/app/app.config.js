'use strict';

angular
    .module('surveyApp')
    .config(config);

function config($routeProvider){
    $routeProvider

        .when('/login',{
            templateUrl: '/app/login/login.html',
            controller: 'loginController',
            controllerAs: 'loginCtrl'
        })
        .when('/register',{
            templateUrl: '/app/register/register.html'

        })
        .when('/encuesta',{
            templateUrl: '/app/survey/encuesta.html'

        })
        .when('/asignaturas',{
            templateUrl: '/app/subjects/asignaturas.html',
            controller: 'subjectController',
            controllerAs: 'subjectCtrl'
        })
        .otherwise({
            redirectTo: '/login'
        });

}