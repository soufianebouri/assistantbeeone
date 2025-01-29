'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.suiviressourceshydriques
 * @description
 * # suiviressourceshydriques
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('suiviressourceshydriques', function($http, _url) {
    return {
      getFiltred: function(data) {
        NProgress.start();
        return $http.post(_url + "/suiviressourceshydriques/getFiltred", data);
      },
      showbyferme: function(data) {
        NProgress.start();
        return $http.post(_url + "/suiviressourceshydriques/showbyferme", data);
      },
      createweb: function(data) {
        NProgress.start();
        return $http.post(_url + "/suiviressourceshydriques/createweb", data);
      },
      getbyID: function(data) {
        NProgress.start();
        return $http.post(_url + "/suiviressourceshydriques/getbyID", data);
      },
      deleteweb: function(data) {
        NProgress.start();
        return $http.post(_url + "/suiviressourceshydriques/deleteweb", data);
      },
      getForEtat: function(data) {
        NProgress.start();
        return $http.post(_url + "/suiviressourceshydriques/getForEtat", data);
      },
      getConsommationByID: function(data) {
        NProgress.start();
        return $http.post(_url + "/suiviressourceshydriques/getConsommationByID", data);
      },
      updateweb: function(data) {
        NProgress.start();
        return $http.post(_url + "/suiviressourceshydriques/updateweb", data);
      },
      getFiltredForXls: function(data) {
        NProgress.start();
        return $http.post(_url + "/suiviressourceshydriques/getFiltredForXls", data);
      },
      getForMapParcelles: function(data) {
        NProgress.start();
        return $http.post(_url + "/suiviressourceshydriques/getForMapParcelles", data);
      },
      getIndecateursFormap: function(data) {
        NProgress.start();
        return $http.post(_url + "/suiviressourceshydriques/getIndecateursFormap", data);
      }
    };
  });