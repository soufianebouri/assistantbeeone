'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.journaldepaie
 * @description
 * # journaldepaie
 * Factory in the beeOneWebFrontApp.
 */

angular.module('beeOneWebFrontApp')
  .factory('journaldepaie', function($http, _url) {
    return {
      getJournalPaieSansDetails: function(d) {
        NProgress.start();
        return $http.post(_url + "/mainoeuvre_journalpaie/getjournalpaiesansdetails", d);
      },
      getJournalPaieAvecDetails: function(d) {
        NProgress.start();
        return $http.post(_url + "/mainoeuvre_journalpaie/getjournalpaieavecdetails", d);
      },
      getPSPNSbyPersonnel: function(d) {
        NProgress.start();
        return $http.post(_url + "/mainoeuvre_journalpaie/getpspnsbypersonnel", d);
      },
      getJournalPaieAUnite: function(d) {
        NProgress.start();
        return $http.post(_url + "/mainoeuvre_journalpaie/getjournalpaieaunite", d);
      }
    };
  });