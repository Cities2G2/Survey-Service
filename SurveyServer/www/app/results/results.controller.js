'use strict';

angular
    .module('surveyApp')
    .controller('resultsController', resultsController);

function resultsController($http, $window, $scope, bigInt, resultsService){

    var vm = this;
    vm.getResults = getResults;
    vm.subjects = $scope.mainCtrl.subjects;

    function getResults(){
        console.log("El resultado de la encuesta que pido es de la asignatura: " + vm.subjectSelected);

        var uri = 'http://localhost:3000/survey/getResults/' + vm.subjectSelected;

        return $http({
            method: 'GET',
            url: uri,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function successCallback(response){
            //var respuesta = response.data.data;
        }, function errorCallback(response){
            vm.res = "error" + response;
        });
        console.log("La encuesta de la asignatura del cuadrimestre anterior es: " + response.data.data);
    }

}