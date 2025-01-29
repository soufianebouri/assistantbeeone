'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.suiviinterventionsequipements
 * @description
 * # suiviinterventionsequipements
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('suiviinterventionsequipements', function($http, _url) {
    return {
      getFiltred: function(data) {
        NProgress.start();
        return $http.post(_url + "/suiviinterventionsequipements/getFiltred", data);
      },
      showbyferme: function(data) {
        NProgress.start();
        return $http.post(_url + "/suiviinterventionsequipements/showbyferme", data);
      },
      createweb: function(data) {
        NProgress.start();
        return $http.post(_url + "/suiviinterventionsequipements/createweb", data);
      },
      getcanalisation_eaubyID: function(data) {
        NProgress.start();
        return $http.post(_url + "/suiviinterventionsequipements/getcanalisation_eaubyID", data);
      },
      getpompesbyID: function(data) {
        NProgress.start();
        return $http.post(_url + "/suiviinterventionsequipements/getpompesbyID", data);
      },
      getcomposantes_electriquesbyID: function(data) {
        NProgress.start();
        return $http.post(_url + "/suiviinterventionsequipements/getcomposantes_electriquesbyID", data);
      },
      deleteweb: function(data) {
        NProgress.start();
        return $http.post(_url + "/suiviinterventionsequipements/deleteweb", data);
      },
      updateweb: function(data) {
        NProgress.start();
        return $http.post(_url + "/suiviinterventionsequipements/updateweb", data);
      },
      getpompesbyid: function(data) {
        NProgress.start();
        return $http.post(_url + "/suiviinterventionsequipements/getpompesbyid", data);
      },
      getcanalisation_eaubyid: function(data) {
        NProgress.start();
        return $http.post(_url + "/suiviinterventionsequipements/getcanalisation_eaubyid", data);
      },
      getcomposantes_electriquesbyid: function(data) {
        NProgress.start();
        return $http.post(_url + "/suiviinterventionsequipements/getcomposantes_electriquesbyid", data);
      },
      getForEtat: function(data) {
        NProgress.start();
        return $http.post(_url + "/suiviinterventionsequipements/getforetat", data);
      }
    };
  });