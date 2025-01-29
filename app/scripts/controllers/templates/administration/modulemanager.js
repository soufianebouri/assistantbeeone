'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:AdministrationModulemanagerCtrl
 * @description
 * # AdministrationModulemanagerCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('AdministrationModulemanagerCtrl', function(profilData, translatedwords, ModuleManager, $scope, $q, toastr, $cookies, $translatePartialLoader, $translate, $window, $mdDialog) {



    $scope.profileName = profilData.Nom + " " + profilData.Prenom;
    $scope.module_array = [];
    $scope.rubrique_array = [];
    $scope.roles = {};
    $scope.checked_module = [];


    $q.all([ModuleManager.getRoles({
      ID: profilData.ID
    }), ModuleManager.getProfil()]).then((e) => {
      $scope.roles = e[0].data[0];
      $scope.checked_module = e[0].data[1];
      $scope.profils = e[1].data;
      angular.forEach(e[0].data[0], (v, k) => {
        $scope.module_array.push(k);
      });
      NProgress.done();
    });
    $scope.isearsh = true;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    $scope.profil_changed = async () => {

      var confirm = $mdDialog.confirm()
        .title(await translatedwords.getTranslatedWord($translate("Veuillez confirmer?")))
        .textContent('')
        .ariaLabel('Lucky day')
        .ok(await translatedwords.getTranslatedWord($translate("Confirme l'affectation au utilisteur")))
        .cancel(await translatedwords.getTranslatedWord($translate("Juste une copie sans enregistrer")))

      $mdDialog.show(confirm.multiple(true)).then(function() {
        //ok
        $scope.isearsh = false;
        ModuleManager.listgetroleprofil({
          ID: $scope.profilRef
        }).then(e => {
          NProgress.done();
          $scope.ro = e.data[0];
          $scope.ch = e.data[1];
          //insertthis on user
          $scope.prof = e.data[2];
          $scope.mod = [];
          angular.forEach(e.data[0], (v, k) => {
            $scope.mod.push(k);
          });

          var str = "";
          angular.forEach($scope.prof, (v, k) => {
            str += `(${profilData.ID},${v.ref_ss_module},${v.a},${v.u},${v.d},${v.web},${v.mobile}),`;
          });
          str = str.slice(0, -1);
          str = str.replace(/false/g, 0).replace(/true/g, 1);
          ModuleManager.affectationprofile({
            VALUES: str,
            ID_USER: profilData.ID
          }).then(async function(res) {

            console.log(res);

            console.log("rrrrrrrrrrrrrrrrrrr");
            toastr.clear();
            toastr.info(await translatedwords.getTranslatedWord($translate("Affectation réussie")), {
              closeButton: true
            });
            NProgress.done();
            $scope.roles = $scope.ro;
            $scope.checked_module = $scope.ch;
            //insertthis on user
            $scope.profilrefarray = $scope.prof;
            $scope.module_array = $scope.mod;

            $scope.isearsh = true;
          }).catch(async e => {
            console.log(e);
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("veuillez réessayer, un probleme de connectivité au serveur est survenu")), {
              closeButton: true
            });
            $scope.isearsh = true;
          });
        }).catch(async e => {
          $scope.isearsh = true;
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("veuillez réessayer, un probleme de connectivité au serveur est survenu")) + e.data, {
            closeButton: true
          });
          NProgress.done();
          $scope.profilRef = undefined;
        });
      }, function() {
        //cancel
        $scope.isearsh = false;
        ModuleManager.listgetroleprofil({
          ID: $scope.profilRef
        }).then(e => {
          $scope.roles = e.data[0];
          $scope.checked_module = e.data[1];
          //insertthis on user
          $scope.profilrefarray = e.data[2];
          $scope.module_array = [];
          angular.forEach(e.data[0], (v, k) => {
            $scope.module_array.push(k);
          });
          $scope.isearsh = true;
          NProgress.done();
        }).catch(async e => {
          $scope.isearsh = true;
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("veuillez réessayer, un probleme de connectivité au serveur est survenu")) + e.data, {
            closeButton: true
          });
          NProgress.done();
          $scope.profilRef = undefined;
        });
      })





    }

    $scope.module_changed = () => {}

    $scope.getRubrique = (module) => {
      var rubrique = [];
      angular.forEach($scope.roles[module], (v, k) => {
        for (var k in v) {
          rubrique.push(k);
          break;
        }
      });
      return rubrique;
    }

    $scope.getSsModule = (rubrique, module) => {
      var ss_module = [];
      angular.forEach($scope.roles[module], (v, k) => {
        for (var k in v) {
          if (k == rubrique) {
            ss_module = v[rubrique];
          }
          break;
        }
      });
      return ss_module;
    }

    $scope.saveModule = (module_name, rubrique, rubrique_model) => {
      var ObPost = {};
      if (rubrique_model.length == 0 || !rubrique_model) {
        ObPost = {
          REF_rubrique: rubrique,
          ID_USER: profilData.ID
        };
      } else {
        var str = "";
        var ss_module_ids = [];
        angular.forEach(rubrique_model, (v, k) => {
          str += `(${profilData.ID},${v.id},${v.a},${v.u},${v.d},${v.web},${v.mobile}),`;
          ss_module_ids.push(v.id);
        });
        str = str.slice(0, -1);
        str = str.replace(/false/g, 0).replace(/true/g, 1);
        ObPost = {
          VALUES: str,
          ID_USER: profilData.ID,
          REF_RUB: rubrique_model[0].ref_rubrique,
          SS_MODULE_IDS: ss_module_ids
        };
      }

      ModuleManager.createRoles(ObPost).then(async e => {
        toastr.clear();
        toastr.info(await translatedwords.getTranslatedWord($translate("Action réussie")), {
          closeButton: true
        });
      }).catch(async e => {
        console.log(e);
        toastr.clear();
        toastr.error(await translatedwords.getTranslatedWord($translate("veuillez réessayer, un probleme de connectivité au serveur est survenu")), {
          closeButton: true
        });
      });

    }

    $scope.ValiderAffectation = (module_name, rubrique, rubrique_model) => {

    }

    $scope.Annuler = () => {
      $mdDialog.hide();document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
    }


  });