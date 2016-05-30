'use strict';

angular
    .module('surveyApp')
    .controller('surveyController', surveyController);

function surveyController($window, $scope, $http) {
    var vm = this;
    console.log('Survey controller');
    console.log($scope.mainCtrl.pseudonym);
    console.log($scope.mainCtrl.pagelocation);
    
    vm.postSurvey = postSurvey;
    vm.getData = getData;

    function postSurvey(){
        var uri = 'http://localhost:3000/user/survey',
            survey = {
                "subject": vm.subjectResolved,
                "questions": vm.questionsResolved
            };

        return $http({
            method: 'POST',
            url: uri,
            data: JSON.stringify(survey),
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function successCallback(response){
            $window.location.href = '#/surveyResolved'
        }, function errorCallback(response){
            console.log(response);
        });
    }


    function getData(){
        var uri = 'http://localhost:3000/object/data';

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