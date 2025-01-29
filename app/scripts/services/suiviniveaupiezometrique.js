'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.suiviniveaupiezometrique
 * @description
 * # suiviniveaupiezometrique
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('suiviniveaupiezometrique', function($http, _url) {
    return {
      getFiltred: function(data) {
        NProgress.start();
        return $http.post(_url + "/suiviniveaupiezometrique/getFiltred", data);
      },
      showbyferme: function(data) {
        NProgress.start();
        return $http.post(_url + "/suiviniveaupiezometrique/showbyferme", data);
      },
      createweb: function(data) {
        NProgress.start();
        return $http.post(_url + "/suiviniveaupiezometrique/createweb", data);
      },
      getbyID: function(data) {
        NProgress.start();
        return $http.post(_url + "/suiviniveaupiezometrique/getbyID", data);
      },
      deleteweb: function(data) {
        NProgress.start();
        return $http.post(_url + "/suiviniveaupiezometrique/deleteweb", data);
      },
      getConsommationByID: function(data) {
        NProgress.start();
        return $http.post(_url + "/suiviniveaupiezometrique/getConsommationByID", data);
      },
      updateweb: function(data) {
        NProgress.start();
        return $http.post(_url + "/suiviniveaupiezometrique/updateweb", data);
      },
      getForMapParcelles: function(data) {
        NProgress.start();
        return $http.post(_url + "/suiviniveaupiezometrique/getForMapParcelles", data);
      },
      getIndecateursFormap: function(data) {
        NProgress.start();
        return $http.post(_url + "/suiviniveaupiezometrique/getIndecateursFormap", data);
      }
    };
  });