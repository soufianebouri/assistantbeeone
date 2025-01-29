'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.ModeApplication
 * @description
 * # ModeApplication
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('ModeApplication', function($http,$translatePartialLoader, $translate,$window) {
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    return {
      pushModeApplication: function(baseUrl, data) {
        return $http.post(baseUrl + "/mode_application/create", data);
      },
      getModeApplication: function(baseUrl) {
        return $http.get(baseUrl + "/mode_application");
      },
      deleteModeApplication: function(baseUrl, data) {
        return $http.post(baseUrl + "/mode_application/delete", data);
      },
      updateModeApplication: function(baseUrl, data) {
        return $http.post(baseUrl + "/mode_application/update", data);
      }
    };
  });
