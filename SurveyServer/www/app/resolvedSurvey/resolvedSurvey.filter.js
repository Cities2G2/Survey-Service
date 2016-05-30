'use strict';

angular
    .module('surveyApp')
    .controller('resolvedSurveyFilter', resolvedSurveyFilter);

function resolvedSurveyFilter() {
    return function (input, start) {
        if (input) {
            start = +start;
            return input.slice(start);
        }
        return [];
    };
}