'use strict';

angular
    .module('surveyApp')
    .controller('resultsController', resultsController);

function resultsController($http, $window, $scope, bigInt){

    var vm = this;
    vm.subject=$scope.mainCtrl.subject;
    vm.period=$scope.mainCtrl.period;
    vm.questions=$scope.mainCtrl.questions;
    console.log("Lo que mostraré será: " + vm.questions.formulation);

}