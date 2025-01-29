'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.bordereaucnss
 * @description
 * # bordereaucnss
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('bordereaucnss', function($http, _url) {
    return {
      GetBordoreauCnss: function(data) {
        NProgress.start();
        return $http.post(_url + "/mainoeuvre_bordoreaucnss/getbordoreaucnss", data);
      }
    };
  });