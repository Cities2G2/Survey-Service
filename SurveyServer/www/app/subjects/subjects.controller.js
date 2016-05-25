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
    vm.postSurvey = postSurvey;
    vm.postResults = postResults;


    function selectSubject(){
        subjectsService.selectSubject(vm.nTTP, vm.eTTP, vm.keys, vm.subjectSelected)
            .then(function successCallback(response){
                alert('Ja tens el teu seudònim firmat');
                $scope.$parent.$broadcast('postPseudonym', response);
                postSurvey();
                $scope.mainCtrl.pageLocation="survey";
                $window.location.href = '#/survey';
            })
            .catch(function errorCallback(response){
                console.log(response);
            });
    }


    function postSurvey(){

        //var texto = 'DaniVilesFlorejachs';
        console.log('El seudónimo que envio es: '+ $scope.mainCtrl.pseudonym.toString());
        subjectsService.postSurvey($scope.mainCtrl.pseudonym.toString())
            .then(function successCallback(response){

                $scope.mainCtrl.pageLocation="survey";
                $window.location.href = '#/survey';
            })
            .catch(function errorCallback(response){
                console.log(response);
            });
    }


    function postResults(){
        console.log("som al postResults");
        $scope.mainCtrl.pageLocation="results";
        $window.location.href = '#/results';

        /*var texto = 'DaniVilesFlorejachs';
         //$scope.mainCtrl.pseudonym
         subjectsService.postSurvey(texto)
         .then(function successCallback(response){

         $scope.mainCtrl.pageLocation="results";
         $window.location.href = '#/results';
         })
         .catch(function errorCallback(response){
         console.log(response);
         });*/
    }

}