'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:TableaudebordTbTechniqueCtrl
 * @description
 * # TableaudebordTbTechniqueCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('TableaudebordTbTechniqueCtrl', function($scope, $http, translatedwords, $translatePartialLoader, $translate, $rootScope, BilanNutritionnel, $cookies, $window, tbTechnique, ApportEau, $log, campagneagricole, $q, domaine, $mdSidenav, $state, dashboardAccessRights, toastr) {
    moment.locale('fr');
    var pc = this;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.IDferme = $cookies.getObject('globals').ferme.IDFerme;
    pc.NomFerme = $cookies.getObject('globals').ferme.NomFerme;
    pc.IDSOCIETE = $cookies.getObject('globals').ferme.IDSociete;
    pc.IDProfil = $cookies.getObject('globals').currentUser.ID;
    pc.mode_irrigation = 1;

    pc.isAdmin = $cookies.getObject('globals').currentUser.isAdmin;
    var permission_data = JSON.parse($window.localStorage.getItem('permission'));
    var permission = {
      modules_array: permission_data[0],
      rubriques_array: permission_data[1],
      sous_modules_array: permission_data[2]
    }

    $scope.isInLevelThree = (ss_module) => {
      var ok = false;
      if (pc.isAdmin)
        return true;
      for (let index = 0; index < permission.sous_modules_array.length; index++) {
        if (permission.sous_modules_array[index].ss_module == ss_module && permission.sous_modules_array[index].web) {
          ok = true;
          break;
        }
      }
      return ok;
    }

    pc.obj = {
      "FERME": pc.IDferme,
      "IDSOCIETE": pc.IDSOCIETE,
      "DateDebutCampagne": "",
      "DateFinCampagne": "",
      "latitude": 0,
      "longitude": 0,
      "mode_irrigation": 1,
      "mode_irrigation_ha": 0
    }

    pc.objUser = {
      Icreate: true,
      ID_Profil: pc.IDProfil
    }

    $scope.templates = [{
        name: 'metio',
        url: 'views/tableaudebord/technique_tabs/tb_technique_metio.html'
      },
      {
        name: 'fertiirrigation',
        url: 'views/tableaudebord/technique_tabs/tb_technique_fertiirrigation.html'
      },
      {
        name: 'traitementphytosanitaire',
        url: 'views/tableaudebord/technique_tabs/tb_technique_traitementphytosanitaire.html'
      },
      {
        name: 'monitoring',
        url: 'views/tableaudebord/technique_tabs/tb_technique_monitoring.html'
      },
      {
        name: 'qualite',
        url: 'views/tableaudebord/technique_tabs/tb_technique_qualite.html'
      },
      {
        name: 'Rendement ',
        url: 'views/tableaudebord/technique_tabs/tb_technique_rendement.html'
      },
      {
        name: 'telemetriedessaisies',
        url: 'views/tableaudebord/technique_tabs/tb_technique_telemetriesaisie.html'
      },
      {
        name: 'personnalisez',
        url: 'views/tableaudebord/technique_tabs/tb_technique_personnalisez.html'
      }
    ];



    $scope.toggleRight = buildToggler('right');

    function buildToggler(navID) {
      return function() {
        $mdSidenav(navID)
          .open()
          .then(function() {});
      };
    }

    $scope.close = function() {
      $mdSidenav('right').close()
        .then(function() {

        });
    };

    $q.all([dashboardAccessRights.GetByProfil(pc.objUser)]).then((values) => {
      pc.dashboardAccessRights = values[0].data;
      if (pc.dashboardAccessRights.length > 0) {
        pc.objUser.Icreate = false;
        $scope.tb_technique_Metio = pc.dashboardAccessRights[0].tb_technique_Metio;
        $scope.tb_technique_FertiIrrigation = pc.dashboardAccessRights[0].tb_technique_FertiIrrigation;
        $scope.tb_technique_TraitementPhytosanitaire = pc.dashboardAccessRights[0].tb_technique_TraitementPhytosanitaire;
        $scope.tb_technique_Monitoring = pc.dashboardAccessRights[0].tb_technique_Monitoring;
        $scope.tb_technique_Qualite = pc.dashboardAccessRights[0].tb_technique_Qualite;
        $scope.tb_technique_Rendement = pc.dashboardAccessRights[0].tb_technique_Rendement;
        $scope.tb_technique_TelemetrieSaisies = pc.dashboardAccessRights[0].tb_technique_TelemetrieSaisies;

        $scope.tb_technique_metio_ForecastMetiogramme = pc.dashboardAccessRights[0].tb_technique_metio_ForecastMetiogramme;
        $scope.tb_technique_metio_ForecastGeneral = pc.dashboardAccessRights[0].tb_technique_metio_ForecastGeneral;

        $scope.tb_technique_fertiIrrigation_TableauApportsParCulture = pc.dashboardAccessRights[0].tb_technique_fertiIrrigation_TableauApportsParCulture;
        $scope.tb_technique_fertiIrrigation_TableauApportsParVariete = pc.dashboardAccessRights[0].tb_technique_fertiIrrigation_TableauApportsParVariete;
        $scope.tb_technique_fertiIrrigation_GraphiqueAapportsParCulture = pc.dashboardAccessRights[0].tb_technique_fertiIrrigation_GraphiqueAapportsParCulture;
        $scope.tb_technique_fertiIrrigation_GraphiqueApportsParVariete = pc.dashboardAccessRights[0].tb_technique_fertiIrrigation_GraphiqueApportsParVariete;
        $scope.tb_technique_traitementPhytosanitaire_CarteApplicationsPhytosanitaires = pc.dashboardAccessRights[0].tb_technique_traitementPhytosanitaire_CarteApplicationsPhytosanitaires;
        $scope.tb_technique_monitoring_AlertesRavageurs = pc.dashboardAccessRights[0].tb_technique_monitoring_AlertesRavageurs;
        $scope.tb_technique_monitoring_TableauInfestation = pc.dashboardAccessRights[0].tb_technique_monitoring_TableauInfestation;
        $scope.tb_technique_monitoring_GraphiqueInfestation = pc.dashboardAccessRights[0].tb_technique_monitoring_GraphiqueInfestation;
        $scope.tb_technique_qualite_TableauSuiviQualiteCulture = pc.dashboardAccessRights[0].tb_technique_qualite_TableauSuiviQualiteCulture;
        $scope.tb_technique_qualite_TableauSuiviQualiteVariete = pc.dashboardAccessRights[0].tb_technique_qualite_TableauSuiviQualiteVariete;
        $scope.tb_technique_qualite_GraphiqueSuiviQualiteParCulture = pc.dashboardAccessRights[0].tb_technique_qualite_GraphiqueSuiviQualiteParCulture;
        $scope.tb_technique_qualite_GraphiqueSuiviQualiteParVariete = pc.dashboardAccessRights[0].tb_technique_qualite_GraphiqueSuiviQualiteParVariete;
        $scope.tb_technique_qualite_TableauSuiviRendementParCulture = pc.dashboardAccessRights[0].tb_technique_qualite_TableauSuiviRendementParCulture;
        $scope.tb_technique_qualite_TableauSuiviRendementParVariete = pc.dashboardAccessRights[0].tb_technique_qualite_TableauSuiviRendementParVariete;
        $scope.tb_technique_qualite_GraphiqueSuiviRendementParCulture = pc.dashboardAccessRights[0].tb_technique_qualite_GraphiqueSuiviRendementParCulture;
        $scope.tb_technique_qualite_GraphiqueSuiviRendementParVariete = pc.dashboardAccessRights[0].tb_technique_qualite_GraphiqueSuiviRendementParVariete;
        $scope.tb_technique_telemetrieSaisies_TableauDernieresSaisiesParUtilisateur = pc.dashboardAccessRights[0].tb_technique_telemetrieSaisies_TableauDernieresSaisiesParUtilisateur;
        $rootScope.$broadcast('broadcastDashboard', {
          tb_technique_metio_ForecastMetiogramme: pc.dashboardAccessRights[0].tb_technique_metio_ForecastMetiogramme,
          tb_technique_metio_ForecastGeneral: pc.dashboardAccessRights[0].tb_technique_metio_ForecastGeneral,
          tb_technique_fertiIrrigation_TableauApportsParCulture: pc.dashboardAccessRights[0].tb_technique_fertiIrrigation_TableauApportsParCulture,
          tb_technique_fertiIrrigation_TableauApportsParVariete: pc.dashboardAccessRights[0].tb_technique_fertiIrrigation_TableauApportsParVariete,
          tb_technique_fertiIrrigation_GraphiqueAapportsParCulture: pc.dashboardAccessRights[0].tb_technique_fertiIrrigation_GraphiqueAapportsParCulture,
          tb_technique_fertiIrrigation_GraphiqueApportsParVariete: pc.dashboardAccessRights[0].tb_technique_fertiIrrigation_GraphiqueApportsParVariete,
          tb_technique_traitementPhytosanitaire_CarteApplicationsPhytosanitaires: pc.dashboardAccessRights[0].tb_technique_traitementPhytosanitaire_CarteApplicationsPhytosanitaires,
          tb_technique_monitoring_AlertesRavageurs: pc.dashboardAccessRights[0].tb_technique_monitoring_AlertesRavageurs,
          tb_technique_monitoring_TableauInfestation: pc.dashboardAccessRights[0].tb_technique_monitoring_TableauInfestation,
          tb_technique_monitoring_GraphiqueInfestation: pc.dashboardAccessRights[0].tb_technique_monitoring_GraphiqueInfestation,
          tb_technique_qualite_TableauSuiviQualiteCulture: pc.dashboardAccessRights[0].tb_technique_qualite_TableauSuiviQualiteCulture,
          tb_technique_qualite_TableauSuiviQualiteVariete: pc.dashboardAccessRights[0].tb_technique_qualite_TableauSuiviQualiteVariete,
          tb_technique_qualite_GraphiqueSuiviQualiteParCulture: pc.dashboardAccessRights[0].tb_technique_qualite_GraphiqueSuiviQualiteParCulture,
          tb_technique_qualite_GraphiqueSuiviQualiteParVariete: pc.dashboardAccessRights[0].tb_technique_qualite_GraphiqueSuiviQualiteParVariete,
          tb_technique_qualite_TableauSuiviRendementParCulture: pc.dashboardAccessRights[0].tb_technique_qualite_TableauSuiviRendementParCulture,
          tb_technique_qualite_TableauSuiviRendementParVariete: pc.dashboardAccessRights[0].tb_technique_qualite_TableauSuiviRendementParVariete,
          tb_technique_qualite_GraphiqueSuiviRendementParCulture: pc.dashboardAccessRights[0].tb_technique_qualite_GraphiqueSuiviRendementParCulture,
          tb_technique_qualite_GraphiqueSuiviRendementParVariete: pc.dashboardAccessRights[0].tb_technique_qualite_GraphiqueSuiviRendementParVariete,
          tb_technique_telemetrieSaisies_TableauDernieresSaisiesParUtilisateur: pc.dashboardAccessRights[0].tb_technique_telemetrieSaisies_TableauDernieresSaisiesParUtilisateur
        })
      } else {
        pc.objUser.Icreate = true;
        $scope.tb_technique_Metio = true;
        $scope.tb_technique_FertiIrrigation = true;
        $scope.tb_technique_TraitementPhytosanitaire = true;
        $scope.tb_technique_Monitoring = true;
        $scope.tb_technique_Qualite = true;
        $scope.tb_technique_Rendement = true;
        $scope.tb_technique_TelemetrieSaisies = true;
        $scope.tb_technique_metio_ForecastMetiogramme = true;
        $scope.tb_technique_metio_ForecastGeneral = true;
        $scope.tb_technique_fertiIrrigation_TableauApportsParCulture = true;
        $scope.tb_technique_fertiIrrigation_TableauApportsParVariete = true;
        $scope.tb_technique_fertiIrrigation_GraphiqueAapportsParCulture = true;
        $scope.tb_technique_fertiIrrigation_GraphiqueApportsParVariete = true;
        $scope.tb_technique_traitementPhytosanitaire_CarteApplicationsPhytosanitaires = true;
        $scope.tb_technique_monitoring_AlertesRavageurs = true;
        $scope.tb_technique_monitoring_TableauInfestation = true;
        $scope.tb_technique_monitoring_GraphiqueInfestation = true;
        $scope.tb_technique_qualite_TableauSuiviQualiteCulture = true;
        $scope.tb_technique_qualite_TableauSuiviQualiteVariete = true;
        $scope.tb_technique_qualite_GraphiqueSuiviQualiteParCulture = true;
        $scope.tb_technique_qualite_GraphiqueSuiviQualiteParVariete = true;
        $scope.tb_technique_qualite_TableauSuiviRendementParCulture = true;
        $scope.tb_technique_qualite_TableauSuiviRendementParVariete = true;
        $scope.tb_technique_qualite_GraphiqueSuiviRendementParCulture = true;
        $scope.tb_technique_qualite_GraphiqueSuiviRendementParVariete = true;
        $scope.tb_technique_telemetrieSaisies_TableauDernieresSaisiesParUtilisateur = true;
        $rootScope.$broadcast('broadcastDashboard', {
          tb_technique_metio_ForecastMetiogramme: $scope.tb_technique_metio_ForecastMetiogramme,
          tb_technique_metio_ForecastGeneral: $scope.tb_technique_metio_ForecastGeneral,
          tb_technique_fertiIrrigation_TableauApportsParCulture: $scope.tb_technique_fertiIrrigation_TableauApportsParCulture,
          tb_technique_fertiIrrigation_TableauApportsParVariete: $scope.tb_technique_fertiIrrigation_TableauApportsParVariete,
          tb_technique_fertiIrrigation_GraphiqueAapportsParCulture: $scope.tb_technique_fertiIrrigation_GraphiqueAapportsParCulture,
          tb_technique_fertiIrrigation_GraphiqueApportsParVariete: $scope.tb_technique_fertiIrrigation_GraphiqueApportsParVariete,
          tb_technique_traitementPhytosanitaire_CarteApplicationsPhytosanitaires: $scope.tb_technique_traitementPhytosanitaire_CarteApplicationsPhytosanitaires,
          tb_technique_monitoring_AlertesRavageurs: $scope.tb_technique_monitoring_AlertesRavageurs,
          tb_technique_monitoring_TableauInfestation: $scope.tb_technique_monitoring_TableauInfestation,
          tb_technique_monitoring_GraphiqueInfestation: $scope.tb_technique_monitoring_GraphiqueInfestation,
          tb_technique_qualite_TableauSuiviQualiteCulture: $scope.tb_technique_qualite_TableauSuiviQualiteCulture,
          tb_technique_qualite_TableauSuiviQualiteVariete: $scope.tb_technique_qualite_TableauSuiviQualiteVariete,
          tb_technique_qualite_GraphiqueSuiviQualiteParCulture: $scope.tb_technique_qualite_GraphiqueSuiviQualiteParCulture,
          tb_technique_qualite_GraphiqueSuiviQualiteParVariete: $scope.tb_technique_qualite_GraphiqueSuiviQualiteParVariete,
          tb_technique_qualite_TableauSuiviRendementParCulture: $scope.tb_technique_qualite_TableauSuiviRendementParCulture,
          tb_technique_qualite_TableauSuiviRendementParVariete: $scope.tb_technique_qualite_TableauSuiviRendementParVariete,
          tb_technique_qualite_GraphiqueSuiviRendementParCulture: $scope.tb_technique_qualite_GraphiqueSuiviRendementParCulture,
          tb_technique_qualite_GraphiqueSuiviRendementParVariete: $scope.tb_technique_qualite_GraphiqueSuiviRendementParVariete,
          tb_technique_telemetrieSaisies_TableauDernieresSaisiesParUtilisateur: $scope.tb_technique_telemetrieSaisies_TableauDernieresSaisiesParUtilisateur
        })
      }
    });

    $scope.Sauvegarder = function() {
      $scope.progress = true;
      dashboardAccessRights.CreateOrUpdate({
        Icreate: pc.objUser.Icreate,
        ID_Profil: pc.IDProfil,
        tb_technique_Metio: $scope.tb_technique_Metio,
        tb_technique_FertiIrrigation: $scope.tb_technique_FertiIrrigation,
        tb_technique_TraitementPhytosanitaire: $scope.tb_technique_TraitementPhytosanitaire,
        tb_technique_Monitoring: $scope.tb_technique_Monitoring,
        tb_technique_Qualite: $scope.tb_technique_Qualite,
        tb_technique_Rendement: $scope.tb_technique_Rendement,
        tb_technique_TelemetrieSaisies: $scope.tb_technique_TelemetrieSaisies,
        tb_technique_metio_ForecastMetiogramme: $scope.tb_technique_metio_ForecastMetiogramme,
        tb_technique_metio_ForecastGeneral: $scope.tb_technique_metio_ForecastGeneral,
        tb_technique_metio_ReleveClimatique: false,
        tb_technique_fertiIrrigation_TableauApportsParCulture: $scope.tb_technique_fertiIrrigation_TableauApportsParCulture,
        tb_technique_fertiIrrigation_TableauApportsParVariete: $scope.tb_technique_fertiIrrigation_TableauApportsParVariete,
        tb_technique_fertiIrrigation_GraphiqueAapportsParCulture: $scope.tb_technique_fertiIrrigation_GraphiqueAapportsParCulture,
        tb_technique_fertiIrrigation_GraphiqueApportsParVariete: $scope.tb_technique_fertiIrrigation_GraphiqueApportsParVariete,
        tb_technique_traitementPhytosanitaire_CarteApplicationsPhytosanitaires: $scope.tb_technique_traitementPhytosanitaire_CarteApplicationsPhytosanitaires,
        tb_technique_monitoring_AlertesRavageurs: $scope.tb_technique_monitoring_AlertesRavageurs,
        tb_technique_monitoring_TableauInfestation: $scope.tb_technique_monitoring_TableauInfestation,
        tb_technique_monitoring_GraphiqueInfestation: $scope.tb_technique_monitoring_GraphiqueInfestation,
        tb_technique_qualite_TableauSuiviQualiteCulture: $scope.tb_technique_qualite_TableauSuiviQualiteCulture,
        tb_technique_qualite_TableauSuiviQualiteVariete: $scope.tb_technique_qualite_TableauSuiviQualiteVariete,
        tb_technique_qualite_GraphiqueSuiviQualiteParCulture: $scope.tb_technique_qualite_GraphiqueSuiviQualiteParCulture,
        tb_technique_qualite_GraphiqueSuiviQualiteParVariete: $scope.tb_technique_qualite_GraphiqueSuiviQualiteParVariete,
        tb_technique_qualite_TableauSuiviRendementParCulture: $scope.tb_technique_qualite_TableauSuiviRendementParCulture,
        tb_technique_qualite_TableauSuiviRendementParVariete: $scope.tb_technique_qualite_TableauSuiviRendementParVariete,
        tb_technique_qualite_GraphiqueSuiviRendementParCulture: $scope.tb_technique_qualite_GraphiqueSuiviRendementParCulture,
        tb_technique_qualite_GraphiqueSuiviRendementParVariete: $scope.tb_technique_qualite_GraphiqueSuiviRendementParVariete,
        tb_technique_telemetrieSaisies_TableauDernieresSaisiesParUtilisateur: $scope.tb_technique_telemetrieSaisies_TableauDernieresSaisiesParUtilisateur
      }).then(async e => {
        if (e.data[0].message == "ajout reussi") {
          //validate success
          toastr.clear();
          toastr.info(pc.objUser.Icreate ? await translatedwords.getTranslatedWord($translate("Ajout reussi")) : await translatedwords.getTranslatedWord($translate("Modification réussie")), {
            closeButton: true
          });
          $scope.close();
          NProgress.done();
        } else {
          $scope.progress = false;
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + e.data[0].description, {
            closeButton: true
          });
          NProgress.done();
        }
      }).catch(e => {
        $scope.progress = false;
        toastr.clear();
        toastr.error(e.data, {
          closeButton: true
        });
      });
    }



    $q.all([campagneagricole.getCampagneByDateNow(pc.obj), domaine.DomaineByID({
      "IDFermes": pc.IDferme
    }), ApportEau.getModeIrrigation({
      id_ferme: $cookies.getObject('globals').ferme.IDFerme
    })]).then(function(values) {
      pc.currentCampagneagricole = values[0].data;
      pc.MyDomaine = values[1].data;

      if (pc.MyDomaine.length > 0) {
        pc.obj.latitude = pc.MyDomaine[0].Latitude;
        pc.obj.longitude = pc.MyDomaine[0].Longitude;
      }


      //load campagne data to fitch
      if (pc.currentCampagneagricole.length > 0) {
        pc.obj.current_campagne = pc.currentCampagneagricole[0].Code;
        pc.obj.DateDebutCampagne = moment(pc.currentCampagneagricole[0].Date_debut).format('YYYYMMDD');
        pc.obj.DateFinCampagne = moment(pc.currentCampagneagricole[0].Date_Fin).format('YYYYMMDD');

        if (values[2].data.length > 0) {
          try {
            pc.mode_irrigation = values[2].data[0].mode_irrigation;
            pc.obj.mode_irrigation = pc.mode_irrigation;
            pc.mode_irrigation_ha = values[2].data[0].mode_irrigation_ha;
            pc.obj.mode_irrigation_ha = pc.mode_irrigation_ha;
          } catch (error) {
            pc.mode_irrigation = 1;
            pc.obj.mode_irrigation = 1;
          }
        } else {
          pc.mode_irrigation = 1;
          pc.obj.mode_irrigation = 1;
        }

        $q.all([tbTechnique.getCumulPluvimoetrique(pc.obj), tbTechnique.getTotalApportsEau(pc.obj), tbTechnique.getSuperficieProduction(pc.obj), tbTechnique.getSuperficiePhysique(pc.obj), tbTechnique.getOrdreFertilisationNRealise(pc.obj), tbTechnique.getOrdreTraitetmentPhytoNRealise(pc.obj), tbTechnique.getReseauIrrigation(pc.obj)]).then(function(values) {
          pc.getCumulPluvimoetrique = values[0].data;
          pc.getTotalApportsEau = values[1].data;
          pc.SuperficieProduction = values[2].data;
          pc.SuperficiePhysique = values[3].data;
          pc.getOrdreFertilisationNRealise = values[4].data;
          pc.OrdreTraitetmentPhytoNRealise = values[5].data;
          pc.ReseauIrrigation = values[6].data;
          NProgress.done();

          //CumulPluvimoetrique
          if (pc.getCumulPluvimoetrique.length > 0) {
            $scope.Cumulpluvimoetriques = pc.getCumulPluvimoetrique[0].sum_Pluvio;
          } else {
            $scope.Cumulpluvimoetriques = 0;
          }

          //TotalApportsEau
          if (pc.getTotalApportsEau.length > 0) {
            $scope.TotalApportsEaus = pc.getTotalApportsEau[0].Dose_realise;
          } else {
            $scope.TotalApportsEaus = 0;
          }

          //SuperficieProduction
          if (pc.SuperficieProduction.length > 0) {
            $scope.SuperficieProd = pc.SuperficieProduction[0].superficie;
          } else {
            $scope.SuperficieProd = 0;
          }

          //SuperficiePhysique
          if (pc.SuperficiePhysique.length > 0 || pc.SuperficiePhysique[0].sup_physique != 0) {
            $scope.SuperficiePhysique = ($scope.SuperficieProd * 100) / pc.SuperficiePhysique[0].sup_physique;
          } else {
            $scope.SuperficiePhysique = 0;
          }

          //OrdreFertilisationNRealise
          if (pc.getOrdreFertilisationNRealise.length > 0) {
            $scope.OrdreFertilisationNRealise = pc.getOrdreFertilisationNRealise[0].nbr_ordre;
          } else {
            $scope.OrdreFertilisationNRealise = 0;
          }

          //getOrdreTraitetmentPhytoNRealise
          if (pc.OrdreTraitetmentPhytoNRealise.length > 0) {
            $scope.OrdreTraitetmentPhytoNRealis = pc.OrdreTraitetmentPhytoNRealise[0].nbr_order;
          } else {
            $scope.OrdreTraitetmentPhytoNRealis = 0;
          }

          //getReseauIrrigation
          if (pc.ReseauIrrigation.length > 0) {
            $scope.ReseauIrrigation = pc.ReseauIrrigation[0].nbr;
          } else {
            $scope.ReseauIrrigation = 0;
          }

        });
      } else {
        NProgress.done();
      }



    });

  });