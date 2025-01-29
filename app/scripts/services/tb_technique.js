'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.tbTechnique.js
 * @description
 * # tbTechnique.js
 * Service in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')

  .factory('tbTechnique', function($http, _url, _appFor) {
    return {
      getMeteo30j: function(d) {
        NProgress.start();
        return $http.post(_url + "/tbtechnique/metio30jour/", d);
      },
      getCumulPluvimoetrique: function(d) {
        NProgress.start();
        return $http.post(_url + "/tbtechnique/cumulpluvimoetrique/", d);
      },
      getTotalApportsEau: function(d) {
        return $http.post(_url + "/tbtechnique/totalapportseau/", d);
      },
      getSuperficieProduction: function(d) {
        return $http.post(_url + "/tbtechnique/superficieproduction/", d);
      },
      getSuperficiePhysique: function(d) {
        return $http.post(_url + "/tbtechnique/superficiephysique/", d);
      },
      getOrdreFertilisationNRealise: function(d) {
        return $http.post(_url + "/tbtechnique/ordrefertilisationnrealise/", d);
      },
      getOrdreTraitetmentPhytoNRealise: function(d) {
        return $http.post(_url + "/tbtechnique/ordretraitetmentphytonrealise/", d);
      },
      getAlerteMaladiesRavageurs: function(d) {
        return $http.post(_url + "/tbtechnique/getalertemaladiesravageurs/", d);
      },
      getReseauIrrigation: function(d) {
        return $http.post(_url + "/tbtechnique/reseauirrigation/", d);
      },
      getForcastMeteo: function(d) {
        return $http({
          method: 'JSONP',
          url: 'https://api.weatherbit.io/v2.0/forecast/daily?lat=' + d.latitude + '&lon=' + d.longitude + '&days=7&units=M&lang=fr&key=a2843f67204d41b18b0a5dae1476fe26'
        })
      },
      getForcastActuel: function(d) {
        return $http({
          method: 'JSONP',
          url: 'https://api.weatherbit.io/v2.0/current?lat=' + d.latitude + '&lon=' + d.longitude + '&lang=fr&key=a2843f67204d41b18b0a5dae1476fe26'
        })
      },
      getForecastGenerale: function(d) {
        NProgress.start();
        return $http.post(_url + "/tbtechnique/getforecastgenerale/", d);
      },
      getReleveClimatique: function(d) {
        NProgress.start();
        return $http.post(_url + "/tbtechnique/getreleveclimatique/", d);
      },
      getTableauDesApportsParVariete: function(d) {
        NProgress.start();
        return $http.post(_url + "/tbtechnique/tableaudesapportsparvariete/", d);
      },
      getTableauDesApportsParCulture: function(d) {
        NProgress.start();
        return $http.post(_url + "/tbtechnique/tableaudesapportsparculture/", d);
      },
      getCarteDesApplicationsPhytosanitaires: function(d) {
        NProgress.start();
        return $http.post(_url + "/tbtechnique/cartedesapplicationsphytosanitaires/", d);
      },
      getAlertesRavageurs: function(d) {
        NProgress.start();
        return $http.post(_url + "/tbtechnique/alertesravageurs/", d);
      },
      getTableauInfestation: function(d) {
        NProgress.start();
        return $http.post(_url + "/tbtechnique/tableauinfestation/", d);
      },
      getTableauSuiviQualiteParVarieteCulture: function(d) {
        NProgress.start();
        return $http.post(_url + "/tbtechnique/tableausuiviqualiteparvariete/", d);
      },
      getTableauSuiviQualiteParCulture: function(d) {
        NProgress.start();
        return $http.post(_url + "/tbtechnique/tableausuiviqualiteparculture/", d);
      },
      getTableauDernieresSaisiesParUtilisateur: function(d) {
        NProgress.start();
        return $http.post(_url + "/tbtechnique/tableaudesdernieressaisiesparutilisateur/", d);
      },
      getTableauRendementParCulture: function(d) {
        NProgress.start();
        d._appFor = _appFor;
        return $http.post(_url + "/tbtechnique/tableaurendementparculture/", d);
      },
      getTableauRendementParVariete: function(d) {
        NProgress.start();
        d._appFor = _appFor;
        return $http.post(_url + "/tbtechnique/tableaurendementparvariete/", d);
      },
      getPlaces: function(d) {
        return $http.get("https://www.yr.no/api/v0/locations/Search?lat=" + d.latitude + "&lon=" + d.longitude + "&language=en");
      }
    };
  });