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
        .when('/survey',{
            templateUrl: '/app/survey/survey.html',
            controller: 'surveyController',
            controllerAs: 'surveyCtrl'
        })
        .when('/subjects',{
            templateUrl: '/app/subjects/subjects.html',
            controller: 'subjectController',
            controllerAs: 'subjectCtrl'
        })
        .otherwise({
            redirectTo: '/login'
        });

}