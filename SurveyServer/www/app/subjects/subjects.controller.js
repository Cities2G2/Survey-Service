'use strict';

angular
    .module('surveyApp')
    .controller('subjectController', subjectController);

function subjectController($window, $scope, $http){
    var vm = this;

    vm.selectSubject = selectSubject;
    vm.getData = getData;

    vm.subjects = $scope.mainCtrl.subjects;
    console.log(vm.subjects);

    function selectSubject(){
        var uri = 'http://localhost:3002/user/selectsubject',
            postInfo = {
                "pseudonym": $scope.mainCtrl.keys.publicKey.n.toString(10),
                "subject": vm.subjectSelected
            };

        return $http({
            method: 'POST',
            url: uri,
            data: JSON.stringify(postInfo),
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function successCallback(response){
            $scope.$parent.$broadcast('postPseudonym', response.data);
            $window.location.href = '#/survey';
        }, function errorCallback(response){
            console.log(response);
        });
    }


    function getData(){
        var uri = 'http://localhost:3002/object/data';

        return $http({
            method: 'GET',
            url: uri,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function succesCallback(response){
            vm.n=bigInt(response.data.data);

            console.log(vm.n);
        }, function errorCallback(response){
            vm.res = "error" + response;
        });
    }
}
