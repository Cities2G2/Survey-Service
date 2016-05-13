'use strict';

angular
    .module('surveyApp')
    .controller('surveyController', surveyController);

function surveyController($window, $scope, $http) {
    var vm = this;
    console.log('Survey controller');
    console.log($scope.mainCtrl.pseudonym);
    console.log($scope.mainCtrl.pagelocation);


}