'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.lesabsences
 * @description
 * # lesabsences
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('lesabsences', function($http, _url) {
    return {
      getAbsences: function(data) {
        NProgress.start();
        return $http.post(_url + "/mainoeuvre_absences/getabsences", data);
      },
      getAllPersonnel: function(data) {
        NProgress.start();
        return $http.post(_url + "/mainoeuvre_absences/getallpersonnel", data);
      }
    };
  });