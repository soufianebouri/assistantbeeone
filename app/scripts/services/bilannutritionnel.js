'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.BilanNutritionnel
 * @description
 * # BilanNutritionnel
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('BilanNutritionnel', function($http, _url) {
    return {
      getIndicateur: function(d) {
        return $http.post(_url + "/bilan_nutritionnel/", d);
      },
      journalier: function(d) {
        return $http.post(_url + "/bilan_nutritionnel/journalier/", d);
      },
      mensuel: function(d) {
        return $http.post(_url + "/bilan_nutritionnel/mensuel/", d);
      },
      getmodefert: function(d) {
        return $http.post(_url + "/bilan_nutritionnel/getmodefert/", d);
      }
    };
  });