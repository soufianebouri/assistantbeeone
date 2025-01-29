'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.ouviers
 * @description
 * # ouviers
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('Ouviers', function($http, _url) {
    // Public API here
    return {
      getOuviers: function(baseUrl, data) {
        NProgress.start();
        return $http.get(baseUrl + "/personnel_ouvrier", data);
      },
      getAllOuviers: function(baseUrl) {
        NProgress.start();
        return $http.get(baseUrl + "/personnel_ouvrier/getall");
      },
      getChefCueilletteByFerme: function(baseUrl,data) {
        NProgress.start();
        return $http.post(baseUrl + "/ouvriers/getChefCueilletteByFerme",data);
      }
    };
  });