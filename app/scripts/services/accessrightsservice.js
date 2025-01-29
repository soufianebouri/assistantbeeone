'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.AccessRightsService
 * @description
 * # AccessRightsService
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('AccessRightsService', function($window) {
    // Public API here
    return {
      getObjectAccessRights: function() {
        var obj_menu = {};
        obj_menu.accessrights_menu = $window.localStorage.getItem("accessrights_menu");
        if (obj_menu.accessrights_menu == 'parametrage_fonctionnel') {
          obj_menu.isParametrage_fonctionnel = true;
        }
        if (obj_menu.accessrights_menu == 'main_oeuvre') {
          obj_menu.isMain_oeuvre = true;
        }
        if (obj_menu.accessrights_menu == 'Conduite_technique') {
          obj_menu.isConduite_technique = true;
        }
        if (obj_menu.accessrights_menu == 'rendement') {
          obj_menu.isRendement = true;
        }
        if (obj_menu.accessrights_menu == 'prevision') {
          obj_menu.isPrevision = true;
        }
        if (obj_menu.accessrights_menu == 'Administration') {
          obj_menu.isProfil = true;
        }
        if (obj_menu.accessrights_menu == 'covid19') {
          obj_menu.isCovid19 = true;
        }
        if (obj_menu.accessrights_menu == 'Bilan') {
          obj_menu.isBilan = true;
        }
        return obj_menu;
      }
    };
  });