"use strict";

/**
 * @ngdoc overview
 * @name beeOneWebFrontApp
 * @description
 * # beeOneWebFrontApp
 *
 * Main module of the application.
 */

var version = '1.56.1'; /*global-version.new-views.improvements*/

//enDev DEMO
var url = "http://agridata2.hopto.org:9010/agridata-lga-backend/api";
var appFor = "demo";


$(function() {
  $('[data-toggle="tooltip"]').tooltip();
});

angular
  .module("beeOneWebFrontApp", [
    "ngMaterial",
    "ngMessages",
    "ui.router",
    "ngAnimate",
    "ngCookies",
    "ngResource",
    "ngRoute",
    "ngSanitize",
    "ngTouch",
    "ngFileUpload",
    "datatables",
    "datatables.buttons",
    "toastr",
    "base64",
    "ui.bootstrap",
    "datatables.scroller",
    "angular-uuid",
    "angularMoment",
    "ui.router.state.events",
    "pascalprecht.translate",
    "lfNgMdFileInput",
    "mdColorPicker",
    "tooltips"
  ])
  .config(function(
    $stateProvider,
    $urlRouterProvider,
    $locationProvider,
    $translateProvider,
    $mdThemingProvider,
    $sceDelegateProvider,
    $mdDateLocaleProvider,
    $provide,
    $mdAriaProvider,
    $cookiesProvider,
    $sceProvider
  ) {

    $cookiesProvider.defaults = {
      samesite: 'None',
      secure: true
    };

    //trusted url
    $sceDelegateProvider.resourceUrlWhitelist([
      // Allow same origin resource loads.
      "self",
      // Allow loading from our assets domain. **.
      //'https://api.openweathermap.org/**'
      "https://www.yr.no/**",
      "https://api.weatherbit.io/**",
      "https://apitreegen.herokuapp.com/**",
      "http://51.75.243.146/**",
      url,
    ]);
    // Globally disables all ARIA warnings.
    $mdAriaProvider.disableWarnings();

    $mdDateLocaleProvider.formatDate = function(date) {
      if (date) return moment(date).format("YYYY-MM-DD");
      return "";
    };

    $provide.decorator('$state', function($delegate, $stateParams) {
      $delegate.forceReload = function(state, local) {
        return $delegate.go(state, $stateParams, {
          reload: true,
          inherit: false,
          notify: true
        });
      };
      return $delegate;
    });

    $mdThemingProvider.theme("dark-grey").backgroundPalette("grey").dark();
    $mdThemingProvider.theme("dark-orange").backgroundPalette("orange").dark();
    $mdThemingProvider
      .theme("dark-purple")
      .backgroundPalette("deep-purple")
      .dark();
    $mdThemingProvider.theme("dark-blue").backgroundPalette("blue").dark();
    $mdThemingProvider.theme("altTheme").primaryPalette("purple");
    //translation settings
    $translateProvider.addInterpolation("$translateMessageFormatInterpolation");
    $translateProvider.useLoader("$translatePartialLoader", {
      urlTemplate: "/scripts/i18n/{part}/{lang}.json",
    });
    $urlRouterProvider.otherwise("/");
    $locationProvider.hashPrefix("");
    $stateProvider

    .state('v_comptes', {
      url: '/configuration/accounts',
      templateUrl: 'views/configuration/comptes/v_comptes.html',
      data: {
        pageTitle: "BeeOne ERP - Configuration Du Compte"
      }
    })

    .state('main_configuration', {
      url: '/configuration/main',
      templateUrl: 'views/configuration/main_configuration.html',
      data: {
        pageTitle: "BeeOne ERP - Configuration BeeOne"
      }
    })
    .state('onboarding', {
      url: '/',
      templateUrl: 'views/onboarding/onboarding_steps.html',
      data: {
        pageTitle: "BeeOne ERP - Onboarding"
      }
    })
        .state('ajustement_des_calibres', {
          url: '/recolte/ajustement_des_calibres',
          templateUrl: 'views/recolte/ajustement_des_calibres.html',
          data: {
            pageTitle: "Ajustement des calibres"
          }
        })
      .state('profile_calibre_data_integration', {
        url: '/recolte/profile_calibre_data_integration',
        templateUrl: 'views/recolte/profile_calibre_data_integration.html',
        data: {
          pageTitle: "Intégration des Données de Profil Calibre"
        }
      })
      .state('etatdesynthesescroring', {
        url: '/recolte/etatdesynthesescroring',
        templateUrl: 'views/recolte/etatdesynthesescroring.html',
        data: {
          pageTitle: "Scoring"
        }
      })
      .state('classifications', {
        url: '/classifications',
        templateUrl: 'views/repository/classifications.html',
        data: {
          pageTitle: "Paramétrage classifications"
        }
      })
      .state('baremes', {
        url: '/baremes',
        templateUrl: 'views/repository/baremes.html',
        data: {
          pageTitle: "Paramétrage barèmes"
        }
      })
      .state('scoring', {
        url: '/recolte/scoring',
        templateUrl: 'views/recolte/scoring.html',
        data: {
          pageTitle: "Scoring"
        }
      })
      .state('controlephec_chart', {
        url: '/nutrition/controlephec_chart',
        templateUrl: 'views/nutrition/controlephec_chart.html',
        data: {
          pageTitle: "Vue graphique"
        }
      })
      .state('suiviinterventionsequipements_synthese', {
        url: '/suiviinterventionsequipements_synthese',
        templateUrl: 'views/ressourceshydriques/suiviinterventionsequipements_synthese.html',
        data: {
          pageTitle: "Vue synthétique"
        }
      })
      .state('recoltearbre_check_dulication', {
        url: '/recoltearbre_check_duplication',
        templateUrl: 'views/palmierdattier/recoltearbre_check_dulication.html',
        data: {
          pageTitle: "Détecteur de duplication"
        }
      })
      .state('suiviqualite', {
        url: '/suiviqualite',
        templateUrl: 'views/grandescultures/suiviqualite.html',
        data: {
          pageTitle: "Suivi qualité"
        }
      })
      .state('etatdesyntheseprofilcalibreprojection', {
        url: '/etatdesyntheseprofilcalibreprojection',
        templateUrl: 'views/palmierdattier/etatdesyntheseprofilcalibreprojection.html',
        data: {
          pageTitle: "Etat de synthèse Profil Calibre après projection"
        }
      })
      .state('etat_preconisation_ordre_taille', {
        url: '/etat_preconisation_ordre_taille',
        templateUrl: 'views/operationscles/etat_preconisation_ordre_taille.html',
        data: {
          pageTitle: "Etat de synthèse Préconisation/Ordre de la Taille"
        }
      })
      .state("etat_nombre_arbre", {
        url: "/palmierdattier/etat_nombre_arbre",
        templateUrl: "views/palmierdattier/etat_nombre_arbre.html",
        data: {
          pageTitle: "Etat nombre d'arbre",
        },
      })
      .state('element_liste', {
        url: '/element_liste',
        templateUrl: 'views/repository/element_liste.html',
        data: {
          pageTitle: "Lsite des éléments"
        }
      })
      .state('elements', {
        url: '/elements',
        templateUrl: 'views/repository/elements.html',
        data: {
          pageTitle: "Éléments"
        }
      })
      .state('ordredetaille', {
        url: '/ordredetaille',
        templateUrl: 'views/operationscles/ordredetaille.html',
        data: {
          pageTitle: "Ordre de taille"
        }
      })
      .state('composantes_rendement', {
        url: '/composantes_rendement',
        templateUrl: 'views/grandescultures/composantes_rendement.html',
        data: {
          pageTitle: "Composantes des rendement"
        }
      })
      .state('suividesstadesgc', {
        url: '/suividesstadesgc',
        templateUrl: 'views/grandescultures/suividesstadesgc.html',
        data: {
          pageTitle: "Suivi des stades GC"
        }
      })
      .state('analysequalitativesimplifiedchart', {
        url: '/analysequalitativesimplifiedchart',
        templateUrl: 'views/recolte/analysequalitativesimplifiedchart.html',
        data: {
          pageTitle: "Vue graphique"
        }
      })
      .state('analyseQualitativesimplified', {
        url: '/analyseQualitativesimplified',
        templateUrl: 'views/recolte/analysequalitativesimplified.html',
        data: {
          pageTitle: "analyse_qualitative"
        }
      })
      .state('expeditionpararbre', {
        url: '/expeditionpararbre',
        templateUrl: 'views/recolte/expeditionpararbre.html',
        data: {
          pageTitle: "Expédition par arbre"
        }
      })
      .state('gestionterminaux', {
        url: '/gestionterminaux',
        templateUrl: 'views/repository/gestionterminaux.html',
        data: {
          pageTitle: "Gestion des terminaux"
        }
      })
      .state('suivirecolte_par_variete', {
        url: '/recolte/suivirecolte',
        templateUrl: 'views/recolte/suivirecolte.html',
        data: {
          pageTitle: "Suivi recolte par variété"
        }
      })
      .state('Suivi_de_la_chute_par_rameau', {
        url: '/suivi_de_la_chute_par_rameaux',
        templateUrl: 'views/chute_physiologique/suivi_de_la_chute_par_rameaux.html',
        data: {
          pageTitle: "Suivi_de_la_chute_par_rameau"
        }
      })

      .state('suivi_de_la_chute_par_rameaux_etat', {
        url: '/suivi_de_la_chute_par_rameaux_etat',
        templateUrl: 'views/chute_physiologique/suivi_de_la_chute_par_rameaux_etat.html',
        data: {
          pageTitle: "suivi_de_la_chute_par_rameaux_etat"
        }
      })
      .state('suivi_de_la_chute_par_fruits_etat', {
        url: '/suivi_de_la_chute_par_fruits_etat',
        templateUrl: 'views/chute_physiologique/suivi_de_la_chute_par_fruits_etat.html',
        data: {
          pageTitle: "Vue synthétique"
        }
      })
      .state('suivi_de_la_chute_par_fruits_etat_graph', {
        url: '/suivi_de_la_chute_par_fruits_graph',
        templateUrl: 'views/chute_physiologique/suivi_de_la_chute_par_fruits_etat_graph.html',
        data: {
          pageTitle: "Vue graphique"
        }
      })
      .state('Suivi_de_la_chute_par_fruits', {
        url: '/suivi_de_la_chute_par_fruits',
        templateUrl: 'views/chute_physiologique/suivi_de_la_chute_par_fruits.html',
        data: {
          pageTitle: "Suivi_de_la_chute_par_fruits"
        }
      })
      .state('bilan_technique', {
        url: '/bilan_technique',
        templateUrl: 'views/bilan/bilan_technique.html',
        data: {
          pageTitle: "Bilan technique"
        }
      })
      .state('refarbregeneratetree', {
        url: '/refarbregeneratetree',
        templateUrl: 'views/repository/refarbregeneratetree.html',
        data: {
          pageTitle: "Auto generate trees"
        }
      })
      .state('declarationrecolte', {
        url: '/declarationrecolte',
        templateUrl: 'views/recolte/declarationrecolte.html',
        data: {
          pageTitle: "Déclaration de la récolte"
        }
      })
      .state('suiviniveaupiezometriquemap', {
        url: '/suiviniveaupiezometriquemap',
        templateUrl: 'views/ressourceshydriques/suiviniveaupiezometriquemap.html',
        data: {
          pageTitle: "Vue cartographique"
        }
      })
      .state('suiviressourceshydriquesmap', {
        url: '/suiviressourceshydriquesmap',
        templateUrl: 'views/ressourceshydriques/suiviressourceshydriquesmap.html',
        data: {
          pageTitle: "Vue cartographique"
        }
      })
      .state('recoltearbregraphique', {
        url: '/recoltearbregraphique',
        templateUrl: 'views/palmierdattier/recoltearbregraphique.html',
        data: {
          pageTitle: "Vue graphique"
        }
      })
      .state('suiviinterventionsequipements', {
        url: '/suiviinterventionsequipements',
        templateUrl: 'views/ressourceshydriques/suiviinterventionsequipements.html',
        data: {
          pageTitle: "Suivi des interventions & équipements"
        }
      })
      .state('suiviniveaupiezometrique', {
        url: '/suiviniveaupiezometrique',
        templateUrl: 'views/ressourceshydriques/suiviniveaupiezometrique.html',
        data: {
          pageTitle: "Suivi du niveau piézométrique"
        }
      })
      .state('etatcomptagepararbre', {
        url: '/etatcomptagepararbre',
        templateUrl: 'views/palmierdattier/etatcomptagepararbre.html',
        data: {
          pageTitle: "Etat comptage par arbre"
        }
      })
      .state('SuiviressourceshydriquesEtat', {
        url: '/SuiviressourceshydriquesEtat',
        templateUrl: 'views/ressourceshydriques/SuiviressourceshydriquesEtat.html',
        data: {
          pageTitle: "Vue synthétique"
        }
      })
      .state('Suiviressourceshydriques', {
        url: '/Suiviressourceshydriques',
        templateUrl: 'views/ressourceshydriques/Suiviressourceshydriques.html',
        data: {
          pageTitle: "Suivi des ressources hydriques"
        }
      })
      .state('ressources_hydriques', {
        url: '/ressources_hydriques',
        templateUrl: 'views/repository/ressources_hydriques.html',
        data: {
          pageTitle: "Ressources hydriques"
        }
      })
      .state('etatdesyntheseprofilcalibre', {
        url: '/etatdesyntheseprofilcalibre',
        templateUrl: 'views/palmierdattier/etatdesyntheseprofilcalibre.html',
        data: {
          pageTitle: "Etat de synthèse Profil Calibre"
        }
      })
      .state('tbmanager', {
        url: '/tbmanager',
        templateUrl: 'views/manager/tbmanager.html',
        data: {
          pageTitle: "tbmanager"
        }
      })
      .state('extractiondepollen', {
        url: '/operationscles/extractiondepollen',
        templateUrl: 'views/operationscles/extractiondepollen.html',
        data: {
          pageTitle: "Extraction de pollen"
        }
      })
      .state('eclaircissagedesregimesordre', {
        url: '/operationscles/eclaircissagedesregimesordre',
        templateUrl: 'views/operationscles/eclaircissagedesregimesordre.html',
        data: {
          pageTitle: "Ordre d'éclaircicage"
        }
      })
      .state('refarbreqrcode', {
        url: '/refarbreqrcode',
        templateUrl: 'views/repository/refarbreqrcode.html',
        data: {
          pageTitle: "QR CODE",
        },
      })
      .state("tb_organisationparcelisation", {
        url: "/tb_organisationparcelisation",
        templateUrl: "views/tableaudebord/tb_organisationparcelisation.html",
        data: {
          pageTitle: "tb_organisationparcelisation",
        },
      })
      .state("vente", {
        url: "/vente",
        templateUrl: "views/rendement/vente.html",
        data: {
          pageTitle: "Vente",
        },
      })
      .state("visites", {
        url: "/visites",
        templateUrl: "views/santeplante/visites.html",
        data: {
          pageTitle: "Etat de visite",
        },
      })
      .state("etatdesyntheseagreage", {
        url: "/etatdesyntheseagreage",
        templateUrl: "views/recolte/etatdesyntheseagreage.html",
        data: {
          pageTitle: "Etat de synthèse Agréage",
        },
      })
      .state("agreagefruitOld", {
        url: "/agreagefruitancienneversion",
        templateUrl: "views/recolte/agreagefruitOld.html",
        data: {
          pageTitle: "Agréage des fruits ancienne version",
        },
      })
      .state("famille_cible", {
        url: "/famille_cible",
        templateUrl: "views/repository/famille_cible.html",
        data: {
          pageTitle: "Famille cible",
        },
      })
      .state("refarbremap", {
        url: "/refarbremap",
        templateUrl: "views/repository/refarbremap.html",
        data: {
          pageTitle: "Vue cartographique des arbres",
        },
      })
      .state("analysequalitativesynthese", {
        url: "/analysequalitativesynthese",
        templateUrl: "views/recolte/analysequalitativesynthese.html",
        data: {
          pageTitle: "Synthèse d'analyses de maturité des fruits",
        },
      })
      .state("analysequalitativefeuilles", {
        url: "/analysequalitativefeuilles",
        templateUrl: "views/recolte/analysequalitativefeuilles.html",
        data: {
          pageTitle: "Mesure de brix des feuilles",
        },
      })
      .state("fermetePeau", {
        url: "/fermetepeau",
        templateUrl: "views/repository/fermetepeau.html",
        data: {
          pageTitle: "Fermeté peau",
        },
      })
      .state("fermeteFruit", {
        url: "/fermetefruit",
        templateUrl: "views/repository/fermete.html",
        data: {
          pageTitle: "Fermeté fruit",
        },
      })
      .state("operationdesemis", {
        url: "/operationdesemis",
        templateUrl: "views/operationscles/operationdesemis.html",
        data: {
          pageTitle: "Opération de semis",
        },
      })
      .state("programmefertilisation", {
        url: "/programmefertilisation",
        templateUrl: "views/nutrition/programmefertilisation.html",
        data: {
          pageTitle: "Programme de fertilisation",
        },
      })
      .state("solutionmere", {
        url: "/solutionmere",
        templateUrl: "views/nutrition/solutionmere.html",
        data: {
          pageTitle: "Solution mère",
        },
      })
      .state("tb_technique_rendement", {
        url: "/tb_technique_rendement",
        templateUrl: "views/tableaudebord/technique_tabs/tb_technique_rendement.html",
        data: {
          pageTitle: "Dashboard techniquel",
        },
      })
      .state("parametretechnique", {
        url: "/parametretechnique",
        templateUrl: "views/repository/parametretechnique.html",
        data: {
          pageTitle: "Paramètrage technique",
        },
      })
      .state("groupe", {
        url: "/profil",
        templateUrl: "views/profil/groupe.html",
        data: {
          pageTitle: "Profil",
        },
      })
      .state("produitgenerale", {
        url: "/produitgenerale",
        templateUrl: "views/repository/produitgenerale.html",
        data: {
          pageTitle: "Produit",
        },
      })
      .state("produit", {
        url: "/produit",
        templateUrl: "views/repository/produit.html",
        data: {
          pageTitle: "Détails produit",
        },
      })
      .state("familleoperations", {
        url: "/familleoperations",
        templateUrl: "views/repository/familleoperations.html",
        data: {
          pageTitle: "Famille d'opérations",
        },
      })
      .state("uniteoperation", {
        url: "/uniteoperation",
        templateUrl: "views/repository/uniteoperation.html",
        data: {
          pageTitle: "Unité d'opérations",
        },
      })
      .state("generation", {
        url: "/generation",
        templateUrl: "views/repository/generation.html",
        data: {
          pageTitle: "Génération",
        },
      })
      .state("secteur_irrigation", {
        url: "/secteurirrigation",
        templateUrl: "views/repository/secteurirrigation.html",
        data: {
          pageTitle: "Secteurs d'irrigation",
        },
      })
      .state("familleculture", {
        url: "/familleculture",
        templateUrl: "views/repository/familleculture.html",
        data: {
          pageTitle: "Famille de culture",
        },
      })
      .state("categoriearticle", {
        url: "/categoriearticle",
        templateUrl: "views/repository/categoriepesticide.html",
        data: {
          pageTitle: "Catégorie des articles",
        },
      })
      .state("tb_technique_personnalisez", {
        url: "/tb_technique_personnalisez",
        templateUrl: "views/tableaudebord/technique_tabs/tb_technique_personnalisez.html",
        data: {
          pageTitle: "Dashboard techniquel",
        },
      })
      .state("tb_technique_telemetriesaisie", {
        url: "/tb_technique_telemetriesaisie",
        templateUrl: "views/tableaudebord/technique_tabs/tb_technique_telemetriesaisie.html",
        data: {
          pageTitle: "Dashboard techniquel",
        },
      })
      .state("tb_technique_qualite", {
        url: "/tb_technique_qualite",
        templateUrl: "views/tableaudebord/technique_tabs/tb_technique_qualite.html",
        data: {
          pageTitle: "Dashboard techniquel",
        },
      })
      .state("tb_technique_monitoring", {
        url: "/tb_technique_monitoring",
        templateUrl: "views/tableaudebord/technique_tabs/tb_technique_monitoring.html",
        data: {
          pageTitle: "Dashboard techniquel",
        },
      })
      .state("tb_technique_traitementphytosanitaire", {
        url: "/tb_technique_traitementphytosanitaire",
        templateUrl: "views/tableaudebord/technique_tabs/tb_technique_traitementphytosanitaire.html",
        data: {
          pageTitle: "Dashboard techniquel",
        },
      })
      .state("tb_technique_fertiirrigation", {
        url: "/tb_technique_fertiirrigation",
        templateUrl: "views/tableaudebord/technique_tabs/tb_technique_fertiirrigation.html",
        data: {
          pageTitle: "Dashboard techniquel",
        },
      })
      .state("tb_technique_metio", {
        url: "/tb_technique_metio",
        templateUrl: "views/tableaudebord/technique_tabs/tb_technique_metio.html",
        data: {
          pageTitle: "Dashboard techniquel",
        },
      })
      .state("groupeoperationnel", {
        url: "/groupeoperationnel",
        templateUrl: "views/repository/groupeoperationnel.html",
        data: {
          pageTitle: "Groupe opérationnel",
        },
      })
      .state("parcelleculturalgroupeoperationnel", {
        url: "/groupeparcellecultural",
        templateUrl: "views/repository/parcelleculturalgroupeoperationnel.html",
        data: {
          pageTitle: "Groupe / Parcelle culturale",
        },
      })
      .state("stadehenologiquesdiagrammegantt", {
        url: "/stadehenologiques/calendrierdesstades",
        templateUrl: "views/plantation/stadehenologiquesdiagrammegantt.html",
        data: {
          pageTitle: "Calendrier des stades",
        },
      })
      .state("syntheseouvertureparparcelle", {
        url: "/syntheseouvertureparparcelle",
        templateUrl: "views/plantation/syntheseouvertureparparcelle.html",
        data: {
          pageTitle: "Synthèse de pourcentage d'ouverture par parcelle",
        },
      })
      .state("cible", {
        url: "/cible",
        templateUrl: "views/repository/cible.html",
        data: {
          pageTitle: "Référentiel des cibles",
        },
      })
      .state("businessunit", {
        url: "/businessunit",
        templateUrl: "views/repository/businessunit.html",
        data: {
          pageTitle: "Référentiel Business Unit ",
        },
      })
      .state("codetrancheage", {
        url: "/codetrancheage",
        templateUrl: "views/repository/codetrancheage.html",
        data: {
          pageTitle: "Référentiel des codes tranches",
        },
      })
      .state("expeditionssynthese", {
        url: "/recolte/expeditionssynthese",
        templateUrl: "views/recolte/expeditionssynthese.html",
        data: {
          pageTitle: "Fiche de suivi des quantités récoltés",
        },
      })
      .state("graphgrossissementsuividecalibre", {
        url: "/palmierdattier/graphgrossissementsuividecalibre",
        templateUrl: "views/palmierdattier/graphgrossissementsuividecalibre.html",
        data: {
          pageTitle: "Vue graphique",
        },
      })
      .state("fichedesuiviprofilcalibre", {
        url: "/fichedesuiviprofilcalibre",
        templateUrl: "views/palmierdattier/fichedesuiviprofilcalibre.html",
        data: {
          pageTitle: "Fiche de suivi de profil calibre",
        },
      })
      .state("tb_covid19", {
        url: "/dashboard_covid19",
        templateUrl: "views/covid19/tb_covid19.html",
        data: {
          pageTitle: "Dashboard",
        },
      })
      .state("controlephec", {
        url: "/nutrition/controlephec",
        templateUrl: "views/nutrition/controlephec.html",
        data: {
          pageTitle: "Contrôle pH, EC",
        },
      })
      .state("recoltearbremap", {
        url: "/palmierdattier/recoltearbremapp",
        templateUrl: "views/palmierdattier/recoltearbremap.html",
        data: {
          pageTitle: "Vue cartographique",
        },
      })
      .state("eclaircissagedesregimesmap", {
        url: "/operationscles/eclaircissagedesregimesmap",
        templateUrl: "views/operationscles/eclaircissagedesregimesmap.html",
        data: {
          pageTitle: "Vue cartographique",
        },
      })
      .state("comptagearbremap", {
        url: "/palmierdattier/comptagearbremap",
        templateUrl: "views/palmierdattier/comptagearbremap.html",
        data: {
          pageTitle: "Vue cartographique",
        },
      })
      .state("comptagearbresynthese", {
        url: "/palmierdattier/comptagearbresynthese",
        templateUrl: "views/palmierdattier/comptagearbresynthese.html",
        data: {
          pageTitle: "Vue synthétique",
        },
      })
      .state("recoltepollensynthese", {
        url: "/operationscles/recoltepollensynthese",
        templateUrl: "views/operationscles/recoltepollensynthese.html",
        data: {
          pageTitle: "Vue synthétique",
        },
      })
      .state("recoltepollenmap", {
        url: "/operationscles/recoltepollenmap",
        templateUrl: "views/operationscles/recoltepollenmap.html",
        data: {
          pageTitle: "Vue cartographique",
        },
      })
      .state("realisationtraitementphytosanitairemap", {
        url: "/santeplante/realisationtraitementphytosanitairemap",
        templateUrl: "views/santeplante/realisationtraitementphytosanitairemap.html",
        data: {
          pageTitle: "Vue cartographique",
        },
      })
      .state("comptagepiegeagefichedesurveillance", {
        url: "/santeplante/comptagepiegeagefichedesurveillance",
        templateUrl: "views/santeplante/comptagepiegeagefichedesurveillance.html",
        data: {
          pageTitle: "Fiche de surveillance des pièges ",
        },
      })
      .state("fichesdesuiviramassageetdestructiondesfruits", {
        url: "/santeplante/fichesdesuiviramassageetdestructiondesfruits",
        templateUrl: "views/santeplante/fichesdesuiviramassageetdestructiondesfruits.html",
        data: {
          pageTitle: "Fiches de ramassage et destruction des fruits",
        },
      })
      .state("fichesdesuividagreagedesfruits", {
        url: "/recolte/fichesdesuividagreagedesfruits",
        templateUrl: "views/recolte/fichesdesuividagreagedesfruits.html",
        data: {
          pageTitle: "Fiches de suivi d'agréage des fruits",
        },
      })
      .state("fichesdesuividepiquresurfruits", {
        url: "/santeplante/fichesdesuividepiquresurfruits",
        templateUrl: "views/santeplante/fichesdesuividepiquresurfruits.html",
        data: {
          pageTitle: "Fiches de suivi de piqûres sur fruits ",
        },
      })
      .state("fichesdesuividechangementpheromone", {
        url: "/santeplante/fichesdesuividechangementpheromone",
        templateUrl: "views/santeplante/fichesdesuividechangementpheromone.html",
        data: {
          pageTitle: "Fiches de suivi de changement pheromone ",
        },
      })
      .state("fichesdesuividetraitementsphytosanitaire", {
        url: "/santeplante/fichesdesuividetraitementsphytosanitaire",
        templateUrl: "views/santeplante/fichesdesuividetraitementsphytosanitaire.html",
        data: {
          pageTitle: "Fiches de suivi de traitements phytosanitaire ",
        },
      })
      .state("refstadephenologiques", {
        url: "/repository/refstadephenologiques",
        templateUrl: "views/repository/refstadephenologiques.html",
        data: {
          pageTitle: "Stades phénologiques",
        },
      })
      .state("gestiondessocietes", {
        url: "/societefermes/gestiondessocietes",
        templateUrl: "views/societefermes/gestiondessocietes.html",
        data: {
          pageTitle: "Gestion des sociétés",
        },
      })
      .state("gestiondesfermes", {
        url: "/societefermes/gestiondesfermes",
        templateUrl: "views/societefermes/gestiondesfermes.html",
        data: {
          pageTitle: "Gestion des fermes",
        },
      })
      .state("eclaircissagedesregimes", {
        url: "/operationscles/eclaircissagedesregimes",
        templateUrl: "views/operationscles/eclaircissagedesregimes.html",
        data: {
          pageTitle: "Eclaircissage des régimes",
        },
      })
      .state("recoltepollen", {
        url: "/operationscles/recoltepollen",
        templateUrl: "views/operationscles/recoltepollen.html",
        data: {
          pageTitle: "Récolte du pollen",
        },
      })
      .state("programmeapplicationpollen", {
        url: "/operationscles/programmeapplicationpollen",
        templateUrl: "views/operationscles/programmeapplicationpollen.html",
        data: {
          pageTitle: "Programme d'application du pollen ",
        },
      })
      .state("estimationsparparcelle", {
        url: "/estimationsparparcelle",
        templateUrl: "views/palmierdattier/estimationsparparcelle.html",
        data: {
          pageTitle: "Estimations par parcelle",
        },
      })
      .state("expeditions", {
        url: "/recolte/expeditions",
        templateUrl: "views/recolte/expeditions.html",
        data: {
          pageTitle: "Expéditions",
        },
      })
      .state("changementpheromone", {
        url: "/santeplante/changementpheromone",
        templateUrl: "views/santeplante/changementpheromone.html",
        data: {
          pageTitle: "Changement des phéromones",
        },
      })
      .state("grossissementsuividecalibre", {
        url: "/grossissementsuividecalibre",
        templateUrl: "views/palmierdattier/grossissementsuividecalibre.html",
        data: {
          pageTitle: "Suivi de grossissement",
        },
      })
      .state("piquressurfruits", {
        url: "/santeplante/piquressurfruits",
        templateUrl: "views/santeplante/piquressurfruits.html",
        data: {
          pageTitle: "Piqûres sur fruits",
        },
      })
      .state("comptagedesravageurmap", {
        url: "/santeplante/comptagedesravageurmap",
        templateUrl: "views/santeplante/comptagedesravageurmap.html",
        data: {
          pageTitle: "Vue cartographique",
        },
      })
      .state("bordereaucnss", {
        url: "/mainoeuvreetats/bordereaucnss",
        templateUrl: "views/mainoeuvreetats/bordereaucnss.html",
        data: {
          pageTitle: "Bordereau CNSS",
        },
      })
      .state("lesabsences", {
        url: "/mainoeuvreetats/lesabsences",
        templateUrl: "views/mainoeuvreetats/lesabsences.html",
        data: {
          pageTitle: "Les absences",
        },
      })
      .state("journaldepaie", {
        url: "/mainoeuvreetats/journaldepaie",
        templateUrl: "views/mainoeuvreetats/journaldepaie.html",
        data: {
          pageTitle: "Journal de paie",
        },
      })
      .state("atatdesvariables", {
        url: "/mainoeuvreetats/atatdesvariables",
        templateUrl: "views/mainoeuvreetats/atatdesvariables.html",
        data: {
          pageTitle: "Etat des variables",
        },
      })
      .state("coutparoperations", {
        url: "/mainoeuvreetats/coutparoperations",
        templateUrl: "views/mainoeuvreetats/coutparoperations.html",
        data: {
          pageTitle: "Coût par opérations",
        },
      })
      .state("multiperiodevariete", {
        url: "/previsionreporting/multiperiodevariete",
        templateUrl: "views/previsionreporting/multiperiodevariete.html",
        data: {
          pageTitle: "Analyse multi période/variété",
        },
      })
      .state("profilsfermes", {
        url: "/profil/profilsfermes",
        templateUrl: "views/profil/profilsfermes.html",
        data: {
          pageTitle: "Gestion des profils",
        },
      })
      .state("gestionprofils", {
        url: "/profil/gestionprofils",
        templateUrl: "views/profil/gestionprofils.html",
        data: {
          pageTitle: "Gestion des profils",
        },
      })
      .state("periodeestimation", {
        url: "/repository/periodeestimation",
        templateUrl: "views/repository/periodeestimation.html",
        data: {
          pageTitle: "Période d'estimation",
        },
      })
      .state("consultationparouvrier", {
        url: "/mainoeuvreetats/consultationparouvrier",
        templateUrl: "views/mainoeuvreetats/consultationparouvrier.html",
        data: {
          pageTitle: "Consultation par Ouviers",
        },
      })
      .state("matricepointage", {
        url: "/mainoeuvreetats/matricepointage",
        templateUrl: "views/mainoeuvreetats/matricepointage.html",
        data: {
          pageTitle: "Matrice de pointage",
        },
      })
      .state("comptagedesravageurssyntheseparculturesurveillance", {
        url: "/santeplante/comptagedesravageurssyntheseparculturesurveillance",
        templateUrl: "views/santeplante/comptagedesravageurs_syntheseparculturesurveillance.html",
        data: {
          pageTitle: "Comptage des ravageurs",
        },
      })
      .state("comptagedesravageurssynthesesurveillance", {
        url: "/santeplante/comptagedesravageurssynthesesurveillance",
        templateUrl: "views/santeplante/comptagedesravageurs_synthesesurveillance.html",
        data: {
          pageTitle: "Comptage des ravageurs",
        },
      })
      .state("comptagedesravageursfichedesurveillance", {
        url: "/santeplante/comptagedesravageursfichedesurveillance",
        templateUrl: "views/santeplante/comptagedesravageurs_fichedesurveillance.html",
        data: {
          pageTitle: "Comptage des ravageurs",
        },
      })
      .state("comptagedesravageurs", {
        url: "/santeplante/comptagedesravageurs",
        templateUrl: "views/santeplante/comptagedesravageurs.html",
        data: {
          pageTitle: "Comptage des ravageurs",
        },
      })
      .state("suivirecolte", {
        url: "/pointage/suivirecolte",
        templateUrl: "views/pointage/suivirecolte.html",
        data: {
          pageTitle: "Suivi recolte",
        },
      })
      .state("presence", {
        url: "/pointage/presence",
        templateUrl: "views/pointage/presence.html",
        data: {
          pageTitle: "Présence",
        },
      })
      .state("pointage", {
        url: "/pointage/pointage",
        templateUrl: "views/pointage/pointage.html",
        data: {
          pageTitle: "Pointage",
        },
      })
      .state("realisationtraitementphytosanitaire", {
        url: "/santeplante/realisationtraitementphytosanitaire",
        templateUrl: "views/santeplante/realisationtraitementphytosanitaire.html",
        data: {
          pageTitle: "Réalisation",
        },
      })
      .state("syntheseIntensiteFleurs", {
        url: "/synthese/intensiteFleurs",
        templateUrl: "views/synthese/plantation/intensitefleurs.html",
        data: {
          pageTitle: "synthese_intensite_fleurs",
        },
      })
      .state("ordretraitementphytosanitaire", {
        url: "/santeplante/ordretraitementphytosanitaire",
        templateUrl: "views/santeplante/ordretraitementphytosanitaire.html",
        data: {
          pageTitle: "ordre traitement phytosanitaire",
        },
      })
      .state("realisation", {
        url: "/nutrition/realisation",
        templateUrl: "views/nutrition/realisation.html",
        data: {
          pageTitle: "Réalisation",
        },
      })
      .state("ordrefertlisation", {
        url: "/nutrition/ordrefertlisation",
        templateUrl: "views/nutrition/ordrefertlisation.html",
        data: {
          pageTitle: "ordre fertlisation",
        },
      })
      .state("observationphyto", {
        url: "/santedelaplante/observationphyto",
        templateUrl: "views/santeplante/observationphyto.html",
        data: {
          pageTitle: "Observation phytosanitaire",
        },
      })
      .state("suivimeteo", {
        url: "/apporteneau/suivimeteo",
        templateUrl: "views/apporteau/suivimeteo.html",
        data: {
          pageTitle: "Suivi météo",
        },
      })
      .state("synthesePourcentageOuverture", {
        url: "/synthese/pourcentageOuverture",
        templateUrl: "views/synthese/plantation/pourcentageouverture.html",
        data: {
          pageTitle: "synthese_pourcentage_ouverture",
        },
      })
      .state("agreageFruit", {
        url: "/agreageFruit",
        templateUrl: "views/recolte/agreagefruit.html",
        data: {
          pageTitle: "agreage_fruit",
        },
      })
      .state("analyseQualitative", {
        url: "/analyseQualitative",
        templateUrl: "views/recolte/analysequalitative.html",
        data: {
          pageTitle: "analyse_qualitative",
        },
      })
      .state("comptagePiege", {
        url: "/comptagePiege",
        templateUrl: "views/santeplante/comptagepiege.html",
        data: {
          pageTitle: "comptage_piegeage",
        },
      })
      .state("aspectVegetal", {
        url: "/aspectvegetal",
        templateUrl: "views/nutrition/aspectvegetal.html",
        data: {
          pageTitle: "Aspect_vegetal",
        },
      })
      .state("ramassageDestruction", {
        url: "/ramassageDestruction",
        templateUrl: "views/santeplante/ramassagedestruction.html",
        data: {
          pageTitle: "Ramassage_destructions_fruits",
        },
      })
      .state("testConf", {
        url: "/testdeconformite",
        templateUrl: "views/apporteau/testconf.html",
        data: {
          pageTitle: "Test de conformité",
        },
      })
      .state("ComptagePiegeageMap", {
        url: "/ComptagePiegeageMap",
        templateUrl: "views/santeplante/comptagepiegeagemap.html",
        data: {
          pageTitle: "Vue cartographique",
        },
      })
      .state("apportEau", {
        url: "/apportEau",
        templateUrl: "views/apporteau/apporteau.html",
        data: {
          pageTitle: "apport_eau",
        },
      })
      .state("profilCalibre", {
        url: "/profilCalibre",
        templateUrl: "views/palmierdattier/profilcalibre.html",
        data: {
          pageTitle: "Profile_calibre",
        },
      })
      .state("recolteArbre", {
        url: "/recolteArbre",
        templateUrl: "views/palmierdattier/recoltearbre.html",
        data: {
          pageTitle: "Récolte par arbre",
        },
      })
      .state("evolutionCalibre", {
        url: "/evolutionCalibre",
        templateUrl: "views/palmierdattier/evolutioncalibre.html",
        data: {
          pageTitle: "evolution_calibre",
        },
      })
      .state("comptageArbre", {
        url: "/comptageArbre",
        templateUrl: "views/palmierdattier/comptagearbre.html",
        data: {
          pageTitle: "comptage_arbre",
        },
      })
      .state("intensiteFleurs", {
        url: "/intensiteFleurs",
        templateUrl: "views/plantation/intensitefleurs.html",
        data: {
          pageTitle: "suivi_intensite_fleurs",
        },
      })
      .state("pourcentageOuverture", {
        url: "/pourcentageOuverture",
        templateUrl: "views/plantation/pourcentageouverture.html",
        data: {
          pageTitle: "pourcentage_ouverture",
        },
      })
      .state("stadePheno", {
        url: "/stadePhenologiques",
        templateUrl: "views/repository/stadepheno.html",
        data: {
          pageTitle: "gestion_stades_phenologiques",
        },
      })
      .state("salaries", {
        url: "/salaries",
        templateUrl: "views/DossierPersonnel/salaries.html",
        data: {
          pageTitle: "salaries",
        },
      })
      .state("ouvriers", {
        url: "/ouvriers",
        templateUrl: "views/DossierPersonnel/ouvriers.html",
        data: {
          pageTitle: "ouvriers",
        },
      })
      .state("home", {
        url: "/home",
        templateUrl: "views/repository/home.html",
        data: {
          pageTitle: "home",
        },
      })
      .state("login", {
        url: "/login",
        templateUrl: "views/login.html",
        data: {
          pageTitle: "BEE ONE",
        },
      })
      .state("listOperation", {
        url: "/listOperation",
        templateUrl: "views/repository/listoperation.html",
        data: {
          pageTitle: "liste_operation",
        },
      })
      .state("listCulture", {
        url: "/listCulture",
        templateUrl: "views/repository/listculture.html",
        data: {
          pageTitle: "liste_culture",
        },
      })
      .state("variete", {
        url: "/variete",
        templateUrl: "views/repository/variete.html",
        data: {
          pageTitle: "variete",
        },
      })
      .state("typeVariete", {
        url: "/typeVariete",
        templateUrl: "views/repository/typevariete.html",
        data: {
          pageTitle: "type_variete",
        },
      })
      .state("elementsMineraux", {
        url: "/elementsMineraux",
        templateUrl: "views/repository/elementsmineraux.html",
        data: {
          pageTitle: "elements_mineraux",
        },
      })
      .state("intensiteStade", {
        url: "/intensiteStade",
        templateUrl: "views/repository/intensitestade.html",
        data: {
          pageTitle: "intensite_stade",
        },
      })
      .state("carence", {
        url: "/carence",
        templateUrl: "views/repository/carence.html",
        data: {
          pageTitle: "carence",
        },
      })
      .state("coloration", {
        url: "/coloration",
        templateUrl: "views/repository/coloration.html",
        data: {
          pageTitle: "Niveaux de coloration",
        },
      })
      .state("LieuElimination", {
        url: "/lieuelimination",
        templateUrl: "views/repository/lieuelimination.html",
        data: {
          pageTitle: "lieu_elimination",
        },
      })
      .state("ModeApplication", {
        url: "/modeapplication",
        templateUrl: "views/repository/modeapplication.html",
        data: {
          pageTitle: "mode_application",
        },
      })
      .state("NiveauAttaque", {
        url: "/niveauAttaque",
        templateUrl: "views/repository/niveauattaque.html",
        data: {
          pageTitle: "niveau_attaque",
        },
      })
      .state("NiveauConformite", {
        url: "/niveauconformite",
        templateUrl: "views/repository/niveauconformite.html",
        data: {
          pageTitle: "niveau_conformite",
        },
      })
      .state("RepartitionAttaque", {
        url: "/niveauxderisque",
        templateUrl: "views/repository/repartitionattaque.html",
        data: {
          pageTitle: "Niveaux de risque",
        },
      })
      .state("ValidationAutoObs", {
        url: "/validationautoobs",
        templateUrl: "views/repository/validationautoobs.html",
        data: {
          pageTitle: "validation_auto_obs",
        },
      })
      .state("Qualite_Stade", {
        url: "/qualite_stade",
        templateUrl: "views/repository/qualite_stade.html",
        data: {
          pageTitle: "qualite_stade",
        },
      })
      .state("gestionPays", {
        url: "/gestionpays",
        templateUrl: "views/repository/gestionpays.html",
        data: {
          pageTitle: "gestion_pays",
        },
      })
      .state("gestionRegion", {
        url: "/gestionregion",
        templateUrl: "views/repository/gestionregion.html",
        data: {
          pageTitle: "gestion_region",
        },
      })
      .state("Tranche_Age", {
        url: "/tranche_age",
        templateUrl: "views/repository/tranche_age.html",
        data: {
          pageTitle: "Référentiel des tranches d'âge",
        },
      })
      .state("RefArbre", {
        url: "/refarbre",
        templateUrl: "views/repository/refarbre.html",
        data: {
          pageTitle: "ref_arbre",
        },
      })
      .state("Piege", {
        url: "/piege",
        templateUrl: "views/repository/piege.html",
        data: {
          pageTitle: "piege",
        },
      })
      .state("Profil", {
        url: "/profil",
        templateUrl: "views/repository/profil.html",
        data: {
          pageTitle: "profil",
        },
      })
      .state("FermesProfil", {
        url: "/fermesprofil",
        templateUrl: "views/repository/fermesprofil.html",
        data: {
          pageTitle: "fermes_profil",
        },
      })
      .state("firstmain", {
        url: "/firstmain",
        templateUrl: "views/firstmain.html",
        controller: "FirstmainCtrl",
        controllerAs: "firstMain",
        data: {
          pageTitle: "main",
        },
      })
      .state("syntheseOrdreFertilisation", {
        url: "/syntheseOrdreFertilisation",
        templateUrl: "views/synthese/nutrition/fertilisation/ordrefertilisation.html",
        data: {
          pageTitle: "synthese_ordre_fertilisation",
        },
      })
      .state("realisationIrrigation", {
        url: "/realisationIrrigation",
        templateUrl: "views/synthese/apporteau/realisationirrigation.html",
        data: {
          pageTitle: "synthese_realisation_irrigation",
        },
      })
      .state("SyntheseApportEau", {
        url: "/SyntheseApportEau",
        templateUrl: "views/synthese/apporteau/synthese_apport_eau/apportseneau.html",
        data: {
          pageTitle: "Synthèse des apports en eau",
        },
      })
      .state("bilanConsomation", {
        url: "/bilanConsomation",
        templateUrl: "views/synthese/apporteau/synthese_apport_eau/bilanconsomation.html",
        data: {
          pageTitle: "Bilan des consommations",
        },
      })
      .state("previsionsPeriodique", {
        url: "/previsionsPeriodique",
        templateUrl: "views/recolte/previsionsperiodique.html",
        data: {
          pageTitle: "Prévisions périodiques",
        },
      })
      .state("previsionsAnnuelle", {
        url: "/previsionsAnnuelle",
        templateUrl: "views/recolte/previsionsannuelle.html",
        data: {
          pageTitle: "Prévisions annuelles",
        },
      })
      .state("previsionPeriodiqueGraphe", {
        url: "/previsionPeriodiqueGraphe",
        templateUrl: "views/recolte/previsionperiodiquegraphe.html",
        data: {
          pageTitle: "prevision_periodique_graphe",
        },
      })
      .state("previsiontoday", {
        url: "/previsiontoday",
        templateUrl: "views/recolte/previsiontoday.html",
        data: {
          pageTitle: "Previsions_today",
        },
      })
      .state("previsiondemain", {
        url: "/previsiondemain",
        templateUrl: "views/recolte/previsiondemain.html",
        data: {
          pageTitle: "prevision_tomorrow",
        },
      })
      .state("notif_manuel", {
        url: "/notif_manuel",
        templateUrl: "views/recolte/gestion_notification/notif_manuel.html",
        data: {
          pageTitle: "notif_manuel",
        },
      })
      .state("assolement_parcel_physique", {
        url: "/parcelle_physique",
        templateUrl: "views/assolement/parcel_physique.html",
        data: {
          pageTitle: "Parcelles physique",
        },
      })
      .state("assolement_cycle_cultural", {
        url: "/cycle_culturaux",
        templateUrl: "views/assolement/cycle_cultural.html",
        data: {
          pageTitle: "Cycle culturaux",
        },
      })
      .state("production_realisee", {
        url: "/production_realisee",
        templateUrl: "views/recolte/production_realisee.html",
        data: {
          pageTitle: "production_realisee",
        },
      })
      .state("assolement_parcel_culturale", {
        url: "/parcelle_culturale",
        templateUrl: "views/assolement/parcel_culturale.html",
        data: {
          pageTitle: "Parcelles culturale",
        },
      })
      .state("notif_auto", {
        url: "/notif_auto",
        templateUrl: "views/recolte/gestion_notification/notif_auto.html",
        data: {
          pageTitle: "Notifications automatisées ",
        },
      })
      .state("actualisation_demande", {
        url: "/actualisation_demande",
        templateUrl: "views/recolte/actualisation_demande.html",
        data: {
          pageTitle: "Actualisation à la demande",
        },
      })
      .state("tableau_bord_mainoeuvre", {
        url: "/dashboard_mainoeuvre",
        templateUrl: "views/mainoeuvreetats/tableau_bord.html",
        data: {
          pageTitle: "Dashboard",
        },
      })
      .state("TB_technique", {
        url: "/dashboard_technique",
        templateUrl: "views/tableaudebord/tb_technique.html",
        data: {
          pageTitle: "Dashboard",
        },
      })
      .state("TbRendement", {
        url: "/dashboard_rendement",
        templateUrl: "views/tableaudebord/tbrendement.html",
        data: {
          pageTitle: "Dashboard",
        },
      })
      .state("tableaudebord_prevision", {
        url: "/dashboard_prevision",
        templateUrl: "views/tableaudebord/prevision.html",
        data: {
          pageTitle: "Dashboard",
        },
      })
      .state("bilan_hydrique", {
        url: "/bilan_hydrique",
        templateUrl: "views/apporteau/bilan_hydrique.html",
        data: {
          pageTitle: "Bilan hydrique",
        },
      })
      .state("bilan_nutritionnel", {
        url: "/bilan_nutritionnel",
        templateUrl: "views/apporteau/bilan_nutritionnel.html",
        data: {
          pageTitle: "Bilan nutritionnel",
        },
      })
      .state("prevision_journaliere", {
        url: "/prevision_journaliere",
        templateUrl: "views/previsionreporting/prevision_journaliere.html",
        data: {
          pageTitle: "Prévision journalière",
        },
      })
      .state("reporting_assolement", {
        url: "/reporting_assolement",
        templateUrl: "views/previsionreporting/assolement.html",
        data: {
          pageTitle: "Assolement",
        },
      })
      .state("prevision_tabs_last_update_harvast", {
        url: "/prevision_tabs_last_update_harvast",
        templateUrl: "views/tableaudebord/prevision_tabs/last_update_harvast.html",
        data: {
          pageTitle: "Assolement",
        },
      })
      .state("prevision_tabs_harvast_detail", {
        url: "/prevision_tabs_harvast_detail",
        templateUrl: "views/tableaudebord/prevision_tabs/harvast_detail.html",
        data: {
          pageTitle: "Assolement",
        },
      })
      .state("prevision_tabs_realisation_detail", {
        url: "/prevision_tabs_realisation_detail",
        templateUrl: "views/tableaudebord/prevision_tabs/realisation_detail.html",
        data: {
          pageTitle: "Assolement",
        },
      })
      .state("prevision_tabs_prevu_realise_semaine", {
        url: "/prevision_tabs_prevu_realise_semaine",
        templateUrl: "views/tableaudebord/prevision_tabs/prevu_realise_semaine.html",
        data: {
          pageTitle: "Assolement",
        },
      })
      .state("prevision_tabs_avancement_semaine_encours", {
        url: "/avancement_semaine_encours",
        templateUrl: "views/tableaudebord/prevision_tabs/avancement_semaine_encours.html",
        data: {
          pageTitle: "Assolement",
        },
      })
      .state("tlemetrie_saisie", {
        url: "/tlemetrie_saisie",
        templateUrl: "views/tableaudebord/prevision_tabs/tlemetrie_saisie.html",
        data: {
          pageTitle: "Assolement",
        },
      })
      .state("qualite_prevision_hebdo", {
        url: "/qualite_prevision_hebdo",
        templateUrl: "views/tableaudebord/prevision_tabs/qualite_prevision_hebdo.html",
        data: {
          pageTitle: "Assolement",
        },
      })
      .state("suivi_hebdo_prevu_realise", {
        url: "/suivi_hebdo_prevu_realise",
        templateUrl: "views/previsionreporting/suivi_hebdo_prevu_realise.html",
        data: {
          pageTitle: "Assolement",
        },
      })
      .state("realisation_synthese", {
        url: "/realisation_synthese",
        templateUrl: "views/synthese/nutrition/fertilisation/realisation_synthese.html",
        data: {
          pageTitle: "Etats Ordres",
        },
      });
  })
  .run([
    "$http",
    "$rootScope",
    "$location",
    "$cookies",
    "$route",
    "$state",
    "$stateParams",

    function(
      $http,
      $rootScope,
      $location,
      $cookies,
      $route,
      $state,
      $stateParams
    ) {
      // Sends this header with any AJAX request
      $http.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
      // Send this header only in post requests. Specifies you are sending a JSON object
      $http.defaults.headers.post.dataType = "json";
      $http.defaults.headers.common.Accept = "application/json;odata=verbose";


      // keep user logged in after page refresh
      $rootScope.globals = $cookies.getObject("globals") || {};
      if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common["Authorization"] =
          "Basic " + $rootScope.globals.currentUser.authdata;
        $location.path("/");
      }
      //for data-rocks warning issues when changing routes before component loaded
      alert = function() {};
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;

      $rootScope.$on("$locationChangeStart", function(event, next, current) {
        var restrictedPage = $.inArray($location.path(), ["/login"]) === -1;
        var usr = $rootScope.globals.currentUser;
        if (restrictedPage && !usr) {
          $location.path("/login");
        } else if (next.includes("login") && usr) {
          event.preventDefault();
          return;
        }
      });
    },
  ])
  .constant("_url", url)
  .constant("_appFor", appFor)
  .constant("_version", version);