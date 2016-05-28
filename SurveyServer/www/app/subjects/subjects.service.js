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

            console.log(response);
            var blindedSignedPsCrypto = response.data.data,
                identData = response.data.identData;

            getKeyTTP(response, keys)
                .then(function successCallback(){
                    getKeyNR(identData)
                        .then(function successCallback(response){
                            console.log('Success');
                            console.log(response);
                            if (identData == response.data.identData){
                                var bytes  = CryptoJS.AES.decrypt(blindedSignedPsCrypto, response.data.key);
                                var blindedSignedPs = bytes.toString(CryptoJS.enc.Utf8);
                                var blindedSignedPsBI = bigInt(blindedSignedPs.toString('hex'), 16);
                                var signedPs = blindedSignedPsBI.multiply(rsaFunctions.modInv(r,nTTP_bi));
                                deferred.resolve(signedPs);
                            }
                        }, function errorCallback(response){
                            console.log(response);
                        });
                }, function errorCallback(response){
                    console.log(response);
                });

        }, function errorCallback(response){
            deferred.reject(response);
        });

        return deferred.promise;
    };

    function getKeyTTP(response, keys){
        var deferred = $q.defer(),
            hash = CryptoJS.SHA1(response.data.data).toString(),
            proofString = response.data.identData + "AAA" + hash,
            proofBigInt = bigInt(proofString.toString('hex'), 16),
            proofRec = keys.privateKey.encrypt(proofBigInt),
            uri = 'http://localhost:3002/NR/' + response.data.identData,
            getKeyMsg = {
                PR: proofRec
            };
        $http({
            method: 'POST',
            url: uri,
            data: JSON.stringify(getKeyMsg),
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function successCallback(response){
            deferred.resolve(response);
        }, function errorCallback(response){
            deferred.reject(response);
        });

        return deferred.promise;
    }

    function getKeyNR(identData){
        var deferred = $q.defer(),
            uri = 'http://localhost:3004/NR/' + identData;
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

    //Dani
    this.postSurvey = function(seudonimo,subject){
        var deferred = $q.defer(),
            uri = 'http://localhost:3000/survey/askSurvey',
            datos = {
                "seudonimo": seudonimo,
                "subject": subject
            };
        $http({
            method: 'POST',
            url: uri,
            data: JSON.stringify(datos),
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function successCallback(response){
           var n = bigInt(keys.publicKey.n.toString(10)),
                e = bigInt(keys.publicKey.e.toString(10));
            var resBI = bigInt(response.data);
            console.log(resBI.toString(10));
            var res = resBI.modPow(e,n);
            console.log("res",res.toString());
            deferred.resolve(res);
        }, function errorCallback(response){
            deferred.reject(response);
        });
        return deferred.promise;
    };


    this.getParams = function(subject){
        var deferred = $q.defer(),
            uri = 'http://localhost:3002/user/getParams',
            datos = {
                "subject": subject
            };
        $http({
            method: 'POST',
            url: uri,
            data: JSON.stringify(datos),
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function successCallback(response){
            deferred.resolve(response);
        }, function errorCallback(response){
            deferred.reject(response);
        });
        return deferred.promise;
    }
}