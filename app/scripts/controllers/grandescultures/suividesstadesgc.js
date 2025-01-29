'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:GrandesculturesSuividesstadesgcCtrl
 * @description
 * # GrandesculturesSuividesstadesgcCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('GrandesculturesSuividesstadesgcCtrl', function(
    $scope,
    DTOptionsBuilder,
    translatedwords,
    _url,
    Ouviers,
    NiveauColorationService,
    $translatePartialLoader,
    $window,
    $filter, elementSuiviGc, qualiteStade,
    toastr,
    GroupeOperationnel,
    campagneagricole, cultureService,
    DTColumnBuilder,
    $mdDialog,
    $translate,
    $q,
    $compile,
    expeditions,
    $state,
    DTDefaultOptions,
    $cookies,
    $templateCache,
    suividesstadesgc,
    parcellecultural,
    refstadephenologiques
  ) {
    var pc = this;
    pc.dtInstance = {};
    $translatePartialLoader.addPart("conduitetechnique");
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    var titleHtml =
      '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    $scope._ = _;
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    pc.showtable = true;
    pc.IDFERME = $cookies.getObject("globals").ferme.IDFerme;
    pc.IDSociete = $cookies.getObject("globals").ferme.IDSociete;
    pc.NomFerme = $cookies.getObject("globals").ferme.NomFerme;



    var permission_data = JSON.parse(
      $window.localStorage.getItem("permission")
    );
    var permission = {
      modules_array: permission_data[0],
      rubriques_array: permission_data[1],
      sous_modules_array: permission_data[2],
    };

    pc.isAdmin = $cookies.getObject("globals").currentUser.isAdmin;
    $scope.isAdministrator = pc.isAdmin;

    var opsemisAccess = _.filter(permission.sous_modules_array, {
      ss_module: "suividesstadesgc",
    });

    $scope.canIAction = () => {
      if (pc.isAdmin)
        return {
          add: true,
          update: true,
          delete: true,
        };
      return {
        add: opsemisAccess[0].a,
        update: opsemisAccess[0].u,
        delete: opsemisAccess[0].d,
      };
    };

    setTimeout(function() {
      $("#Parcelle").selectpicker('refresh');
      $("#Stade").selectpicker('refresh');
      $(".selectpicker").selectpicker("refresh");
    }, 1000);

    $scope.ReverseDisplay = function(d) {
      if (document.getElementById(d).style.display === "none") {
        document.getElementById(d).style.display = "block";
      } else {
        document.getElementById(d).style.display = "none";
      }
    };

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

    //set date input
    $scope.date_fin = moment(
      moment().format("YYYY-MM-DD"),
      "YYYY-MM-DD"
    ).toDate();
    $scope.current_date = moment(
      moment().format("YYYY-MM-DD"),
      "YYYY-MM-DD"
    ).toDate();

    pc.obj = {
      FERME: [pc.IDFERME],
      IDSociete: pc.IDSociete,
      DATE_DEBUT: 0,
      DATE_FIN: moment($scope.date_fin).format("YYYYMMDD"),
      PARCELLE_CULTURAL: [0],
      STADE: [0],
      culture: 0
    };

    $scope.date_debut_sel = 0;
    $scope.date_fin_sel = moment($scope.date_fin).format("YYYYMMDD");


    $q.all([campagneagricole.getCampagneAgricoleByIDSociete(pc.IDSociete),
      cultureService.getCultureByFerme(pc.IDFERME)
    ]).then((values) => {
      pc.compagne_array = values[0].data;
      pc.cultures = values[1].data;
      NProgress.done();
      NProgress.remove();
      setTimeout(function() {
        $("#culture").selectpicker('refresh');
        $("#Parcelle").selectpicker('refresh');
        $("#Stade").selectpicker('refresh');
      }, 1000);
    });


    pc.compagne_change = () => {
      if ($scope.compagne) {

        $scope.date_debut = new Date($scope.compagne.Date_debut);
        $scope.date_fin = new Date($scope.compagne.Date_Fin);
        pc.obj.DATE_DEBUT = moment($scope.compagne.Date_debut).format('YYYYMMDD');
        pc.obj.DATE_FIN = moment($scope.compagne.Date_Fin).format('YYYYMMDD');

        if (pc.obj.culture !== 0) {
          $q.all([
            parcellecultural.getbycampagneculture({
              DATE_DEBUT: pc.obj.DATE_DEBUT,
              DATE_FIN: pc.obj.DATE_FIN,
              IDFermes: pc.IDFERME,
              culture: $scope.culture
            })
          ]).then((values) => {
            pc.parcellescultural = values[0].data;
            pc.stades = [];
            setTimeout(function() {
              $("#Parcelle").selectpicker('refresh');
              //  $('#Parcelle').selectpicker('deselectAll');
              $("#Stade").selectpicker('refresh');
              //  $('#Stade').selectpicker('deselectAll');
              NProgress.done();
            }, 100);
          });
        }




      }
    }


    pc.culture_change = () => {
      if ($scope.culture) {
        pc.obj.culture = $scope.culture;
        pc.obj.PARCELLE_CULTURAL = [0];
        pc.obj.STADE = [0];
      } else {
        pc.obj.PARCELLE_CULTURAL = [0];
        pc.obj.STADE = [0];
      }

      if (pc.obj.DATE_DEBUT !== 0) {
        $q.all([
          refstadephenologiques.getAllStadePhenologiqueByCulture({
            IdCulture: $scope.culture
          }),
          parcellecultural.getbycampagneculture({
            DATE_DEBUT: pc.obj.DATE_DEBUT,
            DATE_FIN: pc.obj.DATE_FIN,
            IDFermes: pc.IDFERME,
            culture: $scope.culture
          })
        ]).then((values) => {
          pc.stades = values[0].data;
          pc.parcellescultural = values[1].data;
          setTimeout(function() {
            $("#Parcelle").selectpicker('refresh');
            //  $('#Parcelle').selectpicker('deselectAll');
            $("#Stade").selectpicker('refresh');
            //  $('#Stade').selectpicker('deselectAll');
            NProgress.done();
          }, 100);
        });
      }

    }
    //by parcelle cultural
    pc.parcelle_change = function() {
      NProgress.start();
      pc.obj.PARCELLE_CULTURAL = [];
      var idculture = [];
      var parcelle = $scope.parcelle.parcelle;

      if (validateInput(parcelle) || $scope.parcelle.parcelle.length === 0 || $scope.parcelle.parcelle.includes(0)) {
        parcelle = [0];
        pc.obj.PARCELLE_CULTURAL = [0];
        idculture = [0]
      } else {
        for (var i = 0; i < parcelle.length; i++) {
          pc.obj.PARCELLE_CULTURAL.push(parcelle[i].ID);
          idculture.push(parcelle[i].idculture)
        }
      }

      NProgress.done();
      NProgress.remove();
    };


    pc.stade_change = function() {
      NProgress.start();
      var stade = $scope.stade.stade;

      if (validateInput(stade) || $scope.stade.stade.length === 0 || $scope.stade.stade.includes(0))
        stade = [0];

      pc.obj.STADE = stade;


      NProgress.done();
      NProgress.remove();
    };

    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
    }

    //by date_debutl
    $scope.date_debut_change = function() {
      NProgress.start();
      if (
        $scope.date_debut === null ||
        $scope.date_debut === "" ||
        $scope.date_debut === undefined ||
        $scope.date_debut === 0 ||
        $scope.date_debut === "0" ||
        !$scope.date_debut ||
        $scope.date_debut.length === 0
      ) {
        $scope.date_debut_sel = 0;
      } else {
        $scope.date_debut_sel = $scope.date_debut;
      }

      pc.obj.DATE_DEBUT = moment($scope.date_debut_sel).format("YYYYMMDD");


      if (pc.obj.culture !== 0) {
        $q.all([
          parcellecultural.getbycampagneculture({
            DATE_DEBUT: pc.obj.DATE_DEBUT,
            DATE_FIN: pc.obj.DATE_FIN,
            IDFermes: pc.IDFERME,
            culture: $scope.culture
          })
        ]).then((values) => {
          pc.parcellescultural = values[0].data;
          pc.stades = [];
          setTimeout(function() {
            $("#Parcelle").selectpicker('refresh');
            //  $('#Parcelle').selectpicker('deselectAll');
            $("#Stade").selectpicker('refresh');
            //  $('#Stade').selectpicker('deselectAll');
            NProgress.done();
          }, 100);
        });
      }

      NProgress.done();
      NProgress.remove();
    };

    //by date_fin
    $scope.date_fin_change = function() {
      NProgress.start();
      if (
        $scope.date_fin === null ||
        $scope.date_fin === "" ||
        $scope.date_fin === undefined ||
        $scope.date_fin === 0 ||
        $scope.date_fin === "0" ||
        !$scope.date_fin ||
        $scope.date_fin.length === 0
      ) {
        $scope.date_fin_sel = 0;
      } else {
        $scope.date_fin_sel = $scope.date_fin;
      }

      pc.obj.DATE_FIN = moment($scope.date_fin_sel).format("YYYYMMDD");
      if (pc.obj.culture !== 0) {
        $q.all([
          parcellecultural.getbycampagneculture({
            DATE_DEBUT: pc.obj.DATE_DEBUT,
            DATE_FIN: pc.obj.DATE_FIN,
            IDFermes: pc.IDFERME,
            culture: $scope.culture
          })
        ]).then((values) => {
          pc.parcellescultural = values[0].data;
          pc.stades = [];
          setTimeout(function() {
            $("#Parcelle").selectpicker('refresh');
            //  $('#Parcelle').selectpicker('deselectAll');
            $("#Stade").selectpicker('refresh');
            //  $('#Stade').selectpicker('deselectAll');
            NProgress.done();
          }, 100);
        });
      }
      NProgress.done();
      NProgress.remove();
    };


    $scope.search = function() {
      try {
        pc.dtInstance.reloadData();
      } catch (e) {}
    }

    //get data and refresh datatable
    $scope.getdata = function(data) {
      return suividesstadesgc.getbyfiltre(data);
    };

    pc.showtable_toggle = function() {
      pc.showtable = true;
    };

    //détails pointage
    pc.detailsuividesstadesgc = function(data) {
      setTimeout(function() {
        $(".selectpicker").selectpicker("refresh");
      }, 1000);
      pc.expeditionByID = data;
      pc.showtable = false;
      if (document.getElementById("filter_form").style.display === "block") {
        document.getElementById("filter_form").style.display = "none";
      }

      suividesstadesgc
        .getdetailsByID({
          ID: pc.expeditionByID.id
        })
        .then(function(res) {
          pc.Mesures = res.data;
          NProgress.done();
        });

    };


    if ($scope.canIAction().add) {
      $scope.btnadd = {
        text: "<i class='fa fa-plus'></i>",
        key: "1",
        className: "pull-left",
        action: function(e, dt, node, config) {
          $scope.AddExpedition();
        },
        titleAttr: "Ajouter",
      };
    } else {
      $scope.btnadd = undefined;
    }
    pc.suividesstadesgcOption = {};
    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        $scope.getdata(pc.obj).then(function(res) {
          defer.resolve(res.data);
          NProgress.done();
        });

        return defer.promise;
      })
      .withOption("deferRender", true)
      .withDOM("<lf<t>ip>")
      .withPaginationType("simple_numbers")
      .withDisplayLength(10)
      .withOption('responsive', true)
      .withOption("createdRow", createdRow)
      .withOption("headerCallback", headerCallback)
      .withOption(
        "fnRowCallback",
        function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
          $("td", nRow).bind("click", function() {
            $scope.$apply(function() {
              $("td").css("background-color", "");
              $("td", nRow).css("background-color", "#fff6b5");
            });
          });
          return nRow;
        }
      )
      .withOption("initComplete", function() {
        // do what evrithing
      })
      .withOption("order", [0, "asc"])

      .withScroller()
      .withLanguage(
        $.getJSON(
          `/scripts/i18n/datatable/${$window.localStorage
            .getItem("lang")
            .toLowerCase()}.json`,
          function(data) {
            return data;
          }
        )
      )

      .withButtons(
        [{
            extend: "colvis",
            text: "<i class='fa fa-eye'></i>",
            className: "pull-left",
            titleAttr: translatedwords.getTranslatedWord(
              $translate("Visibilité")
            ),
          },
          {
            text: "<i class='fa fa-search'></i>",
            action: function(e, dt, node, config) {
              $scope.ReverseDisplay("filter_form");
            },
            titleAttr: translatedwords.getTranslatedWord(
              $translate("Rechercher")
            ),
          },
          {
            extend: "copy",
            text: "<i class='fa fa-copy'></i>",
            titleAttr: translatedwords.getTranslatedWord($translate("Copie")),
          },
          {
            extend: "print",
            text: "<i class='fa fa-print'></i>",
            titleAttr: translatedwords.getTranslatedWord(
              $translate("Imprimer")
            ),
          },
          {
            extend: "excel",
            text: "<i class='fa fa-file-excel-o'></i>",
            titleAttr: "EXCEL",
          },
        ]
      );


    pc.dtColumns = [
      DTColumnBuilder.newColumn("date_constation")
      .withTitle(translatedwords.getTranslatedWord($translate("Date de constatation")))
      .renderWith(function(data, type, full, meta) {
        return moment(full.date_constation).format("YYYY/MM/DD");
      }),
      DTColumnBuilder.newColumn("ParcelleCulturale").withTitle(translatedwords.getTranslatedWord($translate("Parcelles culturales"))).renderWith(function(data, type, full, meta) {
        return full.ParcelleCulturaleReference + ' ' + full.ParcelleCulturale;
      }),
      DTColumnBuilder.newColumn("Culture").withTitle(
        translatedwords.getTranslatedWord($translate("Culture"))
      ),
      DTColumnBuilder.newColumn("Variete").withTitle(
        translatedwords.getTranslatedWord($translate("Variete"))
      ),
      DTColumnBuilder.newColumn("Stade_phenologique").withTitle(
        translatedwords.getTranslatedWord($translate("Stade phénologique"))
      ),
      DTColumnBuilder.newColumn("element_suivi_gc").withTitle(
        translatedwords.getTranslatedWord($translate("Éléments de suivi"))
      ),
      DTColumnBuilder.newColumn("Qualite_Stade").withTitle(
        translatedwords.getTranslatedWord($translate("Qualité du stade"))
      ),
      DTColumnBuilder.newColumn("densite")
      .withTitle(translatedwords.getTranslatedWord($translate("Densité (g/m2)")))
      .renderWith(function(data, type, full, meta) {
        if (full.densite)
          return full.densite;
        return 0;
      }),
      DTColumnBuilder.newColumn("Moyenne")
      .withTitle(translatedwords.getTranslatedWord($translate("Moyenne")))
      .renderWith(function(data, type, full, meta) {
        if (full.Moyenne)
          return Math.round(full.Moyenne);
        return 0;
      }),
      DTColumnBuilder.newColumn("Maximum")
      .withTitle(translatedwords.getTranslatedWord($translate("Maximum")))
      .renderWith(function(data, type, full, meta) {
        if (full.Maximum)
          return Math.round(full.Maximum);
        return 0;
      }),
      DTColumnBuilder.newColumn("Minimum")
      .withTitle(translatedwords.getTranslatedWord($translate("Minimum")))
      .renderWith(function(data, type, full, meta) {
        if (full.Minimum)
          return Math.round(full.Minimum);
        return 0;
      }),
      DTColumnBuilder.newColumn("levee")
      .withTitle(translatedwords.getTranslatedWord($translate("%Leveé")))
      .renderWith(function(data, type, full, meta) {
        if (full.Stade_phenologique.includes("LEVEE")) {
          if (full.levee)
            return Math.round(full.levee);
          return 0;
        } else {
          return "";
        }
      }),
      DTColumnBuilder.newColumn("tallage")
      .withTitle(translatedwords.getTranslatedWord($translate("Tallage")))
      .renderWith(function(data, type, full, meta) {
        if (full.Stade_phenologique.includes("TALLAGE")) {
          if (full.tallage)
            return (full.tallage).toFixed(2);
          return 0;
        } else {
          return "";
        }
      }),
      DTColumnBuilder.newColumn("epiaison")
      .withTitle(translatedwords.getTranslatedWord($translate("%Epiaison")))
      .renderWith(function(data, type, full, meta) {
        if (full.Stade_phenologique.includes("EPIAISON")) {
          if (full.epiaison)
            return (full.epiaison).toFixed(2);
          return 0;
        } else {
          return "";
        }
      }),
      DTColumnBuilder.newColumn("DateCreated")
      .withTitle(translatedwords.getTranslatedWord($translate("Date de création")))
      .renderWith(function(data, type, full, meta) {
        return moment(full.DateCreated).format("DD/MM/YYYY");
      }),
      DTColumnBuilder.newColumn("operateur").withTitle(
        translatedwords.getTranslatedWord($translate("Observateur"))
      ),

      DTColumnBuilder.newColumn(null)
      .withTitle(translatedwords.getTranslatedWord($translate("Actions")))
      .notSortable()
      .renderWith(function(data, type, full, meta) {
        pc.suividesstadesgcOption[data.id] = data;
        var deletebtn = $scope.canIAction().delete ?
          '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.suividesstadesgcOption[' +
          data.id +
          '])" )"=""><i class="fa fa-trash-o"></i></button>' :
          "";
        var dtailsBtn =
          '<button class="btn btn-warning btn-xs" title="Détails" ng-click="pc.detailsorder(pc.suividesstadesgcOption[' +
          data.id +
          '])" )"=""><i class="fa fa-eye"></i></button>';

        var editbtn = ($scope.canIAction().update) ? '<button class="btn btn-success btn-xs" title="Modifier" ng-click="pc.Edit(pc.suividesstadesgcOption[' + data.id + '])"><i class="fa fa-edit"></i></button>&nbsp;' : '';
        return editbtn + dtailsBtn + deletebtn;
      })
      .withClass("td-small nowraptd all"),
    ];

    DTDefaultOptions.setLoadingTemplate(
      '<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>'
    );


    //Edit
    pc.Edit = function(data) {
      document.getElementById("filter_form").style.display = "none";
      $scope.showAdvancedEdit("ev", data);
    }

    $scope.showAdvancedEdit = function(ev, data) {
      $mdDialog.show({
          controller: DialogControllerEdit,
          templateUrl: '././views/templates/suividesstadesgc/Editsuividesstadesgc.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            data: data
          }
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    function DialogControllerEdit($scope, $mdDialog, data) {
      $scope.data = data;

      $scope.date_constation = new Date(moment($scope.data.date_constation).format("YYYY-MM-DD"));




      $scope.DateMiseEnService = ($scope.data.DateMiseEnService) ? new Date(moment($scope.data.DateMiseEnService).format("YYYY-MM-DD")) : undefined;
      $scope.DateApprofondissement = ($scope.data.DateApprofondissement) ? new Date(moment($scope.data.DateApprofondissement).format("YYYY-MM-DD")) : undefined;
      $scope.DebitExploitation = ($scope.data.DebitExploitation) ? new Date(moment($scope.data.DebitExploitation).format("YYYY-MM-DD")) : undefined;
      $scope.DateAutorisation = ($scope.data.DateAutorisation) ? new Date(moment($scope.data.DateAutorisation).format("YYYY-MM-DD")) : undefined;
      $scope.DateEssai = ($scope.data.DateEssai) ? new Date(moment($scope.data.DateEssai).format("YYYY-MM-DD")) : undefined;
      $scope.Latitude = ($scope.data.Latitude) ? parseFloat($scope.data.Latitude) : 0;
      $scope.Longitude = ($scope.data.Longitude) ? parseFloat($scope.data.Longitude) : 0;




      $q.all([
        parcellecultural.getParcelleCulturalByFerme(pc.IDFERME),
        refstadephenologiques.getAllStadePhenologique(),
        elementSuiviGc.getall(),
        qualiteStade.getAll(),
        suividesstadesgc.getdetailsByID({
          ID: $scope.data.id
        })
      ]).then((values) => {
        $scope.parcelleculturals = values[0].data;
        $scope.stadespheno = values[1].data;
        $scope.elementGc = values[2].data;
        $scope.qualiteStaderef = values[3].data;
        $scope.mesures = values[4].data;
        $scope.oldnbrnumber = $scope.mesures.length;
        NProgress.done();
        $scope.letmeclick = true;
      });



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

      $scope.checkMesure = function() {
        var ifoundIt = true;
        angular.forEach($scope.mesures, function(value, key) {
          if (value.valeur == null && value.valeur < 0 && value.valeur && ifoundIt == true) {
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }

      $scope.Modifier = async function() {
        $scope.progress = true;
        toastr.clear();

        if ($scope.date_constation && $scope.parcelleculturalsel && $scope.stadephenosel && $scope.elementsuivisel && $scope.qualitestadesel) {
          if ($scope.checkMesure()) {
            pc.objEdit = {
              ID: $scope.data.id,
              date_constation: moment($scope.date_constation).format('YYYYMMDD'),
              parcelleculturalsel: $scope.parcelleculturalsel,
              stadephenosel: $scope.stadephenosel,
              elementsuivisel: $scope.elementsuivisel,
              qualitestadesel: $scope.qualitestadesel,
              observation: ($scope.data.observation) ? $filter('textforsqlserver')($scope.data.observation) : "",
              mesures: $scope.mesures
            }

            suividesstadesgc.update(pc.objEdit).then(async e => {
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
                toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + e.data[0].description, {
                  closeButton: true
                });
                NProgress.done();
              }
            }).catch(e => {
              $scope.progress = false;
              toastr.clear();
              toastr.error(e.data, {
                closeButton: true
              });
            });
          } else {
            $scope.progress = false;
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez vérifier les valeurs des mesures sur carte")), {
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


      $scope.hide = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Annuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };




      var shapes = [];



      var IO = {
        //returns array with storable google.maps.Overlay-definitions
        OUT: function(arr, //array containg the stored shape-definitions
          map, cadre, calque //map where to draw the shapes
        ) {
          var shapes = [],
            goo = google.maps,
            map = map || null,
            shape, tmp;
          if (arr) {
            for (var i = 0; i < arr.length; i++) {
              shape = arr[i];

              switch (shape.type) {
                case 'CIRCLE':
                  tmp = new goo.Circle({
                    radius: Number(shape.radius),
                    center: this.pp_.apply(this, shape.geometry),
                    strokeColor: calque,
                    strokeOpacity: 1,
                    strokeWeight: 1,
                    fillColor: cadre,
                    fillOpacity: 0.50
                  });
                  break;
                case 'MARKER':
                  tmp = new goo.Marker({
                    position: this.pp_.apply(this, shape.geometry),
                    strokeColor: calque,
                    strokeOpacity: 1,
                    strokeWeight: 1,
                    fillColor: cadre,
                    fillOpacity: 0.50
                  });
                  break;
                case 'RECTANGLE':
                  tmp = new goo.Rectangle({
                    bounds: this.bb_.apply(this, shape.geometry),
                    strokeColor: calque,
                    strokeOpacity: 1,
                    strokeWeight: 1,
                    fillColor: cadre,
                    fillOpacity: 0.50
                  });
                  break;
                case 'POLYLINE':
                  tmp = new goo.Polyline({
                    path: this.ll_(shape.geometry),
                    strokeColor: calque,
                    strokeOpacity: 1,
                    strokeWeight: 1,
                    fillColor: cadre,
                    fillOpacity: 0.50
                  });
                  break;
                case 'POLYGON':
                  tmp = new goo.Polygon({
                    paths: this.mm_(shape.geometry),
                    strokeColor: calque,
                    strokeOpacity: 1,
                    strokeWeight: 1,
                    fillColor: cadre,
                    fillOpacity: 0.50
                  });
                  break;
              }
              tmp.setValues({
                map: map,
                id: shape.id
              })
              //shapes.push(tmp);
            }
          }
          return shapes;
        },
        l_: function(path, e) {
          path = (path.getArray) ? path.getArray() : path;
          if (e) {
            return google.maps.geometry.encoding.encodePath(path);
          } else {
            var r = [];
            for (var i = 0; i < path.length; ++i) {
              r.push(this.p_(path[i]));
            }
            return r;
          }
        },
        ll_: function(path) {
          if (typeof path === 'string') {
            return google.maps.geometry.encoding.decodePath(path);
          } else {
            var r = [];
            for (var i = 0; i < path.length; ++i) {
              r.push(this.pp_.apply(this, path[i]));
            }
            return r;
          }
        },

        m_: function(paths, e) {
          var r = [];
          paths = (paths.getArray) ? paths.getArray() : paths;
          for (var i = 0; i < paths.length; ++i) {
            r.push(this.l_(paths[i], e));
          }
          return r;
        },
        mm_: function(paths) {
          var r = [];
          for (var i = 0; i < paths.length; ++i) {
            r.push(this.ll_.call(this, paths[i]));

          }
          return r;
        },
        p_: function(latLng) {
          return ([latLng.lat(), latLng.lng()]);
        },
        pp_: function(lat, lng) {
          return new google.maps.LatLng(lat, lng);
        },
        b_: function(bounds) {
          return ([this.p_(bounds.getSouthWest()),
            this.p_(bounds.getNorthEast())
          ]);
        },
        bb_: function(sw, ne) {
          return new google.maps.LatLngBounds(this.pp_.apply(this, sw),
            this.pp_.apply(this, ne));
        },
        t_: function(s) {
          var t = ['CIRCLE', 'MARKER', 'RECTANGLE', 'POLYLINE', 'POLYGON'];
          for (var i = 0; i < t.length; ++i) {
            if (s === google.maps.drawing.OverlayType[t[i]]) {
              return t[i];
            }
          }
        }
      }



      var map;

      $scope.initMap = function() {
        if ($scope.parcelleculturalsel) {
          if (!$scope.parcelleculturalsel.LatPosition || !$scope.parcelleculturalsel.LngPosition || $scope.parcelleculturalsel.LatPosition == 0 || $scope.parcelleculturalsel.LngPosition == 0 || $scope.parcelleculturalsel.LatPosition == "" || $scope.parcelleculturalsel.LngPosition == "") {
            var latF = 33.9691409;
            var longF = -6.9273709;
            var zoooom = 4;
          } else {
            var latF = $scope.parcelleculturalsel.LatPosition;
            var longF = $scope.parcelleculturalsel.LngPosition;
            var zoooom = 16;
          }
        } else {
          var latF = 33.9691409;
          var longF = -6.9273709;
          var zoooom = 4;
        }

        map = new google.maps.Map(document.getElementById("Ressourceshydriques"), {
          center: new google.maps.LatLng(latF, longF),
          zoom: zoooom,
          mapTypeControl: false,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        /*if ($scope.data.ID_Ferme == $scope.Ferme.IDFermes && $scope.data.Latitude && $scope.data.Longitude && $scope.data.Latitude != 0 && $scope.data.Longitude != 0 && $scope.data.Latitude != "" && $scope.data.Longitude != "") {
          var latF = $scope.data.Latitude;
          var longF = $scope.data.Longitude;
          var zoooom = 16;
          map.setCenter(new google.maps.LatLng(latF, longF));
          map.setZoom(zoooom);
          document.getElementById('t1').value = $scope.data.Latitude;
          document.getElementById('t2').value = $scope.data.Longitude;
        } else {
          document.getElementById('t1').value = 0;
          document.getElementById('t2').value = 0;
        }*/

        pc.IsJsonString = function(str) {
          try {
            JSON.parse(str);
          } catch (e) {
            return false;
          }
          return true;
        }

        var iconnanimgUser = {
          url: "././images/usermarker.jpg",
          scaledSize: new google.maps.Size(40, 40)
        };

        var iconnanimg = {
          url: "././images/marker-blue-piege.png",
          scaledSize: new google.maps.Size(40, 40)
        };

        const infoWindow = new google.maps.InfoWindow({
          content: "",
          //disableAutoPan: true,
        });

        //user

        /*$scope.mesures.map((position, i) => {
          var markeruser = new google.maps.Marker({
            position: new google.maps.LatLng(position.lat_saisie, position.long_saisie),
            title: $scope.data.operateur,
            icon: iconnanimgUser,
            map
          });

          markeruser.addListener("click", () => {
            infoWindow.setContent(`Opérateur : ${$scope.data.operateur}`);
            infoWindow.open(map, markeruser);
          });
        })*/

        let markers = $scope.mesures.map((position, i) => {
          //const label = labels[i % labels.length];
          let marker = new google.maps.Marker({
            position: new google.maps.LatLng(position.lat_echantillon, position.long_echantillon),
            title: String(position.valeur),
            label: String(position.valeur),
            icon: iconnanimg,
            draggable: true
          });

          google.maps.event.addListener(marker, 'dragend', function(event) {
            position.lat_echantillon = event.latLng.lat();
            position.long_echantillon = event.latLng.lng();;
          });


          marker.addListener("click", () => {
            infoWindow.setContent(`Valeur : <input type="number" step="1"  value="${position.valeur}" oninput="updateInput(this.value, ${i})"/>&nbsp;<button type="button"
                                 style="background-color: #5cb85c;
                                  color: #ffffff;    border-radius: 5px;
                                  border: 1;
                                  border-color: #5cb85c;" onclick="okInput()"><i class="fa fa-edit"></i></button>&nbsp;&nbsp;
                                  <button type="button"
                                                       style="background-color: rgb(221 44 0);
                                                        color: #ffffff;    border-radius: 5px;
                                                        border: 1;
                                                        border-color: rgb(221 44 0);" onclick="Delete_Marker(${i})"><i class="fa fa-trash"></i></button>
                                  <center></center>
                                  `);
            infoWindow.open(map, marker);
          });
          return marker;
        });


        let markerCluster = new markerClusterer.MarkerClusterer({
          map,
          markers
        });

        window.okInput = function() {
          markerCluster.setMap(null);
          markers = $scope.mesures.map((position, i) => {
            //const label = labels[i % labels.length];

            let marker = new google.maps.Marker({
              position: new google.maps.LatLng(position.lat_echantillon, position.long_echantillon),
              title: String(position.valeur),
              label: String(position.valeur),
              icon: iconnanimg,
              draggable: true
            });

            google.maps.event.addListener(marker, 'dragend', function(event) {
              position.lat_echantillon = event.latLng.lat();
              position.long_echantillon = event.latLng.lng();;
            });
            marker.addListener("click", () => {
              infoWindow.setContent(`Valeur : <input type="number" step="1"  value="${position.valeur}" oninput="updateInput(this.value, ${i})"/>&nbsp;<button type="button"
                                   style="background-color: #5cb85c;
                                    color: #ffffff;    border-radius: 5px;
                                    border: 1;
                                    border-color: #5cb85c;" onclick="okInput()"><i class="fa fa-edit"></i></button>&nbsp;&nbsp;
                                    <button type="button"
                                                         style="background-color: rgb(221 44 0);
                                                          color: #ffffff;    border-radius: 5px;
                                                          border: 1;
                                                          border-color: rgb(221 44 0);" onclick="Delete_Marker(${i})"><i class="fa fa-trash"></i></button>
                                    <center></center>
                                    `);
              infoWindow.open(map, marker);
            });
            return marker;
          });

          markerCluster = new markerClusterer.MarkerClusterer({
            map,
            markers
          });
        }


        window.updateInput = function(val, i) {
          val = (val) ? Math.round(val) : 0
          $scope.mesures[i].valeur = val;
        }

        window.Delete_Marker = async function(index) {
          if ($scope.mesures.length == 1) {
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Au moins une mesure requise")), {
              closeButton: true
            });
          } else {

            markerCluster.setMap(null);
            $scope.mesures.splice(index, 1);
            markers = $scope.mesures.map((position, i) => {
              //const label = labels[i % labels.length];

              let marker = new google.maps.Marker({
                position: new google.maps.LatLng(position.lat_echantillon, position.long_echantillon),
                title: String(position.valeur),
                label: String(position.valeur),
                icon: iconnanimg,
                draggable: true
              });
              google.maps.event.addListener(marker, 'dragend', function(event) {
                position.lat_echantillon = event.latLng.lat();
                position.long_echantillon = event.latLng.lng();;
              });
              marker.addListener("click", () => {
                infoWindow.setContent(`Valeur : <input type="number" step="1"  value="${position.valeur}" oninput="updateInput(this.value, ${i})"/>&nbsp;<button type="button"
                                     style="background-color: #5cb85c;
                                      color: #ffffff;    border-radius: 5px;
                                      border: 1;
                                      border-color: #5cb85c;" onclick="okInput()"><i class="fa fa-edit"></i></button>&nbsp;&nbsp;
                                      <button type="button"
                                                           style="background-color: rgb(221 44 0);
                                                            color: #ffffff;    border-radius: 5px;
                                                            border: 1;
                                                            border-color: rgb(221 44 0);" onclick="Delete_Marker(${i})"><i class="fa fa-trash"></i></button>
                                      <center></center>
                                      `);
                infoWindow.open(map, marker);
              });
              return marker;
            });

            markerCluster = new markerClusterer.MarkerClusterer({
              map,
              markers
            });
          }

        }




        if ($scope.parcelleculturalsel) {
          if ($scope.parcelleculturalsel.TokenPolygone !== "" && pc.IsJsonString($scope.parcelleculturalsel.TokenPolygone)) {
            IO.OUT(JSON.parse($scope.parcelleculturalsel.TokenPolygone), map, "#c4bf7d", "#8eb2a0");
          } else {
            IO.OUT(JSON.parse('[{"type": "POLYGON","id": null,"geometry": [[]]}]'), map, "#c4bf7d", "#8eb2a0");
          }
        }


        var markerCenter = new google.maps.Marker({
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 0
          },
          position: map.getCenter(),
          map: map
        });

        google.maps.event.addListener(map, 'zoom_changed', function() {

          var NewMapCenter = map.getCenter();
          var latitude = NewMapCenter.lat();
          var longitude = NewMapCenter.lng();
          markerCenter.setPosition(map.getCenter());
          var latLng = markerCenter.getPosition();
        });

        google.maps.event.addListener(markerCenter, 'drag', function() {
          var latLng = markerCenter.getPosition();
        });

        if (map.getZoom() <= 14) {
          var mapStyles = [{
            featureType: "administrative.country",
            stylers: [{
              visibility: "off"
            }]
          }];
          var mapType = new google.maps.StyledMapType(mapStyles, {
            name: "Maroc"
          });
          //map = new google.maps.Map(document.getElementById("map"), mapOptions);
          map.mapTypes.set('maroc', mapType);
          map.setMapTypeId('maroc');
        }

        if (map.getZoom() >= 8) {
          //alert("d");
          map.setMapTypeId(google.maps.MapTypeId.HYBRID);
        }
        //restaurantes
        new google.maps.event.addListener(map, 'zoom_changed', function() {
          var zoomm = map.getZoom();


          if (zoomm >= 8) {
            //alert("d");
            map.setMapTypeId(google.maps.MapTypeId.HYBRID);


          } else {
            var mapStyles = [{
              featureType: "administrative.country",
              stylers: [{
                visibility: "off"
              }]
            }];
            var mapType = new google.maps.StyledMapType(mapStyles, {
              name: "Maroc"
            });
            //map = new google.maps.Map(document.getElementById("map"), mapOptions);
            map.mapTypes.set('maroc', mapType);
            map.setMapTypeId('maroc');
          }
        });





      }
      $scope.newLocation = function(newLat, newLng) {
        map.setCenter({
          lat: newLat,
          lng: newLng
        });
      }
      setTimeout(function() {
        $scope.initMap();
      }, 1000);

    }

    pc.delete = async function(c) {
      toastr.clear();
      toastr.info(
        "<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" +
        (await translatedwords.getTranslatedWord(
          $translate("Je confirme")
        )) +
        "</button>",
        await translatedwords.getTranslatedWord(
          $translate("Veuillez confirmer !")
        ), {
          closeButton: true,
          allowHtml: true,
          onShown: function(toast) {
            $("#confirmationRevertYes").click(function() {
              suividesstadesgc
                .delete({
                  ID: c.id,
                })
                .then(async function(result) {
                  if (result.data[0].message == "ajout reussi") {
                    //validate success
                    toastr.clear();
                    toastr.info(
                      await translatedwords.getTranslatedWord(
                        $translate("Suppression réussie")
                      ), {
                        closeButton: true,
                      }
                    );
                    NProgress.done();
                    pc.dtInstance.reloadData();
                  } else {
                    toastr.clear();
                    toastr.error(
                      (await translatedwords.getTranslatedWord(
                        $translate("an error occured ")
                      )) + result.data[0].description, {
                        closeButton: true,
                      }
                    );
                  }
                });
            });
          },
        }
      );
    };

    pc.detailsorder = function(data) {
      pc.Mesures = [];
      pc.detailsuividesstadesgc(data);
    };


    pc.printdetails = function(expeditionByID) {
      //alert(expeditionByID);
      pc.Code_compagne_exp = "";

      var w = 1000;
      var h = 1000;
      var left = Number(screen.width / 2 - w / 2);
      var tops = Number(screen.height / 2 - h / 2);

      var mywindow = window.open(
        "_self",
        "PRINT",
        "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" +
        w +
        ", height=" +
        h +
        ", top=" +
        tops +
        ", left=" +
        left,
        ""
      );

      //window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
      mywindow.document.write("<html><head><title></title>");
      mywindow.document.write("</head><body >");
      //header


      mywindow.document.write(
        "<center>Suivi des stades GC</center>"
      );

      mywindow.document.write("<br/>");
      mywindow.document.write("<br/>");

      mywindow.document.write(
        "<center>Domaine : " + pc.NomFerme + "</center>"
      );

      mywindow.document.write("<br/>");


      mywindow.document.write(
        '<table border="1"  style="width:100%;" >' +
        "<tr>" +
        "<td width='14.28%'>Date de constatation</td>" +
        "<td width='14.28%'>Parcelles culturales</td>" +
        "<td width='14.28%'>Référence Parcelles culturales</td>" +
        "<td width='14.28%'>Culture</td>" +
        "<td width='14.28%'>Variete</td>" +
        "<td width='14.28%'>Stade phénologique</td>" +
        "<td width='14.28%'>Éléments de suivi</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" + ((expeditionByID.date_constation) ? moment(expeditionByID.date_constation).format('DD/MM/YYYY') : '-') + "</td>" +
        "<td>" + expeditionByID.ParcelleCulturale + "</td>" +
        "<td>" + expeditionByID.ParcelleCulturaleReference + "</td>" +
        "<td>" + expeditionByID.Culture + "</td>" +
        "<td>" + expeditionByID.Variete + "</td>" +
        "<td>" + expeditionByID.Stade_phenologique + "</td>" +
        "<td>" + expeditionByID.element_suivi_gc + "</td>" +
        "</tr>" +
        "</table>"
      );

      mywindow.document.write("<br/>");
      mywindow.document.write("<br/>");

      expeditionByID.Moyenne = (expeditionByID.Moyenne) ? Math.round(expeditionByID.Moyenne) : 0;
      expeditionByID.Maximum = (expeditionByID.Maximum) ? Math.round(expeditionByID.Maximum) : 0;
      expeditionByID.Minimum = (expeditionByID.Minimum) ? Math.round(expeditionByID.Minimum) : 0;
      expeditionByID.levee = (expeditionByID.levee) ? expeditionByID.levee.toFixed(2) : 0;



      mywindow.document.write(
        '<table border="1"  style="width:100%;" >' +
        "<tr>" +
        "<td width='14.28%'>Qualité du stade</td>" +
        "<td width='14.28%'>Moyenne</td>" +
        "<td width='14.28%'>Maximum</td>" +
        "<td width='14.28%'>Minimum</td>" +
        "<td width='14.28%'>Densité (g/m2)</td>" +
        "<td width='14.28%'>%Leveé</td>" +
        "<td width='14.28%'>Observateur</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" + expeditionByID.Qualite_Stade + "</td>" +
        "<td>" + expeditionByID.Moyenne + "</td>" +
        "<td>" + expeditionByID.Maximum + "</td>" +
        "<td>" + expeditionByID.Minimum + "</td>" +
        "<td>" + expeditionByID.densite + "</td>" +
        "<td>" + expeditionByID.levee + "</td>" +
        "<td>" + expeditionByID.operateur + "</td>" +
        "</tr>" +
        "</table>"
      );


      mywindow.document.write("<br/>");

      expeditionByID.observation = (expeditionByID.observation) ? expeditionByID.observation : '';
      mywindow.document.write('<b>Observation</b> : ' + expeditionByID.observation);


      mywindow.document.write("<br/>");

      $("table").attr("border", "1");
      $("table").width("100%");
      mywindow.document.write(
        document.getElementById("tab_66").innerHTML
      );


      mywindow.document.write("<br/>");



      //mywindow.document.write(document.getElementById("sss").innerHTML);
      mywindow.document.write("</body></html>");

      mywindow.document.close(); // necessary for IE >= 10
      mywindow.focus(); // necessary for IE >= 10*/

      mywindow.print();
      mywindow.close();

      return true;

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
  });