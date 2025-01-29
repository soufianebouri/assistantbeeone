'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.pourcentageOuverture
 * @description
 * # pourcentageOuverture
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('pourcentageOuverture', function($http, _url) {

    return {
      getPurcentageOuverture: function() {
        NProgress.start();
        return $http.get(_url + "/ouvertureFleure/getSomeProps");
      },
      getParcelWithArbre: function(data) {
        return $http.post(_url + "/ouvertureFleure/getParcelWithArbre", data);
      },
      getParcelWithOrientation: function(data) {
        NProgress.start();
        return $http.post(_url + "/ouvertureFleure/getParcelWithOrientation", data);
      },
      getByFiltre: function(data) {
        NProgress.start();
        return $http.post(_url + "/ouvertureFleure/filtre", data);
      },
      delete: function(data) {
        NProgress.start();
        return $http.post(_url + "/ouvertureFleure/delete", data);
      },
      getParcelWithOutArbre: function(data) {
        NProgress.start();
        return $http.post(_url + "/ouvertureFleure/getParcelWithOutArbre", data);
      },
      getParcelWithOrientationWithOutArbre: function(data) {
        NProgress.start();
        return $http.post(_url + "/ouvertureFleure/getParcelWithOrientationWithOutArbre", data);
      },
      update: function(data) {
        NProgress.start();
        return $http.post(_url + "/ouvertureFleure/update", data);
      }
    };

  });