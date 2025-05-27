'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.sousparcelleParcelleculturale
 * @description
 * # sousparcelleParcelleculturale
 * Factory in the beeOneWebFrontApp.
 */

  angular.module('beeOneWebFrontApp')
    .factory('sousparcelleParcelleculturale', function($http, _url) {
      return {
        get_parcelle_culturale_byferme: function(data) {
          NProgress.start();
          return $http.post(_url + "/sousparcelle_parcelleculturale/get_parcelle_culturale_byferme", data);
        },
        get_sous_parcelle_byferme: function(data) {
          NProgress.start();
          return $http.post(_url + "/sousparcelle_parcelleculturale/get_sous_parcelle_byferme", data);
        }
      };
    });
