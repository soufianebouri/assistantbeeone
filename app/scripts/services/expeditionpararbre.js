'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.expeditionpararbre
 * @description
 * # expeditionpararbre
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('expeditionpararbre', function($http, _url) {
    return {
      getbyfiltre: function(d) {
        NProgress.start();
        return $http.post(_url + "/expeditionbyarbre/getbyfiltre", d);
      },
      deleteexpedition: function(d) {
        NProgress.start();
        return $http.post(_url + "/expeditionbyarbre/deleteexpedition", d);
      },
      getvarietesbyid: function(d) {
        NProgress.start();
        return $http.post(_url + "/expeditionbyarbre/getvarietesbyid", d);
      },
      getparcellebyid: function(d) {
        NProgress.start();
        return $http.post(_url + "/expeditionbyarbre/getparcellebyid", d);
      },
      getlasttraitementbyid: function(d) {
        NProgress.start();
        return $http.post(_url + "/expeditionbyarbre/getlasttraitementbyid", d);
      },
      editRefbon_expedition: function(d) {
        NProgress.start();
        return $http.post(_url + "/expeditionbyarbre/editRefbon_expedition", d);
      }
    };
  });