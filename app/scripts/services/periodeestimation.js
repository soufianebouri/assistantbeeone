'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.PeriodeEstimation
 * @description
 * # PeriodeEstimation
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('PeriodeEstimation', function($http, _url,$translatePartialLoader, $translate,$window) {
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    return {
      getPeriodeEstimation: function(d) {
        NProgress.start();
        return $http.post(_url + "/recolte_periodeestimation/getPeriodeEstimation", d);
      },
      getEstimationPeriodique: function(d) {
        NProgress.start();
        return $http.post(_url + "/estimation_periodique/getEstimationPeriodique", d);
      },
      getByFiltre: function(data) {
        NProgress.start();
        return $http.post(_url + "/recolte_periodeestimation/filtre", data);
      },
      getByFiltrecheck: function(data) {
        NProgress.start();
        return $http.post(_url + "/recolte_periodeestimation/filtre/check", data);
      },
      create: function(data) {
        NProgress.start();
        return $http.post(_url + "/recolte_periodeestimation/filtre/add/create", data);
      },
      createEstimationPeriode:function(d)
      {
        NProgress.start();
        return $http.post(_url + "/estimation_periodique/createEstimationPeriode", d);
      },
      cloture: function(data) {
        NProgress.start();
        return $http.post(_url + "/recolte_periodeestimation/filtre/add/cloture", data);
      },
      getDataEstimationForChart: function(data) {
        NProgress.start();
        return $http.post(_url + "/estimation_periodique/getDataEstimationForChart", data);
      },
      getAllVarieteEstim: function(data) {
        NProgress.start();
        return $http.post(_url + "/estimation_periodique/getAllVarieteEstim", data);
      },
      createEstimationAnnuel:function(d)
      {
        NProgress.start();
        return $http.post(_url + "/estimation_annuelle/createEstimationAnnuelle", d);
      },
      getEstimationAnnuelle: function(d) {
        NProgress.start();
        return $http.post(_url + "/estimation_annuelle/getEstimationAnnuelle", d);
      },
      getEstimationAujourdhui: function(d) {
        NProgress.start();
        return $http.post(_url + "/estimation_today/getEstimationToday", d);
      },
      getEstimationDemain: function(d) {
        NProgress.start();
        return $http.post(_url + "/estimation_demain/getEstimationDemain", d);
      },
      pushNotification: function(d) {
        NProgress.start();
        return $http.post(_url + "/pushNotif/pushNotif", d);
      },
      pushNotification_demande_actualisation: function(d) {
        NProgress.start();
        return $http.post(_url + "/pushNotif/demande_actualisation", d);
      },
      getCumuleEstimation: function(d) {
        NProgress.start();
        return $http.post(_url + "/estimationPeriodique/cumule", d);
      },
      getCumuleJR: function(d) {
        NProgress.start();
        return $http.post(_url + "/estimationPeriodique/cumule_jour", d);
      },
      hier: function(d) {
        NProgress.start();
        return $http.get(_url + "/estimationPeriodique/hier/"+d);
      },
      semain_derniere: function(d) {
        NProgress.start();
        return $http.get(_url + "/estimationPeriodique/semain_derniere/"+d);
      },
      semaine_en_cours: function(d) {
        NProgress.start();
        return $http.get(_url + "/estimationPeriodique/semaine_en_cours/"+d);
      },
      lastUpdate: function(d) {
        NProgress.start();
        return $http.get(_url + "/estimationPeriodique/lastUpdate/"+d);
      },
      getDetailPrevisionAujourdhui : function(d) {
        NProgress.start();
        return $http.post(_url + "/estimationPeriodique/getDetailPrevisionAujourdhui/",d);
      },
      getDetailSemaineProchaine : function(d) {
        NProgress.start();
        return $http.post(_url + "/estimationPeriodique/getDetailSemaineProchaine/",d);
      },
      getDetailPeriode: function(d) {
        NProgress.start();
        return $http.post(_url + "/estimationPeriodique/getDetailPeriode/",d);
      },
      hierRealisation: function(d) {
        NProgress.start();
        return $http.post(_url + "/estimationPeriodique/hierRealisation/",d);
      },
      semainEnCoursRealisation: function(d) {
        NProgress.start();
        return $http.post(_url + "/estimationPeriodique/semainEnCoursRealisation/",d);
      },
      semaineDerniereRealisation: function(d) {
        NProgress.start();
        return $http.post(_url + "/estimationPeriodique/semaineDerniereRealisation/",d);
      },
      lastSevenDaysRealisation: function(d) {
        NProgress.start();
        return $http.post(_url + "/estimationPeriodique/lastSevenDaysRealisation/",d);
      },
      getPrevuRealiseParSemaine: function(d) {
        NProgress.start();
        return $http.post(_url + "/estimationPeriodique/getPrevuRealiseParSemaine/",d);
      },
      qualitePrevisionHebdo: function(d) {
        NProgress.start();
        return $http.post(_url + "/estimationPeriodique/qualitePrevisionHebdo/",d);
      },
      getAvancement: function() {
        NProgress.start();
        return $http.get(_url + "/estimationPeriodique/getAvancement/");
      },
      semain_prochaine: function() {
        NProgress.start();
        return $http.get(_url + "/estimationPeriodique/semain_prochaine/");
      },
      saisie_demain: function() {
      NProgress.start();
      return $http.get(_url + "/estimationPeriodique/saisie_demain/");
      },
      saisie_today: function() {
      NProgress.start();
      return $http.get(_url + "/estimationPeriodique/saisie_today/");
      },
      suivi_prevu_realise_hebdo: function(d) {
        NProgress.start();
        return $http.post(_url + "/estimationPeriodique/suivi_prevu_realise_hebdo/",d);
      },
      notifications_automatisees : function(d) {
        NProgress.start();
        return $http.post(_url + "/pushNotif/notifications_automatisees/",d);
      }
    };
  });
