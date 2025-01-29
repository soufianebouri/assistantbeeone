'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.salaries
 * @description
 * # salaries
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('Salaries', function($http, _url) {
    // Public API here
    return {
      getSalaries: function(baseUrl, data) {
        NProgress.start();
        return $http.get(baseUrl + "/personnel_salaries", data);
      },
      getPersonnel_fertilisation: function(data) {
        NProgress.start();
        return $http.post(_url + "/personnel_salaries/getpersonnel_fertilisation", data);
      }
    };
  });