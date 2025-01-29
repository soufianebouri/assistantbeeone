'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:NutritionControlephecCtrl
 * @description
 * # NutritionControlephecCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('NutritionControlephecCtrl', function($scope, translatedwords, $window, DTOptionsBuilder, $filter, $translatePartialLoader, $translate, DTColumnBuilder, $q, $compile, $state, $mdDialog, campagneagricole, DTDefaultOptions, toastr, $cookies, controlephec, parcellecultural, $timeout) {

    var pc = this;
    pc.dtInstance = {};
    pc.controleecaction = {};
    pc.IDFerme = $cookies.getObject('globals').ferme.IDFerme;
    pc.IDSociete = $cookies.getObject('globals').ferme.IDSociete;
    pc.IDUser = $cookies.getObject('globals').currentUser.ID;
    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $('#Parcelle').selectpicker('refresh');
    }, 1000);
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

    //set date input
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

    $q.all([parcellecultural.getParcelleCulturalByFerme($cookies.getObject('globals').ferme.IDFerme)]).then(function(values) {
      pc.parcellescultural = values[0].data;
      setTimeout(function() {
        $('#Parcelle').selectpicker('refresh');
      }, 1000);
    });

    pc.obj = {
      "DOMAINE": pc.IDFerme,
      "PARCELLE_CULTURAL": [0],
      "DATE_DEBUT": 0,
      "DATE_FIN": moment($scope.date_fin).format('YYYYMMDD')
    };


    $scope.parcelle_sel = [0];
    $scope.date_debut_sel = 0;
    $scope.date_fin_sel = moment($scope.date_fin).format('YYYYMMDD');


    //by parcelle cultural
    $scope.parcelle_change = function() {
      if ($scope.parcelle.parcelle === null || $scope.parcelle.parcelle === "" || $scope.parcelle.parcelle === undefined || $scope.parcelle.parcelle === 0 || $scope.parcelle.parcelle === "0" || !$scope.parcelle.parcelle || $scope.parcelle.parcelle.length === 0 || $scope.parcelle.parcelle.includes(0)) {
        $scope.parcelle_sel = [0];

      } else {
        $scope.parcelle_sel = $scope.parcelle.parcelle;
      }

      pc.obj.PARCELLE_CULTURAL = $scope.parcelle_sel;
      try {
        pc.dtInstance.reloadData();
      } catch (e) {}


    };

    //by date_debutl
    $scope.date_debut_change = function() {

      if ($scope.date_debut === null || $scope.date_debut === "" || $scope.date_debut === undefined || $scope.date_debut === 0 || $scope.date_debut === "0" || !$scope.date_debut || $scope.date_debut.length === 0) {
        $scope.date_debut_sel = 0;
      } else {
        $scope.date_debut_sel = $scope.date_debut;
      }

      pc.obj.DATE_DEBUT = moment($scope.date_debut_sel).format('YYYYMMDD');
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
      pc.dtInstance.reloadData();

    };

    //get data and refresh datatable
    $scope.updateDataControleECPH = function(data) {
      return controlephec.getSomeProps(data);
    };

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        $scope.updateDataControleECPH(pc.obj).then(function(res) {
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
        }, {
          text: "<i class='fa fa-plus'></i>",
          key: '1',
          className: 'pull-left',
          action: function(e, dt, node, config) {
            $scope.Add()
          },
          titleAttr: 'Ajouter'
        }, {
          text: "<i class='fa fa-area-chart'></i>",
          action: function(e, dt, node, config) {
            $state.go("controlephec_chart");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Vue graphique"))
        }
      ]);

    pc.dtColumns = [
      DTColumnBuilder.newColumn('Date').withTitle(translatedwords.getTranslatedWord($translate("Date"))).renderWith(function(data, type, full, meta) {
        if (full.Date)
          return moment(full.Date).format('DD/MM/YYYY');
        return ''
      }),
      DTColumnBuilder.newColumn('ref').withTitle(translatedwords.getTranslatedWord($translate("Parcelle Culturale"))),
      DTColumnBuilder.newColumn('Culture').withTitle(translatedwords.getTranslatedWord($translate("Culture"))),
      DTColumnBuilder.newColumn('Variete').withTitle(translatedwords.getTranslatedWord($translate("Variété"))),
      DTColumnBuilder.newColumn('Porte_greffe').withTitle(translatedwords.getTranslatedWord($translate("Porte-greffe"))),
      DTColumnBuilder.newColumn('ph_drainage').withTitle(translatedwords.getTranslatedWord($translate("PH Drainage"))),
      DTColumnBuilder.newColumn('ph_goutteur').withTitle(translatedwords.getTranslatedWord($translate("PH Goutteur"))),
      DTColumnBuilder.newColumn('ec_drainage').withTitle(translatedwords.getTranslatedWord($translate("EC Drainage"))),
      DTColumnBuilder.newColumn('ec_goutteur').withTitle(translatedwords.getTranslatedWord($translate("EC goutteur"))),
      DTColumnBuilder.newColumn('volume_apport').withTitle(translatedwords.getTranslatedWord($translate("Volume drainage (m3)"))),
      DTColumnBuilder.newColumn('volume_drainage').withTitle(translatedwords.getTranslatedWord($translate("Volume apport (m3)"))),
      DTColumnBuilder.newColumn('observation').withTitle(translatedwords.getTranslatedWord($translate("Description"))),
      DTColumnBuilder.newColumn('DateCreated').withTitle(translatedwords.getTranslatedWord($translate("Date de création"))).renderWith(function(data, type, full, meta) {
        if (full.DateCreated)
          return moment(full.DateCreated).format('DD/MM/YYYY');
        return ''
      }),
      DTColumnBuilder.newColumn('CreatedBy').withTitle(translatedwords.getTranslatedWord($translate("Opérateur"))).renderWith(function(data, type, full, meta) {
        if (full.Nom)
          return full.Nom + ' ' + full.Prenom;
        return '';
      }),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).withOption('width', '5%').renderWith(actionsHtml).withClass('nowraptd all')
    ];

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    function actionsHtml(data, type, full, meta) {
      pc.controleecaction[data.IDPH_EC] = data;
      return '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.edit(pc.controleecaction[ ' + data.IDPH_EC + '])"><i class="fa fa-edit"></i></button>&nbsp;' +
        '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.controleecaction[' + data.IDPH_EC + '])" )"=""><i class="fa fa-trash-o"></i></button>';
    }


    //Add
    $scope.Add = function() {
      $mdDialog.show({
          controller: DialogControllerAdd,
          templateUrl: '././views/templates/suiviControlephec/AddCotrolePhEc.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true,
          escapeToClose: false
        })
        .then(function(answer) {}, function() {});
    }

    //Add AddAnalyse
    function DialogControllerAdd($scope, $mdDialog) {


      $q.all([parcellecultural.ShowByDomaineEncours(pc.IDFerme)]).then((values) => {
        $scope.ParcelleCulturale = values[0].data;
        NProgress.done();
        $scope.letmeclick = true;
        document.getElementById("filter_form").style.display = "none";
      });
      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;

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
      $scope.Ajouter = async function() {
        $scope.progress = true;
        toastr.clear();
        if ($scope.DateSuivi &&
          $scope.parcelleculturale &&
          $scope.PH_Drainage >= 0 &&
          $scope.PH_Goutteur >= 0 &&
          $scope.EC_Drainage >= 0 &&
          $scope.EC_goutteur >= 0 &&
          $scope.Volume_drainage >= 0 &&
          $scope.Volume_apport >= 0) {

          pc.objAdd = {
            "DateSuivi": moment($scope.DateSuivi).format('YYYYMMDD'),
            "parcelleculturale": $scope.parcelleculturale,
            "PH_Drainage": $scope.PH_Drainage,
            "PH_Goutteur": $scope.PH_Goutteur,
            "EC_Drainage": $scope.EC_Drainage,
            "EC_goutteur": $scope.EC_goutteur,
            "Volume_drainage": $scope.Volume_drainage,
            "Volume_apport": $scope.Volume_apport,
            "IDFermes": pc.IDFerme,
            "IDUser": pc.IDUser,
            "Description": ($scope.Description) ? $filter('textforsqlserver')($scope.Description) : "",
          }

          controlephec.createweb(pc.objAdd).then(async e => {
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

      $scope.Annuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };


    }



    //Modifer
    pc.edit = function(data) {
      $q.all([parcellecultural.ShowByDomaineEncours(pc.IDFerme)]).then((values) => {
        $scope.ParcelleCulturale = values[0].data;
        $scope.data = data;
        document.getElementById("filter_form").style.display = "none";
        $scope.showAdvancedEdit("ev", $scope.ParcelleCulturale, $scope.data);
      });


    }


    $scope.showAdvancedEdit = function(ev, ParcelleCulturale, data) {
      $mdDialog.show({
          controller: DialogControllerEdit,
          templateUrl: '././views/templates/suiviControlephec/EditCotrolePhEc.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            ParcelleCulturale: ParcelleCulturale,
            data: data
          }
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    function DialogControllerEdit($scope, $mdDialog, ParcelleCulturale, data) {
      $scope.ParcelleCulturale = ParcelleCulturale;
      $scope.data = data;
      $scope.DateSuivi = new Date(moment($scope.data.DateSuivi).format("YYYY-MM-DD"));
      $scope.letmeclick = true;
      $scope.onUpdate = () => {
        if (!$scope.parcelleculturale) {
          $scope.parcelleculturale = $scope.data.Parcellesid;
        }
      }

      $scope.hide = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Annuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Modifier = async function() {
        toastr.clear();
        $scope.onUpdate();

        if ($scope.parcelleculturale &&
          $scope.data.ph_drainage >= 0 &&
          $scope.data.ph_goutteur >= 0 &&
          $scope.data.ec_drainage >= 0 &&
          $scope.data.ec_goutteur >= 0 &&
          $scope.data.volume_drainage >= 0 &&
          $scope.data.volume_apport >= 0) {

          //check campagneagricole
          $scope.progress = true;
          NProgress.done();

          //Edit
          controlephec.update({
            "ID": $scope.data.IDPH_EC,
            "DateSuivi": moment($scope.DateSuivi).format('YYYYMMDD'),
            "parcelleculturale": $scope.parcelleculturale,
            "ph_drainage": $scope.data.ph_drainage,
            "ph_goutteur": $scope.data.ph_goutteur,
            "ec_drainage": $scope.data.ec_drainage,
            "ec_goutteur": $scope.data.ec_goutteur,
            "volume_drainage": $scope.data.volume_drainage,
            "volume_apport": $scope.data.volume_apport,
            "Description": ($scope.data.observation) ? $filter('textforsqlserver')($scope.data.observation) : ""
          }).then(async function(res) {
            NProgress.done();
            pc.resedit = res.data;
            if (pc.resedit[0].message == 'ajout reussi') {
              toastr.clear();
              toastr.info(await translatedwords.getTranslatedWord($translate("Modification réussie")), {
                closeButton: true
              });
              $mdDialog.hide();
              document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
              pc.dtInstance.reloadData();
              $scope.progress = false;
            } else {
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + res.data[0].description, {
                closeButton: true
              });
              $scope.progress = false;
            }
          });


        } else {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
            closeButton: true
          });
        }

      };
    }

    pc.delete = async function(c) {
      pc.IDcontroleec = c.IDPH_EC;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            controlephec.delete({
              ID: pc.IDcontroleec
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

    $scope.searchByCriticite = function(criticite_text) {
      pc.dtInstance.DataTable.search(criticite_text).draw();
    };


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