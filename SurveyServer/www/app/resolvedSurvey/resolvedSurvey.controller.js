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


    vm.clickToView = clickToView;

    function clickToView(id){

        var uri = 'http://localhost:3000/resolvedsurvey/resolvedById/' + id;
        return $http({
            method: 'GET',
            url: uri,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function succesCallback(response){
            console.log("Response es: " + response);
            $scope.$parent.$broadcast('getSubjectResolved', response.data.subject);
            $scope.$parent.$broadcast('getPeriodResolved', response.data.period);
            $scope.$parent.$broadcast('getQuestionsResolved', response.data.questions);
            $scope.mainCtrl.pageLocation="results";
            $window.location.href = '#/results'

        }, function errorCallback(response){
            console.log(response);
            alert(response);
        });

    }
}