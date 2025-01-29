'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:NutritionSolutionmereCtrl
 * @description
 * # NutritionSolutionmereCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('NutritionSolutionmereCtrl', function($scope, translatedwords, DTOptionsBuilder, $window, $translatePartialLoader, $translate, DTColumnBuilder, $q, toastr, $compile, solutionmere, Bloc, bac, engrais, $mdDialog, ordrefertlisation, $state, DTDefaultOptions, $cookies, savefilter) {
    var pc = this;
    pc.dtInstance = {};
    pc.showtable = true;
    pc.solutionmereAction = {};
    pc.IDferme = $cookies.getObject('globals').ferme.IDFerme;
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
    //set date input
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

    pc.obj = {
      "DOMAINE": pc.IDferme,
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


    //get data and refresh datatable
    $scope.updateDataSolutionmere = function(data) {
      return solutionmere.getSolutionMere(data);
    };

    //détails Solution
    pc.detailsSolution = function(data) {
      pc.engraisSolution = [];
      pc.solutionmereByID = data;
      pc.showtable = false;

      if (document.getElementById('filter_form').style.display === "block") {
        document.getElementById('filter_form').style.display = "none";
      }

      solutionmere.getSolutionMereEngrais({
        "ID": pc.solutionmereByID.ID
      }).then(function(res) {
        pc.SolutionMereEngrais = res.data;
        NProgress.done();
      });

    }

    pc.showtable_toggle = function() {
      pc.showtable = true;
    }


    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        $scope.updateDataSolutionmere(pc.obj).then(function(res) {
          defer.resolve(res.data);
          NProgress.done();
        });
        if (pc.obj.DATE_DEBUT == 0) {
          pc.date1 = moment(pc.obj.DATE_FIN).format("DD/MM/YYYY");
          pc.date2 = pc.date1;
        } else {
          pc.date1 = moment(pc.obj.DATE_DEBUT).format("DD/MM/YYYY");
          pc.date2 = moment(pc.obj.DATE_FIN).format("DD/MM/YYYY");
        }
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
        }, {
          text: "<i class='fa fa-plus'></i>",
          key: '1',
          className: 'pull-left',
          action: function(e, dt, node, config) {
            $scope.AddSolutionMere();
          },
          titleAttr: 'Ajouter'
        }
      ]);

    pc.dtColumns = [
      DTColumnBuilder.newColumn('Date').withTitle(translatedwords.getTranslatedWord($translate("Date"))).renderWith(function(data, type, full, meta) {
        return moment(full.Date).format('DD/MM/YYYY');
      }),
      DTColumnBuilder.newColumn('Reference').withTitle(translatedwords.getTranslatedWord($translate("Référence"))),
      DTColumnBuilder.newColumn('BLOCName').withTitle(translatedwords.getTranslatedWord($translate("Bloc"))),
      DTColumnBuilder.newColumn('BacName').withTitle(translatedwords.getTranslatedWord($translate("Bac"))),
      DTColumnBuilder.newColumn('VI').withTitle(translatedwords.getTranslatedWord($translate("Volume initial"))),
      DTColumnBuilder.newColumn('VD_the').withTitle(translatedwords.getTranslatedWord($translate("VD the"))),
      DTColumnBuilder.newColumn('VD_Reel').withTitle(translatedwords.getTranslatedWord($translate("VD Reel"))),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).withClass('nowraptd all').withOption('width', '5%').renderWith(actionsHtml)
    ];

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    function actionsHtml(data, type, full, meta) {
      pc.solutionmereAction[data.ID] = data;
      return '<button class="btn btn-success btn-xs" title="Détails" ng-click="pc.detailsSolution(pc.solutionmereAction[' + data.ID + '])" )"=""><i class="fa fa-eye"></i></button>' +
        '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.update(pc.solutionmereAction[' + data.ID + '])" )"=""><i class="fa fa-edit"></i></button>' +
        '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.solutionmereAction[' + data.ID + '])" )"=""><i class="fa fa-trash-o"></i></button>';
    }


    //Add AddSolutionMere
    $scope.AddSolutionMere = function() {
      $q.all([Bloc.getallbyfermeWithSup({
          FERME: pc.IDferme
        }), bac.getbyferme({
          FERME: pc.IDferme
        }),
        solutionmere.getlastRefSolutionMere({
          IDFermes: pc.IDferme
        }),
        engrais.showbyferme({
          IDFermes: pc.IDferme
        })
      ]).then((values) => {
        NProgress.done();
        $scope.Blocs = values[0].data;
        $scope.bacs = values[1].data;
        $scope.lastRefSolutionMere = values[2].data;
        $scope.engrais = values[3].data;
        $scope.showAdvancedAddSolutionMere("ev", $scope.Blocs, $scope.bacs, $scope.lastRefSolutionMere, $scope.engrais);
      });
    }

    //Add AddSolutionMere
    $scope.showAdvancedAddSolutionMere = function(ev, Blocs, bacs, lastRefSolutionMere, engrais) {
      $mdDialog.show({
          controller: DialogControllerAddSolutionMere,
          templateUrl: '././views/templates/solutionmere/AddSolutionMere.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true,
          escapeToClose: false,
          locals: {
            Blocs: Blocs,
            bacs: bacs,
            lastRefSolutionMere: lastRefSolutionMere,
            engrais: engrais
          }
        })
        .then(function(answer) {}, function() {});
    }

    //Add AddSolutionMere
    function DialogControllerAddSolutionMere($scope, $mdDialog, Blocs, bacs, lastRefSolutionMere, engrais) {
      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
      $scope.Blocs = Blocs;
      $scope.bacs = bacs;
      $scope.lastRefSolutionMere = lastRefSolutionMere;
      $scope.engrais = engrais;

      $scope.foods = [];

      function pad(num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
      }

      if ($scope.lastRefSolutionMere.length > 0) {
        $scope.Reference = "SM-" + pad(parseInt($scope.lastRefSolutionMere[0].Reference.match(/\d+/)) + 1, 6);
      } else {
        $scope.Reference = "SM-" + pad(1, 6);
      }

      $scope.GetOtherReference = function() {
        solutionmere.getlastRefSolutionMere({
          IDFermes: pc.IDferme
        }).then(e => {
          NProgress.done();
          if (e.data.length > 0) {
            $scope.Reference = "SM-" + pad(parseInt(e.data[0].Reference.match(/\d+/)) + 1, 6);
          } else {
            $scope.Reference = "SM-" + pad(1, 6);
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
          .title(await translatedwords.getTranslatedWord($translate("Veuillez confirmer la suppression d\'engrais?")))
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



      $scope.AjouterSolutionMere = async function() {
        $scope.progress = true;
        toastr.clear();
        if ($scope.Reference && $scope.datesolutionmere && $scope.blocsel && $scope.bacsel && $scope.VI && $scope.VD_the && $scope.VD_Reel && $scope.foods.length > 0) {
          if ($scope.foods[0].qantite) {
            pc.objAdd = {
              "Reference": $scope.Reference,
              "Date": moment($scope.datesolutionmere).format('YYYYMMDD'),
              "blocsel": $scope.blocsel,
              "bacsel": $scope.bacsel,
              "VI": $scope.VI,
              "VD_the": $scope.VD_the,
              "VD_Reel": $scope.VD_Reel,
              "Utilisateur": pc.User,
              "IDFermes": pc.IDferme,
              "engrais": $scope.foods
            }

            solutionmere.create(pc.objAdd).then(async e => {
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


      $scope.hideSolutionMere = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.AnnulerSolutionMere = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };




    }


    //Edit SolutionMere
    pc.update = function(data) {
      $q.all([Bloc.getallbyfermeWithSup({
          FERME: pc.IDferme
        }), bac.getbyferme({
          FERME: pc.IDferme
        }),
        engrais.showbyferme({
          IDFermes: pc.IDferme
        }),
        solutionmere.getSolutionMereEngrais({
          "ID": data.ID
        })
      ]).then((values) => {
        NProgress.done();
        $scope.Blocs = values[0].data;
        $scope.bacs = values[1].data;
        $scope.engrais = values[2].data;
        $scope.SolutionMereEngrais = values[3].data;
        $scope.showAdvancedEditSolutionMere("ev", data, $scope.Blocs, $scope.bacs, $scope.engrais, $scope.SolutionMereEngrais);
      });
    }

    //Edit SolutionMere
    $scope.showAdvancedEditSolutionMere = function(ev, data, Blocs, bacs, engrais, SolutionMereEngrais) {
      $mdDialog.show({
          controller: DialogControllerEditSolutionMere,
          templateUrl: '././views/templates/solutionmere/EditSolutionMere.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true,
          escapeToClose: false,
          locals: {
            data: data,
            Blocs: Blocs,
            bacs: bacs,
            engrais: engrais,
            SolutionMereEngrais: SolutionMereEngrais,
          }
        })
        .then(function(answer) {}, function() {});
    }

    //Edit SolutionMere
    function DialogControllerEditSolutionMere($scope, $mdDialog, data, Blocs, bacs, engrais, SolutionMereEngrais) {
      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
      $scope.data = data;
      $scope.Blocs = Blocs;
      $scope.bacs = bacs;
      $scope.SolutionMereEngrais = SolutionMereEngrais;
      $scope.engrais = engrais;

      $scope.datesolutionmere = ($scope.data.Date) ? new Date(moment($scope.data.Date).format("YYYY-MM-DD")) : null;
      $scope.foods = [];

      async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
      }

      $scope.EngraisIN = function(IDEngrais) {
        var i = false;
        angular.forEach($scope.SolutionMereEngrais, function(value, key) {
          if (value.Engrais === IDEngrais && i == false) {
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
          .title(await translatedwords.getTranslatedWord($translate("Veuillez confirmer la suppression d\'engrais?")))
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
        angular.forEach($scope.SolutionMereEngrais, function(value, key) {
          if (value.Engrais == $scope.engraisel.IDEngrais) {
            qantite = value.Qantite;
          }
        })
        $scope.foods.push({
          engrais: $scope.engraisel,
          qantite: qantite
        });
      }



      $scope.ModifierSolutionMere = async function() {
        $scope.progress = true;
        toastr.clear();
        if ($scope.datesolutionmere && $scope.blocsel && $scope.bacsel && $scope.data.VI && $scope.data.VD_the && $scope.data.VD_Reel && $scope.foods.length > 0) {
          if ($scope.foods[0].qantite) {
            pc.objEdit = {
              "ID": $scope.data.ID,
              "Date": moment($scope.datesolutionmere).format('YYYYMMDD'),
              "blocsel": $scope.blocsel,
              "bacsel": $scope.bacsel,
              "VI": $scope.data.VI,
              "VD_the": $scope.data.VD_the,
              "VD_Reel": $scope.data.VD_Reel,
              "engrais": $scope.foods
            }

            solutionmere.update(pc.objEdit).then(async e => {
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


      $scope.hideSolutionMere = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.AnnulerSolutionMere = function() {
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
            solutionmere.delete({
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