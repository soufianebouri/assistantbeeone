'use strict';

/**
 * @ngdoc directive
 * @name beeOneWebFrontApp.directive:loading
 * @description
 * # loading
 */
angular.module('beeOneWebFrontApp')
  .directive('loading', function() {
    return {
      template: '<div><div ng-show="loading" class="loading-container"></div><div ng-hide="loading" ng-transclude></div></div>',
      restrict: 'A',
      transclude: true,
      replace: true,
      scope: {
        loading: "=loading"
      },
      compile: function compile(element, attrs, transclude) {
        var spinner = new Spinner().spin();
        var loadingContainer = element.find(".loading-container")[0];
        loadingContainer.appendChild(spinner.el);
      }
    };
  }).directive('loadingSpinner', function () {
    return {
        restrict: 'E',
        template: `
            <div class="loading-overlay" ng-show="isLoading">
                <div class="spinner"></div>
            </div>`,
        scope: {
            isLoading: '='
        }
    };
});