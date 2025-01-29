'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:SanteplanteChangementpheromoneCtrl
 * @description
 * # SanteplanteChangementpheromoneCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('SanteplanteChangementpheromoneCtrl', function($scope, translatedwords, DTOptionsBuilder, $window, _url, ParcellePhysique, $translatePartialLoader, $translate, DTColumnBuilder, $mdDialog, toastr, $q, $compile, campagneagricole, $state, DTDefaultOptions, $cookies, changementpheromone, Piege, Cible) {

    var pc = this;
    pc.dtInstance = {};
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    pc.ChangementPheroaction = {};
    pc.IDFerme = $cookies.getObject('globals').ferme.IDFerme;
    pc.IDSociete = $cookies.getObject('globals').ferme.IDSociete;
    pc.User = $cookies.getObject('globals').currentUser.Nom + " " + $cookies.getObject('globals').currentUser.Prenom;
    pc.IDUser = $cookies.getObject('globals').currentUser.ID;

    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Piege").selectpicker('refresh');
      $("#cible").selectpicker('refresh');
    }, 1000);


    var permission_data = JSON.parse($window.localStorage.getItem('permission'));
    var permission = {
      modules_array: permission_data[0],
      rubriques_array: permission_data[1],
      sous_modules_array: permission_data[2]
    }

    pc.isAdmin = $cookies.getObject('globals').currentUser.isAdmin;

    var opsemisAccess = _.filter(permission.sous_modules_array, {
      ss_module: 'changement_phero'
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
          $scope.AddChangement()
        },
        titleAttr: 'Ajouter'
      }
    } else {
      $scope.btnadd = undefined;
    }


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



    //set date input
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();



    $q.all([Piege.getPiegeByFerme($cookies.getObject('globals').ferme.IDFerme), Cible.getAllCible()]).then(function(values) {
      pc.pieges = values[0].data;
      pc.cible_array = values[1].data;
      setTimeout(function() {
        $("#Piege").selectpicker('refresh');
        $("#cible").selectpicker('refresh');
      }, 1000);
    });

    pc.obj = {
      "DOMAINE": $cookies.getObject('globals').ferme.IDFerme,
      "PIEGE": [0],
      "DATE_DEBUT": 0,
      "DATE_FIN": moment($scope.date_fin).format('YYYYMMDD'),
      "CIBLE": [0]
    };


    $scope.piege_sel = [0];
    $scope.date_debut_sel = 0;
    $scope.date_fin_sel = moment($scope.date_fin).format('YYYYMMDD');

    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
    }

    pc.cible_change = function() {
      var cible = $scope.cible.cible;

      if (validateInput(cible) || $scope.cible.cible.length === 0 || $scope.cible.cible.includes(0))
        cible = [0];

      pc.obj.CIBLE = cible;
      pc.obj.PIEGE = [0];
      Piege.getPiegeByCible(pc.obj).then(e => {
        pc.pieges = e.data;
        setTimeout(function() {
          $(".selectpicker").selectpicker('refresh');
          $('#Piege option').attr("selected", false);
          $("#Piege").selectpicker('refresh');
        }, 1000);
      });

    };

    //by ppiege
    $scope.piege_change = function() {

      if ($scope.piege.piege === null || $scope.piege.piege === "" || $scope.piege.piege === undefined || $scope.piege.piege === 0 || $scope.piege.piege === "0" || !$scope.piege.piege || $scope.piege.piege.length === 0 || $scope.piege.piege.includes(0)) {
        $scope.piege_sel = [0];
      } else {
        $scope.piege_sel = $scope.piege.piege;
      }

      pc.obj.PIEGE = $scope.piege_sel;


    };

    //by date_debutl
    $scope.date_debut_change = function() {

      if ($scope.date_debut === null || $scope.date_debut === "" || $scope.date_debut === undefined || $scope.date_debut === 0 || $scope.date_debut === "0" || !$scope.date_debut || $scope.date_debut.length === 0) {
        $scope.date_debut_sel = 0;
      } else {
        $scope.date_debut_sel = $scope.date_debut;
      }

      pc.obj.DATE_DEBUT = moment($scope.date_debut_sel).format('YYYYMMDD');


    };

    //by date_fin
    $scope.date_fin_change = function() {

      if ($scope.date_fin === null || $scope.date_fin === "" || $scope.date_fin === undefined || $scope.date_fin === 0 || $scope.date_fin === "0" || !$scope.date_fin || $scope.date_fin.length === 0) {
        $scope.date_fin_sel = 0;
      } else {
        $scope.date_fin_sel = $scope.date_fin;
      }

      pc.obj.DATE_FIN = moment($scope.date_fin_sel).format('YYYYMMDD');


    };

    pc.search = function() {
      pc.dtInstance.reloadData();
    }
    //get data and refresh datatable
    $scope.updateDataObservatioPhyto = function(data) {
      return changementpheromone.getByFiltre(data);
    };

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        $scope.updateDataObservatioPhyto(pc.obj).then(function(res) {
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
        },
        {
          text: "<i class='fa fa-reorder'></i>",
          action: function(e, dt, node, config) {
            $state.go("fichesdesuividechangementpheromone");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Fiches de suivi de changement pheromone"))
        }
      ].concat($scope.btnadd));

    pc.dtColumns = [
      DTColumnBuilder.newColumn('Date_Changement').withTitle(translatedwords.getTranslatedWord($translate("Date de changement"))).renderWith(function(data, type, full, meta) {
        return moment(full.Date_Changement).format('DD/MM/YYYY');
      }),
      DTColumnBuilder.newColumn('Code_Piege').withTitle(translatedwords.getTranslatedWord($translate("Piège"))),
      DTColumnBuilder.newColumn('Cible').withTitle(translatedwords.getTranslatedWord($translate("Cible"))),
      DTColumnBuilder.newColumn('Caracteristique').withTitle(translatedwords.getTranslatedWord($translate("Caracteristique"))).renderWith(function(data, type, full, meta) {
        var Caracteristique = '';
        if (parseInt(full.Caracteristique) == 0) {
          Caracteristique = "Mâle";
        } else {
          Caracteristique = "Femalle";
        }
        return Caracteristique;
      }),
      DTColumnBuilder.newColumn('Date_Installation').withTitle(translatedwords.getTranslatedWord($translate("Date d'installation"))).renderWith(function(data, type, full, meta) {
        return moment(full.Date_Installation).format('DD/MM/YYYY');
      }),
      DTColumnBuilder.newColumn('Num_Date').withTitle(translatedwords.getTranslatedWord($translate("Numéro de changement"))),

      DTColumnBuilder.newColumn('Date_Expire').withTitle(translatedwords.getTranslatedWord($translate("Date d'expiration"))).renderWith(function(data, type, full, meta) {
        return moment(full.Date_Expire).format('DD/MM/YYYY');
      }),
      DTColumnBuilder.newColumn('CreatedBy').withTitle(translatedwords.getTranslatedWord($translate("Observateur"))),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).renderWith(function(data, type, full, meta) {
        pc.ChangementPheroaction[data.ID] = data;
        var editbtn = ($scope.canIAction().update) ? '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.edit(pc.ChangementPheroaction[ ' + data.ID + '])"><i class="fa fa-edit"></i></button>&nbsp;' : '';
        var deletebtn = ($scope.canIAction().delete) ? '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.ChangementPheroaction[' + data.ID + '])" )"=""><i class="fa fa-trash-o"></i></button>' : '';
        return editbtn + deletebtn
      }).withOption('width', '5%').withClass('nowraptd all')
    ];

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');




    $scope.AddChangement = function() {
      $mdDialog.show({
          controller: DialogControllerAddChangement,
          templateUrl: '././views/templates/suiviChangementpheromone/AddChangementpheromone.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true,
          escapeToClose: false
        })
        .then(function(answer) {}, function() {});
    }


    function DialogControllerAddChangement($scope, $mdDialog) {

      $q.all([
        Piege.getPiegeByParcelCible({
          'DOMAINE': [pc.IDFerme],
          "PARCELLE": [0],
          "CIBLE": [0]
        }),
        ParcellePhysique.getAllParcellePhysique(_url, pc.IDFerme)
      ]).then((values) => {
        NProgress.done();
        $scope.MyPiege = values[0].data;
        $scope.parcelles = values[1].data;
        $scope.letmeclick = true;
      });
      $scope.piegesel = [];
      $scope.Num_Date = [];

      $scope.getPiegeGo = () => {
        $scope.piegesel = [];
        $scope.Num_Date = [];
        $scope.MyPiege = [];
        Piege.getPiegeByParcelCible({
          'DOMAINE': [pc.IDFerme],
          "PARCELLE": ($scope.parcellesel) ? $scope.parcellesel : [0],
          "CIBLE": [0]
        }).then(e => {
          NProgress.done();
          $scope.MyPiege = e.data;
        }).catch(async e => {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
            closeButton: true
          });
        });

      }

      async function extractIDs(data) {
        return (data.length > 0) ? data.map(item => item.ID) : [];
      }

      $scope.calculateHeightPercentage = function() {
        if ($scope.dataJsonArray.length >= 1 && $scope.dataJsonArray.length <= 5) {
          return '50%';
        } else if ($scope.dataJsonArray.length > 5) {
          return '70%';
        }
        // You can add additional conditions if needed
        return '50%'; // Default height if array is empty or other conditions
      };

      $scope.getNumChangementGo = async () => {
        $scope.Num_Date = [];
        $scope.piegesel = ($scope.piegesel) ? $scope.piegesel : [];
        changementpheromone.getNumChangementMultipiege({
          'ID_Piege': await extractIDs($scope.piegesel)
        }).then(e => {
          NProgress.done();
          $scope.Num_Date = e.data;
        }).catch(async e => {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
            closeButton: true
          });
        });

      }


      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
      $scope.DateChangement = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

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

        if ($scope.DateChangement && $scope.piegesel.length > 0 && $scope.datedeexpire) {

          pc.objAdd = {
            "DateChangement": moment($scope.DateChangement).format('YYYYMMDD'),
            "piegesel": $scope.piegesel,
            "datedeexpire": moment($scope.datedeexpire).format('YYYYMMDD'),
            "Utilisateur": pc.User,
            "IDFermes": pc.IDFerme,
            "Num_Date": $scope.Num_Date,
            "IDUser": pc.IDUser
          }


          campagneagricole.CheckCodeCompagnebyTwoDates({
            date_debut: moment($scope.DateChangement).format('YYYYMMDD'),
            IDSOCIETE: pc.IDSociete
          }).then(async e => {
            if (e.data.length > 0) {
              pc.objAdd.Code_compagne = e.data[0].Code_compagne;

              changementpheromone.createweb(pc.objAdd).then(async e => {
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
                toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement : ")), {
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



    //Modifer
    pc.edit = function(data) {
      $q.all([Piege.getPiegeByParcelCible({
        'DOMAINE': [pc.IDFerme],
        "PARCELLE": [0],
        "CIBLE": [0]
      }), ParcellePhysique.getAllParcellePhysique(_url, pc.IDFerme)]).then((values) => {
        $scope.MyPiege = values[0].data;
        $scope.parcelles = values[1].data;
        $scope.data = data;
        document.getElementById("filter_form").style.display = "none";
        $scope.showAdvancedEdit("ev", $scope.MyPiege, $scope.data, $scope.parcelles);
      });
    }


    $scope.showAdvancedEdit = function(ev, MyPiege, data, parcelles) {
      $mdDialog.show({
          controller: DialogControllerEdit,
          templateUrl: '././views/templates/suiviChangementpheromone/EditChangementpheromone.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            MyPiege: MyPiege,
            parcelles: parcelles,
            data: data
          }
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    function DialogControllerEdit($scope, $mdDialog, MyPiege, data, parcelles) {
      $scope.MyPiege = MyPiege;
      $scope.parcelles = parcelles;
      $scope.data = data;



      $scope.oldNum = $scope.data.Num_Date;
      $scope.oldPiege = $scope.data.ID_Piege;
      $scope.datedechangement = new Date(moment($scope.data.Date_Changement).format("YYYY-MM-DD"));
      $scope.datedeexpire = new Date(moment($scope.data.Date_Expire).format("YYYY-MM-DD"));

      $scope.onUpdate = () => {
        if (!$scope.parcelle) {
          $scope.parcelle = $scope.data.ID_Parcelle;
        }
        if (!$scope.piege) {
          $scope.piege = $scope.data.ID_Piege;
        }
      }

      $scope.firstload = true;

      $scope.getPiegeGo = () => {
        if (!$scope.firstload) {
          $scope.piegesel = {};
          $scope.Num_Date = undefined;
          $scope.MyPiege = [];
          Piege.getPiegeByParcelCible({
            'DOMAINE': [pc.IDFerme],
            "PARCELLE": ($scope.parcellesel) ? $scope.parcellesel : [0],
            "CIBLE": [0]
          }).then(e => {
            NProgress.done();
            $scope.MyPiege = e.data;
          }).catch(async e => {
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
              closeButton: true
            });
          });
        } else {
          $scope.firstload = false;
        }


      }


      $scope.getnumchangement = function() {
        if ($scope.oldPiege != $scope.piege.ID) {
          $scope.data.Num_Date = undefined;
          $q.all([changementpheromone.getNumChangement({
            'ID_Piege': $scope.piege.ID
          })]).then((values) => {
            NProgress.done();
            $scope.data.Num_Date = (values[0].data[0].Num_Date) ? values[0].data[0].Num_Date : 1;
          })
        } else {
          $scope.data.Num_Date = $scope.oldNum;
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
        $scope.mydatedechangement = moment($scope.datedechangement).format('YYYYMMDD');
        $scope.mydatedeexpire = moment($scope.datedeexpire).format('YYYYMMDD');
        if (!angular.equals({}, $scope.piege) && $scope.datedechangement && $scope.datedeexpire && $scope.data.Num_Date) {
          //check campagneagricole
          $scope.progress = true;
          campagneagricole.getCodeCampagneByIDSocieteDate({
            "IDSOCIETE": pc.IDSociete,
            "DATE": $scope.mydatedechangement
          }).then(async function(result) {
            NProgress.done();
            if (result.data.length > 0) {
              //Edit
              changementpheromone.update({
                "ID": $scope.data.ID,
                "datedecreation": $scope.mydatedecreation,
                "datedechangement": $scope.mydatedechangement,
                "datedeexpire": $scope.mydatedeexpire,
                "piege": $scope.piege.ID,
                "parcelle": $scope.piege.ID_Parcelle,
                "Num_Date": $scope.data.Num_Date,
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
      pc.IDChangementPhero = c.ID;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            changementpheromone.delete({
              ID: pc.IDChangementPhero
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


  });