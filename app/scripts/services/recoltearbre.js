'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.recolteArbre
 * @description
 * # recolteArbre
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('recolteArbre', function($http, _url) {
    return {
      getRendementArbre: function(d) {
        NProgress.start();
        return $http.post(_url + "/rendementArbre/getSomeProps", d);
      },
      getformap: function(d) {
        NProgress.start();
        return $http.post(_url + "/rendementArbre/getformap", d);
      },
      deleteweb: function(d) {
        NProgress.start();
        return $http.post(_url + "/rendementArbre/deleteweb", d);
      },
      getformapAllParcelles: function(d) {
        NProgress.start();
        return $http.post(_url + "/rendementArbre/getformapAllParcelles", d);
      },
      getformapbyparcelle: function(d) {
        NProgress.start();
        return $http.post(_url + "/rendementArbre/getformapbyparcelle", d);
      },
      getforgraphJournalier: function(d) {
        NProgress.start();
        return $http.post(_url + "/rendementArbre/getforgraphJournalier", d);
      },
      getforgraphMensuel: function(d) {
        NProgress.start();
        return $http.post(_url + "/rendementArbre/getforgraphMensuel", d);
      },
      getforgraphQuantiteTotal: function(d) {
        NProgress.start();
        return $http.post(_url + "/rendementArbre/getforgraphQuantiteTotal", d);
      },
      getforgraphByParcelle: function(d) {
        NProgress.start();
        return $http.post(_url + "/rendementArbre/getforgraphByParcelle", d);
      },
      getforgraphNbrArbreRecolte: function(d) {
        NProgress.start();
        return $http.post(_url + "/rendementArbre/getforgraphNbrArbreRecolte", d);
      },
      getforgraphNbrArbreTotal: function(d) {
        NProgress.start();
        return $http.post(_url + "/rendementArbre/getforgraphNbrArbreTotal", d);
      },
      getTreesForDatatable: function() {
        NProgress.start();
        return _url + "/rendementArbre/getTreesForDatatable";
      },
      getrecolteusers: function(d) {
        NProgress.start();
        return $http.post(_url + "/rendementArbre/getrecolteusers", d);
      },
      getURLALLTreesByFiltre: function() {
        NProgress.start();
        return _url + "/rendementArbre/getALLTreesByFiltre";
      },
      getDulicatedRowForDatatable: function() {
        NProgress.start();
        return _url + "/rendementArbre/getDulicatedRowForDatatable";
      },
      deleteDuplicatedRow: function(d) {
        NProgress.start();
        return $http.post(_url + "/rendementArbre/deleteDuplicatedRow", d);
      },
    };
  });