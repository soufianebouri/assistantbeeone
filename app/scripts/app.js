"use strict";

/**
 * @ngdoc overview
 * @name beeOneWebFrontApp
 * @description
 * # beeOneWebFrontApp
 *
 * Main module of the application.
 */

var version = '1.0.0'; /*global-version.new-views.improvements*/

//enDev DEMO
//var url = "http://127.0.0.1:4002/erpassistant/api";
var url = "http://agridata2.hopto.org:4002/erpassistant/api"
var appFor = "production";


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
    /*"ngTouch",*/
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
    $sceProvider,
    toastrConfig,
    $translateSanitizationProvider,
  ) {

    /*$provide.decorator('$exceptionHandler', ['$delegate', function($delegate) {
      return function(exception, cause) {
        if (!exception.message.includes('Bad Request')) { // Filter out specific errors
          $delegate(exception, cause);
        }
      };
    }]);*/

    $translateSanitizationProvider.useStrategy('sanitizeParameters');
    angular.extend(toastrConfig, {
      allowHtml: true,
      closeButton: true,
      newestOnTop: true,
      progressBar: true,
      positionClass: 'toast-bottom-left', // Change position here
      preventDuplicates: false,
      timeOut: 5000
    });

    $cookiesProvider.defaults = {
      samesite: 'None',
      secure: true
    };

    //trusted url
    $sceDelegateProvider.resourceUrlWhitelist([
      "self",
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
    $locationProvider.html5Mode(false).hashPrefix('');
    $stateProvider
    .state('v_sousparcelle_parcelleculturale', {
      url: '/configuration/v_sousparcelle_parcelleculturale',
      templateUrl: 'views/configuration/secteurs_irrigation/v_sousparcelle_parcelleculturale.html',
      data: {
        pageTitle: "BeeOne Assistant - Sécteurs D’irrigation"
      }
    })
    .state('v_sousparcelle', {
      url: '/configuration/v_sousparcelle',
      templateUrl: 'views/configuration/secteurs_irrigation/v_sousparcelle.html',
      data: {
        pageTitle: "BeeOne Assistant - Sécteurs D’irrigation"
      }
    })
    .state('v_bloc', {
      url: '/configuration/v_bloc',
      templateUrl: 'views/configuration/secteurs_irrigation/v_bloc.html',
      data: {
        pageTitle: "BeeOne Assistant - Sécteurs D’irrigation"
      }
    })
    .state('v_operation', {
      url: '/configuration/v_operation',
      templateUrl: 'views/configuration/referentiel/v_operation.html',
      data: {
        pageTitle: "BeeOne Assistant - Référenciel"
      }
    })
    .state('v_prime', {
      url: '/configuration/v_prime',
      templateUrl: 'views/configuration/referentiel/v_prime.html',
      data: {
        pageTitle: "BeeOne Assistant - Référenciel"
      }
    })
    .state('v_depot', {
      url: '/configuration/v_depot',
      templateUrl: 'views/configuration/referentiel/v_depot.html',
      data: {
        pageTitle: "BeeOne Assistant - Référenciel"
      }
    })
    .state('v_pesticide', {
      url: '/configuration/v_pesticide',
      templateUrl: 'views/configuration/referentiel/v_pesticide.html',
      data: {
        pageTitle: "BeeOne Assistant - Référenciel"
      }
    })
    .state('v_engrais', {
      url: '/configuration/v_engrais',
      templateUrl: 'views/configuration/referentiel/v_engrais.html',
      data: {
        pageTitle: "BeeOne Assistant - Référenciel"
      }
    })
    .state('v_calibre', {
      url: '/configuration/v_calibre',
      templateUrl: 'views/configuration/referentiel/v_calibre.html',
      data: {
        pageTitle: "BeeOne Assistant - Référenciel"
      }
    })
    .state('v_client', {
      url: '/configuration/v_client',
      templateUrl: 'views/configuration/referentiel/v_client.html',
      data: {
        pageTitle: "BeeOne Assistant - Référenciel"
      }
    })
    .state('v_profile_production', {
      url: '/configuration/v_profile_production',
      templateUrl: 'views/configuration/referentiel/v_profile_production.html',
      data: {
        pageTitle: "BeeOne Assistant - Référenciel"
      }
    })
    .state('v_fournisseur', {
      url: '/configuration/v_fournisseur',
      templateUrl: 'views/configuration/referentiel/v_fournisseur.html',
      data: {
        pageTitle: "BeeOne Assistant - Référenciel"
      }
    })
    .state('v_article', {
      url: '/configuration/v_article',
      templateUrl: 'views/configuration/referentiel/v_article.html',
      data: {
        pageTitle: "BeeOne Assistant - Référenciel"
      }
    })
    .state('v_produit_rendement', {
      url: '/configuration/v_produit_rendement',
      templateUrl: 'views/configuration/referentiel/v_produit_rendement.html',
      data: {
        pageTitle: "BeeOne Assistant - Référenciel"
      }
    })
    .state('v_secteur', {
      url: '/configuration/v_secteur',
      templateUrl: 'views/configuration/secteurs_irrigation/v_secteur.html',
      data: {
        pageTitle: "BeeOne Assistant - Sécteurs D’irrigation"
      }
    })
    .state('v_secteurs_irrigation', {
      url: '/configuration/secteurs_irrigation',
      templateUrl: 'views/configuration/secteurs_irrigation/v_secteurs_irrigation.html',
      data: {
        pageTitle: "BeeOne Assistant - Sécteurs D’irrigation"
      }
    })
    .state('v_unite', {
      url: '/configuration/v_unite',
      templateUrl: 'views/configuration/referentiel/v_unite.html',
      data: {
        pageTitle: "BeeOne Assistant - Référenciel"
      }
    })
    .state('v_variete', {
      url: '/configuration/v_variete',
      templateUrl: 'views/configuration/referentiel/v_variete.html',
      data: {
        pageTitle: "BeeOne Assistant - Référenciel"
      }
    })
    .state('v_culture', {
      url: '/configuration/v_culture',
      templateUrl: 'views/configuration/referentiel/v_culture.html',
      data: {
        pageTitle: "BeeOne Assistant - Référenciel"
      }
    })
    .state('v_attachement_parcelles_culturale', {
      url: '/configuration/v_attachement_parcelles_culturale',
      templateUrl: 'views/configuration/attachement_parcelles/v_attachement_parcelles_culturale.html',
      data: {
        pageTitle: "BeeOne Assistant - Attachement Parcelles"
      }
    })
    .state('v_attachement_parcelles_phisique', {
      url: '/configuration/v_attachement_parcelles_phisique',
      templateUrl: 'views/configuration/attachement_parcelles/v_attachement_parcelles_phisique.html',
      data: {
        pageTitle: "BeeOne Assistant - Attachement Parcelles"
      }
    })
    .state('v_attachement_parcelles', {
      url: '/configuration/attachement_parcelles',
      templateUrl: 'views/configuration/attachement_parcelles/v_attachement_parcelles.html',
      data: {
        pageTitle: "BeeOne Assistant - Attachement Parcelles"
      }
    })
    .state('v_famille_culture', {
      url: '/configuration/referentiel/campagnes_agricoles',
      templateUrl: 'views/configuration/referentiel/v_famille_culture.html',
      data: {
        pageTitle: "BeeOne Assistant - Référenciel"
      }
    })
    .state('v_campagnes_agricoles', {
      url: '/configuration/accounts/campagnes_agricoles',
      templateUrl: 'views/configuration/comptes/v_campagnes_agricoles.html',
      data: {
        pageTitle: "BeeOne Assistant - Campagnes Agricoles"
      }
    })
    .state('v_referentiel', {
      url: '/configuration/referentiel',
      templateUrl: 'views/configuration/referentiel/v_referentiel.html',
      data: {
        pageTitle: "BeeOne Assistant - Référentiel"
      }
    })
    .state('v_ferme', {
      url: '/configuration/accounts/ferme',
      templateUrl: 'views/configuration/comptes/v_ferme.html',
      data: {
        pageTitle: "BeeOne Assistant - Configuration Du Compte"
      }
    })
    .state('v_societe', {
      url: '/configuration/accounts/societe',
      templateUrl: 'views/configuration/comptes/v_societe.html',
      data: {
        pageTitle: "BeeOne Assistant - Configuration Du Compte"
      }
    })
    .state('v_comptes', {
      url: '/configuration/accounts',
      templateUrl: 'views/configuration/comptes/v_comptes.html',
      data: {
        pageTitle: "BeeOne Assistant - Configuration Du Compte"
      }
    })
    .state('main_configuration', {
      url: '/configuration/main',
      templateUrl: 'views/configuration/main_configuration.html',
      data: {
        pageTitle: "BeeOne Assistant - Configuration BeeOne"
      }
    })
    .state('onboarding', {
      url: '/',
      templateUrl: 'views/onboarding/onboarding_steps.html',
      data: {
        pageTitle: "BeeOne Assistant - Onboarding"
      }
    })
      .state("login", {
        url: "/login",
        templateUrl: "views/login.html",
        data: {
          pageTitle: "BeeOne Assistant",
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
      $rootScope.beeoneAssistant = $cookies.getObject("beeoneAssistant") || {};

      // Set the authorization header if the token exists
      if ($rootScope.beeoneAssistant.assistUser && $rootScope.beeoneAssistant.assistUser.token) {
        $http.defaults.headers.common["Authorization"] = $rootScope.beeoneAssistant.assistUser.token;
      }

      // Watch for changes in the token
      $rootScope.$watch('beeoneAssistant.assistUser.token', function(newToken) {
        if (newToken) {
          $http.defaults.headers.common["Authorization"] = newToken;
        }
      });

      // Optionally, handle redirection here if needed
      if (!$rootScope.beeoneAssistant.assistUser) {
        $location.path("/login"); // Redirect if no user is logged in
      } else {


        let onbording_passed = $rootScope.beeoneAssistant.assistUser.onbording_passed
        if(onbording_passed){
          $location.path("/configuration/main");
        }else {
          $location.path("/");
        }
      }


      //for data-rocks warning issues when changing routes before component loaded
      alert = function() {};
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;

      $rootScope.$on("$locationChangeStart", function(event, next, current) {
        var restrictedPage = $.inArray($location.path(), ["/login"]) === -1;
        var usr = $rootScope.beeoneAssistant.assistUser;
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
