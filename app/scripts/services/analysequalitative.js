'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.analyseQualitative
 * @description
 * # analyseQualitative
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('analyseQualitative', function($http, _url) {
    return {
      getAnalyseQualitative: function(d) {
        NProgress.start();
        return $http.post(_url + "/analyseQualitative/getSomeParams", d);
      },
      createweb: function(d) {
        NProgress.start();
        return $http.post(_url + "/analyseQualitative/createweb", d);
      },
      updateWeb: function(d) {
        NProgress.start();
        return $http.post(_url + "/analyseQualitative/updateWeb", d);
      },
      deleteweb: function(d) {
        NProgress.start();
        return $http.post(_url + "/analyseQualitative/deleteweb", d);
      },
      getfermetefruit: function(d) {
        NProgress.start();
        return $http.post(_url + "/analyseQualitative/getfermetefruit", d);
      },
      getfermetepeau: function(d) {
        NProgress.start();
        return $http.post(_url + "/analyseQualitative/getfermetepeau", d);
      },
      getcoloration: function(d) {
        NProgress.start();
        return $http.post(_url + "/analyseQualitative/getcoloration", d);
      },
      getForSynthese: function(d) {
        NProgress.start();
        return $http.post(_url + "/analyseQualitative/getForSynthese", d);
      },
      getmodeAnalyseQualitative: function(d) {
        NProgress.start();
        return $http.post(_url + "/analyseQualitative/getmodeAnalyseQualitative", d);
      }
    };
  });