'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.EstimationActualise
 * @description
 * # EstimationActualise
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('EstimationActualise',  function($http, _url) {
    return {
      getEstimationActualise: function(d) {
        NProgress.start();
        return $http.post(_url + "/estimationActualisee/listDetail", d);
      },
    };
  });
