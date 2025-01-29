'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:Covid19TbCovid19Ctrl
 * @description
 * # Covid19TbCovid19Ctrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('Covid19TbCovid19Ctrl', function($scope, translatedwords, $translatePartialLoader, $translate, $window, $http, $cookies, covid19, $q) {
    moment.locale('fr');
    var pc = this;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.IDferme = $cookies.getObject('globals').ferme.IDFerme;
    pc.IDSOCIETE = $cookies.getObject('globals').ferme.IDSociete;
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    pc.obj = {
      "FERME": pc.IDferme,
      "IDSOCIETE": pc.IDSOCIETE,
      "DATE_DEBUT": 0,
      "DATE_FIN": moment().format('YYYYMMDD')
    }



    //starting date change listner
    pc.date_debut_change = function() {
      pc.obj.DATE_DEBUT = moment($scope.date_debut).format('YYYYMMDD');
      $scope.date_debut = moment(moment(pc.obj.DATE_DEBUT).format('YYYYMMDD'), 'YYYY-MM-DD').toDate();
    };

    //by date_fin
    pc.date_fin_change = function() {
      pc.obj.DATE_FIN = moment($scope.date_fin).format('YYYYMMDD');
      $scope.date_fin = moment(moment(pc.obj.DATE_FIN).format('YYYYMMDD'), 'YYYY-MM-DD').toDate();
    };


    pc.rechercher = function() {
      $q.all([covid19.geteffectifspresents(pc.obj), covid19.geteffectifsquestiones(pc.obj)]).then(function(values) {
        pc.effectifspresents = values[0].data;
        $q.all([covid19.geteffectifsquestiones(pc.obj)]).then(function(values) {
          pc.effectifsquestiones = values[0].data;
          $q.all([covid19.getaveczerosymptome(pc.obj), covid19.getaumoinsunsymptome(pc.obj), covid19.getentourageaveczerosymptomes(pc.obj), covid19.getentourageavecaumoinsunsymptome(pc.obj), covid19.getentouragealecovide(pc.obj), covid19.getavectemperature(pc.obj), covid19.getdisponibilitethermometre(pc.obj)]).then(function(values) {
            pc.aveczerosymptome = values[0].data;
            pc.aumoinsunsymptome = values[1].data;
            pc.entourageaveczerosymptomes = values[2].data;
            pc.entourageavecaumoinsunsymptome = values[3].data;
            pc.entouragealecovide = values[4].data;
            pc.avectemperature = values[5].data;
            pc.disponibilitethermometre = values[6].data;
            NProgress.done();
          });
        });
      });
    };

    pc.rechercher();

  });