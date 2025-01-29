'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.Profil
 * @description
 * # Profil
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('Profil', function($http,_url) {
    return {
      pushProfil: function(baseUrl, data) {
        return $http.post(baseUrl + "/profil/create", data);
      },
      getProfil: function(baseUrl) {
        return $http.get(baseUrl + "/profil/");
      },
      getProfilWithSomeProps: function(baseUrl) {
        return $http.get(baseUrl + "/profil/showSomeProps/");
      },
      deleteProfil: function(baseUrl, data) {
        return $http.post(baseUrl + "/profil/delete", data);
      },
      updateProfil: function(baseUrl, data) {
        return $http.post(baseUrl + "/profil/update", data);
      },
      getProfilByFerme: function(data) {
        return $http.post(_url + "/profil/byFerme",data);
      },
      getProfilByvariete: function(data) {
        return $http.post(_url + "/profil/byvariete",data);
      },
      getProfilByFermeIfExist: function(data) {
        return $http.post(_url + "/profil/byFermeIfExist",data);
      },
    };
  });
