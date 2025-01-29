'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RepositoryBaremesCtrl
 * @description
 * # RepositoryBaremesCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RepositoryBaremesCtrl', function($scope,
    $compile,
    _url, translatedwords,
    DTOptionsBuilder,
    DTColumnBuilder,
    $q,
    DTDefaultOptions, $translatePartialLoader, $translate, $window,
    $cookies,
    $mdDialog,
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

    pc.obj = {
      "typevariete": []
    };

    $q.all([baremes.get_all_typevariete(pc.obj)]).then((values) => {
      pc.all_typevariete = values[0].data;
      NProgress.done();
      NProgress.remove();
      setTimeout(function() {
        $(".selectpicker").selectpicker('refresh');
        $("#typevariete").selectpicker('refresh');
      }, 1000);
    });

    $scope.updateget_baremes = function(data) {
      return baremes.get_baremes(data);
    };

    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
    }


    //by typevariete
    pc.typevariete_change = function() {

      var typevariete = $scope.typevariete;
      if (validateInput(typevariete) || $scope.typevariete.length === 0 || $scope.typevariete.includes(0))
        typevariete = [];

      pc.obj.typevariete = typevariete;
      $scope.search();
    };

    $scope.search = () => {
      pc.dtInstance.reloadData();
    }


    var permission_data = JSON.parse($window.localStorage.getItem('permission'));
    var permission = {
      modules_array: permission_data[0],
      rubriques_array: permission_data[1],
      sous_modules_array: permission_data[2]
    }

    pc.isAdmin = $cookies.getObject('globals').currentUser.isAdmin;

    var opsemisAccess = _.filter(permission.sous_modules_array, {
      ss_module: 'bareme'
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
        $scope.updateget_baremes(pc.obj).then(function(res) {
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
        }
      ].concat($scope.btnadd));

    pc.dtColumns = [
      DTColumnBuilder.newColumn('reference').withTitle("Référence"),
      DTColumnBuilder.newColumn('datecreated').withTitle("Date de création").renderWith(function(data, type, full, meta) {
        if (full.datecreated) {
          return moment(full.datecreated).format('DD/MM/YYYY');
        } else {
          return "";
        }
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
          templateUrl: '././views/templates/baremes/AddBareme.html',
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
      $scope.typevariete_sel = [];
      $scope.widthTable = "120%";

      $scope.Adjust_table = function() {
        if ($scope.widthTable === "120%") {
          document.getElementById('baremes').style.width = "120%";
          $scope.widthTable = "100%"
        } else {
          document.getElementById('baremes').style.width = "100%";
          $scope.widthTable = "120%"
        }
      }

      $scope.toggleSelectAll = function() {
        if ($scope.objAdd.typevariete_sel && $scope.objAdd.typevariete_sel.length === $scope.typevarietes.length) {
          // Deselect all
          $scope.objAdd.typevariete_sel = [];
        } else {
          // Select all
          $scope.objAdd.typevariete_sel = $scope.typevarietes.map(function(typevariete) {
            return typevariete.IDFamille_variete;
          });
        }
      };

      $scope.no_negative = function(index) {
        if ($scope.objAdd.barems[index]._coef < 0)
          $scope.objAdd.barems[index]._coef *= -1;
      }

      $scope.objAdd = {
        id_profil: pc.IDUser,
        datecreated: moment().format("YYYYMMDD"),
        reference: null,
        typevariete_sel: [],
        barems: [{
            indicator: "% Pépins",
            indicator_id: 1,
            _coef: null,
            _max_note: -1,
            _0: [0, null],
            _5: [5, null],
            _10: [10, null],
            _15: [15, null]
          },
          {
            indicator: "% Anomalies internes",
            indicator_id: 2,
            _coef: null,
            _max_note: -1,
            _0: [0, null],
            _5: [5, null],
            _10: [10, null],
            _15: [15, null]
          },
          {
            indicator: "% Dégâts de ravageurs",
            indicator_id: 3,
            _coef: null,
            _max_note: -1,
            _0: [0, null],
            _5: [5, null],
            _10: [10, null],
            _15: [15, null]
          },
          {
            indicator: "% Dégâts climatiques",
            indicator_id: 4,
            _coef: null,
            _max_note: -1,
            _0: [0, null],
            _5: [5, null],
            _10: [10, null],
            _15: [15, null]
          },
          {
            indicator: "% Anomalies physiologiques",
            indicator_id: 5,
            _coef: null,
            _max_note: -1,
            _0: [0, null],
            _5: [5, null],
            _10: [10, null],
            _15: [15, null]
          },
          {
            indicator: "% Calibres : (5 + HC)",
            indicator_id: 6,
            _coef: null,
            _max_note: -1,
            _0: [0, null],
            _5: [5, null],
            _10: [10, null],
            _15: [15, null]

          },
          {
            indicator: "% Granulation Sévère",
            indicator_id: 7,
            _coef: null,
            _max_note: -1,
            _0: [0, null],
            _5: [5, null],
            _10: [10, null],
            _15: [15, null]

          },
          {
            indicator: "% Altérnaria + Cératite",
            indicator_id: 8,
            _coef: null,
            _note: null,
            _max_note: -1,
            _0: [0, null],
            _5: [5, null],
            _10: [10, null],
            _15: [15, null]
          }
        ]
      }

      $scope.updateMaxKey = async function(index) {
        toastr.clear();



        const keys = ['_0', '_5', '_10', '_15'];
        const keys_min = ['_15', '_10', '_5', '_0'];

        let minKey = null; // Changed from maxKey to minKey
        let minValue = Infinity; // Initialize to Infinity to find the smallest value


        let data = $scope.objAdd.barems[index];

        await keys_min.forEach(key => {
          if (data[key][1] < 0) {
            data[key][1] *= -1
          }
          if (data[key][1] !== null && data[key][1] < minValue) {
            minKey = data[key][0];
            minValue = data[key][1];
          }
        });

        $scope.objAdd.barems[index]._max_note = minKey;

        let validValues = [];

        await keys.forEach(key => {
          if (data[key] && data[key][1] !== null) {
            validValues.push({
              key: key,
              value: data[key][1]
            });
          }
        });

        // Perform the validation if at least two values are present
        if (validValues.length >= 2) {
          let isValid = true;
          for (let i = 0; i < validValues.length - 1; i++) {
            if (validValues[i].value <= validValues[i + 1].value) {
              isValid = false;
              break;

            }
          }

          if (!isValid) {
            toastr.clear();
            toastr.error(`Chevauchement au niveau de l'indicateur ${data.indicator} : les valeurs doivent respecter l'ordre 15 > 10 > 5 > 0.`, {
              closeButton: true
            });

            return;
          }
        }
      };

      $scope.checkBaremsOverlap = async function() {
        toastr.clear();
        const keys = ['_0', '_5', '_10', '_15'];
        let isValid = true;
        let message = "";
        for (let i = 0; i < $scope.objAdd.barems.length; i++) {
          let data = $scope.objAdd.barems[i];


          if (data._coef == null || data._coef < 0) {
            toastr.clear();
            isValid = false;
            message = `Coef doit être non nul et >= 0 au niveau de l'indicateur ${data.indicator}!`;
            break;

          }

          let validValues = [];

          keys.forEach(key => {
            if (data[key] && data[key][1] !== null) {
              validValues.push({
                key: key,
                value: data[key][1]
              });
            }
          });

          // Perform the validation if at least two values are present
          if (validValues.length >= 2) {

            for (let j = 0; j < validValues.length - 1; j++) {
              if (validValues[j].value <= validValues[j + 1].value) {
                isValid = false;
                break;
              }
            }

            if (!isValid) {
              toastr.clear();
              message = `Chevauchement au niveau de l'indicateur ${data.indicator} : les valeurs doivent respecter l'ordre 15 > 10 > 5 > 0.`


              return {
                flag: isValid,
                message: message
              }
            }
          }
        }
        return {
          flag: isValid,
          message: message
        }
      };

      $scope.total_note_max = function() {
        let total = 0;
        let data = $scope.objAdd.barems;
        data.forEach(function(indicator) {
          if (indicator._coef && indicator._max_note && indicator._max_note != -1) {
            total += indicator._coef * indicator._max_note;
          }
        });
        $scope.objAdd.total_note_max = total;
        return total;
      };


      $q.all([baremes.get_typevariete(), baremes.generate_reference()]).then((values) => {
        $scope.typevarietes = values[0].data;
        try {
          $scope.objAdd.reference = values[1].data[0].reference;
        } catch (error) {}
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


      $scope.type_variete_check = function() {
        if (!$scope.typevariete_sel)
          $scope.typevariete_sel = [];
      }




      $scope.checkBaremsValues = async function() {
        let is_Valid = true;
        let message = '';
        await $scope.objAdd.barems.forEach(barem => {
          let hasValidValue = false;

          if (barem._0[1] != null) hasValidValue = true;
          if (barem._5[1] != null) hasValidValue = true;
          if (barem._10[1] != null) hasValidValue = true;
          if (barem._15[1] != null) hasValidValue = true;

          if (!hasValidValue) {
            is_Valid = false;
            message = `Au moins un barème doit être rempli pour l'indicateur ${barem.indicator} !`
          }
        });

        return {
          flag: is_Valid,
          message: message
        };
      };

      $scope.Ajouter = async function() {
        $scope.progress = true;
        toastr.clear();

        if ($scope.objAdd.typevariete_sel.length > 0) {


          if ($scope.objAdd.reference) {

            let checkBaremsOverlap = await $scope.checkBaremsOverlap();

            if (checkBaremsOverlap.flag) {
              let checkBaremsValues = await $scope.checkBaremsValues();

              if (checkBaremsValues.flag) {
                baremes.createweb($scope.objAdd).then(async e => {
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
                toastr.error(checkBaremsValues.message, {
                  closeButton: true
                });
              }


            } else {
              $scope.progress = false;
              toastr.clear();
              toastr.error(checkBaremsOverlap.message, {
                closeButton: true
              });
            }
          } else {
            $scope.progress = false;
            toastr.clear();
            toastr.error("Veuillez saisir la référence du barème !", {
              closeButton: true
            });
          }
        } else {
          $scope.progress = false;
          toastr.clear();
          toastr.error("Veuillez renseigner au moins un type de variété", {
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
    pc.Edit = function(data) {
      document.getElementById("filter_form").style.display = "none";
      $scope.showAdvancedEdit("ev", data);
    }

    $scope.showAdvancedEdit = function(ev, data) {
      $mdDialog.show({
          controller: DialogControllerEdit,
          templateUrl: '././views/templates/baremes/EditBareme.html',
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
      $scope.typevariete_sel = [];
      $scope.widthTable = "120%";

      $scope.Adjust_table = function() {
        if ($scope.widthTable === "120%") {
          document.getElementById('baremes').style.width = "120%";
          $scope.widthTable = "100%"
        } else {
          document.getElementById('baremes').style.width = "100%";
          $scope.widthTable = "120%"
        }
      }

      $scope.no_negative = function(index) {
        if ($scope.objAdd.barems[index]._coef < 0)
          $scope.objAdd.barems[index]._coef *= -1;
      }

      $scope.objAdd = {
        ID: data.ID,
        reference: data.reference,
        typevariete_sel: [],
        barems: []
      }

      $scope.updateMaxKey = async function(index) {
        toastr.clear();
        const keys = ['_0', '_5', '_10', '_15'];
        const keys_min = ['_15', '_10', '_5', '_0'];

        let minKey = null; // Changed from maxKey to minKey
        let minValue = Infinity; // Initialize to Infinity to find the smallest value


        let data = $scope.objAdd.barems[index];

        await keys_min.forEach(key => {
          if (data[key][1] < 0) {
            data[key][1] *= -1
          }
          if (data[key][1] !== null && data[key][1] < minValue) {
            minKey = data[key][0];
            minValue = data[key][1];
          }
        });

        $scope.objAdd.barems[index]._max_note = minKey;





        let validValues = [];

        await keys.forEach(key => {
          if (data[key] && data[key][1] !== null) {
            validValues.push({
              key: key,
              value: data[key][1]
            });
          }
        });

        // Perform the validation if at least two values are present
        if (validValues.length >= 2) {
          let isValid = true;
          for (let i = 0; i < validValues.length - 1; i++) {
            if (validValues[i].value <= validValues[i + 1].value) {
              isValid = false;
              break;

            }
          }

          if (!isValid) {
            toastr.clear();
            toastr.error(`Chevauchement au niveau de l'indicateur ${data.indicator} : les valeurs doivent respecter l'ordre 15 > 10 > 5 > 0.`, {
              closeButton: true
            });

            return;
          }
        }
      };

      $scope.checkBaremsOverlap = async function() {
        toastr.clear();
        const keys = ['_0', '_5', '_10', '_15'];
        let isValid = true;
        let message = "";
        for (let i = 0; i < $scope.objAdd.barems.length; i++) {
          let data = $scope.objAdd.barems[i];


          if (data._coef == null || data._coef < 0) {
            toastr.clear();
            isValid = false;
            message = `Coef doit être non nul et >= 0 au niveau de l'indicateur ${data.indicator}!`;
            break;

          }

          let validValues = [];

          keys.forEach(key => {
            if (data[key] && data[key][1] !== null) {
              validValues.push({
                key: key,
                value: data[key][1]
              });
            }
          });

          // Perform the validation if at least two values are present
          if (validValues.length >= 2) {

            for (let j = 0; j < validValues.length - 1; j++) {
              if (validValues[j].value <= validValues[j + 1].value) {
                isValid = false;
                break;
              }
            }

            if (!isValid) {
              toastr.clear();
              message = `Chevauchement au niveau de l'indicateur ${data.indicator} : les valeurs doivent respecter l'ordre 15 > 10 > 5 > 0.`


              return {
                flag: isValid,
                message: message
              }
            }
          }
        }
        return {
          flag: isValid,
          message: message
        }
      };

      $scope.total_note_max = function() {
        let total = 0;
        let data = $scope.objAdd.barems;
        data.forEach(function(indicator) {
          if (indicator._coef && indicator._max_note && indicator._max_note != -1) {
            total += indicator._coef * indicator._max_note;
          }
        });
        $scope.objAdd.total_note_max = total;
        return total;
      };

      async function getIDFamilleVarieteArray(data) {
        return data.map(function(item) {
          return item.IDFamille_variete;
        });
      }

      $q.all([baremes.get_bareme_typevariete({
        ID: data.ID
      }), baremes.get_bareme_details({
        ID: data.ID
      })]).then(async (values1) => {
        $scope.bareme_typevariete = values1[0].data;
        $scope.objAdd.barems = values1[1].data;
        $scope.objAdd.typevariete_sel = await getIDFamilleVarieteArray($scope.bareme_typevariete);
        $q.all([baremes.get_remaining_typevariete({
          ids: $scope.objAdd.typevariete_sel
        }), baremes.get_bareme_typevariete({
          ID: data.ID
        })]).then(async (values2) => {
          $scope.typevarietes = values2[0].data;
          NProgress.done();
          $scope.letmeclick = true;
        });
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


      $scope.type_variete_check = function() {
        if (!$scope.typevariete_sel)
          $scope.typevariete_sel = [];
      }




      $scope.checkBaremsValues = async function() {
        let is_Valid = true;
        let message = '';
        await $scope.objAdd.barems.forEach(barem => {
          let hasValidValue = false;

          if (barem._0[1] != null) hasValidValue = true;
          if (barem._5[1] != null) hasValidValue = true;
          if (barem._10[1] != null) hasValidValue = true;
          if (barem._15[1] != null) hasValidValue = true;

          if (!hasValidValue) {
            is_Valid = false;
            message = `Au moins un barème doit être rempli pour l'indicateur ${barem.indicator} !`
          }
        });

        return {
          flag: is_Valid,
          message: message
        };
      };

      $scope.Modifier = async function() {
        $scope.progress = true;
        toastr.clear();

        if ($scope.objAdd.typevariete_sel.length > 0) {


          if ($scope.objAdd.reference) {

            let checkBaremsOverlap = await $scope.checkBaremsOverlap();

            if (checkBaremsOverlap.flag) {
              let checkBaremsValues = await $scope.checkBaremsValues();

              if (checkBaremsValues.flag) {
                baremes.updateweb($scope.objAdd).then(async e => {
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
                    toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + ", " + e.data[0].description, {
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
                toastr.error(checkBaremsValues.message, {
                  closeButton: true
                });
              }


            } else {
              $scope.progress = false;
              toastr.clear();
              toastr.error(checkBaremsOverlap.message, {
                closeButton: true
              });
            }
          } else {
            $scope.progress = false;
            toastr.clear();
            toastr.error("Veuillez renseigner au moins un type de variété", {
              closeButton: true
            });
          }
        } else {
          $scope.progress = false;
          toastr.clear();
          toastr.error("Veuillez saisir la référence du barème !", {
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
            baremes.delete({
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

    function actionsHtml(data, type, full, meta) {
      pc.ressources_hydriques[data.ID] = data;
      var editbtn = ($scope.canIAction().update) ? '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.Edit(pc.ressources_hydriques[' + data.ID + '])"><i class="fa fa-edit"></i></button>&nbsp;' : '';
      var deletebtn = ($scope.canIAction().delete) ? '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.Delete(pc.ressources_hydriques[' + data.ID + '])" )"=""><i class="fa fa-trash-o"></i></button>' : '';
      var dtailsBtn = '<button class="btn btn-success btn-xs" title="Détails" ng-click="pc.details(pc.ressources_hydriques[' + data.ID + '])" )"=""><i class="fa fa-eye"></i></button>';
      return dtailsBtn + editbtn + deletebtn;
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