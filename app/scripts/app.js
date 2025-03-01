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
//var url = "http://127.0.0.1:4002/erpassistant/api";
var url = "http://agridata2.hopto.org:4002/erpassistant/api"
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
      $rootScope.globals = $cookies.getObject("globals") || {};

      // Set the authorization header if the token exists
      if ($rootScope.globals.currentUser && $rootScope.globals.currentUser.token) {
        $http.defaults.headers.common["Authorization"] = $rootScope.globals.currentUser.token;
      }

      // Watch for changes in the token
      $rootScope.$watch('globals.currentUser.token', function(newToken) {
        if (newToken) {
          $http.defaults.headers.common["Authorization"] = newToken;
        }
      });
  console.log("$rootScope.globals.currentUser.token", $rootScope.globals.currentUser.token);
      // Optionally, handle redirection here if needed
      if (!$rootScope.globals.currentUser.token) {
        console.log("$rootScope.globals.currentUser.token", $rootScope.globals.currentUser.token);
        $location.path("/login"); // Redirect if no user is logged in
      } else {
        $location.path("/"); // Redirect if the user is logged in
      }


      //for data-rocks warning issues when changing routes before component loaded
      alert = function() {};
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;

      $rootScope.$on("$locationChangeStart", function(event, next, current) {
        var restrictedPage = $.inArray($location.path(), ["/login"]) === -1;
        var usr = $rootScope.globals.currentUser.token;
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
