'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.covid19
 * @description
 * # covid19
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('covid19', function($http, _url) {
    return {
      geteffectifspresents: function(data) {
        NProgress.start();
        return $http.post(_url + "/covid19/effectifspresents", data);
      },
      geteffectifsquestiones: function(data) {
        NProgress.start();
        return $http.post(_url + "/covid19/effectifsquestiones", data);
      },
      getaveczerosymptome: function(data) {
        NProgress.start();
        return $http.post(_url + "/covid19/aveczerosymptome", data);
      },
      getaumoinsunsymptome: function(data) {
        NProgress.start();
        return $http.post(_url + "/covid19/aumoinsunsymptome", data);
      },
      getentourageaveczerosymptomes: function(data) {
        NProgress.start();
        return $http.post(_url + "/covid19/entourageaveczerosymptomes", data);
      },
      getentourageavecaumoinsunsymptome: function(data) {
        NProgress.start();
        return $http.post(_url + "/covid19/entourageavecaumoinsunsymptome", data);
      },
      getentouragealecovide: function(data) {
        NProgress.start();
        return $http.post(_url + "/covid19/entouragealecovide", data);
      },
      getavectemperature: function(data) {
        NProgress.start();
        return $http.post(_url + "/covid19/avectemperature", data);
      },
      getdisponibilitethermometre: function(data) {
        NProgress.start();
        return $http.post(_url + "/covid19/disponibilitethermometre", data);
      }
    };
  });