'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.baremes
 * @description
 * # baremes
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('baremes', function ($http, _url) {
    return {
      get_typevariete: function(data) {
        return $http.post(_url + "/baremes/get_typevariete", data);
      },
      createweb: function(data) {
        return $http.post(_url + "/baremes/createweb", data);
      },
      get_baremes: function(data) {
        return $http.post(_url + "/baremes/get_baremes", data);
      },
      get_bareme_typevariete: function(data) {
        return $http.post(_url + "/baremes/get_bareme_typevariete", data);
      },
      get_bareme_details: function(data) {
        return $http.post(_url + "/baremes/get_bareme_details", data);
      },
      delete: function(data) {
        return $http.post(_url + "/baremes/delete", data);
      },
      generate_reference: function() {
        return $http.post(_url + "/baremes/generate_reference");
      },
      get_remaining_typevariete: function(data) {
        return $http.post(_url + "/baremes/get_remaining_typevariete", data);
      },
      updateweb: function(data) {
        return $http.post(_url + "/baremes/updateweb", data);
      },
      get_all_typevariete: function(data) {
        return $http.post(_url + "/baremes/get_all_typevariete", data);
      }
    };
  });
