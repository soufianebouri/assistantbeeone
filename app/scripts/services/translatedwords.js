'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.translatedwords
 * @description
 * # translatedwords
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('translatedwords', function() {
    return {
      getTranslatedWord: function(data) {
        return data.then(function(val) {
          return val;
        }).catch(function(err) {
          return '';
        });
      }
    };
  });