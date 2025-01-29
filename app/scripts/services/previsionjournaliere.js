'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.PrevisionJournaliere
 * @description
 * # PrevisionJournaliere
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('PrevisionJournaliere', function($http, _url) {
    return {
      getPrevisionJournaliere: function() {
        return $http.get(_url + "/estimationAujourdhui/getPrevisionJournaliere");
      },
      recapJournaliere : function() {
        return $http.get(_url + "/estimationAujourdhui/recapJournaliere");
      } 
    };
  });
  
