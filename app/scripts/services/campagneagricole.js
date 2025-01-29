'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.campagneagricole
 * @description
 * # campagneagricole
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('campagneagricole', function($http, _url) {
    return {
      getCampagneAgricole: function() {
        return $http.get(_url + "/get_campagne_agricole");
      },
      getCampagneAgricoleByIDSociete: function(ID) {
        return $http.get(_url + "/get_campagne_agricole/" + ID);
      },
      getCodeCampagneByIDSocieteDate: function(date) {
        return $http.post(_url + "/get_campagne_agricole/checkcampagne/", date);
      },
      getCampagneByDateNow: function(date) {
        return $http.post(_url + "/get_campagne_agricole/getcampagnebydatenow/", date);
      },
      CheckCodeCompagnebyTwoDates: function(data) {
        NProgress.start();
        return $http.post(_url + "/get_campagne_agricole/checkcodecompagnebytwodates/", data);
      },
      compagneFiltrer: function(data) {
        NProgress.start();
        return $http.post(_url + "/get_campagne_agricole/compagneFiltrer/", data);
      },
      getall: function() {
        NProgress.start();
        return $http.post(_url + "/get_campagne_agricole/getall/");
      }
    };
  });