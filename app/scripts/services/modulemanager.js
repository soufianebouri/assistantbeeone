'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.ModuleManager
 * @description
 * # ModuleManager
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('ModuleManager', function($mdDialog, $http, _url) {
    var parentEl = angular.element(document.body);

    function show(dataToPasse) {
      return $mdDialog.show({
        locals: dataToPasse,
        parent: parentEl,
        templateUrl: './views/templates/administration/modulemanager.html',
        controller: 'AdministrationModulemanagerCtrl',
        clickOutsideToClose: false,
        hasBackdrop: true,
        escapeToClose: true
      });
    }
    return {
      showModal: show,
      getRoles: function(d) {
        console.log(_url + "/role_management/")
        console.log(d)
        return $http.post(_url + "/role_management/", d);
      },
      createRoles: function(d) {
        return $http.post(_url + "/role_management/create", d);
      },
      getPermissionArray: function(id) {
        return $http.get(_url + "/role_management/" + id);
      },
      getProfil: function() {
        NProgress.start();
        return $http.post(_url + "/role_management/getprofil");
      },
      listgetroleprofil: function(data) {
        NProgress.start();
        return $http.post(_url + "/role_management/listgetroleprofil", data);
      },
      createRefProfil: function(data) {
        NProgress.start();
        return $http.post(_url + "/role_management/createrefprofil", data);
      },
      createRef: function(data) {
        NProgress.start();
        return $http.post(_url + "/role_management/createref", data);
      },
      deleteRef: function(data) {
        NProgress.start();
        return $http.post(_url + "/role_management/deleteref", data);
      },
      affectationprofile: function(data) {
        NProgress.start();
        return $http.post(_url + "/role_management/affectationprofile", data);
      }
    };
  });