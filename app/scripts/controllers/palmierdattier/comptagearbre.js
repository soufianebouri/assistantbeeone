'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:PalmierdattierComptagearbreCtrl
 * @description
 * # PalmierdattierComptagearbreCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('PalmierdattierComptagearbreCtrl', function($scope, $window, savefilter, translatedwords, $http, Arbre, DTOptionsBuilder, GroupeOperationnel, $mdDialog, $translatePartialLoader, $translate,
    DTColumnBuilder, toastr, $q, $compile, comptageArbre, $state, parcellecultural, $cookies, DTDefaultOptions, elementcomptage, campagneagricole) {

    //alert();
    var pc = this;
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    pc.dtInstance = {};
    $scope.ComptageParArbreAction = {};
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

    pc.IDferme = $cookies.getObject('globals').ferme.IDFerme;

    pc.IDSociete = $cookies.getObject('globals').ferme.IDSociete;

    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    setTimeout(function() {
      $(".selectpicker").selectpicker('refresh');
      $("#parcelle").selectpicker('refresh');
    }, 1000);

    pc.obj = {
      "DOMAINE": [pc.IDferme],
      "PARCELLE": [0],
      "DATE_DEBUT": 0,
      "DATE_FIN": moment().format('YYYYMMDD'),
      page: {
        page: 0,
        pages: 0,
        start: 0,
        end: 10,
        length: 10,
        recordsTotal: 0,
        recordsDisplay: 0,
        serverSide: true
      },
      searchText: '',
      columnlastSort: [0, 'asc']
    };


    var permission_data = JSON.parse($window.localStorage.getItem('permission'));
    var permission = {
      modules_array: permission_data[0],
      rubriques_array: permission_data[1],
      sous_modules_array: permission_data[2]
    }

    pc.isAdmin = $cookies.getObject('globals').currentUser.isAdmin;

    var opsemisAccess = _.filter(permission.sous_modules_array, {
      ss_module: 'Comptage_arbre'
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
          pc.Add();
        },
        titleAttr: 'Ajouter'
      }
    } else {
      $scope.btnadd = undefined;
    }

    if (!angular.equals(savefilter.getFilters(), {})) {
      pc.obj.DATE_DEBUT = savefilter.getFilters().DATE_DEBUT;
      pc.obj.DATE_FIN = savefilter.getFilters().DATE_FIN;

      $scope.date_debut = moment(pc.obj.DATE_DEBUT, 'YYYY-MM-DD').toDate();
      $scope.date_fin = moment(pc.obj.DATE_FIN, 'YYYY-MM-DD').toDate();
    }

    $q.all([parcellecultural.getParcelleCulturalByFerme(pc.IDferme)]).then((values) => {
      pc.parcelles_array = values[0].data;
      NProgress.done();
      setTimeout(function() {
        $(".selectpicker").selectpicker('refresh');
        $("#parcelle").selectpicker('refresh');
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


    var mylistfilter = [{
      text: "Tous",
      action: function(e, dt, node, config) {
        $scope.searchByType("");
      },
      className: 'SetSize'
    }]

    pc.ElementsComptage = elementcomptage.GetElementComptage().then((values) => {
      angular.forEach(values.data, function(value, key) {
        mylistfilter.push({
          text: value.Nom,
          action: function(e, dt, node, config) {
            $scope.searchByType(value.Nom);
          },
          className: 'SetSize'
        })
      });
      return mylistfilter;
    });


    pc.dtColumns = [
      DTColumnBuilder.newColumn('DateCreated').withTitle(translatedwords.getTranslatedWord($translate("Date"))).renderWith(function(data, type, full, meta) {
        if (full.DateCreated)
          return moment(full.DateCreated).format('DD/MM/YYYY');
        return "";
      }),
      DTColumnBuilder.newColumn('Ref').withTitle(translatedwords.getTranslatedWord($translate("Parcelle culturale"))),
      DTColumnBuilder.newColumn('Culture').withTitle(translatedwords.getTranslatedWord($translate("Culture"))),
      DTColumnBuilder.newColumn('Variete').withTitle(translatedwords.getTranslatedWord($translate("Variété"))),
      DTColumnBuilder.newColumn('Porte_greffe').withTitle(translatedwords.getTranslatedWord($translate("Porte-Greffe"))),
      DTColumnBuilder.newColumn('Code_Arbre').withTitle(translatedwords.getTranslatedWord($translate("Arbre"))),
      DTColumnBuilder.newColumn('NomElement').withTitle(translatedwords.getTranslatedWord($translate("Élément de comptage"))),
      DTColumnBuilder.newColumn('Nombre').withTitle(translatedwords.getTranslatedWord($translate("Nombre"))).renderWith(function(data, type, full, meta) {
        return '<p align="right">' + full.Nombre + '</p>';
      }),
      DTColumnBuilder.newColumn('CreatedBy').withTitle(translatedwords.getTranslatedWord($translate("Observateur"))),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).renderWith(function(data, type, full, meta) { //pc.edit(pc.ProfileCalibreAction[' + data.ID + '], ' + $scope.visibleAtt + ')" )"="
        $scope.ComptageParArbreAction[full.ID] = full;
        var editbtn = ($scope.canIAction().update) ? '<button class="btn btn-warning btn-xs" title="Modifier"  onclick="angular.element(this).scope().edit(angular.element(this).scope().ComptageParArbreAction[' + data.ID + '])" >' + '   <i class="fa fa-edit"></i>' : '';
        var deletebtn = ($scope.canIAction().delete) ? '<button class="btn btn-danger btn-xs" title="Supprimer" onclick="angular.element(this).scope().delete(' + full.ID + ')"><i class="fa fa-trash-o"></i></button>' : '';
        return deletebtn + editbtn;
      }).withOption('width', '5%').notSortable().withClass('nowraptd all')
    ];

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');
    /*pc.dtColumns = [
      //here We will add .withOption('name','column_name') for send column name to the server
      DTColumnBuilder.newColumn("ID", "Customer ID").withOption('name', 'ID'),
      DTColumnBuilder.newColumn("Ref", "Company Name").withOption('name', 'Ref'),
      DTColumnBuilder.newColumn("Culture", "Contact Name").withOption('name', 'Culture'),
      DTColumnBuilder.newColumn("Porte_greffe", "Phone").withOption('name', 'Porte_greffe'),
      DTColumnBuilder.newColumn("Porte_greffe").withTitle('Status').renderWith(function(data, type, full, meta) {
        $scope.ComptageParArbreAction[full.ID] = full;
        var deletebtn = ($scope.canIAction().delete) ? '<button class="btn btn-danger btn-xs" title="Supprimer" onclick="angular.element(this).scope().delete(' + full.ID + ')"><i class="fa fa-trash-o"></i></button>' : '';
        return deletebtn;
      })
    ]*/



    //edit
    $scope.edit = async function(data) {
      $mdDialog.show({
          controller: DialogControllerEditComptageArbre,
          templateUrl: '././views/templates/comptageArbre/EditComptageArbre.html',
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

    //edit
    function DialogControllerEditComptageArbre($scope, $mdDialog, data) {
      $scope.data = data;
      $q.all([
        parcellecultural.getParcelleCulturalByFerme(pc.IDferme),
        GroupeOperationnel.getGroupeOperationnelByFerme({
          idferme: pc.IDferme
        }),
        Arbre.getArbreByParcelle({
          DOMAINE: pc.IDferme,
          PARCELLE_CULTURAL: [$scope.data.IDParcelleCulturale]
        }),
        elementcomptage.GetElementComptage()
      ]).then((values) => {
        NProgress.done();
        $scope.parcelleculturals = values[0].data;
        $scope.GroupeOperationnels = values[1].data;
        $scope.Arbres = values[2].data;
        $scope.Elements = values[3].data;
        $scope.letmeclick = true;
      });

      $scope.getParcellesByGO = () => {
        parcellecultural.showbydomaineandgroupe({
          idferme: pc.IDferme,
          idgroupe: $scope.GroupeOperationnelsel
        }).then(e => {
          NProgress.done();
          $scope.parcelleculturals = e.data;
          $scope.Arbres = [];
          $scope.parcelleculturalsel = null;
          $scope.IDArbre = {};
        }).catch(async e => {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
            closeButton: true
          });
        });
      }

      $scope.getArbreGO = () => {
        Arbre.getArbreByParcelle({
          DOMAINE: pc.IDferme,
          PARCELLE_CULTURAL: [$scope.parcelleculturalsel]
        }).then(e => {
          NProgress.done();
          $scope.Arbres = e.data;
          $scope.IDArbre = {};
        }).catch(async e => {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
            closeButton: true
          });
        });
      }


      $scope.icanadd = false;

      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
      $scope.DateObservation = ($scope.data.DateCreated) ? new Date(moment($scope.data.DateCreated).format("YYYY-MM-DD")) : null;

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


      //Modifier
      $scope.Modifier = async function() {

        $scope.progress = true;
        toastr.clear();

        if ($scope.DateObservation && $scope.parcelleculturalsel && !angular.equals({}, $scope.IDArbre) && $scope.IDEelement && $scope.data.Nombre >= 0) {

          pc.objEdit = {
            "ID": $scope.data.ID,
            "DateObservation": moment($scope.DateObservation).format('YYYYMMDD'),
            "parcelleculturalsel": $scope.parcelleculturalsel,
            "IDArbre": $scope.IDArbre,
            "IDEelement": $scope.IDEelement,
            "Nombre": $scope.data.Nombre
          }

          campagneagricole.CheckCodeCompagnebyTwoDates({
            date_debut: moment($scope.DateObservation).format('YYYYMMDD'),
            IDSOCIETE: pc.IDSociete
          }).then(async e => {
            if (e.data.length > 0) {
              pc.objEdit.Code_compagne = e.data[0].Code_compagne;

              comptageArbre.updateweb(pc.objEdit).then(async e => {
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
              toastr.error(await translatedwords.getTranslatedWord($translate("la date n'appartient a aucune campagne agricole !")), {
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
      }



      $scope.hideAvancer = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Annuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };


    }



    function GetDataToExport() {
      var jsonResult = $.ajax({
        url: comptageArbre.getURLALLPropsByFiltre(),
        data: pc.obj,
        method: 'POST',
        success: function(result) {},
        async: false
      });
      var exportBody = jsonResult.responseJSON;
      return exportBody.map(function(el) {
        return Object.keys(el).map(function(key) {
          return (key == 'DateCreated') ? moment(el[key]).format('DD/MM/YYYY') : el[key]
        });
      });
    }
    pc.dtOptions = DTOptionsBuilder.newOptions()
      .withOption('ajax', function(data, callback, settings, cols) {
        // make an ajax request using data.start and data.length
        //if (settings.aoData.length > 0) {
        var api = this.api();
        var pgNo = api.page.info();

        var currPg = pgNo.page;
        var totalPg = pgNo.pages;
        // get the label where i need to print the page number details
        var myEl = angular.element(document.querySelector('#pgNoDetail'));
        pc.obj.page = pgNo;

        var columnlastSort = settings.aaSorting[0];
        pc.obj.columnlastSort = (columnlastSort != 0) ? columnlastSort : [0, 'asc'];

        //  }

        pc.obj.searchText = document.querySelector('.dataTables_filter input').value;
        NProgress.start();
        $http({
          method: 'POST',
          url: comptageArbre.getURLALLPropsByFiltreForDatatable(),
          data: pc.obj
        }).then(function(res) {
          callback({
            recordsTotal: res.data.recordsTotal,
            recordsFiltered: res.data.recordsFiltered,
            data: res.data.data
          });
          NProgress.done();
        });

      })
      .withDataProp('data')
      .withOption('processing', false) //for show progress bar
      .withOption('serverSide', true) // for server side processing
      .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
      .withDisplayLength(10)
      .withOption('lengthMenu', [10, 50, 100, 200])
      .withOption('aaSorting', [0, 'asc']) // for default sorting column // here 0 means first column
      .withScroller()
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
          extend: 'collection',
          text: "Élément de comptage <i class='fa fa-chevron-down'></i>",
          buttons: pc.ElementsComptage
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
        }, {
          extend: 'excel',
          text: "<i class='fa fa-file-excel-o'></i>",
          titleAttr: 'EXCEL',
          customizeData: function(d) {
            var exportBody = GetDataToExport();
            d.body.length = 0;
            d.body.push.apply(d.body, exportBody);
            NProgress.done();
          }
        }, {
          text: "<i class='fa fa-map-marker'></i>",
          action: function(e, dt, node, config) {
            $state.go('comptagearbremap');
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Vue cartographique"))
        }, {
          text: "<i class='fa fa-table'></i>",
          action: function(e, dt, node, config) {
            $state.go("comptagearbresynthese");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Vue synthétique"))
        }, {
          text: "<i class='fa fa-table'></i>",
          action: function(e, dt, node, config) {
            $state.go("etatcomptagepararbre");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Etat comptage par arbre"))
        }, {
          text: "Etat nombre d'arbre",
          action: function(e, dt, node, config) {
            $state.go("etat_nombre_arbre");
          },
          titleAttr: "Etat nombre d'arbre"
        }
      ]);

    /*  pc.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
          dataSrc: "data",
          url: "http://localhost:9010/agridata-lga-backend/api/comptageArbre/getSomeProps",
          data: pc.obj,
          type: "POST"
        })
        .withOption('processing', true) //for show progress bar
        .withOption('serverSide', true) // for server side processing
        .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
        .withDisplayLength(10) // Page size
        .withOption('aaSorting', [0, 'asc'])*/




    $scope.delete = async function(c) {
      pc.IDComptageParArbre = c;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            comptageArbre.delete({
              ID: pc.IDComptageParArbre
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

    $scope.searchByType = function(type_text) {
      pc.dtInstance.DataTable.search(type_text).draw();
    };

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

    function actionsHtml(data, type, full, meta) {
      return '<button class="btn btn-warning btn-xs" ng-click="pc.edit(pc.obj[' + data.ID + '])">' +
        '   <i class="fa fa-edit"></i>' +
        '</button>&nbsp;' +
        '<button class="btn btn-danger btn-xs" ng-click="pc.delete(pc.obj[' + data.ID + '])" )"="">' +
        '   <i class="fa fa-trash-o"></i>' +
        '</button>';
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
        savefilter.setFilters(pc.obj);
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
        savefilter.setFilters(pc.obj);
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