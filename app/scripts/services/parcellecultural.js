'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.parcellecultural
 * @description
 * # parcellecultural
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('parcellecultural', function($http, _url) {
    return {
      getParcelleCultural: function() {
        return $http.get(_url + "/get_parcelle_cultural");
      },
      getParcelleCulturalByFerme: function(data) {
        return $http.get(_url + "/get_parcelle_cultural/" + data);
      },
      getParcelleCulturalDetail: function(IDFerme) {
        return $http.get(_url + "/parcellesculturale/listParcelCulturalData/" + IDFerme);
      },
      createParcellesCulturale: function(data) {
        return $http.post(_url + "/parcellesculturale/", data);
      },
      showbydomaineIfExist: function(data) {
        return $http.post(_url + "/get_parcelle_cultural/showbydomaineIfExist", data);
      },
      updateParcellesCulturale: function(data) {
        return $http.post(_url + "/parcellesculturale/update", data);
      },
      deleteParcellesCulturale: function(data) {
        return $http.post(_url + "/parcellesculturale/delete", data);
      },
      getParcelleByVarieteCulture: function(data) {
        return $http.post(_url + "/parcellesculturale/ByVarieteCulture", data);
      },
      showbyDomaineVarieteIfExist: function(data) {
        return $http.post(_url + "/get_parcelle_cultural/showbyDomaineVarieteIfExist", data);
      },
      ShowByDomaineEncours: function(IDFerme) {
        return $http.get(_url + "/get_parcelle_cultural/showbydomaineencours/" + IDFerme);;
      },
      getsumsupbyid: function(data) {
        return $http.post(_url + "/parcellesculturale/getsumsupbyid", data);
      },
      showbydomaineandgroupe: function(data) {
        return $http.post(_url + "/get_parcelle_cultural/showbydomaineandgroupe", data);
      },
      getbycampagneculture: function(data) {
        return $http.post(_url + "/get_parcelle_cultural/getbycampagneculture", data);
      },
      ByVarietePortgreff: function(data) {
        return $http.post(_url + "/get_parcelle_cultural/ByVarietePortgreff", data);
      },
      ByCultureVarietePortgreff: function(data) {
        return $http.post(_url + "/get_parcelle_cultural/ByCultureVarietePortgreff", data);
      },
      ByFamilleCultureVariete: function(data) {
        return $http.post(_url + "/get_parcelle_cultural/ByFamilleCultureVariete", data);
      },
      generate_pdf_of_qrcode_byFarm: function(data) {
        return $http.post(_url + "/parcellesculturale/generate_pdf_of_qrcode_byFarm", data, {
          responseType: 'arraybuffer'
        });
      },
      showbydomaineandVarieteculture: function(data) {
        return $http.post(_url + "/get_parcelle_cultural/showbydomaineandVarieteculture", data);
      },
      showbydomaine_variete: function(data) {
        return $http.post(_url + "/get_parcelle_cultural/showbydomaine_variete" , data);
      }
    };
  });