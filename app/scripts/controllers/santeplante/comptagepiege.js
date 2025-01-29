'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:SanteplanteComptagepiegeCtrl
 * @description
 * # SanteplanteComptagepiegeCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('SanteplanteComptagepiegeCtrl', function($scope, DTOptionsBuilder, $window, parametragestockage, translatedwords, DTColumnBuilder, $translatePartialLoader, $translate, $q, $mdDialog, $compile, campagneagricole, ComptagePiege, $state, $cookies, ParcellePhysique, Piege, _url, DTDefaultOptions, toastr, Cible) {

    //alert();
    var pc = this;
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    pc.ComptageRavageuraction = {};
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.IDFerme = $cookies.getObject('globals').ferme.IDFerme;
    pc.IDSociete = $cookies.getObject('globals').ferme.IDSociete;
    pc.dtInstance = {};
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

    pc.obj = {
      "STANDARD": true,
      "DOMAINE": [$cookies.getObject('globals').ferme.IDFerme],
      "PIEGE": [0],
      "PARCELLE": [0],
      "DATE_DEBUT": 0,
      "DATE_FIN": moment().format('YYYYMMDD'),
      "CIBLE": [0]
    };

    pc.parametragestockage = parametragestockage.getAll().then((values) => {
      pc.parametragestockage = values.data;
      NProgress.done();
      NProgress.remove();
      return pc.PicturesHostStadePheno = pc.parametragestockage[0].Host + pc.parametragestockage[0].Rep_Observation_phyto + '/';
    });

    setTimeout(function() {
      $(".selectpicker").selectpicker('refresh');
      $("#parcelle").selectpicker('refresh');
      $("#piege").selectpicker('refresh');
      $("#cible").selectpicker('refresh');
    }, 1000);

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



    $q.all([ParcellePhysique.getParcellePhysique(_url, {
        IDFermes: $cookies.getObject('globals').ferme.IDFerme
      }),
      Cible.getAllCible()
    ]).then((values) => {
      pc.parcelles_array = values[0].data;
      pc.cible_array = values[1].data;
      NProgress.done();
      NProgress.remove();
      setTimeout(function() {
        $(".selectpicker").selectpicker('refresh');
        $("#parcelle").selectpicker('refresh');
        $("#piege").selectpicker('refresh');
        $("#cible").selectpicker('refresh');
      }, 1000);
    });

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        ComptagePiege.getComptagePiege(pc.obj).then(function(result) {
          NProgress.done();
          pc.obj.STANDARD = false;
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
          text: translatedwords.getTranslatedWord($translate("Alertée")),
          action: function(e, dt, node, config) {
            $scope.searchByEtat("Oui", 5);
          },
          init: function(api, node, config) {
            $(node).removeClass('dt-button')
          },
          className: 'dt-withcolor-button-red'
        },
        {
          text: translatedwords.getTranslatedWord($translate("Non alertée")),
          action: function(e, dt, node, config) {
            $scope.searchByEtat("Non", 5);
          },
          init: function(api, node, config) {
            $(node).removeClass('dt-button')
          },
          className: 'dt-withcolor-button-blue'
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
          text: "<i class='fa fa-map-marker'></i>",
          action: function(e, dt, node, config) {
            $state.go('ComptagePiegeageMap');
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Vue cartographique"))
        },
        {
          text: "<i class='fa fa-reorder'></i>",
          action: function(e, dt, node, config) {
            $state.go("comptagepiegeagefichedesurveillance");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Fiche de surveillance des pièges"))
        }
      ]);

    $scope.searchByEtat = async function(type_text, pos) {
      pc.dtInstance.DataTable.column(pos).search(type_text).draw();
      toastr.clear();
      var msgtostFilter = "";
      if (type_text.toString() == "Oui") {
        msgtostFilter = await translatedwords.getTranslatedWord($translate("Lignes allertées"))
      } else if (type_text.toString() == "Non") {
        msgtostFilter = await translatedwords.getTranslatedWord($translate("Lignes non allertées"))
      } else if (type_text.toString() == "Mâle") {
        msgtostFilter = await translatedwords.getTranslatedWord($translate("Observations sur les Mâles"));
      } else {
        msgtostFilter = await translatedwords.getTranslatedWord($translate("Observations sur les femelle"));
      }
      toastr.info(msgtostFilter, {
        closeButton: true,
        timeOut: 10000,
        closeHtml: '<button><i class="fa fa-search"></i></button>'
      });
    };

    pc.dtColumns = [
      DTColumnBuilder.newColumn('Ref').withTitle(translatedwords.getTranslatedWord($translate("Parcelle Physique"))),
      DTColumnBuilder.newColumn('DateCreated').withTitle(translatedwords.getTranslatedWord($translate("Date"))).renderWith(function(data, type, full, meta) {
        if (full.DateCreated)
          return moment(full.DateCreated).format('DD/MM/YYYY');
        return "";
      }),
      DTColumnBuilder.newColumn('Code_Piege').withTitle(translatedwords.getTranslatedWord($translate("Piège"))),
      DTColumnBuilder.newColumn('Cible').withTitle(translatedwords.getTranslatedWord($translate("Cible"))),
      DTColumnBuilder.newColumn('Nombre_Insecte').withTitle(translatedwords.getTranslatedWord($translate("Nombre d'insecte"))).renderWith(function(data, type, full, meta) {
        return full.Nombre_Insecte;
      }),
      DTColumnBuilder.newColumn('Alerte').withTitle(translatedwords.getTranslatedWord($translate("Alerte"))).renderWith(function(data, type, full, meta) {
        if (full.Alerte == 1) {
          return '<span class="badge dt-withcolor-button-red">Oui</span>';
        } else {
          return '<span class="badge dt-withcolor-button-blue" style="color:black">Non</span>';
        }
      }),
      DTColumnBuilder.newColumn('lat_saisie').withTitle("Latitude saisie"),
      DTColumnBuilder.newColumn('long_saisie').withTitle("Longitude saisie"),
      DTColumnBuilder.newColumn('Photo').withTitle(translatedwords.getTranslatedWord($translate("Photo"))).renderWith(function(data, type, full, meta) {
        if (full.Photo) {
          var pics = full.Photo.split(",");
          var imghtml = "<table><tr>";
          pics.forEach(function(item, index) {
            if (item != 'noimg.png')
              imghtml += `<td><a ng-click="pc.showimg('${pc.PicturesHostStadePheno+item}', '${full.Description}')">` +
              `<img src="${pc.PicturesHostStadePheno+item}" width="50px" height="50px" class=""/>  ` +
              `</a></td>`;
          });
          return imghtml + '</tr></table>';

        } else {

          return '';
        }
      }),
      DTColumnBuilder.newColumn('CreatedBy').withTitle(translatedwords.getTranslatedWord($translate("Observateur"))),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).renderWith(function(data, type, full, meta) {
        pc.ComptageRavageuraction[data.ID] = data;
        return '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.edit(pc.ComptageRavageuraction[ ' + data.ID + '])"><i class="fa fa-edit"></i></button>&nbsp;' +
          '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.ComptageRavageuraction[' + data.ID + '])" )"=""><i class="fa fa-trash-o"></i></button>';
      }).withOption('width', '5%').withClass('nowraptd all')
    ];

    pc.showimg = function(img, describe) {
      document.getElementById("filter_form").style.display = "none";
      $.magnificPopup.open({
        tClose: 'Fermer (Esc)',
        tLoading: 'Chargement...',
        delegate: 'a',
        items: {
          src: img
        },
        closeOnContentClick: true,
        closeBtnInside: true,
        mainClass: 'mfp-fade',
        image: {
          titleSrc: function() {
            return '<b style="text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;"></b>';
          }
        },
        gallery: {
          enabled: true
        },
        type: 'image'
      });
    }

    //Modifer
    pc.edit = function(data) {
      $q.all([ParcellePhysique.getParcellePhysique(_url, {
        IDFermes: pc.IDFerme
      }), Piege.getPiegeByParcelCible({
        'DOMAINE': [pc.IDFerme],
        "PARCELLE": [data.ID_Parcelle],
        "CIBLE": [0]
      })]).then((values) => {
        $scope.Parcelle = values[0].data;
        $scope.MyPiege = values[1].data;
        $scope.data = data;
        document.getElementById("filter_form").style.display = "none";
        $scope.showAdvancedEdit("ev", $scope.Parcelle, $scope.MyPiege, $scope.data);
      });
    }


    $scope.showAdvancedEdit = function(ev, Parcelle, MyPiege, data) {
      $mdDialog.show({
          controller: DialogControllerEdit,
          templateUrl: '././views/templates/suivicomptagepiegeage/EditComptagePiegeage.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            Parcelle: Parcelle,
            MyPiege: MyPiege,
            data: data
          }
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    function DialogControllerEdit($scope, $mdDialog, Parcelle, MyPiege, data) {
      $scope.Parcelle = Parcelle;
      $scope.MyPiege = MyPiege;
      $scope.data = data;
      $scope.datedecreation = new Date(moment($scope.data.DateCreated).format("YYYY-MM-DD"));

      $scope.onUpdate = () => {
        if (!$scope.parcelle) {
          $scope.parcelle = $scope.data.ID_Parcelle;
        }
        if (!$scope.piege) {
          $scope.piege = $scope.data.ID_Piege;
        }
      }

      $scope.getPiege = function() {
        if ($scope.ichangeparcelle) {
          $scope.piege = undefined;
          $scope.data.ID_Piege = undefined;
          $q.all([Piege.getPiegeByParcelCible({
            'DOMAINE': [pc.IDFerme],
            "PARCELLE": [$scope.parcelle],
            "CIBLE": [0]
          })]).then((values) => {
            NProgress.done();
            $scope.MyPiege = values[0].data;
          })
        } else {
          $scope.ichangeparcelle = true;
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
        $scope.mydatedecreation = moment($scope.datedecreation).format('YYYYMMDD');
        if ($scope.parcelle && $scope.piege && $scope.datedecreation && $scope.data.Nombre_Insecte >= 0) {
          //check campagneagricole
          $scope.progress = true;
          campagneagricole.getCodeCampagneByIDSocieteDate({
            "IDSOCIETE": pc.IDSociete,
            "DATE": $scope.mydatedecreation
          }).then(async function(result) {
            NProgress.done();
            if (result.data.length > 0) {
              //Edit
              ComptagePiege.update({
                "ID": $scope.data.ID,
                "datedecreation": $scope.mydatedecreation,
                "parcelle": $scope.parcelle,
                "piege": $scope.piege,
                "Nombre_Insecte": $scope.data.Nombre_Insecte,
                "Code_compagne": result.data[0].Code_compagne
              }).then(async function(res) {
                NProgress.done();
                pc.rescreate = res.data;
                if (pc.rescreate[0].message == 'ajout reussi') {
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
              toastr.error(await translatedwords.getTranslatedWord($translate("La date n'appartient a aucune campagne agricole !")), {
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
      pc.IDComptageRavageur = c.ID;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            ComptagePiege.delete({
              ID: pc.IDComptageRavageur
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


    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    //by parcelle cultural
    pc.parcelle_change = function() {
      var parcelle = $scope.parcelle.parcelle;

      if (validateInput(parcelle) || $scope.parcelle.parcelle.length === 0 || $scope.parcelle.parcelle.includes(0))
        parcelle = [0];

      pc.obj.PARCELLE = parcelle;
      pc.obj.PIEGE = [0];
      Piege.getPiegeByParcelCible(pc.obj).then(e => {
        pc.piege_array = e.data;
        setTimeout(function() {
          $(".selectpicker").selectpicker('refresh');
          $('#Piege option').attr("selected", false);
          $("#piege").selectpicker('refresh');
        }, 1000);
      });

    };

    pc.cible_change = function() {
      var cible = $scope.cible.cible;

      if (validateInput(cible) || $scope.cible.cible.length === 0 || $scope.cible.cible.includes(0))
        cible = [0];

      pc.obj.CIBLE = cible;
      pc.obj.PIEGE = [0];
      Piege.getPiegeByParcelCible(pc.obj).then(e => {
        pc.piege_array = e.data;
        setTimeout(function() {
          $(".selectpicker").selectpicker('refresh');
          $('#Piege option').attr("selected", false);
          $("#piege").selectpicker('refresh');
        }, 1000);
      });

    };

    pc.piege_change = function() {
      var piege = $scope.piege.piege;

      if (validateInput(piege) || $scope.piege.piege.length === 0 || $scope.piege.piege.includes(0))
        piege = [0];

      pc.obj.PIEGE = piege;

    };

    //starting date change listner
    pc.date_debut_change = function() {
      var dateToChoose = $scope.date_debut;
      if (validateInput(dateToChoose))
        dateToChoose = 0;

      pc.obj.DATE_DEBUT = moment(dateToChoose).format('YYYYMMDD');

    };

    //by date_fin
    pc.date_fin_change = function() {
      var dateToChoose = $scope.date_fin;
      if (validateInput(dateToChoose))
        dateToChoose = 0;

      pc.obj.DATE_FIN = moment(dateToChoose).format('YYYYMMDD');

    };

    pc.search = function() {
      pc.dtInstance.reloadData();
    }

    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
    }

  });