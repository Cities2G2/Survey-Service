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

    load();

    function load(){
        vm.keys = rsaFunctions.generateKeys(512);
    }

    $scope.$on('getSubjects', function(evt, subjects){
        vm.subjects = subjects;
    });

    $scope.$on('postPseudonym', function(evt, pseudonym){
        vm.pseudonym = pseudonym;
    });

}