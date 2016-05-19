'use strict';

angular
    .module('surveyApp')
    .service('subjectsService', subjectsService);

function subjectsService($http, $q, rsaFunctions, bigInt){

    this.load = function(){
         return rsaFunctions.generateKeys(512);
    };

    this.selectSubject = function(nTTP, eTTP, keys, subjectSelected){
        var nTTP_bi = bigInt(nTTP),
            eTTP_bi = bigInt(eTTP),
            deferred = $q.defer(),
            r = bigInt.randBetween(1, nTTP_bi),
            n = bigInt(keys.publicKey.n.toString(10)),
            e = bigInt(keys.publicKey.e.toString(10)),
            blindPs = n.multiply(r.modPow(eTTP_bi, nTTP_bi)).mod(nTTP_bi),
            uri = 'http://localhost:3002/user/selectsubject',
                postInfo = {
                    "blindedPseudonym": blindPs.toString(10),
                    "subject": subjectSelected
                };
        console.log('Nttp es: ',nTTP_bi);
        console.log('Ettp es: ',eTTP_bi);
        console.log('R es: ',r);
        console.log('N es: ',n);
        console.log('blindPs: ',blindPs);

        var toBlind = keys.publicKey.e.toString(10) + '/' + keys.publicKey.n.toString(10);

        $http({
            method: 'POST',
            url: uri,
            data: JSON.stringify(postInfo),
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function successCallback(response){
            var blindedSignedPs=bigInt(response.data);
            console.log('blindedSignedPs',blindedSignedPs);
            var signedPs = blindedSignedPs.multiply(rsaFunctions.modInv(r,nTTP_bi));
            console.log('signedPs',signedPs);
            deferred.resolve(signedPs);
        }, function errorCallback(response){
            deferred.reject(response);
        });

        return deferred.promise;
    };

}