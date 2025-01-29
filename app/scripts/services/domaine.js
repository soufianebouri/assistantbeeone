'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.domaine
 * @description
 * # domaine
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('domaine', function($http, _url, $cookies) {
    return {
      getDomaine: function() {
        var IDuser = $cookies.getObject('globals').currentUser.ID;
        var IsAdmin = $cookies.getObject('globals').currentUser.isAdmin;
        return $http.get(_url + "/get_domaines/" + IDuser + "/" + IsAdmin);
      },
      getListDomaine: function() {
        var IDuser = $cookies.getObject('globals').currentUser.ID;
        var IsAdmin = $cookies.getObject('globals').currentUser.isAdmin;
        return $http.get(_url + "/get_domaines/listFerme/" + IDuser + "/" + IsAdmin);
      },
      EditFerme: function(data) {
        return $http.post(_url + "/get_domaines/edit/", data);
      },
      AddFerme: function(data) {
        return $http.post(_url + "/get_domaines/create/", data);
      },
      DomaineByID: function(data) {
        return $http.post(_url + "/get_domaines/byidferme/", data);
      },
      DeleteFerme: function(data) {
        return $http.post(_url + "/get_domaines/delete/", data);
      },
      getDomaineByRegion: function(data) {
        data.IDuser = $cookies.getObject('globals').currentUser.ID;
        data.IsAdmin = $cookies.getObject('globals').currentUser.isAdmin;
        return $http.post(_url + "/get_domaines/getDomaineByRegion/", data);
      },
      getDomaineByRegions: function(data) {
        data.IDuser = $cookies.getObject('globals').currentUser.ID;
        data.IsAdmin = $cookies.getObject('globals').currentUser.isAdmin;
        return $http.post(_url + "/get_domaines/getDomaineByRegions/", data);
      },
      list_only_arbo: function() {
        var IDuser = $cookies.getObject('globals').currentUser.ID;
        var IsAdmin = $cookies.getObject('globals').currentUser.isAdmin;
        return $http.post(_url + "/get_domaines/list_only_arbo/", {
          IsAdmin: IsAdmin,
          IDuser: IDuser
        });
      },
    };
  });