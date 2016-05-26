'use strict';

angular
    .module('surveyApp')
    .controller('subjectController', subjectController);

function subjectController($window, $scope, bigInt, subjectsService,$q){
    var vm = this;

    vm.selectSubject = selectSubject;
    vm.subjects = $scope.mainCtrl.subjects;
    //vm.nTTP=$scope.mainCtrl.nTTP;
    //vm.eTTP=$scope.mainCtrl.eTTP;
    vm.keys = subjectsService.load();


    function selectSubject(){
        getParams(vm.subjectSelected)
            .then(function successCallback(response) {
                (subjectsService.selectSubject(vm.nTTP, vm.eTTP, vm.keys, vm.subjectSelected)
                    .then(function successCallback(response) {
                        alert('ya tienes tu pseudonimo firmado');
                        console.log('responsee', response.toString());
                        console.log("el subjec selected es: ", vm.subjectSelected);
                        $scope.$parent.$broadcast('postPseudonym', response);
                        postSurvey(vm.subjectSelected);
                        $scope.mainCtrl.pageLocation = "survey";
                        $window.location.href = '#/survey';
                    })
                    .catch(function errorCallback(response) {
                        console.log(response);
                    }));
            })
    }


    //Dani
    vm.postSurvey = postSurvey;

    function postSurvey(subject){

        //var texto = 'DaniVilesFlorejachs';
        console.log('El seudónimo que envio es: '+ $scope.mainCtrl.pseudonym.toString());
        subjectsService.postSurvey($scope.mainCtrl.pseudonym.toString(),subject)
            .then(function successCallback(response){
                $scope.mainCtrl.pageLocation="survey";
                $window.location.href = '#/survey';
            })
            .catch(function errorCallback(response){
                console.log(response);
            });
    }

    vm.getParams = getParams;

    function getParams(subject){
        var deferred = $q.defer();

        subjectsService.getParams(subject)
            .then(function successCallback(response){
                console.log('response',response);
                vm.nTTP = response.data.n;
                vm.eTTP = response.data.e;
                console.log('vm.nTTP',vm.nTTP);
                console.log('vm.eTTP',vm.eTTP);
                deferred.resolve(response);


            })
            .catch(function errorCallback(response){
                deferred.reject(response);
            });
        return deferred.promise;
    }

    vm.postResults = postResults;
    function postResults(){
        console.log("som aqui");
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
