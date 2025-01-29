'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.ordretraitementphytosanitaire
 * @description
 * # ordretraitementphytosanitaire
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('ordretraitementphytosanitaire', function($http, _url) {
    return {
      getAll: function() {
        NProgress.start();
        return $http.get(_url + "/ordretraitementphytosanitaire");
      },
      getByFiltre: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordretraitementphytosanitaire/filtre", data);
      },
      getParcelleByID: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordretraitementphytosanitaire/filtre/getparcellebyid", data);
      },
      getProduitByID: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordretraitementphytosanitaire/filtre/getproduits/getproduitsbyID", data);
      },
      getAttelageByID: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordretraitementphytosanitaire/filtre/getattelage/getattelagebyID/getoutilebyID", data);
      },
      delete: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordretraitementphytosanitaire/delete", data);
      },
      getlastRef: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordretraitementphytosanitaire/getlastRef", data);
      },
      getAllObservation: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordretraitementphytosanitaire/getAllObservation", data);
      },
      getAllStade: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordretraitementphytosanitaire/getAllStade", data);
      },
      getAllTypeTraitement: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordretraitementphytosanitaire/getAllTypeTraitement", data);
      },
      getAllTypeMethodeTraitement: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordretraitementphytosanitaire/getAllTypeMethodeTraitement", data);
      },
      getAllOperation: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordretraitementphytosanitaire/getAllOperation", data);
      },
      getAllTracteur: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordretraitementphytosanitaire/getAllTracteur", data);
      },
      getAllOutilType: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordretraitementphytosanitaire/getAllOutilType", data);
      },
      getAllOutilAttelage: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordretraitementphytosanitaire/getAllOutilAttelage", data);
      },
      getLitrageByImmo: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordretraitementphytosanitaire/getLitrageByImmo", data);
      },
      getALLCible: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordretraitementphytosanitaire/getALLCible", data);
      },
      getALLPesticide: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordretraitementphytosanitaire/getALLPesticide", data);
      },
      getALLUniteDose: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordretraitementphytosanitaire/getALLUniteDose", data);
      },
      createweb: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordretraitementphytosanitaire/createweb", data);
      },
      getLitrageByTraitement: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordretraitementphytosanitaire/getLitrageByTraitement", data);
      },
      getParcelleByTraitement: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordretraitementphytosanitaire/getParcelleByTraitement", data);
      },
      getPesticideByTraitement: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordretraitementphytosanitaire/getPesticideByTraitement", data);
      },
      updateweb: function(data) {
        NProgress.start();
        return $http.post(_url + "/ordretraitementphytosanitaire/updateweb", data);
      }
    };
  });