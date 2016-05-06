/**
 * Created by ns on 05/05/16.
 */'use strict';

angular
    .module('surveyApp')
    .controller('subjectController', subjectController);

function subjectController($window, $scope, $http){
    var vm = this;

    vm.postData = postData;
    vm.getData = getData;

    vm.subjects = $scope.mainCtrl.subjects;


    function postData(){
        var uri = 'http://localhost:3002/object/',
            subjects = {
                "subject1": "Subject1",
                "subject2": "Subject2",
                "subject3": "Subject3",
                "subject4": "Subject4",
                "subject5": "Subject5"
            };

        return $http({
            method: 'POST',
            url: uri,
            data: JSON.stringify(subjects),
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function successCallback(response){
            console.log(response);
            vm.res = response.data;
            postTTP();
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
