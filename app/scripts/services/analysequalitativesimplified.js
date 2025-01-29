'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.analyseQualitativesimplified
 * @description
 * # analyseQualitativesimplified
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('analyseQualitativesimplified', function($http, _url) {
    return {
      getAnalyseQualitative: function(d) {
        NProgress.start();
        return $http.post(_url + "/analyseQualitativesimplified/getSomeParams", d);
      },
      createweb: function(d) {
        NProgress.start();
        return $http.post(_url + "/analyseQualitativesimplified/createweb", d);
      },
      updateWeb: function(d) {
        NProgress.start();
        return $http.post(_url + "/analyseQualitativesimplified/updateWeb", d);
      },
      deleteweb: function(d) {
        NProgress.start();
        return $http.post(_url + "/analyseQualitativesimplified/deleteweb", d);
      },
      getforgraph: function(d) {
        NProgress.start();
        return $http.post(_url + "/analyseQualitativesimplified/getforgraph", d);
      },
    };
  });