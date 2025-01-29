'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.Arbre
 * @description
 * # Arbre
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('Arbre', function($http, _url) {
    return {
      pushArbre: function(baseUrl, data) {
        return $http.post(baseUrl + "/arbre/create", data);
      },
      getArbre: function(baseUrl, IDferme) {
        return $http.get(baseUrl + "/arbre/getTreeDesc/" + IDferme);
      },
      deleteArbre: function(baseUrl, data) {
        return $http.post(baseUrl + "/arbre/delete", data);
      },
      updateArbre: function(baseUrl, data) {
        return $http.post(baseUrl + "/arbre/update", data);
      },
      getByParcelleDomaine: function(data) {
        return $http.post(_url + "/get_arbre/getbyparcelledomaine", data);
      },
      getArbreByParcelle: function(d) {
        return $http.post(_url + "/arbre/getArbreByParcelle/", d);
      },
      getAllArbreByIdParcel: function(d) {
        return $http.post(_url + "/arbre/getAllArbreByIdParcel/", d);
      },
      creategeneratedtrees: function(d) {
        return $http.post(_url + "/arbre/creategeneratedtrees/", d);
      },
      getAllArbreByIdParcelwithSig: function(d) {
        return $http.post(_url + "/arbre/getAllArbreByIdParcelwithSig/", d);
      },
      getTreesForDatatable: function() {
        NProgress.start();
        return _url + "/arbre/getTreesForDatatable";
      },
      getURLALLTreesByFiltre: function() {
        NProgress.start();
        return _url + "/arbre/getALLTreesByFiltre";
      },
      generateTrees: function(d) {
        NProgress.start();
        return $http.post("https://apitreegen.herokuapp.com/", d);
        /*return $http({
          method: 'POST',
          data: d,
          url: 'https://apitreegen.herokuapp.com/',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
            "Server": "gunicorn",
            "Content-Type": "application/json",
            "Connection": "keep-alive"

          }
        })*/
      }
    };
  });