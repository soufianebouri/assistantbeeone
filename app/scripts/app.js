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
var url = "http://127.0.0.1:4000/erpassistant/api";
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
    .state('v_societe', {
      url: '/configuration/accounts/societe',
      templateUrl: 'views/configuration/comptes/v_societe.html',
      data: {
        pageTitle: "BeeOne ERP - Configuration Du Compte"
      }
    })
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
      .state("login", {
        url: "/login",
        templateUrl: "views/login.html",
        data: {
          pageTitle: "BeeOne ERP",
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
          $rootScope.globals.currentUser.token;
          
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