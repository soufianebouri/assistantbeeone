'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.bilanHydrique
 * @description
 * # bilanHydrique
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('bilanHydrique', function($http, _url) {
    return {
      getIndicateurBian: function(d) {
        return $http.post(_url + "/bilan_hydrique/", d);
      },
      apportJournalier: function(d) {
        return $http.post(_url + "/bilan_hydrique/apportJournalier/", d);
      },
      apportMensuel: function(d) {
        return $http.post(_url + "/bilan_hydrique/apportMensuel/", d);
      },
      besoinrecommande: function(d) {
        return $http.post(_url + "/bilan_hydrique/besoinrecommande/", d);
      },
      supsimple: function(d) {
        return $http.post(_url + "/bilan_hydrique/supsimple/", d);
      },
      supirriger: function(d) {
        return $http.post(_url + "/bilan_hydrique/supirriger/", d);
      },
      getsupDebutCampagne: function(d) {
        return $http.post(_url + "/bilan_hydrique/getsupDebutCampagne/", d);
      }
    };
  });