/**
 * Created by ns on 01/06/16.
 */
'use strict'
angular
    .module('surveyApp')
    .controller('teacherController',teacherController);

function teacherController($http,$scope,$window, rsaFunctions, bigInt){

    var vm = this;
    vm.surveys = [];
    load();

    function load(){
        var uri = 'http://localhost:3000/resolvedsurvey/resolvedByTeacher/';
        console.log("La uri que envio es: " + uri);
        var data = {
            teacher: $scope.mainCtrl.teacher
        };
        return $http({
            method: 'POST',
            url: uri,
            data: JSON.stringify(data),
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