'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('MainCtrl', function($rootScope, $scope, $route, $location, translatedwords, translation, auth, $window, $state, $translatePartialLoader, $translate, _version) {

    var main = this;
    $scope.obj = translation.getObjectTranslated();
    $scope._version = _version;
    $scope.currentYear = $scope.obj.currentYear;
    $translatePartialLoader.addPart('pageTitle');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      // redirect to login page if not logged in and trying to access a restricted page
      $scope.loggedIn = $rootScope.beeoneAssistant.assistUser;
      if (toState.name == "login" && $scope.loggedIn) {
        event.preventDefault();
        return;
      } else {
        $scope.title = toState.data.pageTitle;
      }


      if ($state.current) {
        $state.go($state.current);
      }
    });


  });
