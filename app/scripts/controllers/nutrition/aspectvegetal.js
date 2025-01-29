'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:NutritionAspectvegetalCtrl
 * @description
 * # NutritionAspectvegetalCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('NutritionAspectvegetalCtrl', function($scope, translatedwords, DTOptionsBuilder, $window, $translatePartialLoader, $translate, DTColumnBuilder, campagneagricole, $q, $compile, $mdDialog, AspectVegetal, $state, $cookies, parcellecultural, NiveauCarenceService, ElementsMinerauxService, _url, DTDefaultOptions, parametragestockage, toastr) {

    //alert();
    var pc = this;
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    pc.dtInstance = {};
    pc.aspectvegetalaction = {};
    pc.IDFerme = $cookies.getObject('globals').ferme.IDFerme;
    pc.IDSociete = $cookies.getObject('globals').ferme.IDSociete;
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    pc.parametragestockage = [];
    pc.PicturesHostAspectVegetal = "";

    pc.obj = {
      "STANDARD": true,
      "DOMAINE": [pc.IDFerme],
      "ELEMENT_MINERAL": [0],
      "NIVEAU_CARENCE": [0],
      "PARCELLE_CULTURAL": [0],
      "DATE_DEBUT": 0,
      "DATE_FIN": moment().format('YYYYMMDD')
    };

    setTimeout(function() {
      $(".selectpicker").selectpicker('refresh');
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

    pc.parametragestockage = parametragestockage.getAll().then((values) => {
      pc.parametragestockage = values.data;
      NProgress.done();
      NProgress.remove();
      return pc.PicturesHostAspectVegetal = pc.parametragestockage[0].Host + pc.parametragestockage[0].Rep_Obs_Aspect_vegetal + '/';
    });

    $q.all([parcellecultural.getParcelleCulturalByFerme(pc.IDFerme), NiveauCarenceService.getCarence(_url), ElementsMinerauxService.getEelem(_url)]).then((values) => {
      pc.element_mineral_array = values[2].data;
      pc.niveau_carence_array = values[1].data;
      pc.parcelles_array = values[0].data;
      NProgress.done();
      NProgress.remove();
      setTimeout(function() {
        $(".selectpicker").selectpicker('refresh');
      }, 1000);
    });

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        AspectVegetal.getAspectVegetal(pc.obj).then(function(result) {
          for (var i = 0; i < result.data.length; i++) {
            result.data[i].DateCreated = moment(result.data[i].DateCreated).format('YYYY-MM-DD');
          }

          pc.obj.STANDARD = false;
          defer.resolve(result.data);
          NProgress.done();
        });
        return defer.promise;
      })
      .withDOM('<lf<t>ip>')
      .withPaginationType('simple_numbers')
      .withDisplayLength(10)
      .withOption('responsive', true)
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
          titleAttr: 'Imprimer'
        },
        {
          extend: 'pdf',
          text: "<i class='fa fa-file-pdf-o'></i>",
          titleAttr: 'PDF',
          titleAttr: 'EXCEL'
        },
        {
          extend: 'excel',
          text: "<i class='fa fa-file-excel-o'></i>"
        }
      ]);



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
      DTColumnBuilder.newColumn('Element_mineral').withTitle(translatedwords.getTranslatedWord($translate("Élément minéral"))),
      DTColumnBuilder.newColumn('Niveau_Carence').withTitle(translatedwords.getTranslatedWord($translate("Niveau de carence"))),
      DTColumnBuilder.newColumn('CreatedBy').withTitle(translatedwords.getTranslatedWord($translate("Observateur"))),
      DTColumnBuilder.newColumn('Description').withTitle(translatedwords.getTranslatedWord($translate("Description"))),
      DTColumnBuilder.newColumn('Photo').withTitle(translatedwords.getTranslatedWord($translate("Photo"))).renderWith(function(data, type, full, meta) {
        if (full.Photo) {
          var pics = full.Photo.split(",");
          var imghtml = "<table><tr>";
          pics.forEach(function(item, index) {
            if (item != 'noimg.png')
              imghtml += `<td><a ng-click="pc.showimg('${pc.PicturesHostAspectVegetal+item}', '${full.Description}')">` +
              `<img src="${pc.PicturesHostAspectVegetal+item}" width="50px" height="50px" class=""/>  ` +
              `</a></td>`;
          });
          return imghtml + '</tr></table>';

        } else {

          return '';
        }
      }),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).renderWith(function(data, type, full, meta) {
        pc.aspectvegetalaction[data.ID] = data;
        return '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.edit(pc.aspectvegetalaction[ ' + data.ID + '])"><i class="fa fa-edit"></i></button>&nbsp;' +
          '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.aspectvegetalaction[' + data.ID + '])" )"=""><i class="fa fa-trash-o"></i></button>';
      }).withOption('width', '5%').withClass('nowraptd all')
    ];


    //Modifer
    pc.edit = function(data) {

      $q.all([parcellecultural.ShowByDomaineEncours(pc.IDFerme), NiveauCarenceService.getCarence(_url), ElementsMinerauxService.getEelem(_url)]).then((values) => {
        $scope.ParcelleCulturale = values[0].data;
        $scope.NiveauCarence = values[1].data;
        $scope.ElementsMineraux = values[2].data;
        $scope.data = data;
        document.getElementById("filter_form").style.display = "none";
        $scope.showAdvancedEdit("ev", $scope.ParcelleCulturale, $scope.NiveauCarence, $scope.ElementsMineraux, $scope.data);
      });


    }


    $scope.showAdvancedEdit = function(ev, ParcelleCulturale, NiveauCarence, ElementsMineraux, data) {
      $mdDialog.show({
          controller: DialogControllerEdit,
          templateUrl: '././views/templates/suiviAspectvegetal/EditAspectvegetal.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            ParcelleCulturale: ParcelleCulturale,
            NiveauCarence: NiveauCarence,
            ElementsMineraux: ElementsMineraux,
            data: data
          }
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    function DialogControllerEdit($scope, $mdDialog, ParcelleCulturale, NiveauCarence, ElementsMineraux, data) {
      $scope.ParcelleCulturale = ParcelleCulturale;
      $scope.NiveauCarence = NiveauCarence;
      $scope.ElementsMineraux = ElementsMineraux;
      $scope.data = data;
      $scope.datedecreation = new Date(moment($scope.data.DateCreated).format("YYYY-MM-DD"));

      $scope.onUpdate = () => {
        if (!$scope.parcelleculturale) {
          $scope.parcelleculturale = $scope.data.ID_ParcelleCulturale;
        }
        if (!$scope.niveaucarence) {
          $scope.niveaucarence = $scope.data.ID_Niveau_Carence;
        }
        if (!$scope.elementsmineraux) {
          $scope.elementsmineraux = $scope.data.ID_Elements_Mineraux;
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
        if (!$scope.data.Description) {
          $scope.data.Description = "";
        }

        if ($scope.parcelleculturale && $scope.niveaucarence && $scope.elementsmineraux && $scope.datedecreation) {
          //check campagneagricole
          $scope.progress = true;
          campagneagricole.getCodeCampagneByIDSocieteDate({
            "IDSOCIETE": pc.IDSociete,
            "DATE": $scope.mydatedecreation
          }).then(async function(result) {
            NProgress.done();
            if (result.data.length > 0) {
              //Edit
              AspectVegetal.update({
                "ID": $scope.data.ID,
                "datedecreation": $scope.mydatedecreation,
                "parcelleculturale": $scope.parcelleculturale,
                "niveaucarence": $scope.niveaucarence,
                "elementsmineraux": $scope.elementsmineraux,
                "Description": $scope.data.Description.replace(/'/g, "''"),
                "Code_compagne": result.data[0].Code_compagne
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
      pc.IDAspectVegetal = c.ID;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            AspectVegetal.delete({
              ID: pc.IDAspectVegetal
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
            return '<b style="text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;"><u>Description</u> : ' + describe + '</b>';
          }
        },
        gallery: {
          enabled: true
        },
        type: 'image'
      });
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

    function actionsHtml(data, type, full, meta) {
      return '<button class="btn btn-warning btn-xs" ng-click="pc.edit(pc.obj[' + data.ID + '])">' +
        '   <i class="fa fa-edit"></i>' +
        '</button>&nbsp;' +
        '<button class="btn btn-danger btn-xs" ng-click="pc.delete(pc.obj[' + data.ID + '])" )"="">' +
        '   <i class="fa fa-trash-o"></i>' +
        '</button>';
    }


    pc.element_mineral_change = function() {
      NProgress.start();
      var element_mineral = $scope.element_mineral.element_mineral;

      if (validateInput(element_mineral) || $scope.element_mineral.element_mineral.length === 0 || $scope.element_mineral.element_mineral.includes(0))
        element_mineral = [0];

      pc.obj.ELEMENT_MINERAL = element_mineral;
      try {
        pc.dtInstance.reloadData();
      } catch (e) {}
      NProgress.done();
      NProgress.remove();
    };

    pc.niveau_carence_change = function() {
      NProgress.start();
      var niveau_carence = $scope.niveau_carence.niveau_carence;

      if (validateInput(niveau_carence) || $scope.niveau_carence.niveau_carence.length === 0 || $scope.niveau_carence.niveau_carence.includes(0))
        niveau_carence = [0];

      pc.obj.NIVEAU_CARENCE = niveau_carence;
      try {
        pc.dtInstance.reloadData();
      } catch (e) {}
      NProgress.done();
      NProgress.remove();
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

    //by parcelle cultural
    pc.parcelle_change = function() {
      var parcelle = $scope.parcelle.parcelle;

      if (validateInput(parcelle) || $scope.parcelle.parcelle.length === 0 || $scope.parcelle.parcelle.includes(0))
        parcelle = [0];

      pc.obj.PARCELLE_CULTURAL = parcelle;
      try {
        pc.dtInstance.reloadData();
      } catch (e) {}
    };

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
    }
  });