'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.ordrefertlisation
 * @description
 * # ordrefertlisation
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('ordrefertlisation', function($http, _url) {
    return {
      getAll: function() {
        NProgress.start();
        return $http.get(_url + "/ordrefertlisation");
      },
      getByFiltre: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordrefertlisation/filtre", data);
      },
      getEtatFertigation: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordrefertlisation/getEtatFertigation", data);
      },
      getByID: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordrefertlisation/filtre/byordreID", data);
      },
      getFert_EngraisByID: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordrefertlisation/filtre/byordreID/showFertEngaris", data);
      },
      getSecteurByID: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordrefertlisation/filtre/byordreID/secteur/showsecteur", data);
      },
      getParcelleByID: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordrefertlisation/filtre/byordreID/parcelles/findparcelle/showParcellebyidfert", data);
      },
      getEngraisByID: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordrefertlisation/filtre/byordreID/engrais/findengrais/showengraisbyidfert/engrais", data);
      },
      delete: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordrefertlisation/delete", data);
      },
      getlastRef: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordrefertlisation/getlastRef", data);
      },
      createwebsimple: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordrefertlisation/createwebsimple", data);
      },
      getSecteur_parcelle: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordrefertlisation/getSecteur_parcelle", data);
      },
      getFert_Engrais: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordrefertlisation/getFert_Engrais", data);
      },
      updatewebsimple: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordrefertlisation/updatewebsimple", data);
      },
      createwebavancer: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordrefertlisation/createwebavancer", data);
      },
      getFertilisation_SolutionAvancer: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordrefertlisation/getFertilisation_SolutionAvancer", data);
      },
      getFerti_PersonAvancer: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordrefertlisation/getFerti_PersonAvancer", data);
      },
      getFert_EngraisAvancer: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordrefertlisation/getFert_EngraisAvancer", data);
      },
      getFert_sect_SecteurAvancer: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordrefertlisation/getFert_sect_SecteurAvancer", data);
      },
      getFert_sect_SousParcelleAvancer: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordrefertlisation/getFert_sect_SousParcelleAvancer", data);
      },
      updatewebavancer: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordrefertlisation/updatewebavancer", data);
      },
      createwebavancerepandage: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordrefertlisation/createwebavancerepandage", data);
      },
      updatewebavancerepandage: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordrefertlisation/updatewebavancerepandage", data);
      },
      updatewebavancerapportfoliaire: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordrefertlisation/updatewebavancerapportfoliaire", data);
      },
      createwebavancerapportfoliaire: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordrefertlisation/createwebavancerapportfoliaire", data);
      }
    };
  });