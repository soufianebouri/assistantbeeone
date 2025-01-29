'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:NutritionProgrammefertilisationCtrl
 * @description
 * # NutritionProgrammefertilisationCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('NutritionProgrammefertilisationCtrl', function($scope, translatedwords, $window, DTOptionsBuilder, $translatePartialLoader, $translate, DTColumnBuilder, $q, campagneagricole, toastr, $compile, programmefertilisation, Bloc, bac, engrais, $mdDialog, ordrefertlisation, $state, DTDefaultOptions, $cookies, savefilter) {
    var pc = this;
    pc.dtInstance = {};
    pc.showtable = true;
    pc.programmefertilisationction = {};
    pc.IDferme = $cookies.getObject('globals').ferme.IDFerme;
    pc.IDSociete = $cookies.getObject('globals').ferme.IDSociete;
    $scope.ReverseDisplay = function(d) {
      if (document.getElementById(d).style.display === "none") {
        document.getElementById(d).style.display = "block";
      } else {
        document.getElementById(d).style.display = "none";
      }
    }
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    //Set date input
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $('#compagne').selectpicker('refresh');
    }, 1000);

    pc.obj = {
      "DOMAINE": pc.IDferme,
      "DATE_DEBUT": 0,
      "DATE_FIN": moment($scope.date_fin).format('YYYYMMDD'),
      "compagne": ""
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


    $q.all([campagneagricole.getCampagneAgricoleByIDSociete(pc.IDSociete)]).then((values) => {
      pc.compagne_array = values[0].data;
      setTimeout(function() {
        $('#compagne').selectpicker('refresh');
      }, 1000);
    });
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


    pc.compagne_change = function() {
      if ($scope.compagne === null || $scope.compagne === "" || $scope.compagne === undefined || $scope.compagne === 0 || $scope.compagne === "0" || !$scope.compagne || $scope.compagne.length === 0) {
        $scope.compagne = "";
      } else {
        $scope.compagne = $scope.compagne;
      }
      pc.obj.compagne = $scope.compagne;
      pc.dtInstance.reloadData();
    };

    //get data and refresh datatable
    $scope.updateDataprogrammefertilisation = function(data) {
      return programmefertilisation.getProgrammeFertilisation(data);
    };

    //détails Solution
    pc.detailsFertilisation = function(data) {
      pc.programmefertilisationByID = data;
      pc.showtable = false;

      if (document.getElementById('filter_form').style.display === "block") {
        document.getElementById('filter_form').style.display = "none";
      }

      programmefertilisation.getProgrammeFertilisationEngrais({
        "ID": pc.programmefertilisationByID.IDProgramme_Fertigation
      }).then(function(res) {
        pc.ProgrammeFertilisationEngrais = res.data;
        NProgress.done();
      });

    }

    pc.showtable_toggle = function() {
      pc.showtable = true;
    }

    pc.getProgrammefertilisation = function(d) {
      return programmefertilisation.getProgrammeFertilisation(pc.obj).then(function(result) {
        NProgress.done();
        NProgress.remove();
        d.resolve(result.data);
      });
    }

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(async function() {
        var defer = $q.defer();
        campagneagricole.CheckCodeCompagnebyTwoDates({
          date_debut: moment().format('YYYYMMDD'),
          IDSOCIETE: pc.IDSociete
        }).then(async e => {
          if (e.data.length > 0) {
            pc.obj.compagne = e.data[0].Code_compagne;
            await pc.getProgrammefertilisation(defer);
          }
        })
        return defer.promise;
      })
      .withOption('deferRender', true)
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
      .withLanguage($.getJSON(`/scripts/i18n/datatable/${$window.localStorage.getItem("lang").toLowerCase()}.json`, function(data) {
        return data
      }))


      .withButtons([{
          extend: 'colvis',
          text: "<i class='fa fa-eye'></i>",
          className: 'pull-left',
          titleAttr: 'Visibilité'
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
        }, {
          text: "<i class='fa fa-plus'></i>",
          key: '1',
          className: 'pull-left',
          action: function(e, dt, node, config) {
            $scope.AddProgrammeFertilisation();
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Ajouter"))
        }
      ]);

    pc.dtColumns = [
      DTColumnBuilder.newColumn('Code').withTitle(translatedwords.getTranslatedWord($translate("Campagne"))),
      DTColumnBuilder.newColumn('Num_programme').withTitle(translatedwords.getTranslatedWord($translate("Numéro programme"))),
      DTColumnBuilder.newColumn('Date_debut').withTitle(translatedwords.getTranslatedWord($translate("Date début"))).renderWith(function(data, type, full, meta) {
        return moment(full.Date_debut).format('DD/MM/YYYY');
      }),
      DTColumnBuilder.newColumn('Date_fin').withTitle(translatedwords.getTranslatedWord($translate("Date fin"))).renderWith(function(data, type, full, meta) {
        return moment(full.Date_fin).format('DD/MM/YYYY');
      }),
      DTColumnBuilder.newColumn('EC').withTitle(translatedwords.getTranslatedWord($translate("EC"))),
      DTColumnBuilder.newColumn('PH').withTitle(translatedwords.getTranslatedWord($translate("PH"))),
      DTColumnBuilder.newColumn('Volume_eau').withTitle(translatedwords.getTranslatedWord($translate("Volume d'eau (L)"))),
      DTColumnBuilder.newColumn('cloture').withTitle(translatedwords.getTranslatedWord($translate("Cloturé"))).renderWith(function(data, type, full, meta) {
        if (full.cloture) {
          return "Oui";
        } else {
          return "Non";
        }
      }),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).withClass('nowraptd all').withOption('width', '5%').renderWith(actionsHtml)
    ];

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    function actionsHtml(data, type, full, meta) {
      pc.programmefertilisationction[data.IDProgramme_Fertigation] = data;
      return '<button class="btn btn-success btn-xs" title="Détails" ng-click="pc.detailsFertilisation(pc.programmefertilisationction[' + data.IDProgramme_Fertigation + '])" )"=""><i class="fa fa-eye"></i></button>' +
        '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.update(pc.programmefertilisationction[' + data.IDProgramme_Fertigation + '])" )"=""><i class="fa fa-edit"></i></button>' +
        '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.programmefertilisationction[' + data.IDProgramme_Fertigation + '])" )"=""><i class="fa fa-trash-o"></i></button>';
    }


    //Add AddProgrammeFertilisation
    $scope.AddProgrammeFertilisation = function() {
      $q.all([campagneagricole.getCampagneAgricoleByIDSociete(pc.IDSociete),
        programmefertilisation.getlastRefProgrammeFertilisation({
          IDFermes: pc.IDferme
        }),
        engrais.showbyferme({
          IDFermes: pc.IDferme
        })
      ]).then((values) => {
        NProgress.done();
        $scope.campagneagricoles = values[0].data;
        $scope.lastRefProgrammeFertilisation = values[1].data;
        $scope.engrais = values[2].data;
        $scope.showAdvancedAddProgrammeFertilisation("ev", $scope.campagneagricoles, $scope.lastRefProgrammeFertilisation, $scope.engrais);
      });
    }

    //Add AddProgrammeFertilisation
    $scope.showAdvancedAddProgrammeFertilisation = function(ev, campagneagricoles, lastRefProgrammeFertilisation, engrais) {
      $mdDialog.show({
          controller: DialogControllerAddProgrammeFertilisation,
          templateUrl: '././views/templates/programmefertilisation/AddProgrammeFertilisation.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true,
          escapeToClose: false,
          locals: {
            campagneagricoles: campagneagricoles,
            lastRefProgrammeFertilisation: lastRefProgrammeFertilisation,
            engrais: engrais
          }
        })
        .then(function(answer) {}, function() {});
    }

    //Add AddProgrammeFertilisation
    function DialogControllerAddProgrammeFertilisation($scope, $mdDialog, campagneagricoles, lastRefProgrammeFertilisation, engrais) {
      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
      $scope.campagneagricoles = campagneagricoles;
      $scope.lastRefProgrammeFertilisation = lastRefProgrammeFertilisation;
      $scope.engrais = engrais;
      $scope.Statut = 1;

      $scope.foods = [];

      function pad(num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
      }

      if ($scope.lastRefProgrammeFertilisation.length > 0) {
        $scope.Num_programme = "PF-" + pad(parseInt($scope.lastRefProgrammeFertilisation[0].Num_programme.match(/\d+/)) + 1, 6);
      } else {
        $scope.Num_programme = "PF-" + pad(1, 6);
      }

      $scope.GetOtherReference = function() {
        programmefertilisation.getlastRefProgrammeFertilisation({
          IDFermes: pc.IDferme
        }).then(e => {
          NProgress.done();
          if (e.data.length > 0) {
            $scope.Num_programme = "PF-" + pad(parseInt(e.data[0].Num_programme.match(/\d+/)) + 1, 6);
          } else {
            $scope.Num_programme = "PF-" + pad(1, 6);
          }
        }).catch(async e => {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
            closeButton: true
          });
        });
      }


      async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
      }

      $scope.isIn = async function(ID) {
        var i = false;
        await asyncForEach($scope.foods, async (value, key) => {
          if (value.blocsirrigation.ID === ID && i == false) {
            i = true;
          }
        });
        return i;
      }

      $scope.notIn = function(IDEngrais) {
        var ifoundIt = false;
        angular.forEach($scope.foods, function(value, key) {
          if (value.engrais.IDEngrais == IDEngrais && ifoundIt == false) {
            ifoundIt = true;
          }
        })
        return ifoundIt;
      }

      $scope.RetirerEngais = async function(index) {
        var confirm = $mdDialog.confirm()
          .title(await translatedwords.getTranslatedWord($translate("Veuillez confirmer la suppression d'engrais?")))
          .textContent('')
          .ariaLabel('Lucky day')
          .ok(await translatedwords.getTranslatedWord($translate("Ok")))
          .cancel(await translatedwords.getTranslatedWord($translate("Annuler")))

        $mdDialog.show(confirm.multiple(true)).then(function() {
          //ok
          $scope.foods.splice(index, 1);
          $scope.engraisel = undefined;
        }, function() {
          //cancel
        })
      }

      $scope.setFoods = function() {
        $scope.foods.push({
          engrais: $scope.engraisel,
          qantite: null
        })
      }


      $scope.checkallqteFood = function() {
        var ifoundIt = true;
        angular.forEach($scope.foods, function(value, key) {
          if (value.qantite == null && ifoundIt == true) {
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }

      $scope.AjouterProgramme = async function() {
        $scope.progress = true;
        toastr.clear();
        if ($scope.Num_programme && $scope.code && $scope.datedebut && $scope.datefin && $scope.EC && $scope.volumeeau && $scope.PH && $scope.foods.length > 0 && $scope.checkallqteFood()) {
          if ($scope.foods[0].qantite) {
            if (moment($scope.datefin).isSameOrAfter(moment($scope.datedebut))) {
              pc.objAdd = {
                "Num_programme": $scope.Num_programme,
                "code": $scope.code,
                "datedebut": moment($scope.datedebut).format('YYYYMMDD'),
                "datefin": moment($scope.datefin).format('YYYYMMDD'),
                "datecreate": moment().format('YYYYMMDD'),
                "EC": $scope.EC,
                "volumeeau": $scope.volumeeau,
                "PH": $scope.PH,
                "statut": $scope.Statut,
                "IDFermes": pc.IDferme,
                "engrais": $scope.foods
              }

              programmefertilisation.create(pc.objAdd).then(async e => {
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
              toastr.error(await translatedwords.getTranslatedWord($translate("La date fin doit être supérieure ou eguale à la date début !")), {
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


        } else {
          $scope.progress = false;
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoirese")), {
            closeButton: true
          });
        }

      };


      $scope.hideProgramme = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.AnnulerProgramme = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };




    }


    //Edit ProgrammeFertilisation
    pc.update = function(data) {
      $q.all([campagneagricole.getCampagneAgricoleByIDSociete(pc.IDSociete),
        engrais.showbyferme({
          IDFermes: pc.IDferme
        }),
        programmefertilisation.getProgrammeFertilisationEngrais({
          "ID": data.IDProgramme_Fertigation
        })
      ]).then((values) => {
        NProgress.done();
        $scope.campagneagricoles = values[0].data;
        $scope.engrais = values[1].data;
        $scope.ProgrammeFertilisationEngrais = values[2].data;
        $scope.showAdvancedEditProgrammeFertilisation("ev", data, $scope.campagneagricoles, $scope.engrais, $scope.ProgrammeFertilisationEngrais);
      });
    }

    //Edit ProgrammeFertilisation
    $scope.showAdvancedEditProgrammeFertilisation = function(ev, data, campagneagricoles, engrais, ProgrammeFertilisationEngrais) {
      $mdDialog.show({
          controller: DialogControllerEditProgrammeFertilisation,
          templateUrl: '././views/templates/programmefertilisation/EditProgrammeFertilisation.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true,
          escapeToClose: false,
          locals: {
            data: data,
            campagneagricoles: campagneagricoles,
            engrais: engrais,
            ProgrammeFertilisationEngrais: ProgrammeFertilisationEngrais,
          }
        })
        .then(function(answer) {}, function() {});
    }

    //Edit ProgrammeFertilisation
    function DialogControllerEditProgrammeFertilisation($scope, $mdDialog, data, campagneagricoles, engrais, ProgrammeFertilisationEngrais) {
      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
      $scope.data = data;
      $scope.campagneagricoles = campagneagricoles;
      $scope.ProgrammeFertilisationEngrais = ProgrammeFertilisationEngrais;
      $scope.engrais = engrais;

      $scope.datedebut = ($scope.data.Date_debut) ? new Date(moment($scope.data.Date_debut).format("YYYY-MM-DD")) : null;
      $scope.datefin = ($scope.data.Date_fin) ? new Date(moment($scope.data.Date_fin).format("YYYY-MM-DD")) : null;
      $scope.foods = [];

      async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
      }

      $scope.EngraisIN = function(IDEngrais) {
        var i = false;
        angular.forEach($scope.ProgrammeFertilisationEngrais, function(value, key) {
          if (value.IDEngrais === IDEngrais && i == false) {
            i = true;
          }
        });
        return i;
      }

      $scope.isIn = async function(ID) {
        var i = false;
        await asyncForEach($scope.foods, async (value, key) => {
          if (value.blocsirrigation.ID === ID && i == false) {
            i = true;
          }
        });
        return i;
      }

      $scope.notIn = function(IDEngrais) {
        var ifoundIt = false;
        angular.forEach($scope.foods, function(value, key) {
          if (value.engrais.IDEngrais == IDEngrais && ifoundIt == false) {
            ifoundIt = true;
          }
        })
        return ifoundIt;
      }

      $scope.RetirerEngais = async function(index) {
        var confirm = $mdDialog.confirm()
          .title(await translatedwords.getTranslatedWord($translate("Veuillez confirmer la suppression d'engrais?")))
          .textContent('')
          .ariaLabel('Lucky day')
          .ok(await translatedwords.getTranslatedWord($translate("Ok")))
          .cancel(await translatedwords.getTranslatedWord($translate("Annuler")))

        $mdDialog.show(confirm.multiple(true)).then(function() {
          //ok
          $scope.foods.splice(index, 1);
          $scope.engraisel = undefined;
        }, function() {
          //cancel
        })
      }



      $scope.setFoods = function() {
        var qantite = null;
        angular.forEach($scope.ProgrammeFertilisationEngrais, function(value, key) {
          if (value.IDEngrais == $scope.engraisel.IDEngrais) {
            qantite = value.Quantite;
          }
        })
        $scope.foods.push({
          engrais: $scope.engraisel,
          qantite: qantite
        });
      }

      $scope.checkallqteFood = function() {
        var ifoundIt = true;
        angular.forEach($scope.foods, function(value, key) {
          if (value.qantite == null && ifoundIt == true) {
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }

      $scope.ModifierProgramme = async function() {
        $scope.progress = true;
        toastr.clear();
        if ($scope.code && $scope.datedebut && $scope.datefin && $scope.data.EC && $scope.data.Volume_eau && $scope.data.PH && $scope.foods.length > 0 && $scope.checkallqteFood()) {
          if ($scope.foods[0].qantite) {
            if (moment($scope.datefin).isSameOrAfter(moment($scope.datedebut))) {
              pc.objEdit = {
                "ID": $scope.data.IDProgramme_Fertigation,
                "datedebut": moment($scope.datedebut).format('YYYYMMDD'),
                "datefin": moment($scope.datefin).format('YYYYMMDD'),
                "code": $scope.code,
                "EC": $scope.data.EC,
                "cloture": $scope.data.cloture,
                "Volume_eau": $scope.data.Volume_eau,
                "PH": $scope.data.PH,
                "engrais": $scope.foods
              }

              programmefertilisation.update(pc.objEdit).then(async e => {
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
              toastr.error(await translatedwords.getTranslatedWord($translate("La date fin doit être supérieure ou eguale à la date début")), {
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


        } else {
          $scope.progress = false;
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
            closeButton: true
          });
        }

      };


      $scope.hideProgramme = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.AnnulerProgramme = function() {
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
            programmefertilisation.delete({
              ID: c.IDProgramme_Fertigation
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