'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.dashboardAccessRights
 * @description
 * # dashboardAccessRights
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('dashboardAccessRights', function($http, _url) {
    return {
      GetByProfil: function(data) {
        NProgress.start();
        return $http.post(_url + "/dashboard_access_rights/getbyprofil/", data);
      },
      CreateOrUpdate: function(data) {
        NProgress.start();
        return $http.post(_url + "/dashboard_access_rights/createorupdate/", data);
      }
    }
  });