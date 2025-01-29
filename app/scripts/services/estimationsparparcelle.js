'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.estimationsparparcelle
 * @description
 * # estimationsparparcelle
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('estimationsparparcelle', function($http, _url) {
    return {
      getByFiltre: function(data) {
        NProgress.start();
        return $http.post(_url + "/estimationsparparcelle/filtre", data);
      },
      allParcelle: function(data) {
        NProgress.start();
        return $http.post(_url + "/estimationsparparcelle/allParcelle", data);
      },
      allCategorieArbre: function(data) {
        NProgress.start();
        return $http.post(_url + "/estimationsparparcelle/allCategorieArbre", data);
      },
      createcategrie: function(data) {
        NProgress.start();
        return $http.post(_url + "/estimationsparparcelle/createcategrie", data);
      },
      createestimation: function(data) {
        NProgress.start();
        return $http.post(_url + "/estimationsparparcelle/createestimation", data);
      },
      deleteestimation: function(data) {
        NProgress.start();
        return $http.post(_url + "/estimationsparparcelle/deleteestimation", data);
      },
      getCategorieByEstim: function(data) {
        NProgress.start();
        return $http.post(_url + "/estimationsparparcelle/getCategorieByEstim", data);
      }
    };
  });