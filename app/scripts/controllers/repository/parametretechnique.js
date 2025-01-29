'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RepositoryParametretechniqueCtrl
 * @description
 * # RepositoryParametretechniqueCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RepositoryParametretechniqueCtrl', function($scope, $compile, translatedwords, $q, $cookies, toastr, parametretechnique, $translatePartialLoader, $translate, $window) {
    var pc = this;
    pc.IDFerme = $cookies.getObject('globals').ferme.IDFerme;
    pc.arbre = {};
    pc.obj = {
      IDFermes: pc.IDFerme,
      Paremetrge: false,
      Mode_irrigation: '1',
      mode_irrigation_ha: 0,
      Mode_fert: '1',
      Mode_fert_ha: 0,
      Solution_mere: false,
      traitement_deduction_automatique: false,
      mode_analyse_qualitative: false,
      ferigation_deduction_automatique: false,
      fertigation_creation_automatique: false
    }
    pc.obj_global = {
      ressources_hydriques_multi_diametre: false
    }
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    $q.all([parametretechnique.getparametragetechniquebyferme(pc.obj), parametretechnique.get_parametragetechnique_general()]).then((values) => {
      pc.ParametrageTechnique = values[0].data;
      pc.ParametrageTechniqueGlobal = values[1].data;

      try {
        pc.obj_global.ressources_hydriques_multi_diametre = pc.ParametrageTechniqueGlobal[0].ressources_hydriques_multi_diametre;
      } catch (e) {
        pc.obj_global.ressources_hydriques_multi_diametre = false;
      }
      console.log(pc.obj_global);

      if (pc.ParametrageTechnique.length > 0) {
        pc.obj.Paremetrge = true;
        pc.obj.Mode_irrigation = pc.ParametrageTechnique[0].Mode_irrigation;
        pc.obj.mode_irrigation_ha = pc.ParametrageTechnique[0].mode_irrigation_ha;
        pc.obj.Mode_fert = pc.ParametrageTechnique[0].Mode_fert;
        pc.obj.Mode_fert_ha = pc.ParametrageTechnique[0].Mode_fert_ha;
        pc.obj.Solution_mere = pc.ParametrageTechnique[0].Solution_mere;
        pc.obj.traitement_deduction_automatique = pc.ParametrageTechnique[0].traitement_deduction_automatique;
        pc.obj.mode_analyse_qualitative = pc.ParametrageTechnique[0].mode_analyse_qualitative;
        pc.obj.ferigation_deduction_automatique = pc.ParametrageTechnique[0].ferigation_deduction_automatique;
        pc.obj.fertigation_creation_automatique = pc.ParametrageTechnique[0].fertigation_creation_automatique;
      } else {
        pc.obj.Paremetrge = false;
        pc.obj.Mode_irrigation = '1';
        pc.obj.mode_irrigation_ha = 0;
        pc.obj.Mode_fert = '1';
        pc.obj.Mode_fert_ha = 0;
        pc.obj.Solution_mere = false;
        pc.obj.traitement_deduction_automatique = false;
        pc.obj.mode_analyse_qualitative = false;
        pc.obj.ferigation_deduction_automatique = false;
        pc.obj.fertigation_creation_automatique = false;
      }
      NProgress.done();
    });

    pc.changeparametragetechnique = async function() {

      toastr.clear();
      if (pc.obj.Paremetrge) {
        //create
        parametretechnique.updateparametragetechnique(pc.obj).then(async e => {
          if (e.data[0].message == "ajout reussi") {
            //validate success
            toastr.clear();
            toastr.info(await translatedwords.getTranslatedWord($translate("Modification reussite")), {
              closeButton: true
            });
            NProgress.done();
          } else {
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + e.data[0].description, {
              closeButton: true
            });
            NProgress.done();
          }
        }).catch(async e => {
          toastr.clear();
          toastr.error(e.data, {
            closeButton: true
          });
        });
      } else {
        //update
        parametretechnique.createparametragetechnique(pc.obj).then(async e => {
          if (e.data[0].message == "ajout reussi") {
            //validate success
            toastr.clear();
            toastr.info(await translatedwords.getTranslatedWord($translate("Modification reussite")), {
              closeButton: true
            });
            NProgress.done();
          } else {
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + e.data[0].description, {
              closeButton: true
            });
            NProgress.done();
          }
        }).catch(async e => {
          toastr.clear();
          toastr.error(e.data, {
            closeButton: true
          });
        });

      }
    }


    pc.changeparametrage_general = async function() {
      toastr.clear();
      parametretechnique.update_parametragetechnique_general(pc.obj_global).then(async e => {
        if (e.data[0].message == "ajout reussi") {
          //validate success
          toastr.clear();
          toastr.info(await translatedwords.getTranslatedWord($translate("Modification reussite")), {
            closeButton: true
          });
          NProgress.done();
        } else {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + e.data[0].description, {
            closeButton: true
          });
          NProgress.done();
        }
      }).catch(async e => {
        toastr.clear();
        toastr.error(e.data, {
          closeButton: true
        });
      });

    }
  });