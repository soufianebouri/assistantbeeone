'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.modeirrigation
 * @description
 * # modeirrigation
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('modeirrigation', function($http, _url) {
    return {
      getAllbyFerme: function(data) {
        NProgress.start();
        return $http.post(_url + "/modeirrigation/getallbyferme", data);
      },
      create: function(data) {
        NProgress.start();
        return $http.post(_url + "/modeirrigation/create", data);
      },
      get_all: function(data) {
        NProgress.start();
        return $http.post(_url + "/modeirrigation/get_all", data);
      }
    };
  });
