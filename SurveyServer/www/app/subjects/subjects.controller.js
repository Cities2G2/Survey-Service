'use strict';

angular
    .module('surveyApp')
    .controller('subjectController', subjectController);

function subjectController($window, $scope, bigInt, subjectsService,$q){
    var vm = this;

    vm.selectSubject = selectSubject;
    vm.subjects = $scope.mainCtrl.subjects;
    vm.keys = subjectsService.load();
    vm.nTTP=$scope.mainCtrl.nTTP;
    vm.eTTP=$scope.mainCtrl.eTTP;
    vm.postSurvey = postSurvey;
    vm.postResults = postResults;

    function selectSubject(){
        subjectsService.getSubjectN(vm.subjectSelected)
            .then(function successCallback(response){
                console.log(response);
                $scope.$parent.$broadcast('getN', response.data.n);
                $scope.$parent.$broadcast('getE', response.data.e);
                $scope.$parent.$broadcast('getSubject', vm.subjectSelected);
                subjectsService.selectSubject(response.data.n, response.data.e, vm.keys, vm.subjectSelected)
                    .then(function successCallback(response) {
                        $scope.$parent.$broadcast('postPseudonym', response);
                        postSurvey(vm.subjectSelected,vm.keys);
                    })
                    .catch(function errorCallback(response) {
                        alert('Ha sucedido un error');
                        console.log(response);
                    })
            })
            .catch(function errorCallback(response){
                alert('Ha sucedido un error');
                console.log(response);
            })

    }



    function postSurvey(subject,keys){
        console.log('El seudónimo que envio es: '+ $scope.mainCtrl.pseudonym.toString());
        subjectsService.postSurvey($scope.mainCtrl.pseudonym.toString(),subject,keys)
            .then(function successCallback(response){

                if(response=="7308888601133282401"){
                    $scope.mainCtrl.pageLocation="survey";
                    $window.location.href = '#/survey';
                }else{
                    alert("Tu pseudonimo no es correcto");
                }
            })
            .catch(function errorCallback(response){
                console.log(response);
            });
    }
    
    vm.postResults = postResults;

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
