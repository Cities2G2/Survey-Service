'use strict';

angular
    .module('surveyApp')
    .controller('mainController', mainController);

function mainController($window, $scope, rsaFunctions, bigInt) {
    var vm = this;

    vm.token = "";
    vm.eTTP = "";
    vm.nTTP = "";
    vm.subjects = [];
    vm.pageLocation = "";
    vm.subjectSelected = "";
    vm.subject = "";
    vm.period = "";
    vm.questions = "";
    vm.teacher = "";

    $scope.$on('$locationChangeStart', function (event, next, current) {


        if (vm.pageLocation == "") {
            vm.eTTP = "";
            vm.nTTP = "";
            vm.subjects = [];
            vm.subjectSelected = "";
            vm.token = "";
            $window.location.href = '#/login';

            if (vm.pageLocation == "") {
                $window.location.href = '#/login';

            }
        }
    });

    $scope.$on('getSubjects', function (evt, subjects) {
        vm.subjects = subjects;
    });

    $scope.$on('getN', function (evt, n) {
        vm.nTTP = n;
    });

    $scope.$on('getE', function (evt, e) {
        vm.eTTP = e;
    });

    $scope.$on('postPseudonym', function (evt, pseudonym) {
        vm.pseudonym = pseudonym;
    });


    $scope.$on('getSubjectResolved', function (evt, subject) {
        vm.subject = subject;
    });

    $scope.$on('getPeriodResolved', function (evt, period) {
        vm.period = period;
    });

    $scope.$on('getQuestionsResolved', function (evt, questions) {
        vm.questions = questions;
    });

    $scope.$on('getSubject', function (evt, subject) {
        vm.subjectSelected = subject;

    });

    $scope.$on('getTeacher', function (evt, teacher) {
        vm.teacher = teacher;

    });

}