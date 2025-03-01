'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.ressourcesHydriques
 * @description
 * # ressourcesHydriques
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('ressourcesHydriques', function($http, _url, $cookies) {
    return {
      showbyfiltre: function(data) {
        data.IDuser = $cookies.getObject('globals').assistUser.ID;
        data.IsAdmin = $cookies.getObject('globals').assistUser.isAdmin;
        NProgress.start();
        return $http.post(_url + "/ressources_hydriques/showbyfiltre", data);
      },
      createweb: function(data) {
        NProgress.start();
        return $http.post(_url + "/ressources_hydriques/createweb", data);
      },
      updateweb: function(data) {
        NProgress.start();
        return $http.post(_url + "/ressources_hydriques/updateweb", data);
      },
      deleteweb: function(data) {
        NProgress.start();
        return $http.post(_url + "/ressources_hydriques/deleteweb", data);
      },
      showbyferme: function(data) {
        NProgress.start();
        return $http.post(_url + "/ressources_hydriques/showbyferme", data);
      },
      showforfiltre: function(data) {
        NProgress.start();
        return $http.post(_url + "/ressources_hydriques/showforfiltre", data);
      },
      getDiametres: function(data) {
        NProgress.start();
        return $http.post(_url + "/ressources_hydriques/getDiametres", data);
      }
    };
  });
