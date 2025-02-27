'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.mainAssist
 * @description
 * # mainAssist
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('mainAssist', function (_url,$http ) {
    return {
      get_percents: function() {
        return $http.post(_url + "/main_assist/get_percents");
      }
    };
  });
