'use strict';

angular
    .module('surveyApp')
    .controller('mainController', mainController);

function mainController($window, $scope, rsaFunctions, bigInt){
    var vm = this;

    vm.token = "";
    vm.eTTP = "";
    vm.nTTP = "";
    vm.subjects = [];



    $scope.$on('getSubjects', function(evt, subjects){
        vm.subjects = subjects;
    });

    $scope.$on('getN', function(evt, n){
        vm.nTTP = n;
    });

    $scope.$on('getE', function(evt, e){
        vm.eTTP = e;
    });

    $scope.$on('postPseudonym', function(evt, pseudonym){
        vm.pseudonym = pseudonym;
    });

}