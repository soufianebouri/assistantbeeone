'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ConfigurationSecteursIrrigationVSousparcelleParcelleculturaleCtrl
 * @description
 * # ConfigurationSecteursIrrigationVSousparcelleParcelleculturaleCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ConfigurationSecteursIrrigationVSousparcelleParcelleculturaleCtrl', function (
    $q,
    $scope,$mdDialog,
    toastr,
    $timeout,cultureService,
    _url,VarieteService,
    $window,
    $translatePartialLoader,
    $translate,uniteoperation,
    _version,
    DTOptionsBuilder,Produit,
    $compile,
    DTColumnBuilder,
    DTDefaultOptions,
    $cookies,
    ferme,
    familleculture, Bloc, sousparcelleParcelleculturale
  ) {
    var vm = this;
    vm._version = _version;

    vm.User = $cookies.getObject('beeoneAssistant').assistUser.Nom + " " + $cookies.getObject('beeoneAssistant').assistUser.Prenom;
    vm.IDUser = $cookies.getObject('beeoneAssistant').assistUser.ID;

    $translatePartialLoader.addPart("conduitetechnique");
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());


    vm.bodydt = {
      IDFermes : null
    }

    NProgress.start();



        vm.get_data = function(){
          vm.sous_parcelle = [];
          vm.parcelle_culturale  = [];
          vm.selectedParcelle = null;
          vm.selectedSousParcelle = null;
          $q.all([
            sousparcelleParcelleculturale.get_sous_parcelle_byferme(vm.bodydt),
            sousparcelleParcelleculturale.get_parcelle_culturale_byferme(vm.bodydt)
          ]).then((values) => {
              NProgress.done();
            vm.sous_parcelle = values[0].data;
            vm.parcelle_culturale = values[1].data;
          }).catch((error) => {
              NProgress.done();
            toastr.clear();
            toastr.error(error.message, {
              closeButton: true
            });
          });
        }

        $q.all([
          ferme.get_all()
        ]).then((values) => {
            NProgress.done();
          vm.data_ferme = values[0].data;
        }).catch((error) => {
            NProgress.done();
          toastr.clear();
          toastr.error(error.message, {
            closeButton: true
          });
        });

        // Selected items
           vm.selectedParcelle = null;
           vm.selectedSousParcelle = null;

           // Selection logic
           vm.selectParcelle = async function(parcelle, index) {
               vm.selectedParcelle = index;
               await vm.parcelle_culturale.forEach(function(p) {
                  p.selected = false;
              });
               vm.parcelle_culturale[vm.selectedParcelle].selected = true
           };

           vm.selectSousParcelle = async function(sous, index) {
               vm.selectedSousParcelle = index;
               await vm.sous_parcelle.forEach(function(p) {
                  p.selected = false;
              });
               vm.sous_parcelle[vm.selectedSousParcelle].selected = true
           };

           // Attach selected sous-parcelle to selected parcelle
           vm.attachSousParcelle = async function() {
              if(typeof vm.selectedParcelle !== 'number'){
                toastr.clear();
                toastr.warning("Please Select Parcelle Culturale", {
                closeButton: true,
                });
              }else  if(typeof vm.selectedSousParcelle !== 'number'){
                  toastr.clear();
                  toastr.warning("Please Select Sous Parcelle", {
                  closeButton: true,
                  });
                }else{
                if(vm.sous_parcelle[vm.selectedSousParcelle].parcelleculturalle.length>0){
                  toastr.clear();
                  toastr.warning("Parcelle Culturale already attached", {
                  closeButton: true,
                 });
               }else {
                 vm.sous_parcelle[vm.selectedSousParcelle].parcelleculturalle.push(vm.parcelle_culturale[vm.selectedParcelle])
                 vm.selectedSousParcelle = null;
                 vm.selectedSousParcelle = null;
                 await vm.parcelle_culturale.forEach(function(p) {
                    p.selected = false;
                });
                await vm.sous_parcelle.forEach(function(p) {
                    p.selected = false;
                });
               }
              }

           };

           // Detach selected sous-parcelle
           vm.detachSousParcelle = async function() {
             if(typeof vm.selectedSousParcelle !== 'number'){
               toastr.clear();
               toastr.warning("Please Select Sous Parcelle", {
               closeButton: true,
               });
             }else {
               if(vm.sous_parcelle[vm.selectedSousParcelle].parcelleculturalle.length>0){
                 vm.parcelle_culturale.unshift(vm.sous_parcelle[vm.selectedSousParcelle].parcelleculturalle[0]);
                 vm.sous_parcelle[vm.selectedSousParcelle].parcelleculturalle = []
                 vm.sous_parcelle[vm.selectedSousParcelle].ID_parcelleculturalle = null;
                 vm.selectedSousParcelle = null;
                 vm.selectedSousParcelle = null;
                 await vm.parcelle_culturale.forEach(function(p) {
                    p.selected = false;
                });
                await vm.sous_parcelle.forEach(function(p) {
                    p.selected = false;
                });
               }else {
                 toastr.clear();
                 toastr.warning("Parcelle Culturale not attached yet", {
                 closeButton: true,
                });

               }
             }

           };

           // Reset selections
           vm.resetSelection = function() {
               vm.selectedParcelle = null;
               vm.selectedSousParcelle = null;
           };


  }
);
