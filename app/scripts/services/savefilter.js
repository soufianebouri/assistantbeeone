'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.savefilter
 * @description
 * # savefilter
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .service('savefilter', function() {
    var objFilter = {};
    return {
      getFilters: function() {
        return objFilter;
      },
      setFilters: function(setObjFilter) {
        return objFilter = setObjFilter;
      },
      resetFilter: function() {
        objFilter = {};
      }
    };
  });