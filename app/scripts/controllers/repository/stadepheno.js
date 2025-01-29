'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RepositoryStadephenoCtrl
 * @description
 * # RepositoryStadephenoCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RepositoryStadephenoCtrl', function($scope, StadePheno, translatedwords, $translatePartialLoader, $translate, $window, DTOptionsBuilder, $state, DTColumnBuilder, $q, $compile, parcellecultural, VarieteService, $cookies, DTDefaultOptions, refstadephenologiques, $mdDialog, IntensiteStadeService, qualiteStade, _url, toastr, campagneagricole, parametragestockage) {
    var pc = this;
    NProgress.start();
    pc.dtInstance = {};
    pc.stadeObject = {};
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    pc.IDFerme = $cookies.getObject('globals').ferme.IDFerme;
    pc.IDSociete = $cookies.getObject('globals').ferme.IDSociete;
    pc.UserData = $cookies.getObject('globals').currentUser;
    pc.CreatedByUser = pc.UserData.Nom + " " + pc.UserData.Prenom;
    pc.IDUSER = pc.UserData.ID;
    pc.parametragestockage = [];
    pc.PicturesHostStadePheno = "";

    setTimeout(function() {
      $("#Parcelle").selectpicker('refresh');
      $("#VarieteSelection").selectpicker('refresh');
      $("#Stade").selectpicker('refresh');
    }, 1000);

    pc.obj = {
      "FERME": [$cookies.getObject('globals').ferme.IDFerme],
      "VARIETE": [0],
      "PARCELLE_CULTURAL": [0],
      "STADE": [0],
      "DATE_DEBUT": 0,
      "DATE_FIN": moment().format('YYYYMMDD')
    };

    pc.parametragestockage = parametragestockage.getAll().then((values) => {
      pc.parametragestockage = values.data;
      NProgress.done();
      NProgress.remove();
      return pc.PicturesHostStadePheno = pc.parametragestockage[0].Host + pc.parametragestockage[0].Rep_Obs_Autres_stades + '/';
    });


    $q.all([parcellecultural.getParcelleCulturalByFerme(pc.IDFerme), VarieteService.getVarieteByParcel(pc.obj), refstadephenologiques.getAllStadePhenologique()]).then((values) => {
      pc.parcellescultural = values[0].data;
      pc.varietes = values[1].data;
      pc.stades = values[2].data;
      NProgress.done();
      NProgress.remove();
      setTimeout(function() {
        $("#Parcelle").selectpicker('refresh');
        $("#VarieteSelection").selectpicker('refresh');
        $("#Stade").selectpicker('refresh');
      }, 1000);

    });

    $scope.ReverseDisplay = function(d) {
      if (document.getElementById(d).style.display === "none") {
        document.getElementById(d).style.display = "block";
      } else {
        document.getElementById(d).style.display = "none";
      }
    }

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        StadePheno.getStadePheno(pc.obj).then(function(result) {
          NProgress.done();
          for (var i = 0; i < result.data.length; i++) {
            result.data[i].DateCreated = moment(result.data[i].DateCreated).format('YYYY-MM-DD');
          }
          defer.resolve(result.data);
        });
        return defer.promise;
      })
      .withDOM('<lf<t>ip>')
      .withPaginationType('simple_numbers')
      .withDisplayLength(10)
      .withOption('createdRow', createdRow)
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
        /*{
                 text: "<i class='fa fa-plus'></i>",
                 key: '1',
                 action: function(e, dt, node, config) {
                   pc.AddStadePheno();
                 },
                 className: 'pull-left',
                 titleAttr: 'Ajouter'
               },*/
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
          text: "<i class='fa fa-area-chart'></i>",
          action: function(e, dt, node, config) {
            $state.go("stadehenologiquesdiagrammegantt");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Calendrier des stades"))
        }
      ]);
    pc.carenceObject = {};
    pc.dtColumns = [
      DTColumnBuilder.newColumn('DateCreated').withTitle(translatedwords.getTranslatedWord($translate("Date"))).renderWith(function(data, type, full, meta) {
        if (full.DateCreated)
          return moment(full.DateCreated).format('DD/MM/YYYY');
        return "";
      }),
      DTColumnBuilder.newColumn('Date_Constatation').withTitle(translatedwords.getTranslatedWord($translate('Date de constatation'))).renderWith(function(data, type, full, meta) {
        if (full.Date_Constatation)
          return moment(full.Date_Constatation).format('DD/MM/YYYY');
        return "";
      }),
      DTColumnBuilder.newColumn('Ref').withTitle(translatedwords.getTranslatedWord($translate("Parcelle culturale"))),
      DTColumnBuilder.newColumn('Culture').withTitle(translatedwords.getTranslatedWord($translate("Culture"))),
      DTColumnBuilder.newColumn('Variete').withTitle(translatedwords.getTranslatedWord($translate("Variété"))),
      DTColumnBuilder.newColumn('Porte_greffe').withTitle(translatedwords.getTranslatedWord($translate("Porte-Greffe"))),
      DTColumnBuilder.newColumn('code').withTitle(translatedwords.getTranslatedWord($translate("Stade phénologique"))),
      DTColumnBuilder.newColumn('Qualite_Stade').withTitle(translatedwords.getTranslatedWord($translate("Qualité"))),
      DTColumnBuilder.newColumn('Intensite_Stade').withTitle(translatedwords.getTranslatedWord($translate("Intensité"))),
      DTColumnBuilder.newColumn('CreatedBy').withTitle(translatedwords.getTranslatedWord($translate("Observateur"))),
      DTColumnBuilder.newColumn('Description').withTitle(translatedwords.getTranslatedWord($translate("Description"))),
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
      DTColumnBuilder.newColumn(null).withOption('width', '10%').withTitle(translatedwords.getTranslatedWord($translate("Actions"))).notSortable()
      .renderWith(actionsHtml).withClass('nowraptd all')
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

    function actionsHtml(data, type, full, meta) {
      pc.stadeObject[data.ID] = data;
      return "<button class='btn btn-warning btn-xs' title='Modifier' ng-click='pc.edit(pc.stadeObject[ " + data.ID + "])'><i class='fa fa-edit'></i></button>&nbsp;" +
        "<button class='btn btn-danger btn-xs' title='Supprimer' ng-click='pc.delete(" + data.ID + ")'><i class='fa fa-trash'></i></button>";
    }

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

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

      //pc.obj.PARCELLE_CULTURAL = parcelle;
      $('.selectpicker').prop('disabled', true);
      $('.selectpicker').selectpicker('refresh');

      VarieteService.getVarieteByParcel(pc.obj).then(res => {
        pc.varietes = res.data;
        $('.selectpicker').prop('disabled', false);
        setTimeout(function() {
          $(".selectpicker").selectpicker('refresh');
        }, 1000);
      });

      refstadephenologiques.getAllStadePhenologiqueByCulture({
        IdCulture: idculture
      }).then(res => {
        pc.stades = res.data;
        $('.selectpicker').prop('disabled', false);
        setTimeout(function() {
          $(".selectpicker").selectpicker('refresh');
        }, 1000);
      });

      try {
        pc.dtInstance.reloadData();
      } catch (e) {

      }
      NProgress.done();
      NProgress.remove();
    };

    //by variete
    pc.variete_change = function() {
      NProgress.start();
      pc.obj.VARIETE = [];
      var idculture = [];
      var variete = $scope.variete.variete;

      if (validateInput(variete) || $scope.variete.variete.length === 0 || $scope.variete.variete.includes(0)) {
        variete = [0];
        pc.obj.VARIETE = [0];
        idculture = [0]
      } else {
        for (var i = 0; i < variete.length; i++) {
          pc.obj.VARIETE.push(variete[i].varieteId);
          idculture.push(variete[i].idculture)
        }
      }

      refstadephenologiques.getAllStadePhenologiqueByCulture({
        IdCulture: idculture
      }).then(res => {
        pc.stades = res.data;
        $('.selectpicker').prop('disabled', false);
        setTimeout(function() {
          $(".selectpicker").selectpicker('refresh');
        }, 1000);
      });

      try {
        pc.dtInstance.reloadData();
      } catch (e) {

      }
      NProgress.done();
      NProgress.remove();
    };

    //by stade_change
    pc.stade_change = function() {
      NProgress.start();
      var stade = $scope.stade.stade;

      if (validateInput(stade) || $scope.stade.stade.length === 0 || $scope.stade.stade.includes(0))
        stade = [0];

      pc.obj.STADE = stade;

      try {
        pc.dtInstance.reloadData();
      } catch (e) {

      }
      NProgress.done();
      NProgress.remove();
    };

    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
    }

    //starting date change listner
    pc.date_debut_change = function() {
      NProgress.start();
      var dateToChoose = $scope.date_debut;
      if (validateInput(dateToChoose))
        dateToChoose = 0;

      pc.obj.DATE_DEBUT = moment(dateToChoose).format('YYYYMMDD');
      $scope.reload = true;
      try {
        pc.dtInstance.reloadData();
      } catch (e) {}
      NProgress.done();
      NProgress.remove();
    };

    //by date_fin
    pc.date_fin_change = function() {
      NProgress.start();
      var dateToChoose = $scope.date_fin;
      if (validateInput(dateToChoose))
        dateToChoose = 0;

      pc.obj.DATE_FIN = moment(dateToChoose).format('YYYYMMDD');
      $scope.reload = true;
      try {
        pc.dtInstance.reloadData();
      } catch (e) {}
      NProgress.done();
      NProgress.remove();
    };
    //Delete StadePheno
    pc.delete = async function(IDStade_phenologiqueDelete) {
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            StadePheno.DeleteStadePheno({
              "IDStade_phenologiqueDelete": IDStade_phenologiqueDelete
            }).then(async function(res) {
              NProgress.done();
              pc.rescreate = res.data;
              if (pc.rescreate[0].message == 'ajout reussi') {
                toastr.clear();
                toastr.info(await translatedwords.getTranslatedWord($translate("Suppression réussie")), {
                  closeButton: true
                });
                pc.dtInstance.reloadData();
              } else {
                toastr.clear();
                toastr.error(await translatedwords.getTranslatedWord($translate("Server is down, plz try again !")), {
                  closeButton: true
                });
              }
            });
          });
        }
      });


    }


    //add AddStadePheno
    pc.AddStadePheno = function() {

      $q.all([parcellecultural.ShowByDomaineEncours(pc.IDFerme),
        refstadephenologiques.getAllStadePhenologique(),
        IntensiteStadeService.getStade(_url),
        qualiteStade.getQualiteStade(_url)
      ]).then((values) => {
        $scope.ParcelleCulturale = values[0].data;
        $scope.RefStadePhenologique = values[1].data;
        $scope.IntensiteStade = values[2].data;
        $scope.QualiteStade = values[3].data;
        document.getElementById("filter_form").style.display = "none";
        NProgress.done();
        $scope.showAdvancedAdd("ev", $scope.ParcelleCulturale, $scope.RefStadePhenologique, $scope.IntensiteStade, $scope.QualiteStade);
      });

    }

    $scope.showAdvancedAdd = function(ev, ParcelleCulturale, RefStadePhenologique, IntensiteStade, QualiteStade) {
      $mdDialog.show({
          controller: DialogControllerAdd,
          templateUrl: '././views/templates/suivistadephenologique/AddStadePhenologique.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            ParcelleCulturale: ParcelleCulturale,
            RefStadePhenologique: RefStadePhenologique,
            IntensiteStade: IntensiteStade,
            QualiteStade: QualiteStade
          }
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    function DialogControllerAdd($scope, $mdDialog, ParcelleCulturale, RefStadePhenologique, IntensiteStade, QualiteStade) {

      $scope.ParcelleCulturale = ParcelleCulturale;
      $scope.RefStadePhenologique = RefStadePhenologique;
      $scope.IntensiteStade = IntensiteStade;
      $scope.QualiteStade = QualiteStade;
      $scope.datedecreation = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
      $scope.timedecreation = moment().format('h:mm');


      $scope.hide = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Annuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.setFiles = function(element) {
        $scope.$apply(function(scope) {
          $scope.files = [];
          for (var i = 0; i < element.files.length; i++) {
            scope.files.push(element.files[i])
          }
        });
        for (var i in $scope.files) {
          document.getElementById('img' + i).src = URL.createObjectURL(this.files[i]); // set src to blob url
        }
      };


      $scope.changeimg = function() {


      };

      $scope.Ajouter = async function() {
        /*  var fileUpload = $("#fileInput")[0];
         */

        /*var fileData = new FormData();
        for (var i in $scope.files) {
          fileData.append('file', $scope.files[i]);
          document.getElementById('img' + i).src = URL.createObjectURL(this.files[i]); // set src to blob url
        }*/





        toastr.clear();
        $scope.str = "";
        $scope.mydatedecreation = moment($scope.datedecreation).format('YYYYMMDD');
        if (!$scope.Description) {
          $scope.Description = "";
        }

        if ($scope.parcelleculturale && $scope.stade && $scope.qualite && $scope.intensite) {
          //check campagneagricole
          $scope.progress = true;
          campagneagricole.getCodeCampagneByIDSocieteDate({
            "IDSOCIETE": pc.IDSociete,
            "DATE": $scope.mydatedecreation
          }).then(async function(result) {
            NProgress.done();
            if (result.data.length > 0) {
              //En masse
              angular.forEach($scope.parcelleculturale, function(value, key) {
                $scope.str += "(" + value + ",'" + $scope.mydatedecreation + "'," + $scope.stade + "," + $scope.qualite + "," + $scope.intensite + ",'" + $scope.Description.replace(/'/g, "''") + "','" + result.data[0].Code_compagne + "','" + pc.CreatedByUser + "'," + pc.IDUSER + ",'" + $scope.timedecreation + "'," + pc.IDFerme + ",1),";
              });
              StadePheno.CreateStadePheno({
                "AUTRESTADEMASSE": $scope.str.substring(0, $scope.str.length - 1)
              }).then(async function(res) {
                NProgress.done();
                pc.rescreate = res.data;
                if (pc.rescreate[0].message == 'ajout reussi') {
                  toastr.clear();
                  toastr.info(await translatedwords.getTranslatedWord($translate("Ajout reussi!")), {
                    closeButton: true
                  });
                  $mdDialog.hide();
                  document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
                  pc.dtInstance.reloadData();
                  $scope.progress = false;
                } else {
                  toastr.clear();
                  toastr.error(await translatedwords.getTranslatedWord($translate("Server is down, plz try again !")), {
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

    //Modifer stade
    pc.edit = function(data) {


      $q.all([parcellecultural.ShowByDomaineEncours(pc.IDFerme),
        IntensiteStadeService.getStade(_url),
        refstadephenologiques.getAllStadePhenologique(),
        qualiteStade.getQualiteStade(_url)
      ]).then((values) => {
        $scope.ParcelleCulturale = values[0].data;
        $scope.IntensiteStade = values[1].data;
        $scope.RefStadePhenologique = values[2].data;
        $scope.QualiteStade = values[3].data;
        $scope.data = data;
        document.getElementById("filter_form").style.display = "none";
        NProgress.done();
        $scope.showAdvancedEdit("ev", $scope.ParcelleCulturale, $scope.RefStadePhenologique, $scope.IntensiteStade, $scope.QualiteStade, $scope.data);
      });
    }


    $scope.showAdvancedEdit = function(ev, ParcelleCulturale, RefStadePhenologique, IntensiteStade, QualiteStade, data) {
      $mdDialog.show({
          controller: DialogControllerEdit,
          templateUrl: '././views/templates/suivistadephenologique/EditStadePhenologique.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            ParcelleCulturale: ParcelleCulturale,
            RefStadePhenologique: RefStadePhenologique,
            IntensiteStade: IntensiteStade,
            QualiteStade: QualiteStade,
            data: data
          }
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    function DialogControllerEdit($scope, $mdDialog, ParcelleCulturale, RefStadePhenologique, IntensiteStade, QualiteStade, data) {

      $scope.ParcelleCulturale = ParcelleCulturale;
      $scope.RefStadePhenologique = RefStadePhenologique;
      $scope.IntensiteStade = IntensiteStade;
      $scope.QualiteStade = QualiteStade;
      $scope.data = data;
      $scope.datedecreation = new Date(moment($scope.data.DateCreated).format("YYYY-MM-DD"));
      $scope.dateconstatation = new Date(moment($scope.data.Date_Constatation).format("YYYY-MM-DD"));
      $scope.timedecreation = moment().format('h:mm');
      $scope.IDStade_phenologiqueEdit = $scope.data.ID;
      $scope.onUpdate = () => {
        if (!$scope.parcelleculturale) {
          $scope.parcelleculturale = $scope.data.ID_ParcelleCulturale;
        }
        if (!$scope.stade) {
          $scope.stade = $scope.data.ID_Stade_phenologique;
        }
        if (!$scope.qualite) {
          $scope.qualite = $scope.data.ID_Qualite_Stade;
        }
        if (!$scope.intensite) {
          $scope.intensite = $scope.data.ID_Intensite_Stade;
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
        $scope.mydateconstatation = moment($scope.dateconstatation).format('YYYYMMDD');

        if (!$scope.Description) {
          $scope.Description = "";
        }

        if ($scope.parcelleculturale && $scope.stade && $scope.qualite && $scope.intensite && $scope.dateconstatation && $scope.dateconstatation != 'Invalid Date') {
          //check campagneagricole
          $scope.progress = true;
          campagneagricole.getCodeCampagneByIDSocieteDate({
            "IDSOCIETE": pc.IDSociete,
            "DATE": $scope.mydatedecreation
          }).then(async function(result) {
            NProgress.done();
            if (result.data.length > 0) {
              //Edit
              StadePheno.EditStadePheno({
                "IDStade_phenologiqueEdit": $scope.IDStade_phenologiqueEdit,
                "parcelleculturale": $scope.parcelleculturale,
                "mydatedecreation": $scope.mydatedecreation,
                "mydateconstatation": $scope.mydateconstatation,
                "stade": $scope.stade,
                "qualite": $scope.qualite,
                "intensite": $scope.intensite,
                "Description": $scope.data.Description.replace(/'/g, "''"),
                "Code_compagne": result.data[0].Code_compagne,
                "timedecreation": $scope.timedecreation
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

  });