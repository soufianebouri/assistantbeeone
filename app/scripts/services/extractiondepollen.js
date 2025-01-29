'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.extractiondepollen
 * @description
 * # extractiondepollen
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('extractiondepollen', function($http, _url) {
    return {
      getExtractionPollen: function(data) {
        NProgress.start();
        return $http.post(_url + "/extractionpollen/getExtractionPollen", data);
      },
      createweb: function(data) {
        NProgress.start();
        return $http.post(_url + "/extractionpollen/createweb", data);
      },
      updateweb: function(data) {
        NProgress.start();
        return $http.post(_url + "/extractionpollen/updateweb", data);
      },
      deleteweb: function(data) {
        NProgress.start();
        return $http.post(_url + "/extractionpollen/deleteweb", data);
      }
    };
  });