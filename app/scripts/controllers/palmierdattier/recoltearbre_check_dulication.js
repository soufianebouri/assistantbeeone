'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:PalmierdattierRecoltearbreCheckDulicationCtrl
 * @description
 * # PalmierdattierRecoltearbreCheckDulicationCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('PalmierdattierRecoltearbreCheckDulicationCtrl', function($scope, DTOptionsBuilder, translatedwords, $http, $translatePartialLoader, $translate, $window, DTColumnBuilder, $q, $compile, toastr, recolteArbre, $state, $cookies, parcellecultural, DTDefaultOptions, $mdDialog) {

    //alert();
    var pc = this;
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    $scope.RecolteArbreAction = {};
    pc.dtInstance = {};
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());


    var permission_data = JSON.parse($window.localStorage.getItem('permission'));
    var permission = {
      modules_array: permission_data[0],
      rubriques_array: permission_data[1],
      sous_modules_array: permission_data[2]
    }

    pc.isAdmin = $cookies.getObject('globals').currentUser.isAdmin;
    pc.idUser = $cookies.getObject('globals').currentUser.ID;


    var opsemisAccess = _.filter(permission.sous_modules_array, {
      ss_module: 'Recolte_Arbre'
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
      "DOMAINE": $cookies.getObject('globals').ferme.IDFerme,
      "USER": null,
      "DATE": null,
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
      searchText: ''
    };

    $q.all([recolteArbre.getrecolteusers({
      DOMAINE: $cookies.getObject('globals').ferme.IDFerme
    })]).then((values) => {
      pc.users_array = values[0].data;

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

    pc.duplicated_count = 0;
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


        //  }

        if (pc.obj.USER && pc.obj.DATE) {
          NProgress.start();
          $http({
            method: 'POST',
            url: recolteArbre.getDulicatedRowForDatatable(),
            data: pc.obj
          }).then(function(res) {
            pc.duplicated_count = 0;
            callback({
              recordsTotal: res.data.recordsTotal,
              recordsFiltered: res.data.recordsFiltered,
              data: res.data.data
            });
            NProgress.done();
          });
        } else {
          callback({
            recordsTotal: 0,
            recordsFiltered: 0,
            data: []
          });
          NProgress.done();
        }


      })
      .withDataProp('data')
      .withOption('processing', false) //for show progress bar
      .withOption('serverSide', true) // for server side processing
      .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
      .withDisplayLength(10)
      .withOption('lengthMenu', [10, 50, 100, 200])
      .withOption('bSort', false)
      .withOption('bFilter', false)
      .withScroller()
      .withLanguage($.getJSON(`/scripts/i18n/datatable/${$window.localStorage.getItem("lang").toLowerCase()}.json`, function(data) {
        return data
      }))
      /*.withOption('fnRowCallback', function(nRow, aData) {
        var rowNum = parseInt(aData.RowNum);

        if (rowNum >= 2) {
          angular.element(nRow).css('background-color', '#f23f3f');
        }

        return nRow;
      })*/

      .withButtons([{
          text: "<i class='fa fa-arrow-left'></i>",
          className: 'pull-left',
          action: function(e, dt, node, config) {
            $state.go("recolteArbre");
          },
          titleAttr: "Back"
        }, {
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
        }
      ]);

    pc.dtColumns = [
      DTColumnBuilder.newColumn('RowNum').withTitle("Statut").renderWith(function(data, type, full, meta) {
        var bgColor = parseInt(full.RowNum) > 1 ? '#f23f3f' : 'transparent';
        if (full.RowNum > 1) {
          pc.duplicated_count++;
          return '<span style="background-color: ' + bgColor + '; color: #ffffff;padding: 2px; border-radius: 5px; display: inline-block;">Doublon</span>';
        } else {
          return "";
        }
      }),
      DTColumnBuilder.newColumn('DateCreated').withTitle(translatedwords.getTranslatedWord($translate("Date"))).renderWith(function(data, type, full, meta) {
        if (full.DateCreated)
          return moment(full.DateCreated).format('DD/MM/YYYY');
        return "";
      }),
      DTColumnBuilder.newColumn('Ref').withTitle(translatedwords.getTranslatedWord($translate("Parcelle culturale"))),
      DTColumnBuilder.newColumn('Culture').withTitle(translatedwords.getTranslatedWord($translate("Culture"))),
      DTColumnBuilder.newColumn('Variete').withTitle(translatedwords.getTranslatedWord($translate("Variété"))),
      DTColumnBuilder.newColumn('Porte_greffe').withTitle(translatedwords.getTranslatedWord($translate("Porte-Greffe"))),
      DTColumnBuilder.newColumn('Quantite').withTitle(translatedwords.getTranslatedWord($translate("Quantité"))),
      DTColumnBuilder.newColumn('Code_Arbre').withTitle(translatedwords.getTranslatedWord($translate("Arbre"))),
      DTColumnBuilder.newColumn('Nom').withTitle(translatedwords.getTranslatedWord($translate("Ouvrier"))).renderWith(function(data, type, full, meta) {
        return full.Nom + " " + full.Prenom;
      }),
      DTColumnBuilder.newColumn('QR_caisse').withTitle(translatedwords.getTranslatedWord($translate("Qr Caisse"))),
      DTColumnBuilder.newColumn('CreatedBy').withTitle(translatedwords.getTranslatedWord($translate("Observateur")))
    ];

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');


    $scope.delete = async function() {
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            recolteArbre.deleteDuplicatedRow(pc.obj).then(async function(result) {
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

    //by users
    pc.users_change = function() {

      var userRecolte = $scope.userRecolte.userRecolte;

      if (validateInput(userRecolte) || $scope.userRecolte.userRecolte.length === 0 || $scope.userRecolte.userRecolte.includes(0))
        userRecolte = [0];
      pc.obj.USER = userRecolte;

    };
    //starting date change listner
    pc.date_debut_change = function() {

      var dateToChoose = $scope.date_debut;
      if (validateInput(dateToChoose))
        dateToChoose = 0;

      pc.obj.DATE = moment(dateToChoose).format('YYYYMMDD');

    };

    $scope.rechercherbyFilter = function() {
      if (pc.obj.DATE && pc.obj.USER) {
        try {
          pc.dtInstance.reloadData();
        } catch (e) {}
      } else {
        toastr.clear();
        toastr.info((!pc.obj.DATE) ? "Veuillez renseigner la date de création!" : "Veuillez renseigner l'utilisateur de la récolte!", {
          closeButton: true
        });
      }
    }


    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
    }

  });