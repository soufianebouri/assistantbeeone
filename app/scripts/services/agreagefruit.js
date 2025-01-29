'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.AgreageFruit
 * @description
 * # AgreageFruit
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('AgreageFruit', function($http, _url) {
    return {
      getAgreageFruit: function(d) {
        NProgress.start();
        return $http.post(_url + "/agreage/getSomeParams", d);
      },
      getAgreageFruitFiche: function(d) {
        NProgress.start();
        return $http.post(_url + "/agreage/getfiche", d);
      },
      addAgreageFruit: function(data) {
        return $http.post(_url + "/agreage/createAgreageWeb", data)
      },
      updateAgreageFruit: function(data) {
        return $http.post(_url + "/agreage/updateAgreage", data)
      },
      getAllAgreageFruit: function(data) {
        return $http.post(_url + "/agreage/getAllAgreageTemp", data);
      },
      getAllDetailVueAgreageFruit: function(data) {
        return $http.post(_url + "/agreage/getAllAgreageVueDetailTemp", data);
      },
      filterAllDetailVueAgreageFruit: function(data) {
        return $http.post(_url + "/agreage/filterAllAgreageVueDetailTemp", data);
      },
      getAgreageFruit: function(id) {
        return $http.get(_url + "/agreage/getAgreageTemp/" + id);
      },
      getDetailsAgreageFruit: function(id) {
        return $http.get(_url + "/agreage/getAgreageDetailsTemp/" + id);
      },
      getAllDetailsAgreageFruit: function(data) {
        return $http.post(_url + "/agreage/getAllAgreageDetailTemp", data);
      },
      deleteAgreageFruit: function(data) {
        return $http.post(_url + "/agreage/deleteAgreage", data)
      },
      deleteAgreageFruitOld: function(data) {
        return $http.post(_url + "/agreage/deleteAgreageFruitOld", data)
      },
      getAllAgreageFruitDetails: function(IDAgreage) {
        return $http.get(_url + "/agreage/getAllAgreageTemp/" + IDAgreage);
      },
      getlastRef: function(data) {
        return $http.post(_url + "/agreage/getlastRef", data)
      },
      getParcelleByAgreage: function(data) {
        return $http.post(_url + "/agreage/getParcelleByAgreage", data)
      },
      getCibleByAgreage: function(data) {
        return $http.post(_url + "/agreage/getCibleByAgreage", data)
      },
      getAllAgreageOld: function(data) {
        return $http.post(_url + "/agreage/getAllAgreageOld", data)
      },
      getAllObs_Agreage_temp: function(data) {
        return $http.post(_url + "/agreage/getAllObs_Agreage_temp", data)
      },
      getAllcategorie_cible: function(data) {
        return $http.post(_url + "/agreage/getAllcategorie_cible", data)
      },
      getAllcible: function(data) {
        return $http.post(_url + "/agreage/getAllcible", data)
      },
      getAllObs_Agreage_detail_temp: function(data) {
        return $http.post(_url + "/agreage/getAllObs_Agreage_detail_temp", data)
      },
      getdatafamillecibleonlyforedit: function(data) {
        return $http.post(_url + "/agreage/getdatafamillecibleonlyforedit", data)
      },
      editAgreageFruit: function(data) {
        return $http.post(_url + "/agreage/editAgreageFruit", data)
      },
      getCalibreByVariete: function(data) {
        return $http.post(_url + "/agreage/getCalibreByVariete", data)
      },
      getCalibreByIDAgreage: function(data) {
        return $http.post(_url + "/agreage/getCalibreByIDAgreage", data)
      },
      getCalibreByIDAgreagEdit: function(data) {
        return $http.post(_url + "/agreage/getCalibreByIDAgreagEdit", data)
      },
      getCalibreByVarieteEdit: function(data) {
        return $http.post(_url + "/agreage/getCalibreByVarieteEdit", data)
      }
    };
  });