'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RendementVenteCtrl
 * @description
 * # RendementVenteCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RendementVenteCtrl', function($scope, translatedwords, $translate, vente, fermete, $filter, $translatePartialLoader, $window, campagneagricole, DTOptionsBuilder, NiveauColorationService, DTColumnBuilder, $q, _url, $compile, analyseQualitative, $cookies, $state, DTDefaultOptions, $mdDialog, toastr) {

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
    pc.venteObject = {};
    pc.showtable = true;
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    pc.User = $cookies.getObject('globals').currentUser.Nom + " " + $cookies.getObject('globals').currentUser.Prenom;
    pc.IDUser = $cookies.getObject('globals').currentUser.ID;
    pc.IDferme = $cookies.getObject('globals').ferme.IDFerme;
    pc.IDSociete = $cookies.getObject('globals').ferme.IDSociete;

    var permission_data = JSON.parse($window.localStorage.getItem('permission'));
    var permission = {
      modules_array: permission_data[0],
      rubriques_array: permission_data[1],
      sous_modules_array: permission_data[2]
    }

    pc.isAdmin = $cookies.getObject('globals').currentUser.isAdmin;

    var opsemisAccess = _.filter(permission.sous_modules_array, {
      ss_module: 'vente'
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
      "STANDARD": true,
      "DOMAINE": $cookies.getObject('globals').ferme.IDFerme,
      "PARCELLE": [0],
      "DATE_DEBUT": 0,
      "DATE_FIN": moment().format('YYYYMMDD')
    };



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
          $scope.AddVente()
        },
        titleAttr: translatedwords.getTranslatedWord($translate("Ajouter"))
      }
    } else {
      $scope.btnadd = undefined;
    }

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        vente.getallVente(pc.obj).then(function(result) {
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
        }
      ].concat($scope.btnadd));

    pc.dtColumns = [
      DTColumnBuilder.newColumn('Date').withTitle(translatedwords.getTranslatedWord($translate("Date de vente"))).renderWith(function(data, type, full, meta) {
        return moment(full.Date).format('DD/MM/YYYY');
      }),
      DTColumnBuilder.newColumn('Ref').withTitle(translatedwords.getTranslatedWord($translate("Numéro de vente"))),
      DTColumnBuilder.newColumn('Societe').withTitle(translatedwords.getTranslatedWord($translate("Client"))),
      DTColumnBuilder.newColumn('total').withTitle(translatedwords.getTranslatedWord($translate("Prix Total"))).renderWith(function(data, type, full, meta) {
        if (full.total)
          return '<p align="right">' + parseInt(full.total) + '</p>';
        return '';
      }),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).notSortable().renderWith(actionsHtml).withOption('width', '5%').withClass('nowraptd all')
    ];

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');


    //Add AddAnalyse
    $scope.AddVente = function() {
      $mdDialog.show({
          controller: DialogControllerAddVente,
          templateUrl: '././views/templates/vente/AddVente.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true,
          escapeToClose: false
        })
        .then(function(answer) {}, function() {});
    }

    //Add AddAnalyse
    function DialogControllerAddVente($scope, $mdDialog) {
      function pad(num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
      }
      $q.all([
        vente.getallClient(),
        vente.getMaxRef(pc.obj)
      ]).then((values) => {
        NProgress.done();
        $scope.AllClients = values[0].data;
        $scope.lastRef = values[1].data;
        if ($scope.lastRef.length > 0) {
          $scope.Reference = "VE-" + pad(parseInt($scope.lastRef[0].NbrVisite) + 1, 5);
        } else {
          $scope.Reference = "VE-" + pad(1, 5);
        }
        $scope.letmeclick = true;
      });


      $scope.GetOtherReference = function() {
        vente.getMaxRef(pc.obj).then(e => {
          NProgress.done();
          if (e.data.length > 0) {
            $scope.Reference = "VE-" + pad(parseInt(e.data[0].NbrVisite) + 1, 5);
          } else {
            $scope.Reference = "VE-" + pad(1, 5);
          }
        }).catch(async e => {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
            closeButton: true
          });
        });
      }

      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
      $scope.DateVente = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
      $scope.Ifullscreen = false;
      $scope.VarieteProduit = [];

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

      $scope.ClientChange = function() {
        NProgress.start();
        vente.getallExpedition({
          Client: $scope.Client.ID,
          DOMAINE: pc.IDferme
        }).then(e => {
          NProgress.done();
          $scope.AllExpeditions = e.data;
          $scope.VarieteProduit = [];
        }).catch(async e => {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
            closeButton: true
          });
        });
      }

      $scope.ExpeditionChange = function() {
        NProgress.start();
        vente.getAllVarieteProduit({
          IDExp: $scope.AllExpedition,
          DOMAINE: pc.IDferme
        }).then(e => {
          NProgress.done();
          $scope.VarieteProduit = e.data;
        }).catch(async e => {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
            closeButton: true
          });
        });
      }

      $scope.setTotalkg = function(food) {
        food.totalkg = food.PM_reel * food.qteCaisse;
        return food.totalkg;
      }

      $scope.setPrixunitairecaisse = function(food) {
        food.prixunitairecaisse = food.prixunitairekg * food.PM_reel;
        return food.prixunitairecaisse;
      }

      $scope.setPrixtotal = function(food) {
        food.prixtotal = food.totalkg * food.prixunitairekg;
        return food.prixtotal;
      }

      $scope.setPrixAlltotal = function(food) {
        $scope.prixAlltotal = 0;
        if ($scope.VarieteProduit.length > 0)
          $scope.prixAlltotal = parseFloat(_.sumBy($scope.VarieteProduit, 'prixtotal').toFixed(2));
        return $scope.prixAlltotal;
      }

      async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
      }

      $scope.checkVarieteProduitData = function() {
        var ifoundIt = true;
        angular.forEach($scope.VarieteProduit, function(value, key) {
          if (((!value.prixunitairekg || value.prixunitairekg === null || Number.isNaN(value.prixunitairekg)) || (!value.PM_reel || value.PM_reel === null || Number.isNaN(value.PM_reel))) && ifoundIt) {
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }

      //add click
      $scope.Ajouter = async function() {

        $scope.progress = true;
        toastr.clear();

        if ($scope.Reference && $scope.Client && $scope.VarieteProduit.length > 0 && $scope.DateVente) {
          if ($scope.checkVarieteProduitData()) {
            pc.objAdd = {
              "Reference": $scope.Reference,
              "Client": $scope.Client,
              "DateVente": moment($scope.DateVente).format('YYYYMMDD'),
              "VarieteProduit": $scope.VarieteProduit,
              "prixAlltotal": $scope.prixAlltotal,
              "Utilisateur": pc.User,
              "IDFermes": pc.IDferme,
              "IDUser": pc.IDUser
            }

            vente.createweb(pc.objAdd).then(async e => {
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
            toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner les Prix/Pois unitaire KG")), {
              closeButton: true
            });
          }



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
      pc.ID = c.IDVente;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            vente.deleteweb({
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
      pc.venteObject[data.IDVente] = data;
      var deletebtn = ($scope.canIAction().delete) ? '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.venteObject[' + data.IDVente + '])" )"=""><i class="fa fa-trash-o"></i></button>' : '';
      var dtailsBtn = '<button class="btn btn-success btn-xs" title="Détails" ng-click="pc.detailsorder(pc.venteObject[' + data.IDVente + '])" )"=""><i class="fa fa-eye"></i></button>';
      return dtailsBtn + deletebtn;
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


    pc.showtable_toggle = function() {
      pc.showtable = true;
    }


    //détails ordre
    pc.detailsorder = function(data) {
      pc.ventedetails = [];
      pc.VenteByID = data;
      pc.showtable = false;

      if (document.getElementById('filter_form').style.display === "block") {
        document.getElementById('filter_form').style.display = "none";
      }
      vente.getVenteDetails({
        "IDVente": pc.VenteByID.IDVente
      }).then(function(res) {
        pc.ventedetails = res.data;
        NProgress.done();
        NProgress.remove();
      });
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