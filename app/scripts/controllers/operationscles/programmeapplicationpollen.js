'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:OperationsclesProgrammeapplicationpollenCtrl
 * @description
 * # OperationsclesProgrammeapplicationpollenCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('OperationsclesProgrammeapplicationpollenCtrl', function($scope, translatedwords, DTOptionsBuilder, $translatePartialLoader, $translate, $window, DTColumnBuilder, $q, $compile, $state, DTDefaultOptions, $cookies, programmeapplicationpollen, $mdDialog, toastr, campagneagricole) {

    var pc = this;
    pc.dtInstance = {};
    pc.programmeapplicationpollen = {};
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    pc.IDferme = $cookies.getObject('globals').ferme.IDFerme;
    pc.IDSOCIETE = $cookies.getObject('globals').ferme.IDSociete;
    pc.IDprofile = $cookies.getObject('globals').currentUser.ID;
    pc.createdby = $cookies.getObject('globals').currentUser.Nom + ' ' + $cookies.getObject('globals').currentUser.Prenom;

    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
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


    var permission_data = JSON.parse($window.localStorage.getItem('permission'));
    var permission = {
      modules_array: permission_data[0],
      rubriques_array: permission_data[1],
      sous_modules_array: permission_data[2]
    }

    pc.isAdmin = $cookies.getObject('globals').currentUser.isAdmin;

    var opsemisAccess = _.filter(permission.sous_modules_array, {
      ss_module: 'programme_application_pollen'
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

    if ($scope.canIAction().add) {
      $scope.btnadd = {
        text: "<i class='fa fa-plus'></i>",
        key: '1',
        className: 'pull-left',
        action: function(e, dt, node, config) {
          pc.Add()
        },
        titleAttr: 'Ajouter'
      }
    } else {
      $scope.btnadd = undefined;
    }

    //set date input
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();


    pc.obj = {
      "DOMAINE": pc.IDferme,
      "DATE_DEBUT": 0,
      "DATE_FIN": moment($scope.date_fin).format('YYYYMMDD')
    };



    $scope.date_debut_sel = 0;
    $scope.date_fin_sel = moment($scope.date_fin).format('YYYYMMDD');



    //by date_debutl
    $scope.date_debut_change = function() {

      if ($scope.date_debut === null || $scope.date_debut === "" || $scope.date_debut === undefined || $scope.date_debut === 0 || $scope.date_debut === "0" || !$scope.date_debut || $scope.date_debut.length === 0) {
        $scope.date_debut_sel = 0;
      } else {
        $scope.date_debut_sel = $scope.date_debut;
      }

      pc.obj.DATE_DEBUT = moment($scope.date_debut_sel).format('YYYYMMDD');
      try {
        pc.dtInstance.reloadData();
      } catch (error) {}


    };

    //by date_fin
    $scope.date_fin_change = function() {

      if ($scope.date_fin === null || $scope.date_fin === "" || $scope.date_fin === undefined || $scope.date_fin === 0 || $scope.date_fin === "0" || !$scope.date_fin || $scope.date_fin.length === 0) {
        $scope.date_fin_sel = 0;
      } else {
        $scope.date_fin_sel = $scope.date_fin;
      }

      pc.obj.DATE_FIN = moment($scope.date_fin_sel).format('YYYYMMDD');
      try {
        pc.dtInstance.reloadData();
      } catch (error) {}


    };

    //get data and refresh datatable
    $scope.updateDataprogrammeapplicationpollen = function(data) {
      return programmeapplicationpollen.getProgrammeAppPollen(data);
    };

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        $scope.updateDataprogrammeapplicationpollen(pc.obj).then(function(res) {
          defer.resolve(res.data);
          NProgress.done();
        });
        return defer.promise;
      })
      .withOption('deferRender', true)
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
        }
      ].concat($scope.btnadd));

    pc.dtColumns = [
      DTColumnBuilder.newColumn('DateCreated').withTitle(translatedwords.getTranslatedWord($translate("Date"))).renderWith(function(data, type, full, meta) {
        return moment(full.DateCreated).format('DD/MM/YYYY');
      }),
      DTColumnBuilder.newColumn('Ref').withTitle(translatedwords.getTranslatedWord($translate("Référence"))),
      DTColumnBuilder.newColumn('NombreSpathe').withTitle(translatedwords.getTranslatedWord($translate("Nombre de spathe à polliniser"))).renderWith(function(data, type, full, meta) {
        return '<p align="right">' + full.NombreSpathe + '</p>';
      }),
      DTColumnBuilder.newColumn('QuantitePoudre').withTitle(translatedwords.getTranslatedWord($translate("Quantité de poudre par spathe (g)"))).renderWith(function(data, type, full, meta) {
        return '<p align="right">' + full.QuantitePoudre + '</p>';
      }),
      DTColumnBuilder.newColumn('Quantite').withTitle(translatedwords.getTranslatedWord($translate("Quantité totale (Kg)"))).renderWith(function(data, type, full, meta) {
        return '<p align="right">' + full.Quantite + '</p>';
      }),
      DTColumnBuilder.newColumn('Talc').withTitle(translatedwords.getTranslatedWord($translate("Talc"))).renderWith(function(data, type, full, meta) {
        return '<p align="right">' + full.Talc + '</p>';
      }),
      DTColumnBuilder.newColumn('Carbone').withTitle(translatedwords.getTranslatedWord($translate("Carbone"))).renderWith(function(data, type, full, meta) {
        return '<p align="right">' + full.Carbone + '</p>';
      }),
      DTColumnBuilder.newColumn('CreatedBy').withTitle(translatedwords.getTranslatedWord($translate("Observateur"))),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).notSortable().renderWith(actionsHtml).withClass('nowraptd all')
    ];

    function actionsHtml(data, type, full, meta) {
      pc.programmeapplicationpollen[data.ID] = data;
      var editbtn = ($scope.canIAction().update) ? '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.Edit(pc.programmeapplicationpollen[' + data.ID + '])"><i class="fa fa-edit"></i></button>&nbsp;' : '';
      var deletebtn = ($scope.canIAction().delete) ? '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.Delete(pc.programmeapplicationpollen[' + data.ID + '])" )"=""><i class="fa fa-trash-o"></i></button>' : '';
      return editbtn + deletebtn;
    }


    //add Addprogrammeapplicationpollen
    pc.Add = function() {
      $scope.showAdvancedAdd("ev");
    }

    $scope.showAdvancedAdd = function(ev) {
      $mdDialog.show({
          controller: DialogControllerAdd,
          templateUrl: '././views/templates/programmeapplicationpollen/Addprogrammeapplicationpollen.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    function DialogControllerAdd($scope, $mdDialog) {
      $scope.QtePoudre = 2;

      $q.all([programmeapplicationpollen.getparcelles({
        IDferme: pc.IDferme
      })]).then((values) => {
        $scope.parcelleculturals = values[0].data;
        NProgress.done();
        $scope.letmeclick = true;
      });

      $scope.parcelleculturalsel = [];

      $scope.setfoodsParcelle = function() {
        programmeapplicationpollen.getarbres({
          IDferme: pc.IDferme,
          PARCELLE: $scope.parcelleculturalsel
        }).then(async e => {
          NProgress.done();
          $scope.Arbres = e.data;
          $scope.NbrSpathe = parseFloat(_.sumBy($scope.Arbres, 'Nombre').toFixed(2));
          try {
            if ($scope.Arbres.name === "ConnectionError") {
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
                closeButton: true
              });
              $scope.Arbres = [];
              $scope.NbrSpathe = undefined;
            }
          } catch (e) {

          }
        }).catch(async e => {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
            closeButton: true
          });
        });
      }

      $scope.DateProgramme = new Date(moment().format("YYYY-MM-DD"));

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

      $scope.setQuantite = function() {
        $scope.qtee = ($scope.QtePoudre * $scope.NbrSpathe) / 1000;
        return parseFloat($scope.qtee.toFixed(2));
      }

      $scope.hide = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Annuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Ajouter = async function() {
        $scope.progress = true;
        toastr.clear();


        if ($scope.DateProgramme && $scope.Reference && document.getElementById("QuantiteTotal").value >= 0 && $scope.Talc >= 0 && $scope.Carbone >= 0 && $scope.parcelleculturalsel.length > 0 && $scope.NbrSpathe >= 0 && $scope.QtePoudre >= 0) {
          pc.objAdd = {
            "DateProgramme": moment($scope.DateProgramme).format('YYYYMMDD'),
            "Reference": $scope.Reference,
            "Quantite": document.getElementById("QuantiteTotal").value,
            "Talc": $scope.Talc,
            "Carbone": $scope.Carbone,
            "NbrSpathe": $scope.NbrSpathe,
            "QtePoudre": $scope.QtePoudre,
            "Arbres": $scope.Arbres,
            "ID_Profil": pc.IDprofile,
            "ID_Ferme": pc.IDferme,
            "CreatedBy": pc.createdby,
            "TimeCreated": moment().format('HH:mm')
          };

          programmeapplicationpollen.create(pc.objAdd).then(async function(res) {
            pc.resAdd = res.data;
            if (pc.resAdd[0].message == 'ajout reussi') {
              toastr.clear();
              toastr.info(await translatedwords.getTranslatedWord($translate("Ajout reussi!")), {
                closeButton: true
              });
              NProgress.done();
              $mdDialog.hide();
              document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
              pc.dtInstance.reloadData();
            } else {
              $scope.progress = false;
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("An error occured ")) + pc.resAdd[0].description, {
                closeButton: true
              });
            }
          });

        } else {
          $scope.progress = false;
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
            closeButton: true
          });
        }

      };
    }

    pc.Edit = function(dataProgrammePollen) {
      $scope.showAdvancedEdit("ev", dataProgrammePollen);
    }

    $scope.showAdvancedEdit = function(ev, dataProgrammePollen) {
      $mdDialog.show({
          controller: DialogControllerEdit,
          templateUrl: '././views/templates/programmeapplicationpollen/Editprogrammeapplicationpollen.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            dataProgrammePollen: dataProgrammePollen
          }
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    function DialogControllerEdit($scope, $mdDialog, dataProgrammePollen) {
      $scope.dataProgrammePollen = dataProgrammePollen;
      $scope.DateProgramme = new Date(moment($scope.dataProgrammePollen.DateCreated).format("YYYY-MM-DD"));

      $scope.NbrSpathe = $scope.dataProgrammePollen.NombreSpathe;
      $scope.QtePoudre = $scope.dataProgrammePollen.QuantitePoudre;
      $scope.Quantite = $scope.dataProgrammePollen.Quantite;

      $q.all([programmeapplicationpollen.getparcelles({
        IDferme: pc.IDferme
      })]).then((values) => {
        $scope.parcelleculturals = values[0].data;
        NProgress.done();
        $scope.letmeclick = true;
      });

      $scope.parcelleculturalsel = [];

      $scope.setfoodsParcelle = function() {
        programmeapplicationpollen.getarbres({
          IDferme: pc.IDferme,
          PARCELLE: $scope.parcelleculturalsel
        }).then(async e => {
          NProgress.done();
          $scope.Arbres = e.data;
          $scope.NbrSpathe = parseFloat(_.sumBy($scope.Arbres, 'Nombre').toFixed(2));
          try {
            if ($scope.Arbres.name === "ConnectionError") {
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
                closeButton: true
              });
              $scope.Arbres = [];
              $scope.NbrSpathe = undefined;
            }
          } catch (e) {

          }
        }).catch(async e => {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
            closeButton: true
          });
        });
      }

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

      $scope.setQuantite = function() {
        $scope.qtee = ($scope.QtePoudre * $scope.NbrSpathe) / 1000;
        return parseFloat($scope.qtee.toFixed(2));
      }

      $scope.hide = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Annuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Modifer = async function() {

        $scope.progress = true;
        toastr.clear();


        if ($scope.DateProgramme && document.getElementById("QuantiteTotal").value >= 0 >= 0 && $scope.dataProgrammePollen.Talc >= 0 && $scope.dataProgrammePollen.Carbone >= 0 && $scope.NbrSpathe >= 0 && $scope.QtePoudre >= 0) {
          pc.objEdit = {
            "ID": $scope.dataProgrammePollen.ID,
            "DateProgramme": moment($scope.DateProgramme).format('YYYYMMDD'),
            "Quantite": document.getElementById("QuantiteTotal").value,
            "Talc": $scope.dataProgrammePollen.Talc,
            "NbrSpathe": $scope.NbrSpathe,
            "QtePoudre": $scope.QtePoudre,
            "Carbone": $scope.dataProgrammePollen.Carbone
          };


          programmeapplicationpollen.update(pc.objEdit).then(async function(res) {
            pc.resAdd = res.data;
            if (pc.resAdd[0].message == 'ajout reussi') {
              toastr.clear();
              toastr.info(await translatedwords.getTranslatedWord($translate("Modification reussite")), {
                closeButton: true
              });
              NProgress.done();
              $mdDialog.hide();
              document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
              pc.dtInstance.reloadData();
            } else {
              $scope.progress = false;
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("An error occured ")) + pc.resAdd[0].description, {
                closeButton: true
              });
            }
          });


        } else {
          $scope.progress = false;
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
            closeButton: true
          });
        }

      };
    }


    pc.Delete = async function(data) {
      pc.IDprogramme = data.ID;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            programmeapplicationpollen.delete({
              "ID": pc.IDprogramme
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
                toastr.error(await translatedwords.getTranslatedWord($translate("An error occured ")) + result.data[0].description, {
                  closeButton: true
                });
              }
            });
          });
        }
      });

    }

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

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



  });