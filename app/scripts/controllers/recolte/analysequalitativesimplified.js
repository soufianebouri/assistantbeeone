'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RecolteAnalysequalitativesimplifiedCtrl
 * @description
 * # RecolteAnalysequalitativesimplifiedCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RecolteAnalysequalitativesimplifiedCtrl', function($scope, translatedwords, $translate, fermete, $filter, $translatePartialLoader, $window, campagneagricole,
    DTOptionsBuilder, NiveauColorationService, DTColumnBuilder, $q, _url, $compile, analyseQualitative, analyseQualitativesimplified, parcellecultural, $cookies, $state, DTDefaultOptions, $mdDialog, toastr) {

    //alert();
    var pc = this;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    pc.dtInstance = {};
    pc.anakysequalitativeObject = {};
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    pc.User = $cookies.getObject('globals').currentUser.Nom + " " + $cookies.getObject('globals').currentUser.Prenom;
    pc.IDUser = $cookies.getObject('globals').currentUser.ID;
    pc.IDferme = $cookies.getObject('globals').ferme.IDFerme;
    pc.IDSociete = $cookies.getObject('globals').ferme.IDSociete;


    analyseQualitative.getmodeAnalyseQualitative({
      farm: pc.IDferme
    }).then(function(result) {
      NProgress.done();
      try {
        if (!result.data[0].mode_analyse_qualitative) {
          $state.go('analyseQualitative');
        }
      } catch (e) {
        $state.go('analyseQualitative');
      }

    }).catch(async e => {
      toastr.clear();
      toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
        closeButton: true
      });
    });


    var permission_data = JSON.parse($window.localStorage.getItem('permission'));
    var permission = {
      modules_array: permission_data[0],
      rubriques_array: permission_data[1],
      sous_modules_array: permission_data[2]
    }

    pc.isAdmin = $cookies.getObject('globals').currentUser.isAdmin;

    var opsemisAccess = _.filter(permission.sous_modules_array, {
      ss_module: 'analyse_qualitative'
    });

    $scope.canIAction = () => {
      if (pc.isAdmin)
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

    pc.obj = {
      "DOMAINE": pc.IDferme,
      "PARCELLE": [0],
      "DATE_DEBUT": 0,
      "DATE_FIN": moment().format('YYYYMMDD')
    };

    $q.all([parcellecultural.getParcelleCulturalByFerme($cookies.getObject('globals').ferme.IDFerme)]).then((values) => {
      pc.parcelles_array = values[0].data;
      NProgress.done();
      setTimeout(function() {
        $(".selectpicker").selectpicker('refresh');
      }, 1000);
    });




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
            pc.selectAll = false;
            return;
          }
        }
      }
      pc.selectAll = true;
    }


    if ($scope.canIAction().add) {
      $scope.btnadd = {
        text: "<i class='fa fa-plus'></i>",
        key: '1',
        className: 'pull-left',
        action: function(e, dt, node, config) {
          $scope.AddAnalyse()
        },
        titleAttr: 'Ajouter'
      }
    } else {
      $scope.btnadd = undefined;
    }

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        analyseQualitativesimplified.getAnalyseQualitative(pc.obj).then(function(result) {
          NProgress.done();
          defer.resolve(result.data);
        });
        return defer.promise;
      })
      .withDOM('<lf<t>ip>')
      .withPaginationType('simple_numbers')
      .withDisplayLength(10)
      .withOption('createdRow', createdRow)
      .withOption('headerCallback', headerCallback)
      .withOption('order', [0, 'asc'])
      .withScroller()
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
        },
        {
          text: "<i class='fa fa-area-chart'></i>",
          action: function(e, dt, node, config) {
            $state.go("analysequalitativesimplifiedchart");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Vue graphique"))
        }
      ].concat($scope.btnadd));

    pc.dtColumns = [
      DTColumnBuilder.newColumn('Date').withTitle(translatedwords.getTranslatedWord($translate("Date"))).renderWith(function(data, type, full, meta) {
        return moment(full.Date).format('DD/MM/YYYY');
      }),
      DTColumnBuilder.newColumn('Variete').withTitle(translatedwords.getTranslatedWord($translate("Variété"))),
      DTColumnBuilder.newColumn('business_unit').withTitle(translatedwords.getTranslatedWord($translate("Busness unit"))),
      DTColumnBuilder.newColumn('NParcelle').withTitle(translatedwords.getTranslatedWord($translate("N° Parcelle"))),
      DTColumnBuilder.newColumn('Tauxjus').withTitle(translatedwords.getTranslatedWord($translate("Taux de Jus %"))).renderWith(function(data, type, full, meta) {
        if (full.Tauxjus)
          return '<p align="right">' + full.Tauxjus.toFixed(2) + '</p>';
        return '';
      }),
      DTColumnBuilder.newColumn('Brix').withTitle(translatedwords.getTranslatedWord($translate("Brix"))).renderWith(function(data, type, full, meta) {
        if (full.Brix)
          return '<p align="right">' + full.Brix.toFixed(2) + '</p>';
        return '';
      }),
      DTColumnBuilder.newColumn('Acidite').withTitle(translatedwords.getTranslatedWord($translate("Acidité"))).renderWith(function(data, type, full, meta) {
        if (full.Acidite)
          return '<p align="right">' + full.Acidite.toFixed(2) + '</p>';
        return '';
      }),
      DTColumnBuilder.newColumn('RapportEA').withTitle(translatedwords.getTranslatedWord($translate("Rapport E/A"))).renderWith(function(data, type, full, meta) {
        if (full.RapportEA)
          return '<p align="right">' + full.RapportEA.toFixed(2) + '</p>';
        return '';
      }),
      DTColumnBuilder.newColumn('calibre').withTitle(translatedwords.getTranslatedWord($translate("Calibre"))),
      DTColumnBuilder.newColumn('Granulation_Leger').withTitle(translatedwords.getTranslatedWord($translate("Granulation Leger"))).renderWith(function(data, type, full, meta) {
        if (full.Granulation_Leger)
          return '<p align="right">' + full.Granulation_Leger.toFixed(2) + '</p>';
        return '';
      }),
      DTColumnBuilder.newColumn('Granulation_Moyen').withTitle(translatedwords.getTranslatedWord($translate("Granulation Moyen"))).renderWith(function(data, type, full, meta) {
        if (full.Granulation_Moyen)
          return '<p align="right">' + full.Granulation_Moyen.toFixed(2) + '</p>';
        return '';
      }),
      DTColumnBuilder.newColumn('Granulation_Sever').withTitle(translatedwords.getTranslatedWord($translate("Granulation Sever"))).renderWith(function(data, type, full, meta) {
        if (full.Granulation_Sever)
          return '<p align="right">' + full.Granulation_Sever.toFixed(2) + '</p>';
        return '';
      }),

      DTColumnBuilder.newColumn('Nbre_pepin_1_3').withTitle(translatedwords.getTranslatedWord($translate("Pipens 1-3"))).renderWith(function(data, type, full, meta) {
        if (full.Nbre_pepin_1_3)
          return '<p align="right">' + full.Nbre_pepin_1_3.toFixed(2) + '</p>';
        return '';
      }),
      DTColumnBuilder.newColumn('Nbre_pepin_4_5_plus').withTitle(translatedwords.getTranslatedWord($translate("Pipens 4-5+"))).renderWith(function(data, type, full, meta) {
        if (full.Nbre_pepin_4_5_plus)
          return '<p align="right">' + full.Nbre_pepin_4_5_plus.toFixed(2) + '</p>';
        return '';
      }),
      DTColumnBuilder.newColumn('Nbre_pepin').withTitle(translatedwords.getTranslatedWord($translate("Nbr Pipens"))).renderWith(function(data, type, full, meta) {
        if (full.Nbre_pepin)
          return '<p align="right">' + full.Nbre_pepin.toFixed(2) + '</p>';
        return '';
      }),
      DTColumnBuilder.newColumn('Gumming_Leger').withTitle(translatedwords.getTranslatedWord($translate("Gumming Leger"))).renderWith(function(data, type, full, meta) {
        if (full.Gumming_Leger)
          return '<p align="right">' + full.Gumming_Leger.toFixed(2) + '</p>';
        return '';
      }),
      DTColumnBuilder.newColumn('Gumming_Moyen').withTitle(translatedwords.getTranslatedWord($translate("Gumming Moyen"))).renderWith(function(data, type, full, meta) {
        if (full.Gumming_Moyen)
          return '<p align="right">' + full.Gumming_Moyen.toFixed(2) + '</p>';
        return '';
      }),
      DTColumnBuilder.newColumn('Gumming_Sever').withTitle(translatedwords.getTranslatedWord($translate("Gumming Sever"))).renderWith(function(data, type, full, meta) {
        if (full.Gumming_Sever)
          return '<p align="right">' + full.Gumming_Sever.toFixed(2) + '</p>';
        return '';
      }),
      DTColumnBuilder.newColumn('Observation').withTitle(translatedwords.getTranslatedWord($translate("Observation"))),
      DTColumnBuilder.newColumn('Observateur').withTitle(translatedwords.getTranslatedWord($translate("Observateur"))),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).notSortable().renderWith(actionsHtml).withClass('nowraptd all')
    ];

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');


    //Add AddAnalyse
    $scope.AddAnalyse = function() {
      $mdDialog.show({
          controller: DialogControllerAddAvancer,
          templateUrl: '././views/templates/analysequalitative/AddAnalyseQualitativeSimplified.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true,
          escapeToClose: false
        })
        .then(function(answer) {}, function() {});
    }

    //Add AddAnalyse
    function DialogControllerAddAvancer($scope, $mdDialog) {
      $q.all([
        parcellecultural.getParcelleCulturalByFerme(pc.IDferme)
      ]).then((values) => {
        NProgress.done();
        $scope.parcelleculturals = values[0].data;
        $scope.letmeclick = true;
      });

      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
      $scope.parcelleculturalsel = [];
      $scope.Dateanalyses = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
      $scope.NbrFruitEchantillon = 20;
      $scope.NiveauColoration = [];
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



      async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
      }

      $scope.setRapportEA = function() {
        try {
          $scope.RapportEA = parseFloat(($scope.Brix / $scope.Acidite).toFixed(2));
        } catch (e) {
          $scope.RapportEA = null;
        }

      }


      $scope.calibre = "Tous calibre";

      //add click
      $scope.AjouterSimplified = async function() {

        $scope.progress = true;
        toastr.clear();

        if ($scope.parcelleculturalsel.ID && $scope.Dateanalyses) {

          pc.objAdd = {
            "parcelleculturalsel": $scope.parcelleculturalsel.ID,
            "Dateanalyses": moment($scope.Dateanalyses).format('YYYYMMDD'),
            "TauxJus": $scope.TauxJus,
            "Brix": $scope.Brix,
            "Acidite": $scope.Acidite,
            "RapportEA": $scope.RapportEA,
            "Gumming_Leger": $scope.Gumming_Leger,
            "Gumming_Moyen": $scope.Gumming_Moyen,
            "Gumming_Sever": $scope.Gumming_Sever,
            "Granulation_Leger": $scope.Granulation_Leger,
            "Granulation_Moyen": $scope.Granulation_Moyen,
            "Granulation_Sever": $scope.Granulation_Sever,
            "Nbre_pepin_1_3": $scope.Nbre_pepin_1_3,
            "Nbre_pepin_4_5_plus": $scope.Nbre_pepin_4_5_plus,
            "Nbre_pepin": $scope.Nbre_pepin,
            "Observation": ($scope.Observation) ? $filter('textforsqlserver')($scope.Observation) : "",
            "Utilisateur": pc.User,
            "IDFermes": pc.IDferme,
            "IDUser": pc.IDUser,
            "calibre": $scope.calibre
          }

          analyseQualitativesimplified.createweb(pc.objAdd).then(async e => {
            if (e.data[0].message == "ajout reussi") {
              //validate success
              toastr.clear();
              toastr.info(await translatedwords.getTranslatedWord($translate("Ajout reussi")), {
                closeButton: true
              });
              NProgress.done();
              $mdDialog.hide();
              document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
              pc.dtInstance.reloadData();
            } else {
              $scope.progress = false;
              toastr.clear();
              toastr.error(e.data, {
                closeButton: true
              });
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

      $scope.AnnulerAvancer = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };


    }

    //Add AddAnalyse
    pc.edit = function(data) {
      $mdDialog.show({
          controller: DialogControlleredit,
          templateUrl: '././views/templates/analysequalitative/EditAnalyseQualitativeSimplified.html',
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
    function DialogControlleredit($scope, $mdDialog, data) {
      $q.all([
        parcellecultural.getParcelleCulturalByFerme(pc.IDferme)
      ]).then((values) => {
        NProgress.done();
        $scope.parcelleculturals = values[0].data;
        $scope.letmeclick = true;
      });


      document.getElementById('filter_form').style.display = "none";

      $scope.data = data;
      $scope.Dateanalyses = ($scope.data.Date) ? new Date(moment($scope.data.Date).format("YYYY-MM-DD")) : null;

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

      async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
      }





      $scope.setRapportEA = function() {
        try {
          $scope.data.RapportEA = parseFloat(($scope.data.Brix / $scope.data.Acidite).toFixed(2));
        } catch (e) {
          $scope.data.RapportEA = null;
        }
      }

      $scope.calibre = $scope.data.calibre;
      //add click
      $scope.Modifier = async function() {

        $scope.progress = true;
        toastr.clear();

        if ($scope.parcelleculturalsel.ID && $scope.Dateanalyses) {
          pc.objEdit = {
            "ID": $scope.data.ID,
            "parcelleculturalsel": $scope.parcelleculturalsel.ID,
            "Dateanalyses": moment($scope.Dateanalyses).format('YYYYMMDD'),
            "TauxJus": $scope.data.Tauxjus,
            "Brix": $scope.data.Brix,
            "Acidite": $scope.data.Acidite,
            "RapportEA": $scope.data.RapportEA,
            "Gumming_Leger": $scope.data.Gumming_Leger,
            "Gumming_Moyen": $scope.data.Gumming_Moyen,
            "Gumming_Sever": $scope.data.Gumming_Sever,
            "Granulation_Leger": $scope.data.Granulation_Leger,
            "Granulation_Moyen": $scope.data.Granulation_Moyen,
            "Granulation_Sever": $scope.data.Granulation_Sever,
            "Nbre_pepin_1_3": $scope.data.Nbre_pepin_1_3,
            "Nbre_pepin_4_5_plus": $scope.data.Nbre_pepin_4_5_plus,
            "Nbre_pepin": $scope.data.Nbre_pepin,
            "calibre": $scope.calibre,
            "Observation": ($scope.data.Observation) ? $filter('textforsqlserver')($scope.data.Observation) : ""
          }

          analyseQualitativesimplified.updateWeb(pc.objEdit).then(async e => {
            if (e.data[0].message == "ajout reussi") {
              //validate success
              toastr.clear();
              toastr.info(await translatedwords.getTranslatedWord($translate("Modification réussie")), {
                closeButton: true
              });
              NProgress.done();
              $mdDialog.hide();
              document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
              pc.dtInstance.reloadData();
            } else {
              $scope.progress = false;
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("An error occured ")) + e.data, {
                closeButton: true
              });
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


    pc.delete = async function(c) {
      pc.ID = c.ID;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            analyseQualitative.deleteweb({
              ID: pc.ID
            }).then(async function(result) {
              if (result.data[0].message == "ajout reussi") {
                //validate success
                toastr.clear();
                toastr.info(await translatedwords.getTranslatedWord($translate("Suppression réussie")), {
                  closeButton: true
                });
                NProgress.done();
                pc.dtInstance.reloadData();
              } else {
                toastr.clear();
                toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + result.data[0].description, {
                  closeButton: true
                });
              }
            });
          });
        }
      });

    }

    function actionsHtml(data, type, full, meta) {
      pc.anakysequalitativeObject[data.ID] = data;
      var editbtn = ($scope.canIAction().update) ? '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.edit(pc.anakysequalitativeObject[' + data.ID + '])"><i class="fa fa-edit"></i></button>&nbsp;' : '';
      var deletebtn = ($scope.canIAction().delete) ? '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.anakysequalitativeObject[' + data.ID + '])" )"=""><i class="fa fa-trash-o"></i></button>' : '';
      return editbtn + deletebtn;
    }

    function edit(c) {}

    function deleteRow(c) {}

    function createdRow(row, data, dataIndex) {
      // Recompiling so we can bind Angular directive to the DT
      $compile(angular.element(row).contents())($scope);
    }

    function headerCallback(header) {
      if (!pc.headerCompiled) {
        // Use this headerCompiled field to only compile header once
        pc.headerCompiled = true;
        $compile(angular.element(header).contents())($scope);
      }
    }

    //by parcelle cultural
    pc.parcelle_change = function() {

      var parcelle = $scope.parcelle.parcelle;

      if (validateInput(parcelle) || $scope.parcelle.parcelle.length === 0 || $scope.parcelle.parcelle.includes(0))
        parcelle = [0];

      pc.obj.PARCELLE = parcelle;
      try {
        pc.dtInstance.reloadData();
      } catch (e) {}


    };
    //starting date change listner
    pc.date_debut_change = function() {

      var dateToChoose = $scope.date_debut;
      if (validateInput(dateToChoose))
        dateToChoose = 0;

      pc.obj.DATE_DEBUT = moment(dateToChoose).format('YYYYMMDD');
      try {
        pc.dtInstance.reloadData();
      } catch (e) {}


    };

    //by date_fin
    pc.date_fin_change = function() {

      var dateToChoose = $scope.date_fin;
      if (validateInput(dateToChoose))
        dateToChoose = 0;

      pc.obj.DATE_FIN = moment(dateToChoose).format('YYYYMMDD');
      try {
        pc.dtInstance.reloadData();
      } catch (e) {}


    };

    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
    }

  });