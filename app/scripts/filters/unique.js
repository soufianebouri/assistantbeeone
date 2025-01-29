'use strict';

/**
 * @ngdoc filter
 * @name beeOneWebFrontApp.filter:unique
 * @function
 * @description
 * # unique
 * Filter in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .filter('unique', function() {
    function deepFind(obj, path) {
      var paths = path.split('.'),
        current = obj,
        i;

      for (i = 0; i < paths.length; ++i) {
        if (current[paths[i]] == undefined) {
          return undefined;
        } else {
          current = current[paths[i]];
        }
      }
      return current;
    }

    return function(items, filterOn) {

      if (filterOn === false) {
        return items;
      }

      if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
        var hashCheck = {},
          newItems = [];

        var extractValueToCompare = function(item) {
          if (angular.isObject(item) && angular.isString(filterOn)) {
            return deepFind(item, filterOn);
          } else {
            return item;
          }
        };

        angular.forEach(items, function(item) {
          var valueToCheck, isDuplicate = false;

          for (var i = 0; i < newItems.length; i++) {
            if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
              isDuplicate = true;
              break;
            }
          }
          if (!isDuplicate) {
            newItems.push(item);
          }

        });
        items = newItems;
      }
      return items;
    }
  });