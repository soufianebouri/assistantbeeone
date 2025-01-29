'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.actualisercycle
 * @description
 * # actualisercycle
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('actualisercycle', function($http, _url) {
    return {
      getCampagne: function(data) {
        NProgress.start();
        return $http.post(_url + "/actualisercycle/getcampagne", data);
      },
      getCycleArbo: function() {
        NProgress.start();
        return $http.post(_url + "/actualisercycle/getcyclearbo");
      },
      getParcelleArbo: function(data) {
        NProgress.start();
        return $http.post(_url + "/actualisercycle/getparcellearbo", data);
      },
      getParcelleCycle: function(data) {
        NProgress.start();
        return $http.post(_url + "/actualisercycle/getparcellecycle", data);
      },
      CreateActualiserCycle: function(data) {
        NProgress.start();
        return $http.post(_url + "/actualisercycle/createactualisercycle", data);
      },
      CreateActualiserParcelle: function(data) {
        NProgress.start();
        return $http.post(_url + "/actualisercycle/createactualiserparcelle", data);
      }
    };
  });