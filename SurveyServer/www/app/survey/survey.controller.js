'use strict';

angular
    .module('surveyApp')
    .controller('surveyController', surveyController);

function surveyController($window, $scope, $http, bigInt, $q) {
    var vm = this;
    console.log('Survey controller');
    console.log($scope.mainCtrl.pseudonym);
    console.log($scope.mainCtrl.pageLocation);
    
    vm.postSurvey = postSurvey;
    vm.results = [];
    load();

    function postSurvey(){
        var questions = [];
        for (var iterResults = 0; iterResults < vm.results.length; iterResults++){
            questions.push({
                formulation: vm.survey.questions[iterResults].formulation,
                value: vm.results[iterResults]
            })
        }
        var resolvedSurvey = {
            subject: vm.survey.subject,
            teacher: vm.survey.teacher,
            period: "QP1516",
            questions: questions
        };

        var identData = createId(),
            keyMsg = createId(),
            msgEncrypt = CryptoJS.AES.encrypt(JSON.stringify(resolvedSurvey), keyMsg).toString(),
            hash = CryptoJS.SHA1(msgEncrypt).toString(),
            proofString = "SERVER" + "AAA" + identData + "AAA" + hash,
            proofBigInt = bigInt(proofString.toString('hex'), 16),
            proofOrg = $scope.mainCtrl.keys.privateKey.encrypt(proofBigInt),
            message = {
                "identData": identData,
                "data": msgEncrypt,
                "PO": proofOrg,
                "publicKey": $scope.mainCtrl.keys.publicKey
            };

        var uri = 'http://localhost:3000/resolvedsurvey/NR/';

        return $http({
            method: 'POST',
            url: uri,
            data: JSON.stringify(message),
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function successCallback(response){
            postKeyNR(identData, keyMsg)
                .then(function successCallback(){
                    postAvailableKey(identData)
                        .then(function successCallback(){
                            //ENVIADA
                            alert("ENCUESTA ENVIADA CORRECTAMENTE");
                            for(var iterSubjects = 0; iterSubjects < $scope.mainCtrl.subjects.length; iterSubjects++){
                                console.log(vm.survey.subject);
                                console.log($scope.mainCtrl.subjects[iterSubjects].name);
                                if(vm.survey.subject ===$scope.mainCtrl.subjects[iterSubjects].name){
                                    $scope.mainCtrl.subjects.splice(iterSubjects,1);
                                }
                            }
                            $scope.mainCtrl.pageLocation="subjects";
                            $window.location.href = '#/subjects';
                        }, function errorCallback(response){
                            console.log(response);
                        });
                }, function errorCallback(response){
                    console.log(response);
                });
        }, function errorCallback(response){
            console.log(response);
        });
    }

    function postKeyNR(identData, key){
        var deferred = $q.defer(),
            uri = 'http://localhost:3004/NR/',
            message = {
                destiny: "TTP",
                key: key,
                identData: identData
            };
        $http({
            method: 'POST',
            url: uri,
            data: JSON.stringify(message),
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function successCallback(response){
            deferred.resolve(response);
        }, function errorCallback(response){
            deferred.reject(response);
        });

        return deferred.promise;
    }

    function postAvailableKey(identData){
        var deferred = $q.defer(),
            uri = 'http://localhost:3000/resolvedsurvey/NR/' + identData;

        $http({
            method: 'GET',
            url: uri,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function successCallback(response){
            deferred.resolve(response);
        }, function errorCallback(response){
            deferred.reject(response);
        });

        return deferred.promise;
    }

    function load(){
        var uri = 'http://localhost:3000/survey/subjectById/' + $scope.mainCtrl.subjectSelected;

        return $http({
            method: 'GET',
            url: uri,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function succesCallback(response){
            uri = 'http://localhost:3000/survey/' + response.data.name;
            $http({
                method: 'GET',
                url: uri,
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            }).then(function succesCallback(response){
                vm.survey = response.data;
            }, function errorCallback(response){
                alert("error");
                console.log(response);
            });
        }, function errorCallback(response){
            alert("error");
            console.log(response);
        });


    }

    function createId() {
        return Math.random().toString(36).substr(2, 9);
    }
}