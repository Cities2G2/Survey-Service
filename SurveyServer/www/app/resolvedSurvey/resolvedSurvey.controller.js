'use strict';

angular
    .module('surveyApp')
    .controller('resolvedSurveyController', resolvedSurveyController);

function resolvedSurveyController($window, $scope, $http) {
    var vm = this;
    vm.surveys = [];
    load();

    function load(){
        var uri = 'http://localhost:3000/resolvedsurvey/';

        return $http({
            method: 'GET',
            url: uri,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function succesCallback(response){
            vm.surveys=response.data;
            console.log(vm.surveys);
        }, function errorCallback(response){
            console.log(response);
            alert(response);
        });
    }
}