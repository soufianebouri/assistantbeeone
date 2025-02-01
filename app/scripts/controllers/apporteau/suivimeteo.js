'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ApporteauSuivimeteoCtrl
 * @description
 * # ApporteauSuivimeteoCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ApporteauSuivimeteoCtrl', function($scope, translatedwords, DTOptionsBuilder, $rootScope, $translatePartialLoader, $translate, DTColumnBuilder, $filter, $q, $window, $mdDialog, $compile, $state, DTDefaultOptions, $cookies, suivimeteo, toastr) {
    var pc = this;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    vm.dtInstance = {};
    var titleHtml = '<input type="checkbox" ng-model="vm.selectAll" ng-click="vm.toggleAll(vm.selectAll, vm.selected)">';
    vm.selected = {};
    vm.selectAll = false;
    vm.toggleAll = toggleAll;
    vm.toggleOne = toggleOne;
    vm.metio = {};
    vm.User = $cookies.getObject('globals').currentUser.Nom + " " + $cookies.getObject('globals').currentUser.Prenom;
    vm.IDUser = $cookies.getObject('globals').currentUser.ID;
    vm.IDferme = $cookies.getObject('globals').ferme.IDFerme;
    vm.IDSociete = $cookies.getObject('globals').ferme.IDSociete;
    //set date input
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

    $scope.date_debut_sel = 0;
    $scope.date_fin_sel = moment($scope.date_fin).format('YYYYMMDD');

    var permission_data = JSON.parse($window.localStorage.getItem('permission'));
    var permission = {
      modules_array: permission_data[0],
      rubriques_array: permission_data[1],
      sous_modules_array: permission_data[2]
    }

    vm.isAdmin = $cookies.getObject('globals').currentUser.isAdmin;

    var opsemisAccess = _.filter(permission.sous_modules_array, {
      ss_module: 'Suivi_meteo'
    });

    $scope.canIAction = () => {
      if (vm.isAdmin)
        return {
          add: true,
          update: true,
          delete: true
        }
      return {
        add: opsemisAccess[0].a,
        update: opsemisAccess[0].u,
        delete: opsemisAccess[0].d
      }
    }

    vm.obj = {
      "DOMAINE": $cookies.getObject('globals').ferme.IDFerme,
      "DATE_DEBUT": 0,
      "DATE_FIN": moment($scope.date_fin).format('YYYYMMDD')
    };

    //get data and refresh datatable
    $scope.updateDataMeteo = function(data) {
      return suivimeteo.getByFiltre(data);
    };

    //by date_debutl
    $scope.date_debut_change = function() {
      NProgress.start();
      if ($scope.date_debut === null || $scope.date_debut === "" || $scope.date_debut === undefined || $scope.date_debut === 0 || $scope.date_debut === "0" || !$scope.date_debut || $scope.date_debut.length === 0) {
        $scope.date_debut_sel = 0;
      } else {
        $scope.date_debut_sel = $scope.date_debut;
      }

      vm.obj.DATE_DEBUT = moment($scope.date_debut_sel).format('YYYYMMDD');
      vm.dtInstance.reloadData();
      NProgress.done();
      NProgress.remove();
    };

    //by date_fin
    $scope.date_fin_change = function() {
      NProgress.start();
      if ($scope.date_fin === null || $scope.date_fin === "" || $scope.date_fin === undefined || $scope.date_fin === 0 || $scope.date_fin === "0" || !$scope.date_fin || $scope.date_fin.length === 0) {
        $scope.date_fin_sel = 0;
      } else {
        $scope.date_fin_sel = $scope.date_fin;
      }

      vm.obj.DATE_FIN = moment($scope.date_fin_sel).format('YYYYMMDD');
      vm.dtInstance.reloadData();
      NProgress.done();
      NProgress.remove();
    };

    if ($scope.canIAction().add) {
      $scope.btnadd = {
        text: "<i class='fa fa-plus'></i>",
        key: '1',
        className: 'pull-left',
        action: function(e, dt, node, config) {
          $scope.AddClimat()
        },
        titleAttr: 'Ajouter'
      }
    } else {
      $scope.btnadd = undefined;
    }

    vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        $scope.updateDataMeteo(vm.obj).then(function(res) {
          defer.resolve(res.data);
          NProgress.done();
        });
        return defer.promise;
      })
      .withOption('createdRow', createdRow)
      .withDOM('<lf<t>ip>')
      .withPaginationType('simple_numbers')
      .withOption('responsive', true)
      .withLanguage($.getJSON(`/scripts/i18n/datatable/${$window.localStorage.getItem("lang").toLowerCase()}.json`, function(data) {
        return data
      }))


      .withButtons([{
          extend: 'colvis',
          text: "<i class='fa fa-eye'></i>",
          className: 'pull-left',
          titleAttr: translatedwords.getTranslatedWord($translate("Visibilité"))
        },
        {
          text: "<i class='fa fa-search'></i>",
          action: function(e, dt, node, config) {
            $scope.ReverseDisplay('filter_form');
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Rechercher"))
        },
        {
          extend: 'copy',
          text: "<i class='fa fa-copy'></i>",
          titleAttr: translatedwords.getTranslatedWord($translate("Copie"))
        },
        {
          extend: 'print',
          text: "<i class='fa fa-print'></i>",
          titleAttr: translatedwords.getTranslatedWord($translate("Imprimer"))
        },
        {
          extend: 'pdf',
          text: "<i class='fa fa-file-pdf-o'></i>",
          titleAttr: 'PDF'
        },
        {
          extend: 'excel',
          text: "<i class='fa fa-file-excel-o'></i>",
          titleAttr: 'EXCEL'
        }
      ].concat($scope.btnadd));


    vm.dtColumns = [
      DTColumnBuilder.newColumn('Date').withTitle(translatedwords.getTranslatedWord($translate("Date"))).renderWith(function(data, type, full, meta) {
        return moment(full.Date).format('DD/MM/YYYY');
      }),
      DTColumnBuilder.newColumn('TMax').withTitle(translatedwords.getTranslatedWord($translate("Tmax (°C)"))).renderWith(function(data, type, full, meta) {
        if (full.TMax)
          return '<p align="right">' + full.TMax.toFixed(2) + '</p>';
        return '<p align="right">0</p>';
      }),
      DTColumnBuilder.newColumn('Tmin').withTitle(translatedwords.getTranslatedWord($translate("Tmin (°C)"))).renderWith(function(data, type, full, meta) {
        if (full.TMax)
          return '<p align="right">' + full.Tmin.toFixed(2) + '</p>';
        return '<p align="right">0</p>';
      }),
      DTColumnBuilder.newColumn('Tmoy').withTitle(translatedwords.getTranslatedWord($translate("Tmoy (°C)"))).renderWith(function(data, type, full, meta) {
        if (full.Tmoy)
          return '<p align="right">' + full.Tmoy.toFixed(2) + '</p>';
        return '<p align="right">0</p>';
      }),
      DTColumnBuilder.newColumn('Vent').withTitle(translatedwords.getTranslatedWord($translate("Vent (Km/h)"))).renderWith(function(data, type, full, meta) {
        if (full.Vent)
          return '<p align="right">' + full.Vent.toFixed(2) + '</p>';
        return '<p align="right">0</p>';
      }),
      DTColumnBuilder.newColumn('HR').withTitle(translatedwords.getTranslatedWord($translate("HR (%)"))).renderWith(function(data, type, full, meta) {
        if (full.HR)
          return '<p align="right">' + full.HR.toFixed(2) + '</p>';
        return '0';
      }),
      DTColumnBuilder.newColumn('Hmin').withTitle(translatedwords.getTranslatedWord($translate("Hmin (%)"))).renderWith(function(data, type, full, meta) {
        if (full.Hmin)
          return '<p align="right">' + full.Hmin.toFixed(2) + '</p>';
        return '<p align="right">0</p>';
      }),
      DTColumnBuilder.newColumn('Pluvio').withTitle(translatedwords.getTranslatedWord($translate("Pluviométrie (mm)"))).renderWith(function(data, type, full, meta) {
        if (full.Pluvio)
          return '<p align="right">' + full.Pluvio.toFixed(2) + '</p>';
        return '<p align="right">0</p>';
      }),
      DTColumnBuilder.newColumn('E0').withTitle(translatedwords.getTranslatedWord($translate("ETO (mm)"))).renderWith(function(data, type, full, meta) {
        if (full.E0)
          return '<p align="right">' + full.E0.toFixed(2) + '</p>';
        return '<p align="right">0</p>';
      }),
      DTColumnBuilder.newColumn('RG').withTitle(translatedwords.getTranslatedWord($translate("RG (W/m2)"))).renderWith(function(data, type, full, meta) {
        if (full.RG)
          return '<p align="right">' + full.RG.toFixed(2) + '</p>';
        return '<p align="right">0</p>';
      }),
      DTColumnBuilder.newColumn('BAC').withTitle(translatedwords.getTranslatedWord($translate("BAC (mm)"))).renderWith(function(data, type, full, meta) {
        if (full.BAC)
          return '<p align="right">' + full.BAC.toFixed(2) + '</p>';
        return '<p align="right">0</p>';
      }),
      DTColumnBuilder.newColumn('BAC').withTitle(translatedwords.getTranslatedWord($translate("BAC (mm)"))).renderWith(function(data, type, full, meta) {
        if (full.BAC)
          return '<p align="right">' + full.BAC.toFixed(2) + '</p>';
        return '<p align="right">0</p>';
      }),
      DTColumnBuilder.newColumn('BAR').withTitle(translatedwords.getTranslatedWord($translate("BAR (Bar)"))).renderWith(function(data, type, full, meta) {
        if (full.BAR)
          return '<p align="right">' + full.BAR.toFixed(2) + '</p>';
        return '<p align="right">0</p>';
      }),
      DTColumnBuilder.newColumn('RAJOUT').withTitle(translatedwords.getTranslatedWord($translate("Rajout (mm)"))).renderWith(function(data, type, full, meta) {
        if (full.RAJOUT)
          return '<p align="right">' + full.RAJOUT.toFixed(2) + '</p>';
        return '<p align="right">0</p>';
      }),
      DTColumnBuilder.newColumn('Observation').withTitle(translatedwords.getTranslatedWord($translate("Observation"))),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).withOption('width', '10%').renderWith(actionsHtml).withClass('nowraptd all')
    ];

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    //Add AddClimat
    $scope.AddClimat = function() {
      $mdDialog.show({
          controller: DialogControllerAddClimat,
          templateUrl: '././views/templates/suivimeteo/AddSuiviMeteo.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true,
          escapeToClose: false
        })
        .then(function(answer) {}, function() {});
    }

    async function getprimised(data) {
      return await data;
    }

    //Add AddAnalyse
    function DialogControllerAddClimat($scope, $mdDialog) {

      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
      $scope.DateObservation = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

      $scope.Ifullscreen = false;

      $scope.Fullscreen = function() {
        if (!$scope.Ifullscreen) {
          $("#model").addClass("fullscreen-dialog");
          document.getElementsByClassName('left_col')[0].style.zIndex = 0;
          $scope.Ifullscreen = true;
        } else {
          $("#model").removeClass("fullscreen-dialog");
          document.getElementsByClassName('left_col')[0].style.zIndex = 99999;
          $scope.Ifullscreen = false;
        }
      }

      //add click
      $scope.Ajouter = async function() {

        $scope.progress = true;
        toastr.clear();

        if ($scope.DateObservation && $scope.Tmin >= 0 && $scope.Tmax >= 0) {

          vm.objAdd = {
            "DateObservation": moment($scope.DateObservation).format('YYYYMMDD'),
            "Tmin": $scope.Tmin,
            "Tmax": $scope.Tmax,
            "Tmoy": $scope.Tmoy,
            "HR": $scope.HR,
            "Bac": $scope.Bac,
            "HM": $scope.HM,
            "Pluvio": $scope.Pluvio,
            "Rajout": $scope.Rajout,
            "ETO": $scope.ETO,
            "Vent": $scope.Vent,
            "Barometre": $scope.Barometre,
            "RG": $scope.RG,
            "Observation": ($scope.Observation) ? $filter('textforsqlserver')($scope.Observation) : "",
            "Utilisateur": vm.User,
            "IDFermes": vm.IDferme,
            "IDUser": vm.IDUser
          }


          suivimeteo.createweb(vm.objAdd).then(async e => {
            if (e.data[0].message == "ajout reussi") {
              //validate success
              toastr.clear();
              toastr.info(await translatedwords.getTranslatedWord($translate("Ajout reussi")), {
                closeButton: true
              });
              NProgress.done();
              $mdDialog.hide();
              document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
              vm.dtInstance.reloadData();
            } else {
              $scope.progress = false;
              if (e.data[0].description.includes('WDIDX_ReleveClimatique_date_IDfermes')) {
                toastr.clear();
                toastr.error(await translatedwords.getTranslatedWord($translate("Date est déjà existe sur cette ferme !")), {
                  closeButton: true
                });
              } else {
                toastr.clear();
                toastr.error(await translatedwords.getTranslatedWord($translate("An error occured")) + e.data[0].description, {
                  closeButton: true
                });
              }
              NProgress.done();
            }
          }).catch(async e => {
            $scope.progress = false;
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement : ")) + e.data, {
              closeButton: true
            });
          });

        } else {
          $scope.progress = false;
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
            closeButton: true
          });
        }

      };


      $scope.hideAvancer = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Annuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };


    }

    //Add AddClimat
    vm.edit = function(data) {
      $mdDialog.show({
          controller: DialogControllerEditClimat,
          templateUrl: '././views/templates/suivimeteo/EditSuiviMeteo.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true,
          escapeToClose: false,
          locals: {
            data: data
          }
        })
        .then(function(answer) {}, function() {});
    }

    //Add AddAnalyse
    function DialogControllerEditClimat($scope, $mdDialog, data) {


      $scope.data = data;

      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
      $scope.DateObservation = ($scope.data.Date) ? new Date(moment($scope.data.Date).format("YYYY-MM-DD")) : null;


      $scope.Ifullscreen = false;

      $scope.Fullscreen = function() {
        if (!$scope.Ifullscreen) {
          $("#model").addClass("fullscreen-dialog");
          document.getElementsByClassName('left_col')[0].style.zIndex = 0;
          $scope.Ifullscreen = true;
        } else {
          $("#model").removeClass("fullscreen-dialog");
          document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
          $scope.Ifullscreen = false;
        }
      }

      //add click
      $scope.Modifier = async function() {

        $scope.progress = true;
        toastr.clear();

        if ($scope.DateObservation && $scope.data.Tmin >= 0 && $scope.data.TMax >= 0) {

          vm.objAdd = {
            "ID": $scope.data.ID,
            "DateObservation": moment($scope.DateObservation).format('YYYYMMDD'),
            "Tmin": $scope.data.Tmin,
            "Tmax": $scope.data.TMax,
            "Tmoy": $scope.data.Tmoy,
            "HR": $scope.data.HR,
            "Bac": $scope.data.BAC,
            "HM": $scope.data.Hmin,
            "Pluvio": $scope.data.Pluvio,
            "Rajout": $scope.data.RAJOUT,
            "ETO": $scope.data.E0,
            "Vent": $scope.data.Vent,
            "Barometre": $scope.data.BAR,
            "RG": $scope.data.RG,
            "Observation": ($scope.data.Observation) ? $filter('textforsqlserver')($scope.data.Observation) : "",
            "Utilisateur": vm.User,
            "IDFermes": vm.IDferme,
            "IDUser": vm.IDUser
          }

          suivimeteo.updateweb(vm.objAdd).then(async e => {
            if (e.data[0].message == "ajout reussi") {
              //validate success
              toastr.clear();
              toastr.info(await translatedwords.getTranslatedWord($translate("Modification réussie")), {
                closeButton: true
              });
              NProgress.done();
              $mdDialog.hide();
              document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
              vm.dtInstance.reloadData();
            } else {
              $scope.progress = false;
              if (e.data[0].description.includes('WDIDX_ReleveClimatique_date_IDfermes')) {
                toastr.clear();
                toastr.error(await translatedwords.getTranslatedWord($translate("Date est déjà existe sur cette ferme !")), {
                  closeButton: true
                });
              } else {
                toastr.clear();
                toastr.error(await translatedwords.getTranslatedWord($translate("An error occured ")) + e.data[0].description, {
                  closeButton: true
                });
              }
              NProgress.done();
            }
          }).catch(async e => {
            $scope.progress = false;
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement :")) + e.data, {
              closeButton: true
            });
          });

        } else {
          $scope.progress = false;
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
            closeButton: true
          });
        }

      };


      $scope.hideAvancer = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Annuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };


    }

    function edit(c) {}

    function deleteRow(c) {}

    function createdRow(row, data, dataIndex) {
      // Recompiling so we can bind Angular directive to the DT
      $compile(angular.element(row).contents())($scope);
    }

    function headerCallback(header) {
      if (!vm.headerCompiled) {
        // Use this headerCompiled field to only compile header once
        vm.headerCompiled = true;
        $compile(angular.element(header).contents())($scope);
      }
    }

    function actionsHtml(data, type, full, meta) {
      vm.metio[data.ID] = data;
      var editbtn = ($scope.canIAction().update) ? '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="vm.edit(vm.metio[' + data.ID + '])"><i class="fa fa-edit"></i></button>&nbsp;' : '';
      var deletebtn = ($scope.canIAction().delete) ? '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="vm.delete(vm.metio[' + data.ID + '])" )"=""><i class="fa fa-trash-o"></i></button>' : '';
      return editbtn + deletebtn;
    }

    vm.delete = async function(c) {
      vm.IDmetio = c.ID;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            suivimeteo.delete({
              ID: vm.IDmetio
            }).then(async function(result) {
              if (result.data[0].message == "ajout reussi") {
                //validate success
                toastr.clear();
                toastr.info(await translatedwords.getTranslatedWord($translate("Suppression réussie")), {
                  closeButton: true
                });
                NProgress.done();
                vm.dtInstance.reloadData();
              } else {
                toastr.clear();
                toastr.error(await translatedwords.getTranslatedWord($translate("An error occured")) + result.data[0].description, {
                  closeButton: true
                });
              }
            });
          });
        }
      });

    }

    $scope.ReverseDisplay = function(d) {
      if (document.getElementById(d).style.display === "none") {
        document.getElementById(d).style.display = "block";
      } else {
        document.getElementById(d).style.display = "none";
      }
    }

    function toggleAll(selectAll, selectedItems) {
      for (var id in selectedItems) {
        if (selectedItems.hasOwnProperty(id)) {
          selectedItems[id] = selectAll;
        }
      }
    }

    function toggleOne(selectedItems) {
      for (var id in selectedItems) {
        if (selectedItems.hasOwnProperty(id)) {
          if (!selectedItems[id]) {
            vm.selectAll = false;
            return;
          }
        }
      }
      vm.selectAll = true;
    }
  });