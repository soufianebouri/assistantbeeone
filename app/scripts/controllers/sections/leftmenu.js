'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:LeftmenuCtrl
 * @description
 * # LeftmenuCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('LeftmenuCtrl', function(auth, $window, $location, analyseQualitative, AccessRightsService, $scope, $translatePartialLoader, $translate, $cookies, $state, _version) {
    var vm = this;
    $translatePartialLoader.addPart('section');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    $scope._version = _version;
    vm.logout = function() {
      auth.ClearCredentials();
    }

    $scope.obj_menu = AccessRightsService.getObjectAccessRights();





    vm.isAdmin = $cookies.getObject('beeoneAssistant').assistUser.isAdmin;
    var permission_data = JSON.parse($window.localStorage.getItem('permission'));
    var permission = {
      modules_array: permission_data[0],
      rubriques_array: permission_data[1],
      sous_modules_array: permission_data[2]
    }
    $scope.isInLevelTwo = (rubrique) => {
      var ok = false;
      if (vm.isAdmin)
        return true;
      for (let index = 0; index < permission.rubriques_array.length; index++) {
        if (permission.rubriques_array[index].rubrique == rubrique) {
          ok = true;
          break;
        }
      }
      return ok;
    }

    $scope.isInLevelThree = (ss_module) => {
      var ok = false;
      if (vm.isAdmin)
        return true;
      for (let index = 0; index < permission.sous_modules_array.length; index++) {
        if (permission.sous_modules_array[index].ss_module == ss_module) {
          ok = true;
          break;
        }
      }
      return ok;
    }

    $scope.setBranche = (module, rubrique, submodule) => {
      $window.sessionStorage.setItem(1, JSON.stringify({
        module: module,
        rubrique: rubrique,
        submodule: submodule
      }));
    }

  });
