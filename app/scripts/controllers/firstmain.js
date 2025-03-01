'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:FirstmainCtrl
 * @description
 * # FirstmainCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('FirstmainCtrl', function(translation, $scope, $state, $window, translatedwords, $translate, $translatePartialLoader, $cookies, auth, _appFor, _version) {
    $translatePartialLoader.addPart('firstMain');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    $scope.obj = translation.getObjectTranslated();
    $scope.currentYear = $scope.obj.currentYear;
    $scope._version = _version;
    $scope.containerStyle = {
      'overflow-x': 'hidden',
      'padding-left': '15%'
    };
    var zouiaModules = ["Administration", "parametrage_fonctionnel", "Conduite_technique", "Rendement", "Bilan"];
    var comaprimModules = ["Administration", "parametrage_fonctionnel", "prevision"];
    var domaineModules = ["Administration", "parametrage_fonctionnel", "Conduite_technique", "Rendement", "Main_oeuvre", "covid19"];
    var sahamModules = ["Administration", "parametrage_fonctionnel", "Conduite_technique", "Rendement", "Main_oeuvre", "Stock"];
    var afrifruitModules = ["Administration", "parametrage_fonctionnel", "Conduite_technique", "Rendement"];
    var pvModules = ["parametrage_fonctionnel"];
    var agrocapitaleModules = ["Administration", "parametrage_fonctionnel", "Conduite_technique", "Rendement"]
    var mfruitModules = ["Administration", "parametrage_fonctionnel", "Conduite_technique", "Rendement"]
    var maroc_citrusModules = ["Administration", "parametrage_fonctionnel", "Conduite_technique"]
    var delassusModules = ["Administration", "parametrage_fonctionnel"]

    function setPadding(mobile) {
      $scope.$evalAsync(function() {
        if (mobile) {
          $scope.containerStyle = {
            'overflow-x': 'hidden',
            'padding-left': '15%',
            'padding-right': '15%'
          };
        } else {
          $scope.containerStyle = {
            'overflow-x': 'hidden',
            'padding-left': '15%'
          };
        }
      });
    }

    function setDefaultSize() {
      var winWidth = $(window).width();
      if (winWidth < 768) {
        setPadding(true);
      } else if (winWidth <= 991) {
        setPadding(true);
      } else if (winWidth <= 1199) {
        setPadding(false);
      } else {
        setPadding(false);
      }
    }
    setDefaultSize();
    $(window).on('resize', function() {
      var winWidth = $(window).width();
      if (winWidth < 768) {
        setPadding(true);
      } else if (winWidth <= 991) {
        setPadding(true);
      } else if (winWidth <= 1199) {
        setPadding(false);
      } else {
        setPadding(false);
      }
    });

    $scope.isInMdule = (module) => {
      var ok = false;
      var permission_data = JSON.parse($window.localStorage.getItem('permission'));
      var permission = {
        modules_array: permission_data[0],
        rubriques_array: permission_data[1],
        sous_modules_array: permission_data[2]
      }

      if ($cookies.getObject('beeoneAssistant').assistUser.isAdmin)
        return true;
      for (let index = 0; index < permission.modules_array.length; index++) {
        if (permission.modules_array[index].module == module) {
          ok = true;
          break;
        }
      }
      return ok;
    }

    $.getJSON("./scripts/model/modules.json", function(data) {
      $scope.first_page_array = [];
      var temp = [];
      var j = 0;
      for (let i = 0; i < data.length; i++) {
        if (!$scope.isInMdule(data[i].label))
          continue;
        if (_appFor != "demo") {
          if (_appFor == "comaprim") {
            if (!comaprimModules.includes(data[i].label)) continue;
          } else if (_appFor == "zaouia") {
            if (!zouiaModules.includes(data[i].label)) continue;
          } else if (_appFor == "domaine") {
            if (!domaineModules.includes(data[i].label)) continue;
          } else if (_appFor == "saham") {
            if (!sahamModules.includes(data[i].label)) continue;
          } else if (_appFor == "afrifruit") {
            if (!afrifruitModules.includes(data[i].label)) continue;
          } else if (_appFor == "pv") {
            if (!pvModules.includes(data[i].label)) continue;
          } else if (_appFor == "agrocapitale") {
            if (!agrocapitaleModules.includes(data[i].label)) continue;
          } else if (_appFor == "mfruit") {
            if (!mfruitModules.includes(data[i].label)) continue;
          } else if (_appFor == "maroc_citrus") {
            if (!maroc_citrusModules.includes(data[i].label)) continue;
          } else if (_appFor == "delassus") {
            if (!delassusModules.includes(data[i].label)) continue;
          }
        }
        if (((j + 1) % 5) !== 0) {
          temp.push(data[i]);
        } else {
          temp.push(data[i]);
          $scope.first_page_array.push(temp);

          temp = [];
        }
        j++;
      }

      if (temp.length > 0) {
        $scope.first_page_array.push(temp);
      }
      $scope.first_page_array.push(0);

      $scope.$evalAsync(function() {
        $scope.first_page_array.pop();
      })
    });

    $scope.getRequiredFunction = (module) => {
      switch (module) {
        case 'Administration':
          $scope.go_profil();
          break;
        case 'parametrage_fonctionnel':
          $scope.go_parametrage_fonctionnel();
          break;
        case 'Conduite_technique':
          $scope.go_conduite_technique();
          break;
        case 'Rendement':
          $scope.go_rendement();
          break;
        case 'prevision':
          $scope.go_prevision();
          break;
        case 'Main_oeuvre':
          $scope.go_main_oeuvre();
          break;
        case 'Stock':
          $scope.go_Stock();
          break;
        case 'covid19':
          $scope.go_covid19();
          break;
        case 'BeeOne_Manager':
          $scope.go_manager();
          break;
        case 'Bilan':
          $scope.go_bilan();
          break;
        default:
          console.log("There's no action for this button !!");
      }
    }

    $scope.verify = () => {
      if ($scope.first_page_array == undefined || $scope.first_page_array.length == 0) {}
    }
    //disconnect
    $scope.disconnect = function() {
      auth.ClearCredentials();
    }

    $scope.go_parametrage_fonctionnel = function() {
      $window.localStorage.setItem("accessrights_menu", "parametrage_fonctionnel");
      $state.go('tb_organisationparcelisation');
    }

    $scope.go_main_oeuvre = function() {
      $window.localStorage.setItem("accessrights_menu", "main_oeuvre");
      //$state.go('tableau_bord_mainoeuvre');
      if (_appFor == "saham") {
        var url = 'http://105.159.249.83:4300';
      } else {
        var url = 'http://beeone-mainoeuvre.herokuapp.com';
      }
      //$window.location.href = `${url}/?q=${$cookies.getObject('beeoneAssistant').assistUser.token}`;
      window.open(`${url}/?user=${$cookies.getObject('beeoneAssistant').assistUser.ID}`, '_blank');
    }

    $scope.go_Stock = function() {
      $window.localStorage.setItem("accessrights_menu", "Stock");
      if (_appFor === "saham") {
        var url = 'http://105.159.249.83:4200';
      } else {
        var url = 'http://beeone-warehouse.herokuapp.com';
      }
      //$window.location.href = `${url}/?q=${$cookies.getObject('beeoneAssistant').assistUser.token}`;
      window.open(`${url}/?user=${$cookies.getObject('beeoneAssistant').assistUser.ID}`, '_blank');
    }


    $scope.go_conduite_technique = function() {
      $window.localStorage.setItem("accessrights_menu", "Conduite_technique");
      $state.go('TB_technique');
    }

    $scope.go_rendement = function() {
      $window.localStorage.setItem("accessrights_menu", "rendement");
      if (_appFor === "saham") {
        $state.go('recolteArbre');
      } else {
        $state.go('TbRendement');
      }
    }

    $scope.go_prevision = function() {
      $window.localStorage.setItem("accessrights_menu", "prevision");
      $state.go('tableaudebord_prevision');
    }

    $scope.go_profil = function() {
      $window.localStorage.setItem("accessrights_menu", "Administration");
      $state.go('home');
    }

    $scope.go_covid19 = function() {
      $window.localStorage.setItem("accessrights_menu", "covid19");
      $state.go('tb_covid19');
    }

    $scope.go_manager = function() {
      $window.localStorage.setItem("accessrights_menu", "BeeOne_Manager");
      $state.go('tbmanager');
    }

    $scope.go_bilan = function() {
      $window.localStorage.setItem("accessrights_menu", "Bilan");
      $state.go('bilan_technique');
    }

  });
