'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:OperationsclesOperationdesemisCtrl
 * @description
 * # OperationsclesOperationdesemisCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('OperationsclesOperationdesemisCtrl', function($scope, translatedwords, $translate, $window, $translatePartialLoader, DTOptionsBuilder, Produit, operationdesemis, DTColumnBuilder, $q, toastr, parcellecultural, generation, _url, $compile, ordrefertlisation, $filter, uniteoperation, $state, DTDefaultOptions, $cookies, savefilter, $mdDialog) {
    var pc = this;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.dtInstance = {};
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    pc.showtable = true;
    pc.mode_fert = 1;
    pc.operationsemisAction = {};
    pc.IDferme = $cookies.getObject('globals').ferme.IDFerme;
    pc.NomFerme = $cookies.getObject('globals').ferme.NomFerme;
    pc.YearNow = moment().format('YYYY');
    pc.DateNow = moment().format('DD/MM/YYYY');
    pc.TimeNow = moment().format('HH:mm');
    pc.date1 = "";
    pc.date2 = "";
    $scope.currentNavItem = 'ordrefertlisation';
    pc.User = $cookies.getObject('globals').currentUser.Nom + " " + $cookies.getObject('globals').currentUser.Prenom;
    pc.IDUser = $cookies.getObject('globals').currentUser.ID;
    $scope.ReverseDisplay = function(d) {
      if (document.getElementById(d).style.display === "none") {
        document.getElementById(d).style.display = "block";
      } else {
        document.getElementById(d).style.display = "none";
      }
    }

    var permission_data = JSON.parse($window.localStorage.getItem('permission'));
    var permission = {
      modules_array: permission_data[0],
      rubriques_array: permission_data[1],
      sous_modules_array: permission_data[2]
    }

    pc.isAdmin = $cookies.getObject('globals').currentUser.isAdmin;

    var opsemisAccess = _.filter(permission.sous_modules_array, {
      ss_module: 'operation_semis'
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


    setTimeout(function() {
      $("#Parcelle").selectpicker('refresh');
    }, 1000);

    $q.all([parcellecultural.getParcelleCulturalByFerme(pc.IDferme)]).then((values) => {
      pc.parcellescultural = values[0].data;
      NProgress.remove();
      setTimeout(function() {
        $("#Parcelle").selectpicker('refresh');
      }, 1000);
    });

    function toggleAll(selectAll, selectedItems) {
      for (var id in selectedItems) {
        if (selectedItems.hasOwnProperty(id)) {
          selectedItems[id] = selectAll;
        }
      }
    }

    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
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

    //set date input
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

    pc.obj = {
      "DOMAINE": pc.IDferme,
      "PARCELLE_CULTURAL": [0],
      "DATE_DEBUT": 0,
      "DATE_FIN": moment($scope.date_fin).format('YYYYMMDD')
    };

    //check saved filter
    if (!angular.equals(savefilter.getFilters(), {})) {
      pc.obj.DATE_DEBUT = savefilter.getFilters().DATE_DEBUT;
      pc.obj.DATE_FIN = savefilter.getFilters().DATE_FIN;

      $scope.date_debut = moment(pc.obj.DATE_DEBUT, 'YYYY-MM-DD').toDate();
      $scope.date_fin = moment(pc.obj.DATE_FIN, 'YYYY-MM-DD').toDate();
    }

    $scope.date_debut_sel = 0;
    $scope.date_fin_sel = moment($scope.date_fin).format('YYYYMMDD');

    //by parcelle cultural
    pc.parcelle_change = function() {
      NProgress.start();
      var parcelle = $scope.parcelle.parcelle;

      if (validateInput(parcelle) || $scope.parcelle.parcelle.length === 0 || $scope.parcelle.parcelle.includes(0))
        parcelle = [0];

      pc.obj.PARCELLE_CULTURAL = parcelle;

      try {
        pc.dtInstance.reloadData();
      } catch (e) {}

      NProgress.done();
      NProgress.remove();
    };

    //by date_debutl
    $scope.date_debut_change = function() {
      if ($scope.date_debut === null || $scope.date_debut === "" || $scope.date_debut === undefined || $scope.date_debut === 0 || $scope.date_debut === "0" || !$scope.date_debut || $scope.date_debut.length === 0) {
        $scope.date_debut_sel = 0;
      } else {
        $scope.date_debut_sel = $scope.date_debut;
      }

      pc.obj.DATE_DEBUT = moment($scope.date_debut_sel).format('YYYYMMDD');
      //Save to filter service
      savefilter.setFilters(pc.obj);
      pc.dtInstance.reloadData();
    };

    //by date_fin
    $scope.date_fin_change = function() {
      if ($scope.date_fin === null || $scope.date_fin === "" || $scope.date_fin === undefined || $scope.date_fin === 0 || $scope.date_fin === "0" || !$scope.date_fin || $scope.date_fin.length === 0) {
        $scope.date_fin_sel = 0;
      } else {
        $scope.date_fin_sel = $scope.date_fin;
      }
      pc.obj.DATE_FIN = moment($scope.date_fin_sel).format('YYYYMMDD');
      //Save to filter service
      savefilter.setFilters(pc.obj);
      pc.dtInstance.reloadData();
    };

    $scope.type = "Type";

    //get data and refresh datatable
    $scope.updateDataOperationSemis = function(data) {
      return operationdesemis.byfiltre(data);
    };

    //détails ordre
    pc.detailsoperation = function(data) {
      pc.operationdetails = [];
      pc.parcelles = [];
      pc.operationdetailsByID = data;
      pc.showtable = false;

      if (document.getElementById('filter_form').style.display === "block") {
        document.getElementById('filter_form').style.display = "none";
      }

      operationdesemis.getParcelleSemis({
        "ID_Operation_Semis": pc.operationdetailsByID.ID
      }).then(function(res) {
        pc.ParcelleSemis = res.data;
        NProgress.done();
      });




    }

    pc.showtable_toggle = function() {
      pc.showtable = true;
    }

    if ($scope.canIAction().add) {
      $scope.btnadd = {
        text: "<i class='fa fa-plus'></i>",
        key: '1',
        className: 'pull-left',
        action: function(e, dt, node, config) {
          $scope.AddAvancer()
        },
        titleAttr: 'Ajouter'
      }
    } else {
      $scope.btnadd = undefined;
    }


    pc.dtOptions = DTOptionsBuilder.fromFnPromise(async function() {
        var defer = $q.defer();
        $scope.updateDataOperationSemis(pc.obj).then(function(res) {
          defer.resolve(res.data);
          NProgress.done();
        });
        return defer.promise;
      })
      .withDOM('<lf<t>ip>')
      .withPaginationType('simple_numbers')
      .withDisplayLength(10)
      .withOption('createdRow', createdRow)
      .withOption('headerCallback', headerCallback)
      .withOption('fnRowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        $('td', nRow).bind('click', function() {
          $scope.$apply(function() {
            $('td').css("background-color", "");
            $('td', nRow).css('background-color', '#fff6b5');
          });
        });
        return nRow;
      })
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
          title: '',
          titleAttr: translatedwords.getTranslatedWord($translate("Imprimer")),
          autoPrint: true
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
      DTColumnBuilder.newColumn('DateSemis').withTitle(translatedwords.getTranslatedWord($translate("Date de semis"))).renderWith(function(data, type, full, meta) {
        return moment(full.DateSemis).format('DD/MM/YYYY');
      }).withOption('width', '12%'),
      DTColumnBuilder.newColumn('Ref').withTitle(translatedwords.getTranslatedWord($translate("Parcelle"))),
      DTColumnBuilder.newColumn('Sup').withTitle(translatedwords.getTranslatedWord($translate("Superficie des parcelles (Ha)"))).withOption('width', '9%').renderWith(function(data, type, full, meta) {
        if (full.Sup)
          return full.Sup.toFixed(2);
      }),
      DTColumnBuilder.newColumn('SupIntervention').withTitle(translatedwords.getTranslatedWord($translate("Superficie de intervention (Ha)"))).withOption('width', '9%').renderWith(function(data, type, full, meta) {

        if (full.SupIntervention)
          return full.SupIntervention.toFixed(2);
      }),
      DTColumnBuilder.newColumn('Commentaire').withTitle(translatedwords.getTranslatedWord($translate("Commentaire"))).withOption('width', '15%'),
      DTColumnBuilder.newColumn('NbrCulture').withTitle(translatedwords.getTranslatedWord($translate("Nbr de parcelles"))).withOption('width', '9%'),
      DTColumnBuilder.newColumn('Designation').withTitle(translatedwords.getTranslatedWord($translate("Produit"))).withOption('width', '15%'),
      DTColumnBuilder.newColumn('Variete').withTitle(translatedwords.getTranslatedWord($translate("Variété"))).withOption('width', '15%'),
      DTColumnBuilder.newColumn('Type').withTitle(translatedwords.getTranslatedWord($translate("Type Variété"))).withOption('width', '15%').withOption('width', '9%').renderWith(function(data, type, full, meta) {
        if (full.Type == 0)
          return "Certifiée";
        return "Fermière";
      }),
      DTColumnBuilder.newColumn('PMG').withTitle(translatedwords.getTranslatedWord($translate("PMG"))).withOption('width', '15%'),
      DTColumnBuilder.newColumn('Dose').withTitle(translatedwords.getTranslatedWord($translate("Dose(/Ha)"))).withOption('width', '15%'),
      DTColumnBuilder.newColumn('Unite').withTitle(translatedwords.getTranslatedWord($translate("Unite(/Ha)"))).withOption('width', '15%'),
      DTColumnBuilder.newColumn('qtefix').withTitle(translatedwords.getTranslatedWord($translate("Qté fixe"))).withOption('width', '15%').withOption('width', '15%').withOption('width', '9%').renderWith(function(data, type, full, meta) {
        if (full.qtefix)
          return "Oui";
        return "Non";
      }),
      DTColumnBuilder.newColumn('Densite').withTitle(translatedwords.getTranslatedWord($translate("Densité(gr/m2)"))).withOption('width', '15%'),
      DTColumnBuilder.newColumn('Quantite').withTitle(translatedwords.getTranslatedWord($translate("Quantité"))).withOption('width', '15%'),
      DTColumnBuilder.newColumn('faculte_germinative').withTitle(translatedwords.getTranslatedWord($translate("Faculté germinative (%)"))).withOption('width', '9%'),
      DTColumnBuilder.newColumn('poid_specifique').withTitle(translatedwords.getTranslatedWord($translate("Poid spécifique (kg/hl)"))).withOption('width', '9%'),
      DTColumnBuilder.newColumn('NumeroLot').withTitle(translatedwords.getTranslatedWord($translate("Numéro de lot"))).withOption('width', '15%'),
      DTColumnBuilder.newColumn('CreatedBy').withTitle(translatedwords.getTranslatedWord($translate("Saisie par"))).withOption('width', '9%'),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).withClass('nowraptd all').withOption('width', '2%').renderWith(actionsHtml)
    ];

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    function actionsHtml(data, type, full, meta) {
      pc.operationsemisAction[data.ID] = data;
      var editbtn = ($scope.canIAction().update) ? '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.editAvancer(pc.operationsemisAction[' + data.ID + '])" )"=""><i class="fa fa-edit"></i></button>' : '';
      var deletebtn = ($scope.canIAction().delete) ? '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.operationsemisAction[' + data.ID + '])" )"=""><i class="fa fa-trash-o"></i></button>' : '';


      return '<button class="btn btn-success btn-xs" title="Détails" ng-click="pc.detailsoperation(pc.operationsemisAction[' + data.ID + '])" )"=""><i class="fa fa-eye"></i></button>' + editbtn + deletebtn;
    }




    //Add Avancer
    $scope.AddAvancer = function() {
      $mdDialog.show({
          controller: DialogControllerAddAvancer,
          templateUrl: '././views/templates/operationsemis/AddOperationSemis.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true,
          escapeToClose: false
        })
        .then(function(answer) {}, function() {});
    }

    //Add Avancer
    function DialogControllerAddAvancer($scope, $mdDialog) {
      $q.all([
        parcellecultural.getParcelleCulturalByFerme(pc.IDferme),
        uniteoperation.getall(),
        generation.getall(),
        Produit.getProduitByFermeCategorie({
          IDFermes: pc.IDferme
        })
      ]).then((values) => {
        NProgress.done();
        $scope.parcelleculturals = values[0].data;
        $scope.uniteoperations = values[1].data;
        $scope.generations = values[2].data;
        $scope.Produits = values[3].data;

      });

      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
      $scope.Datedesemis = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
      $scope.TypeVariete = 0;
      $scope.parcelleculturalsel = [];
      $scope.qtefix = false;

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

      $scope.getSuperficieTotal = function() {
        return parseFloat(_.sumBy($scope.parcelleculturalsel, 'Sup').toFixed(2));
      }

      $scope.getSuperficieSemis = function() {
        $scope.SupSemiTotal = _.sumBy($scope.parcelleculturalsel, 'SupSemis');
        return parseFloat($scope.SupSemiTotal.toFixed(2));
      }

      async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
      }


      $scope.checkSuperficieIntervention = function() {
        var ifoundIt = true;
        angular.forEach($scope.parcelleculturalsel, function(value, key) {
          if ((value.Sup < value.SupSemis && ifoundIt) || !value.SupSemis) {
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }

      $scope.astwodigits = function(val) {
        if (val)
          return parseFloat(val.toFixed(2));
        return 0;
      }

      $scope.checkDuplicateVaeiete = async function() {
        toastr.clear();
        if (_.uniqBy($scope.parcelleculturalsel, 'Variete').length > 1) {
          toastr.error(await translatedwords.getTranslatedWord($translate("Ne pas permettre de sélectionner des parcelles ayant des variétés différentes")), {
            closeButton: true
          });
        }
      }

      $scope.$watch('dose', function(n) {
        $scope.Densite = parseInt($scope.dose * 100 / $scope.pmg);
        if (!$scope.qtefix) {
          $scope.Quantite = parseFloat(($scope.dose * $scope.SupSemiTotal).toFixed(2));
        }
      });

      $scope.$watch('pmg', function(n) {
        $scope.Densite = parseInt(($scope.dose * 100 / $scope.pmg));
      });

      $scope.$watch('Quantite', function(n) {
        $scope.dose = parseFloat(($scope.Quantite / $scope.SupSemiTotal).toFixed(2));
      });

      $scope.$watch('qtefix', function(n) {
        if (!$scope.qtefix) {
          $scope.Quantite = parseFloat(($scope.dose * $scope.SupSemiTotal).toFixed(2));
        }
      });

      $scope.$watch('SupSemiTotal', function(n) {
        $scope.Quantite = undefined;
        $scope.dose = undefined;
        $scope.Densite = undefined;
      });


      //add click
      $scope.AjouterAvancer = async function() {

        $scope.progress = true;
        toastr.clear();
        if ($scope.parcelleculturalsel.length > 0 && $scope.Datedesemis && $scope.semencesel && $scope.dose && $scope.unitesel && $scope.Quantite) {

          if ($scope.checkSuperficieIntervention()) {
            if (_.uniqBy($scope.parcelleculturalsel, 'Variete').length == 1) {

              pc.objAdd = {
                "parcelleculturalsel": $scope.parcelleculturalsel,
                "Datedesemis": moment($scope.Datedesemis).format('YYYYMMDD'),
                "SuperficieTotal": _.sumBy($scope.parcelleculturalsel, 'Sup'),
                "Superficieintervention": _.sumBy($scope.parcelleculturalsel, 'SupSemis'),
                "semencesel": $scope.semencesel,
                "varietesel": $scope.parcelleculturalsel[0].Variete,
                "dose": $scope.dose,
                "Densite": $scope.Densite,
                "unitesel": $scope.unitesel.IDUnite_Operation,
                "Quantite": $scope.Quantite,
                "nbrCulture": $scope.parcelleculturalsel.length,
                "TypeVariete": $scope.TypeVariete,
                "faculte_germinative": $scope.faculte_germinative,
                "poid_specifique": $scope.poid_specifique,
                "NumeroLot": ($scope.NumeroLot) ? $filter('textforsqlserver')($scope.NumeroLot) : "",
                "pmg": $scope.pmg,
                "Commentaire": ($scope.Commentaire) ? $filter('textforsqlserver')($scope.Commentaire) : "",
                "categoriesel": $scope.categoriesel,
                "Utilisateur": pc.User,
                "IDFermes": pc.IDferme,
                "IDUser": pc.IDUser,
                "qtefix": $scope.qtefix
              }

              operationdesemis.create(pc.objAdd).then(async e => {
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
              toastr.error(await translatedwords.getTranslatedWord($translate("Ne pas permettre de sélectionner des parcelles ayant des variétés différentes")), {
                closeButton: true
              });
            }

          } else {
            $scope.progress = false;
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("La superficie de l'intervention par culture doit être inferieur ou egale de la superficie de la parcelle culturale !")), {
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

      $scope.AnnulerAvancer = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };


    }


    //Edit avancer
    pc.editAvancer = function(data) {
      $scope.showAdvancedEditAvancer("ev", data);
    }

    //Edit Avancer Fertigation
    $scope.showAdvancedEditAvancer = function(ev, data) {
      $mdDialog.show({
          controller: DialogControllerEditAvancer,
          templateUrl: '././views/templates/operationsemis/EditOperationSemis.html',
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

    //Edit Avancer Fertigation
    function DialogControllerEditAvancer($scope, data, $mdDialog) {
      $q.all([
        parcellecultural.getParcelleCulturalByFerme(pc.IDferme),
        uniteoperation.getall(),
        generation.getall(),
        Produit.getProduitByFermeCategorie({
          IDFermes: pc.IDferme
        }),
        operationdesemis.getParcelleSemis({
          ID_Operation_Semis: data.ID
        })
      ]).then((values) => {
        NProgress.done();
        $scope.parcelleculturals = values[0].data;
        $scope.uniteoperations = values[1].data;
        $scope.generations = values[2].data;
        $scope.Produits = values[3].data;
        $scope.ParcelleSemis = values[4].data;

        angular.forEach($scope.ParcelleSemis, function(value, key) {
          var indexs = _.findIndex($scope.parcelleculturals, {
            "ID": value.ID_Parcelle_Culturale
          });
          $scope.parcelleculturals[indexs].SupSemis = value.SupIntervention;
        });
      });
      $scope.parcellefood = [];

      $scope.isINParcelle = function(ID, index) {
        var ifoundIt = false;
        angular.forEach($scope.ParcelleSemis, function(value, key) {
          if (value.ID_Parcelle_Culturale == ID && ifoundIt == false) {
            ifoundIt = true;
          }
        });
        return ifoundIt;
      }



      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
      $scope.data = data;
      $scope.DateSemis = ($scope.data.DateSemis) ? new Date(moment($scope.data.DateSemis).format("YYYY-MM-DD")) : null;

      $scope.parcelleculturalsel = [];

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

      $scope.getSuperficieTotal = function() {
        return parseFloat(_.sumBy($scope.parcelleculturalsel, 'Sup').toFixed(2));
      }

      $scope.getSuperficieSemis = function() {
        $scope.SupSemiTotal = _.sumBy($scope.parcelleculturalsel, 'SupSemis');
        return parseFloat($scope.SupSemiTotal.toFixed(2));
      }

      $scope.astwodigits = function(val) {
        return parseFloat(val.toFixed(2));
      }
      var foo = false;
      $scope.checkDuplicateVaeiete = async function() {
        toastr.clear();
        if (_.uniqBy($scope.parcelleculturalsel, 'Variete').length > 1 && foo) {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Ne pas permettre de sélectionner des parcelles ayant des variétés différentes")), {
            closeButton: true
          });
        }
        setTimeout(function() {
          foo = true;
        }, 5000);
      }

      $scope.checkSuperficieIntervention = function() {
        var ifoundIt = true;
        angular.forEach($scope.parcelleculturalsel, function(value, key) {
          if ((value.Sup < value.SupSemis && ifoundIt) || !value.SupSemis) {
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }

      $scope.run = false;

      $scope.ichangeVal = function() {
        $scope.run = true;
      }

      $scope.$watch('data.Dose', function(n) {
        if ($scope.run) {
          $scope.data.Densite = parseInt(($scope.data.Dose * 100 / $scope.data.PMG));
          if (!$scope.data.qtefix) {
            $scope.data.Quantite = parseFloat(($scope.data.Dose * $scope.SupSemiTotal).toFixed(2));
          }
        }
      });

      $scope.$watch('data.PMG', function(n) {
        if ($scope.run) {
          $scope.data.Densite = parseInt(($scope.data.Dose * 100 / $scope.data.PMG));
        }
      });

      $scope.$watch('data.Quantite', function(n) {
        if ($scope.run) {
          $scope.data.Dose = parseFloat(($scope.data.Quantite / $scope.SupSemiTotal).toFixed(2));
        }
      });

      $scope.$watch('data.qtefix', function(n) {
        if ($scope.run) {
          if (!$scope.data.qtefix) {
            $scope.data.Quantite = parseFloat(($scope.data.Dose * $scope.SupSemiTotal).toFixed(2));
          }
        }
      });

      $scope.$watch('SupSemiTotal', function(n) {
        if ($scope.run) {
          $scope.data.Quantite = undefined;
          $scope.data.Dose = undefined;
          $scope.data.Densite = undefined;
        }
      });

      $scope.ModifierAvancer = async function() {

        $scope.progress = true;
        toastr.clear();
        if ($scope.parcelleculturalsel.length > 0 && $scope.DateSemis && $scope.semencesel && $("#Dose").val() && $scope.unitesel && $("#Quantite").val()) {
          if ($scope.checkSuperficieIntervention()) {
            if (_.uniqBy($scope.parcelleculturalsel, 'Variete').length == 1) {
              pc.objEdit = {
                "ID": $scope.data.ID,
                "parcelleculturalsel": $scope.parcelleculturalsel,
                "Datedesemis": moment($scope.DateSemis).format('YYYYMMDD'),
                "SuperficieTotal": _.sumBy($scope.parcelleculturalsel, 'Sup'),
                "Superficieintervention": _.sumBy($scope.parcelleculturalsel, 'SupSemis'),
                "semencesel": $scope.semencesel,
                "faculte_germinative": $scope.data.faculte_germinative,
                "poid_specifique": $scope.data.poid_specifique,
                "varietesel": $scope.parcelleculturalsel[0].Variete,
                "dose": $("#Dose").val(),
                "Densite": $("#Densite").val(),
                "unitesel": $scope.unitesel.IDUnite_Operation,
                "Quantite": $("#Quantite").val(),
                "nbrCulture": $scope.parcelleculturalsel.length,
                "TypeVariete": $scope.data.Type,
                "NumeroLot": ($scope.data.NumeroLot) ? $filter('textforsqlserver')($scope.data.NumeroLot) : "",
                "pmg": $("#pmg").val(),
                "Commentaire": ($scope.data.Commentaire) ? $filter('textforsqlserver')($scope.data.Commentaire) : "",
                "qtefix": $scope.data.qtefix
              }

              operationdesemis.update(pc.objEdit).then(async e => {
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
              toastr.error(await translatedwords.getTranslatedWord($translate("Ne pas permettre de sélectionner des parcelles ayant des variétés différentes")), {
                closeButton: true
              });
            }

          } else {
            $scope.progress = false;
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("La superficie de l'intervention par culture doit être inferieur ou egale de la superficie de la parcelle culturale !")), {
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

      $scope.AnnulerAvancer = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };




    }

    pc.delete = async function(c) {
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            operationdesemis.delete({
              ID: c.ID
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





    pc.printdetails = function(operationdetailsByID) {
      var type = "";
      var dateOP = "";
      var daterealisation = "";


      if (operationdetailsByID.DateSemis) {
        dateOP = moment(operationdetailsByID.DateSemis).format('DD/MM/YYYY');
      }


      var w = 1000;
      var h = 1000;
      var left = Number((screen.width / 2) - (w / 2));
      var tops = Number((screen.height / 2) - (h / 2));

      var mywindow = window.open('_self', 'PRINT', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + tops + ', left=' + left, '');

      //window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
      mywindow.document.write('<html><head><title>' + document.title + '</title>');
      mywindow.document.write('</head><body >');
      //header
      mywindow.document.write('<table border="1" style="width:100%; background:#e0efda" >' +
        '<tr>' +
        '<th rowspan="3" style="width:30%;">' + pc.NomFerme + '</th>' +
        '</tr>' +
        '<tr>' +
        '<th style="width:40%;">Le ' + pc.DateNow + ' à ' + pc.TimeNow + '</th>' +
        '</tr>' +
        '<tr>' +
        '<th style="width:40%;">Opération de semis</th>' +
        '</tr>' +
        '</table>');

      mywindow.document.write('<br/>');

      mywindow.document.write('<table border="1" class="pull-right" style="width:50%;" >' +
        '<tr>' +
        '<td style="background:#e0e0e0;width:50%">Date de semis</td>' +
        '<td>' + dateOP + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td style="background:#e0e0e0;width:50%">Commentaire</td>' +
        '<td>' + operationdetailsByID.Commentaire + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td style="background:#e0e0e0;width:50%">Saisir par</td>' +
        '<td>' + operationdetailsByID.CreatedBy + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td style="background:#e0e0e0;width:50%">Nbr Culture</td>' +
        '<td align="right">' + operationdetailsByID.NbrCulture + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td style="background:#e0e0e0;width:50%">Superficie des cultures (Ha)</td>' +
        '<td align="right">' + (operationdetailsByID.SupTotal ? operationdetailsByID.SupTotal.toFixed(2) : 0) + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td style="background:#e0e0e0;width:50%">Superficie de intervention (Ha)</td>' +
        '<td align="right">' + (operationdetailsByID.SupInterventionTotal ? operationdetailsByID.SupInterventionTotal.toFixed(2) : 0) + '</td>' +
        '</tr>' +
        '</table>');

      mywindow.document.write('<br/>');

      var Certifiee = (operationdetailsByID.Type == 0) ? "Certifiee" : "Fermiere",
        Oui = (operationdetailsByID.qtefix) ? "Oui" : "Non";
      mywindow.document.write('<table border="1" class="pull-right" style="width:50%;" >' +
        '<tr>' +
        '<td style="background:#e0e0e0;width:50%">Produit</td>' +
        '<td>' + operationdetailsByID.Designation + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td style="background:#e0e0e0;width:50%">Variété</td>' +
        '<td>' + operationdetailsByID.Variete + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td style="background:#e0e0e0;width:50%">Type Variété</td>' +
        '<td>' + Certifiee + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td style="background:#e0e0e0;width:50%">PMG</td>' +
        '<td  align="right">' + operationdetailsByID.PMG + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td style="background:#e0e0e0;">Dose(/Ha)</td>' +
        '<td align="right">' + operationdetailsByID.Dose + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td style="background:#e0e0e0;width:50%">Unite(/Ha)</td>' +
        '<td>' + operationdetailsByID.Unite + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td style="background:#e0e0e0;width:50%">Qté fixe(/Ha)</td>' +
        '<td>' + Oui + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td style="background:#e0e0e0;width:50%">Densité(gr/m2)(/Ha)</td>' +
        '<td>' + operationdetailsByID.Densite + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td style="background:#e0e0e0;width:50%">Quantité(/Ha)</td>' +
        '<td align="right">' + operationdetailsByID.Quantite + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td style="background:#e0e0e0;width:50%">Numéro de lot</td>' +
        '<td>' + operationdetailsByID.NumeroLot + '</td>' +
        '</tr>' +
        '</table>');

      mywindow.document.write('<br/>');


      if (operationdetailsByID.Type == 1) {
        $('table').attr('border', '1');
        $('table').width('100%');
        $('td').width('100%');
        $('th').width('100%');
        mywindow.document.write(document.getElementById("tab_1").innerHTML);
        $('table').attr('border', '0');
      }

      if (operationdetailsByID.Type != 1) {
        $('table').attr('border', '1');
        $('table').width('100%');
        $('td').width('100%');
        $('th').width('100%');
        mywindow.document.write(document.getElementById("tab_23").innerHTML);
        $('table').attr('border', '0');
      }



      mywindow.document.write('<br/>');




      //mywindow.document.write(document.getElementById("sss").innerHTML);
      mywindow.document.write('</body></html>');

      mywindow.document.close(); // necessary for IE >= 10
      mywindow.focus(); // necessary for IE >= 10*/

      mywindow.print();
      mywindow.close();

      return true;
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

  });