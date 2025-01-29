'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RepositoryClassificationsCtrl
 * @description
 * # RepositoryClassificationsCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RepositoryClassificationsCtrl', function($scope,
    $compile,
    _url, translatedwords,
    DTOptionsBuilder,
    DTColumnBuilder,
    $q,
    DTDefaultOptions, $translatePartialLoader, $translate, $window,
    $cookies,
    $mdDialog,
    classifications,
    toastr,
    baremes
  ) {

    var pc = this;

    pc.IDFerme = $cookies.getObject('globals').ferme.IDFerme;
    pc.UserName = $cookies.getObject('globals').currentUser.Nom + " " + $cookies.getObject('globals').currentUser.Prenom;
    pc.IDUser = $cookies.getObject('globals').currentUser.ID;
    pc.ressources_hydriques = {};
    pc.dtInstance = {};
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    setTimeout(function() {
      $(".selectpicker").selectpicker('refresh');
      $("#Ferme").selectpicker('refresh');
    }, 1000);

    $scope.ReverseDisplay = function(d) {
      if (document.getElementById(d).style.display === "none") {
        document.getElementById(d).style.display = "block";
      } else {
        document.getElementById(d).style.display = "none";
      }
    }

    $scope.updateget_classification = function() {
      return classifications.get_all();
    };

    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
    }

    var permission_data = JSON.parse($window.localStorage.getItem('permission'));
    var permission = {
      modules_array: permission_data[0],
      rubriques_array: permission_data[1],
      sous_modules_array: permission_data[2]
    }

    pc.isAdmin = $cookies.getObject('globals').currentUser.isAdmin;

    var opsemisAccess = _.filter(permission.sous_modules_array, {
      ss_module: 'classification'
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
          pc.Add()
        },
        titleAttr: 'Ajouter'
      }
    } else {
      $scope.btnadd = undefined;
    }

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        $scope.updateget_classification().then(function(res) {
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
        }
      ].concat($scope.btnadd));

    pc.dtColumns = [
      DTColumnBuilder.newColumn('rank').withTitle("Order"),
      DTColumnBuilder.newColumn('valeur').withTitle("% Valeur"),
      DTColumnBuilder.newColumn('codification').withTitle("Codification"),
      DTColumnBuilder.newColumn('code_couleur').withTitle("Couleur").renderWith(function(data, type, full, meta) {
        if (full.code_couleur) {
          return '<div style="width: 20px; height: 20px; border-radius: 50%; background-color: ' + full.code_couleur + ';"></div>';
        }
        return ''
      }),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).notSortable().renderWith(actionsHtml).withClass('nowraptd all').withOption('width', '10%').withClass('nowraptd all')
    ];


    //add
    pc.Add = function() {
      document.getElementById("filter_form").style.display = "none";
      $scope.showAdvancedAdd("ev");
    }

    $scope.showAdvancedAdd = function(ev) {
      $mdDialog.show({
          controller: DialogControllerAdd,
          templateUrl: '././views/templates/classifications/AddClassification.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };


    function DialogControllerAdd($scope, $mdDialog) {



      $scope.objAdd = [{
        rank: 1,
        codification: "C",
        valeur: null,
        code_couleur: null,
        id_profil: pc.IDUser
      }, {
        rank: 2,
        codification: "B",
        valeur: null,
        code_couleur: null,
        id_profil: pc.IDUser
      }, {
        rank: 3,
        codification: "A",
        valeur: null,
        code_couleur: null,
        id_profil: pc.IDUser
      }, {
        rank: 4,
        codification: "A+",
        valeur: null,
        code_couleur: null,
        id_profil: pc.IDUser
      }]

      $scope.validateRows = async function() {
        let message = ''
        let isValid = true;
        for (let i = 0; i < $scope.objAdd.length; i++) {
          let row = $scope.objAdd[i];

          if (row.valeur === null || row.valeur === undefined || row.valeur === '' || isNaN(parseFloat(row.valeur))) {
            message = `Pour la codification ${row.codification}, la valeur en pourcentage est obligatoire.`
            isValid = false;
            break
          }

          if (row.code_couleur === null || row.code_couleur === undefined || row.code_couleur === '' || !/^#[0-9A-Fa-f]{6}$/.test(row.code_couleur)) {
            message = `Pour la codification ${row.codification}, le code de couleur est obligatoire.`
            isValid = false;
            break
          }
        }

        return {
          flag: isValid,
          message: message
        };
      };

      $scope.checkForOverlaps = async function() {
        const order = {
          "A+": 4,
          "A": 3,
          "B": 2,
          "C": 1
        };

        let previousValue = null;
        let overlapRow = null;
        let isValid = true;
        let message = "";

        for (let i = 0; i < $scope.objAdd.length; i++) {
          let current = $scope.objAdd[i];
          if (current.valeur !== null && previousValue !== null && isValid) {
            if (order[current.codification] >= order[previousValue.codification] && current.valeur <= previousValue.valeur) {
              overlapRow = i;
              isValid = false;
              message = `Chevauchement au niveau la codification ${current.codification} : les valeurs doivent respecter l'ordre A+ > A > B > C.`
              break
            }
          }
          if (current.valeur !== null) {
            previousValue = current;
          }
        }

        return {
          flag: isValid,
          message: message
        }
      };


      $scope.progress = false;
      $scope.Ifullscreen = false;

      $scope.Fullscreen = function() {
        if (!$scope.Ifullscreen) {
          $("#model").addClass("fullscreen-dialog");
          $scope.Ifullscreen = true;
          document.getElementsByClassName('left_col')[0].style.zIndex = 0;
        } else {
          $("#model").removeClass("fullscreen-dialog");
          $scope.Ifullscreen = false;
          document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
        }
      }

      $scope.no_negative = function(index) {
        if ($scope.objAdd[index].valeur < 0)
          $scope.objAdd[index].valeur *= -1;
      }

      $scope.Ajouter = async function() {
        $scope.progress = true;
        toastr.clear();
        let validateRows = await $scope.validateRows();
        if (validateRows.flag) {

          let checkForOverlaps = await $scope.checkForOverlaps();
          if (checkForOverlaps.flag) {
            classifications.createweb($scope.objAdd).then(async e => {
              if (e.data[0].message == "ajout reussi") {
                //validate success
                toastr.clear();
                toastr.info(await translatedwords.getTranslatedWord($translate("Ajout reussi!")), {
                  closeButton: true
                });
                NProgress.done();
                $mdDialog.hide();
                document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
                pc.dtInstance.reloadData();
              } else {
                $scope.progress = false;
                toastr.clear();
                toastr.error(e.data[0].description, {
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
            toastr.error(checkForOverlaps.message, {
              closeButton: true
            });
          }


        } else {
          $scope.progress = false;
          toastr.clear();
          toastr.error(validateRows.message, {
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

    }

    //Edit
    pc.Edit = function() {
      document.getElementById("filter_form").style.display = "none";
      $scope.showAdvancedEdit("ev");
    }

    $scope.showAdvancedEdit = function(ev) {
      $mdDialog.show({
          controller: DialogControllerEdit,
          templateUrl: '././views/templates/classifications/EditClassification.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    function DialogControllerEdit($scope, $mdDialog) {

      $scope.objAdd = {};
      $q.all([classifications.get_all_transformed()]).then(async (values) => {
        $scope.objAdd = values[0].data;
        NProgress.done();
        $scope.letmeclick = true;
      });

      $scope.progress = false;
      $scope.Ifullscreen = false;

      $scope.Fullscreen = function() {
        if (!$scope.Ifullscreen) {
          $("#model").addClass("fullscreen-dialog");
          $scope.Ifullscreen = true;
          document.getElementsByClassName('left_col')[0].style.zIndex = 0;
        } else {
          $("#model").removeClass("fullscreen-dialog");
          $scope.Ifullscreen = false;
          document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
        }
      }

      $scope.validateRows = async function() {
        let message = ''
        let isValid = true;
        for (let i = 0; i < $scope.objAdd.length; i++) {
          let row = $scope.objAdd[i];

          if (row.valeur === null || row.valeur === undefined || row.valeur === '' || isNaN(parseFloat(row.valeur))) {
            message = `Pour la codification ${row.codification}, la valeur en pourcentage est obligatoire.`
            isValid = false;
            break
          }

          if (row.code_couleur === null || row.code_couleur === undefined || row.code_couleur === '' || !/^#[0-9A-Fa-f]{6}$/.test(row.code_couleur)) {
            message = `Pour la codification ${row.codification}, le code de couleur est obligatoire.`
            isValid = false;
            break
          }
        }

        return {
          flag: isValid,
          message: message
        };
      };

      $scope.checkForOverlaps = async function() {
        const order = {
          "A+": 4,
          "A": 3,
          "B": 2,
          "C": 1
        };

        let previousValue = null;
        let overlapRow = null;
        let isValid = true;
        let message = "";

        for (let i = 0; i < $scope.objAdd.length; i++) {
          let current = $scope.objAdd[i];
          if (current.valeur !== null && previousValue !== null && isValid) {
            if (order[current.codification] >= order[previousValue.codification] && current.valeur <= previousValue.valeur) {
              overlapRow = i;
              isValid = false;
              message = `Chevauchement au niveau la codification ${current.codification} : les valeurs doivent respecter l'ordre A+ > A > B > C.`
              break
            }
          }
          if (current.valeur !== null) {
            previousValue = current;
          }
        }

        return {
          flag: isValid,
          message: message
        }
      };

      $scope.no_negative = function(index) {
        if ($scope.objAdd[index].valeur < 0)
          $scope.objAdd[index].valeur *= -1;
      }

      $scope.Modifier = async function() {
        $scope.progress = true;
        toastr.clear();
        let validateRows = await $scope.validateRows();
        if (validateRows.flag) {

          let checkForOverlaps = await $scope.checkForOverlaps();
          if (checkForOverlaps.flag) {
            classifications.update($scope.objAdd).then(async e => {
              if (e.data[0].message == "ajout reussi") {
                //validate success
                toastr.clear();
                toastr.info("Modification réussie", {
                  closeButton: true
                });
                NProgress.done();
                $mdDialog.hide();
                document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
                pc.dtInstance.reloadData();
              } else {
                $scope.progress = false;
                toastr.clear();
                toastr.error(e.data[0].description, {
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
            toastr.error(checkForOverlaps.message, {
              closeButton: true
            });
          }


        } else {
          $scope.progress = false;
          toastr.clear();
          toastr.error(validateRows.message, {
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

    }
    //delete
    pc.Delete = async function(c) {
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            classifications.delete().then(async function(result) {
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

    function actionsHtml(data, type, full, meta) {
      if (data.rank === 1) {
        var editbtn = ($scope.canIAction().update) ? '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.Edit()"><i class="fa fa-edit"></i></button>&nbsp;' : '';
        var deletebtn = ($scope.canIAction().delete) ? '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.Delete()" )"=""><i class="fa fa-trash-o"></i></button>' : '';
        return editbtn + deletebtn;
      } else {
        return "";
      }
    }
    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    pc.showtable = true;
    //détails
    pc.details = function(data) {
      pc.baremeByID = data;

      baremes.get_bareme_typevariete({
        ID: data.ID
      }).then(function(res) {
        pc.bareme_typevariete = res.data;
        NProgress.done();
      });

      baremes.get_bareme_details({
        ID: data.ID
      }).then(function(res) {
        pc.bareme_details = res.data;
        NProgress.done();
      });

      pc.showtable = false;

      if (document.getElementById('filter_form').style.display === "block") {
        document.getElementById('filter_form').style.display = "none";
      }

    }

    pc.showtable_toggle = function() {
      pc.showtable = true;
    }


  });