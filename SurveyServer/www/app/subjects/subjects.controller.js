'use strict';

angular
    .module('surveyApp')
    .controller('subjectController', subjectController);

function subjectController($window, $scope, $http,rsaFunctions, bigInt){
    var vm = this;

    vm.selectSubject = selectSubject;
    vm.getData = getData;

    vm.subjects = $scope.mainCtrl.subjects;
    console.log(vm.subjects);

    vm.nTTP=$scope.mainCtrl.nTTP;
    vm.eTTP=$scope.mainCtrl.eTTP;

    var nTTP_bi = bigInt(vm.nTTP);
    var eTTP_bi = bigInt(vm.eTTP);

    load();

    function load(){
        vm.keys = rsaFunctions.generateKeys(512);
    }


    function selectSubject(){

        var r = bigInt.randBetween(1, nTTP_bi);

        var n = bigInt(keys.publicKey.n.toString(10));

        var blindPs = n.multiply(r.modPow(eTTP_bi, nTTP_bi)).mod(nTTP_bi);

        var uri = 'http://localhost:3002/user/selectsubject',
            postInfo = {
                "blindedPseudonym": blindPs.toString(10),
                "subject": vm.subjectSelected
            };

        return $http({
            method: 'POST',
            url: uri,
            data: JSON.stringify(postInfo),
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function successCallback(response){
            var blindedSignedPs=bigInt(response.blindedSignedPs);
            var signedPs = blindedSignedPs.multiply(rsaFunctions.modInv(r,nTTP_bi));
            alert('ya tienes tu pseudonimo firmado');
            //$scope.$parent.$broadcast('postPseudonym', response.data);
            //$window.location.href = '#/survey';
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
