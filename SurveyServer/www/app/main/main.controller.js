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
    vm.pageLocation = "";

    $scope.$on('$locationChangeStart', function(event, next, current) {

        if (vm.pageLocation == ""){
            $window.location.href='#/login';
        }
    });

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