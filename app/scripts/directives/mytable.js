'use strict';

/**
 * @ngdoc directive
 * @name beeOneWebFrontApp.directive:myTable
 * @description
 * # myTable
 */
angular.module('beeOneWebFrontApp')
  .directive('myTable', function() {
    return {
      restrict: 'E, A, C',
      link: function(scope, element, attrs, controller) {
        var dataTable = element.dataTable(scope.options);

        scope.$watch('options.aaData', handleModelUpdates, true);

        function handleModelUpdates(newData) {
          var data = newData || null;
          if (data) {
            dataTable.fnClearTable();
            dataTable.fnAddData(data);
          }
        }
      },
      scope: {
        options: "="
      }
    };
  })