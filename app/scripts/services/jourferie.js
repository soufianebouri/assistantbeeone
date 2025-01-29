'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.jourferie
 * @description
 * # jourferie
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('jourferie', function($http, _url) {
    return {
      getJourferiers: function() {
        return $http.get(_url + "/jourferie");
      },
      getJourferiers_organized: function(d) {
        return $http.get(_url + "/jourferie/listOrganized/"+d);
      }
    };
  });