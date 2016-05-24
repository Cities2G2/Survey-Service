'use strict';

angular
    .module('surveyApp')
    .service('resultsService', resultsService);

function resultsService($http, $q, rsaFunctions, bigInt){

    this.getResults = function(texto){
        var deferred = $q.defer(),
            uri = 'http://localhost:3000/survey/getResults',
            datos = {
                "surveySubject": texto
            };
        $http({
            method: 'GET',
            url: uri,
            data: JSON.stringify(datos),
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function successCallback(response){
            deferred.resolve(response);
        }, function errorCallback(response){
            deferred.reject(response);
        });
        return deferred.promise;
    };

}
