'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.secteurirrigation
 * @description
 * # secteurirrigation
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('secteurirrigation', function($http, _url,$translatePartialLoader, $translate,$window) {
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    return {
      getallbyferme: function(data) {
        NProgress.start();
        return $http.post(_url + "/secteurirrigation/getallbyferme", data);
      },
      getallbyfermemin: function(data) {
        NProgress.start();
        return $http.post(_url + "/secteurirrigation/getallbyfermemin", data);
      },
      getallbyBloc: function(data) {
        NProgress.start();
        return $http.post(_url + "/secteurirrigation/getallbyBloc", data);
      },
      create: function(data) {
        NProgress.start();
        return $http.post(_url + "/secteurirrigation/create", data);
      },
      update: function(data) {
        NProgress.start();
        return $http.post(_url + "/secteurirrigation/update", data);
      },
      delete: function(data) {
        NProgress.start();
        return $http.post(_url + "/secteurirrigation/delete", data);
      },
      getsupsousparcelle: function(data) {
        NProgress.start();
        return $http.post(_url + "/secteurirrigation/getsupsousparcelle", data);
      },
      getUniqueSouParcelleName: function(data) {
        NProgress.start();
        return $http.post(_url + "/secteurirrigation/getUniqueSouParcelleName", data);
      },
      getUniqueSouParcelleNameEdit: function(data) {
        NProgress.start();
        return $http.post(_url + "/secteurirrigation/getUniqueSouParcelleNameEdit", data);
      },
      getSupSousParcelleEdit: function(data) {
        NProgress.start();
        return $http.post(_url + "/secteurirrigation/getSupSousParcelleEdit", data);
      }
    };
  });
