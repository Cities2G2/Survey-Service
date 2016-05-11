'use strict';

angular
    .module('surveyApp')
    .controller('subjectController', subjectController);

function subjectController($window, $scope, bigInt, subjectsService){
    var vm = this;

    vm.selectSubject = selectSubject;
    vm.subjects = $scope.mainCtrl.subjects;
    vm.nTTP=$scope.mainCtrl.nTTP;
    vm.eTTP=$scope.mainCtrl.eTTP;

    vm.keys = subjectsService.load();

    function selectSubject(){
        subjectsService.selectSubject(vm.nTTP, vm.eTTP, vm.keys, vm.subjectSelected)
            .then(function successCallback(response){
                alert('ya tienes tu pseudonimo firmado');
                //$scope.$parent.$broadcast('postPseudonym', response.data);
                //$window.location.href = '#/survey';
            })
            .catch(function errorCallback(response){
                console.log(response);
            });
    }
}
