'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RepositoryTrancheAgeCtrl
 * @description
 * # RepositoryTrancheAgeCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RepositoryTrancheAgeCtrl', function($scope, translatedwords,
    $compile,
    $uibModal,
    _url,
    DTOptionsBuilder,
    DTColumnBuilder,
    $q,
    TrancheAge,
    $filter,
    DTDefaultOptions,
    $mdDialog,
    VarieteService, $translatePartialLoader, $translate, $window,
    $cookies,
    toastr,
    $element,
    $transitions,
    $state
  ) {

    var pc = this;
    pc.UserName = $cookies.getObject('globals').currentUser.Nom + " " + $cookies.getObject('globals').currentUser.Prenom;
    pc.IDFermes = $cookies.getObject('globals').ferme.IDFerme;
    pc.dtInstance = {};
    pc.obj = {};
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    setTimeout(function() {
      $(".selectpicker").selectpicker('refresh');
      $("#Variete").selectpicker('refresh');
    }, 1000);


    $q.all([VarieteService.getNameIdVariete(_url, {})]).then((values) => {
      pc.Varietes = values[0].data;
      NProgress.done();
      NProgress.remove();
      setTimeout(function() {
        $(".selectpicker").selectpicker('refresh');
        $("#Variete").selectpicker('refresh');
      }, 1000);
    });


    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
    }

    pc.objfitch = {
      VARIETE: [0],
      FERME: pc.IDFermes
    }

    //by variete_change
    pc.variete_change = function() {

      var parcelle = $scope.variete.variete;
      if (validateInput(parcelle) || $scope.variete.variete.length === 0 || $scope.variete.variete.includes(0))
        parcelle = [0];
      pc.objfitch.VARIETE = parcelle;
      try {
        pc.dtInstance.reloadData();
      } catch (e) {}
    };

    $scope.ReverseDisplay = function(d) {
      if (document.getElementById(d).style.display === "none") {
        document.getElementById(d).style.display = "block";
      } else {
        document.getElementById(d).style.display = "none";
      }
    }

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        TrancheAge.getTrancheAge(_url, pc.objfitch).then(function(result) {
          defer.resolve(result.data);
        });
        return defer.promise;
      })
      .withOption('deferRender', true)
      .withDOM('<lf<t>ip>')
      .withPaginationType('simple_numbers')
      .withDisplayLength(10)
      .withOption('createdRow', createdRow)
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
          titleAttr: translatedwords.getTranslatedWord($translate("Ajouter"))
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
          text: "<i class='fa fa-plus'></i>",
          key: '1',
          className: 'pull-left',
          action: function(e, dt, node, config) {
            pc.Add();
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Ajouter"))
        },
        {
          text: "Codes tranches",
          key: '1',
          className: 'pull-left',
          action: function(e, dt, node, config) {
            $state.go('codetrancheage');
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Code tranche age"))
        }
      ]);

    pc.dtColumns = [
      DTColumnBuilder.newColumn('Variete').withTitle(translatedwords.getTranslatedWord($translate("Variété"))),
      DTColumnBuilder.newColumn('Code').withTitle(translatedwords.getTranslatedWord($translate("Code"))),
      DTColumnBuilder.newColumn('De_ans').withTitle(translatedwords.getTranslatedWord($translate("À partir de"))),
      DTColumnBuilder.newColumn('A_ans').withTitle(translatedwords.getTranslatedWord($translate("Jusqu'à"))),
      DTColumnBuilder.newColumn('CreatedBy').withTitle(translatedwords.getTranslatedWord($translate("Creer par"))),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).notSortable().withClass('nowraptd all')
      .renderWith(actionsHtml)
    ];
    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');


    //add
    pc.Add = function() {
      $scope.Varietes = VarieteService.getNameIdVariete(_url, {}).then(result => {
        return result.data;
      });
      $scope.CodeTranche = TrancheAge.getcode(_url).then(result => {
        NProgress.done();
        return result.data;
      });
      $scope.showAdvancedAdd("ev", $scope.Varietes, $scope.CodeTranche);

    }

    $scope.showAdvancedAdd = function(ev, Varietes, CodeTranche) {
      $mdDialog.show({
          controller: DialogControllerAdd,
          templateUrl: '././views/templates/trancheage/AddTrancheAge.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            id: "add",
            Varietes: Varietes,
            CodeTranche: CodeTranche
          }
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };


    function DialogControllerAdd($scope, $mdDialog, $element, Varietes, CodeTranche) {
      $scope.Varietes = Varietes;
      $scope.CodeTranche = CodeTranche;
      $scope.codedisabled = true;
      $scope.adddisabled = true;


      $scope.searchTerm;
      $scope.clearSearchTerm = function() {
        $scope.searchTerm = '';
      };
      // The md-select directive eats keydown events for some quick select
      // logic. Since we have a search input here, we don't need that logic.
      $element.find('input').on('keydown', function(events) {
        events.stopPropagation();
      });

      $element.find('input').on('click', function(events) {
        events.stopPropagation();
      });
      $scope.ichooseVariete = function() {
        $scope.agede = undefined;
        $scope.Code = undefined;
        $scope.codedisabled = false;
      }
      $scope.ichooseCode = function() {
        $scope.agede = undefined;
        TrancheAge.getCountByVarieteCode(_url, {
          "variete": $scope.variete,
          "Code": $scope.Code
        }).then(resultCount => {
          NProgress.done();
          try {
            if (resultCount.data[0].Existe == 0) {
              TrancheAge.getMaxByVariete(_url, {
                "variete": $scope.variete
              }).then(resultMax => {
                NProgress.done();
                if (resultMax.data[0].A_ans) {
                  $scope.agede = resultMax.data[0].A_ans
                } else {
                  $scope.agede = 0;
                }
                $scope.adddisabled = false;
              }).catch(function(e) {
                toastr.clear();
                toastr.error("An error occured, Server connectivity is down !", {
                  closeButton: true
                });
              });
            } else {
              toastr.clear();
              toastr.error("Ce code est déjà attribué à une tranche d'âge pour la variété sélectionnée !", {
                closeButton: true
              });
            }
          } catch (e) {
            toastr.clear();
            toastr.error("An error occured " + resultCount.data.message, {
              closeButton: true
            });
          }
        }).catch(function(e) {
          toastr.clear();
          toastr.error("An error occured, Server connectivity is down !", {
            closeButton: true
          });
        });;
      }

      $scope.Ajouter = async function(statut) {
        toastr.clear();
        $scope.addmasse = "";

        if ($scope.Code && $scope.variete && $scope.agede != undefined && $scope.agea != undefined) {
          if ($scope.agede < $scope.agea) {
            pc.objAdd = {
              "Code": $scope.Code,
              "agede": $scope.agede,
              "agea": $scope.agea,
              "variete": $scope.variete,
              "UserName": pc.UserName,
              "datecreated": moment().format('YYYYMMDD')
            }

            TrancheAge.pushTrancheAge(_url, pc.objAdd).then(async e => {
              if (e.data[0].message == "ajout reussi") {
                //validate success
                toastr.clear();
                toastr.info(await translatedwords.getTranslatedWord($translate("Ajout reussi")), {
                  closeButton: true
                });
                NProgress.done();
                if (statut == 0) {
                  $mdDialog.hide();
                  document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
                } else {
                  $scope.Code = undefined;
                  $scope.agea = undefined;
                  $scope.agede = undefined;
                }
                pc.dtInstance.reloadData();
              } else {
                toastr.clear();
                toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + e.data[0].description, {
                  closeButton: true
                });
                NProgress.done();
              }
            }).catch(async e => {
              toastr.clear();
              toastr.error(e.data, {
                closeButton: true
              });
            });
          } else {
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Attention la deuxième valeur doit être strictement supérieure à la première valeur !")), {
              closeButton: true
            });
          }
        } else {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
            closeButton: true
          });
        }
      };

      //add code
      $scope.AddCode = function() {
        $mdDialog.show({
            controller: DialogControllerAddCode,
            templateUrl: '././views/templates/trancheage/AddTrancheAgeCode.html',
            parent: angular.element(document.body),
            targetEvent: "ev",
            clickOutsideToClose: false
          })
          .then(function(answer) {
            $scope.CodeTranche = answer;
          }, function() {
            $scope.status = 'You cancelled the dialog.';
          });
      }

      //add code
      function DialogControllerAddCode($scope, $mdDialog) {
        $scope.AjouterCode = async function() {
          toastr.clear();
          if ($scope.NewCode) {
            pc.objNewCode = {
              "NewCode": $scope.NewCode,
              "NewOrdre": $scope.NewOrdre
            }
            TrancheAge.getCountOrder(_url, pc.objNewCode).then(async resultCountOrder => {
              NProgress.done();
              try {
                if (resultCountOrder.data[0].Existe == 0) {
                  TrancheAge.createnewcode(_url, pc.objNewCode).then(async e => {
                    if (e.data[0].message == "ajout reussi") {
                      //validate success
                      toastr.clear();
                      toastr.info(await translatedwords.getTranslatedWord($translate("Ajout reussi")), {
                        closeButton: true
                      });
                      NProgress.done();
                      $scope.CodeTranche = TrancheAge.getcode(_url).then(result => {
                        NProgress.done();
                        $mdDialog.hide(result.data);
                      });
                    } else {
                      toastr.clear();
                      if (e.data[0].description.includes("duplicate key")) {
                        toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez noter que ce code existe déjà !")), {
                          closeButton: true
                        });
                      } else {
                        toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + e.data[0].description, {
                          closeButton: true
                        });
                      }
                      NProgress.done();
                    }
                  }).catch(async e => {
                    toastr.clear();
                    toastr.error(e.data, {
                      closeButton: true
                    });
                  });
                } else {
                  toastr.clear();
                  toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez noter que ce ordre existe déjà !")), {
                    closeButton: true
                  });
                }
              } catch (e) {
                toastr.clear();
                toastr.error(await translatedwords.getTranslatedWord($translate("An error occured ")) + resultCount.data.message, {
                  closeButton: true
                });
              }
            });





          } else {
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
              closeButton: true
            });
          }

        };


        $scope.hideCode = function() {
          $mdDialog.hide();
          document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
        };

        $scope.AnnulerCode = function() {
          $mdDialog.cancel();
          document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
        };




      }

      $scope.hide = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Annuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };




    }

    //edit
    pc.edit = function(datatrancheage) {

      $scope.Varietes = VarieteService.getNameIdVariete(_url, {}).then(result => {
        return result.data;
      });

      $scope.CodeTranche = TrancheAge.getcode(_url).then(result => {
        NProgress.done();
        return result.data;
      });

      $scope.showAdvancedEdit("ev", $scope.Varietes, datatrancheage, $scope.CodeTranche);
    }

    $scope.showAdvancedEdit = function(ev, Varietes, datatrancheage, CodeTranche) {
      $mdDialog.show({
          controller: DialogControllerEdit,
          templateUrl: '././views/templates/trancheage/EditTrancheAge.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            Varietes: Varietes,
            datatrancheage: datatrancheage,
            CodeTranche: CodeTranche
          }
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    function DialogControllerEdit($scope, $mdDialog, Varietes, datatrancheage, CodeTranche) {
      $scope.podata = datatrancheage;
      $scope.Varietes = Varietes;
      $scope.CodeTranche = CodeTranche;

      $scope.onUpdate = () => {
        if (!$scope.variete) {
          $scope.variete = $scope.podata.ID_Variete;
        }
        if (!$scope.code) {
          $scope.code = $scope.podata.ID_Tranche_Age_Codification;
        }
      }

      function dateRangeOverlaps(De_ans, A_ans, DATADe_ans, DATAA_ans) {
        /*if (De_ans < DATADe_ans && DATADe_ans <= A_ans) return true; // b starts in a
        if (De_ans < DATAA_ans && DATAA_ans <= A_ans) return true; // b ends in a
        if (DATADe_ans < De_ans && A_ans < DATAA_ans) return true; // a in b
        return false;*/
        if (DATADe_ans >= A_ans && DATAA_ans > A_ans) return false; //you can
        return true //you cant;
      }
      $scope.Modifer = async function() {
        toastr.clear();
        $scope.onUpdate();
        if ($scope.podata.De_ans != undefined && $scope.podata.A_ans != undefined) {
          if ($scope.podata.De_ans < $scope.podata.A_ans) {

            pc.objEdit = {
              "Code": $scope.podata.Code,
              "De_ans": $scope.podata.De_ans,
              "A_ans": $scope.podata.A_ans,
              "ID_Variete": $scope.variete,
              "ID": $scope.podata.ID
            }

            $scope.checkchouvechment = function(data) {

              var keepGoing = true;
              var checker = false;
              angular.forEach(data, function(tranches) {
                if (keepGoing) {
                  if (!dateRangeOverlaps(tranches.De_ans, tranches.A_ans, $scope.podata.De_ans, $scope.podata.A_ans)) {

                    checker = false;
                  } else {

                    checker = true;
                    keepGoing = false;
                  }
                }
              })
              return checker;
            }


            TrancheAge.checkbetween(_url, pc.objEdit).then(async resultCheck => {
              NProgress.done();
              if (!$scope.checkchouvechment(resultCheck.data)) {
                TrancheAge.updateTrancheAge(_url, pc.objEdit).then(async e => {
                  if (e.data[0].message == "ajout reussi") {
                    //validate success
                    toastr.clear();
                    toastr.info(await translatedwords.getTranslatedWord($translate("Modification reussite")), {
                      closeButton: true
                    });
                    NProgress.done();
                    $mdDialog.hide();
                    document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
                    pc.dtInstance.reloadData();
                  } else {
                    toastr.clear();
                    toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + e.data[0].description, {
                      closeButton: true
                    });
                    NProgress.done();
                  }
                }).catch(async e => {
                  toastr.clear();
                  toastr.error(e.data, {
                    closeButton: true
                  });
                });
              } else {
                toastr.clear();
                toastr.error(await translatedwords.getTranslatedWord($translate("Attention les valeurs se chevauchent !")), {
                  closeButton: true
                });
              }

            });



            /* */





          } else {
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Attention la deuxième valeur doit être strictement supérieure à la première valeur !")), {
              closeButton: true
            });
          }
        } else {
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
        pc.dtInstance.reloadData();
      };

    }







    function createdRow(row, data, dataIndex) {
      // Recompiling so we can bind Angular directive to the DT
      $compile(angular.element(row).contents())($scope);
    }

    function actionsHtml(data, type, full, meta) {
      pc.obj[data.ID] = data;
      return '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.edit(pc.obj[' + data.ID + '])">' +
        '   <i class="fa fa-edit"></i>' +
        '</button>&nbsp;' +
        '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.obj[' + data.ID + '])" )"="">' +
        '   <i class="fa fa-trash-o"></i>' +
        '</button>';
    }

    //delete
    pc.delete = async function(c) {
      pc.IDTranche = c.ID;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            TrancheAge.deleteTrancheAge(_url, {
              ID: pc.IDTranche
            }).then(async function(result) {
              if (result.data[0].message == "ajout reussi") {
                //validate success
                toastr.clear();
                toastr.info(await translatedwords.getTranslatedWord($translate("Suppression réussie!")), {
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

  });