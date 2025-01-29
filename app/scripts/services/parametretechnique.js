'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.parametretechnique
 * @description
 * # parametretechnique
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('parametretechnique', function($http, _url, $translatePartialLoader, $translate, $window) {
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    return {
      getparametragetechniquebyferme: function(data) {
        NProgress.start();
        return $http.post(_url + "/parametretechnique/getparametragetechniquebyferme", data);
      },
      createparametragetechnique: function(data) {
        NProgress.start();
        return $http.post(_url + "/parametretechnique/createparametragetechnique", data);
      },
      updateparametragetechnique: function(data) {
        NProgress.start();
        return $http.post(_url + "/parametretechnique/updateparametragetechnique", data);
      },
      checkcloture: function(data) {
        return $http.post(_url + "/parametretechnique/checkcloture", data);
      },
      get_parametragetechnique_general: function() {
        NProgress.start();
        return $http.post(_url + "/parametretechnique/get_parametragetechnique_general");
      },
      update_parametragetechnique_general: function(data) {
        NProgress.start();
        return $http.post(_url + "/parametretechnique/update_parametragetechnique_general", data);
      }
    };
  });