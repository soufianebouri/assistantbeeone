'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.TrancheAge
 * @description
 * # TrancheAge
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('TrancheAge', function($http,$translatePartialLoader, $translate,$window,) {
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    return {
      pushTrancheAge: function(baseUrl, data) {
        return $http.post(baseUrl + "/tranche_age/create", data);
      },
      getTrancheAge: function(baseUrl, data) {
        return $http.post(baseUrl + "/tranche_age/getSomeProps", data);
      },
      deleteTrancheAge: function(baseUrl, data) {
        return $http.post(baseUrl + "/tranche_age/delete", data);
      },
      updateTrancheAge: function(baseUrl, data) {
        return $http.post(baseUrl + "/tranche_age/update", data);
      },
      getcode: function(baseUrl) {
        NProgress.start();
        return $http.post(baseUrl + "/tranche_age/getcode");
      },
      getCountByVarieteCode: function(baseUrl, data) {
        NProgress.start();
        return $http.post(baseUrl + "/tranche_age/getcountByvarietecode", data);
      },
      getMaxByVariete: function(baseUrl, data) {
        NProgress.start();
        return $http.post(baseUrl + "/tranche_age/getmaxByvarietecode", data);
      },
      createnewcode: function(baseUrl, data) {
        NProgress.start();
        return $http.post(baseUrl + "/tranche_age/createnewcode", data);
      },
      getCountOrder: function(baseUrl, data) {
        NProgress.start();
        return $http.post(baseUrl + "/tranche_age/getcountorder", data);
      },
      checkbetween: function(baseUrl, data) {
        NProgress.start();
        return $http.post(baseUrl + "/tranche_age/checkbetween", data);
      },
      getCountOrderEdit: function(baseUrl, data) {
        NProgress.start();
        return $http.post(baseUrl + "/tranche_age/getcountorderedit", data);
      },
      Editcode: function(baseUrl, data) {
        NProgress.start();
        return $http.post(baseUrl + "/tranche_age/editcode", data);
      },
      deletecode: function(baseUrl, data) {
        NProgress.start();
        return $http.post(baseUrl + "/tranche_age/deletecode", data);
      }
    };
  });
