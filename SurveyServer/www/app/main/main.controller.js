'use strict';

angular
    .module('surveyApp')
    .controller('mainController', mainController);

function mainController($window, $scope){
    var vm = this;

    vm.token = "";
    vm.eTTP = "";
    vm.nTTP = "";
    vm.subjects = [];

    $scope.$on('getSubjects', function(evt, subjects){
        vm.subjects = subjects;
    });
}