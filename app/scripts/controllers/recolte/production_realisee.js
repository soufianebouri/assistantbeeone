'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RecolteProductionRealiseeCtrl
 * @description
 * # RecolteProductionRealiseeCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RecolteProductionRealiseeCtrl', function($mdDialog,
    $scope,
    productionRealisee,
    DTOptionsBuilder,
    DTColumnBuilder,
    DTDefaultOptions,
    $q, $translatePartialLoader, $translate, $window, translatedwords,
    $compile,
    $filter,
    toastr) {

    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    var pc = this;
    pc.dtInstance = {};

    $scope.showAdvanced = function(ev) {
      $mdDialog.show({
          controller: DialogController,
          templateUrl: '././views/templates/prevision/UploadFromExcelPrevisionAnnyelle.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    function DialogController($scope, $mdDialog) {
      $scope.Ajouter = () => {
        NProgress.start();
        var myFile = document.getElementById('fileInput');
        var input = myFile;
        var reader = new FileReader();
        reader.onload = async function() {
          var fileData = reader.result;
          var workbook = XLSX.read(fileData, {
            type: 'binary'
          });
          var excelJsonObj = "";
          if (workbook.SheetNames.length > 0) {
            var ob = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[workbook.SheetNames[0]]);
            var res;
            if (pc.isGroupeImportation) {
              res = validateObjGroupe(ob);
            } else
              res = validateObj(ob);
            if (!res.status) {
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez vérifier les données de la ligne ")) + (res.index + 1), {
                closeButton: true
              });
              NProgress.done();
            } else {
              var data = {
                farms: res.farms,
                creation: false
              };

              if (pc.isGroupeImportation) {
                data.groupe = res.groupe;
                data.QT = res.QT;
                productionRealisee.createPrdocutionRealiseegroup(data).then(e => {
                  var values = "";
                  var groupTemp = {};
                  angular.forEach(ob, (v, k) => {
                    v.Ferme = e.data.farms.find(el => el.nom.toLowerCase() == v.Ferme.toLowerCase()).idfermes;
                    groupTemp = e.data.group.find(el => el.groupName.toLowerCase() == v["Groupe"].toLowerCase());
                    angular.forEach(groupTemp.parcel_group, (vv, k) => {
                      values += "(" + v.Ferme + "," + vv.idParcel + ",'" + moment(v.Date, 'MM/DD/YYYY').format('YYYY-MM-DD') + "'," + parseFloat((vv.sup * v.Quantite) / groupTemp.superficie_total).toFixed(2) + "),";
                    });
                    groupTemp = {};
                  });
                  values = values.slice(0, -1);
                  var dataToInsert = {
                    data: values,
                    creation: true
                  };
                  productionRealisee.createPrdocutionRealisee(dataToInsert).then(e => {
                    pc.dtInstance.reloadData();
                    $mdDialog.hide();document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
                    NProgress.done();
                  });
                }).catch(async e => {
                  toastr.clear();
                  toastr.error(((e.data.farm) ? await translatedwords.getTranslatedWord($translate("La ferme ")) : await translatedwords.getTranslatedWord($translate("Le groupe "))) + e.data.data + await translatedwords.getTranslatedWord($translate("est introuvable")), {
                    closeButton: true
                  });
                  NProgress.done();
                });
              } else {
                data.parcel = res.parcel;
                productionRealisee.createPrdocutionRealisee(data).then(e => {
                  var values = "";
                  angular.forEach(ob, (v, k) => {
                    v.Ferme = e.data.farms.find(el => el.nom.toLowerCase() == v.Ferme.toLowerCase()).idfermes;
                    v['Parcelle culturale'] = e.data.parcel.find(el => el.ref.toLowerCase() == v["Parcelle culturale"].toLowerCase()).id;
                    values += "(" + v.Ferme + "," + v['Parcelle culturale'] + ",'" + moment(v.Date, 'MM/DD/YYYY').format('YYYY-MM-DD') + "'," + v.Quantite + "),";
                  });
                  values = values.slice(0, -1);
                  var dataToInsert = {
                    data: values,
                    creation: true
                  };

                  productionRealisee.createPrdocutionRealisee(dataToInsert).then(e => {
                    pc.dtInstance.reloadData();
                    $mdDialog.hide();document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
                    NProgress.done();
                  });
                }).catch(async e => {
                  toastr.clear();
                  toastr.error("La " + ((e.data.prcl) ? await translatedwords.getTranslatedWord($translate("parcelle ")) : await translatedwords.getTranslatedWord($translate("ferme "))) + e.data.data + await translatedwords.getTranslatedWord($translate("est introuvable")), {
                    closeButton: true
                  });
                  NProgress.done();
                });
              }

            }

          }
        }

        reader.readAsBinaryString(input.files[0]);
      }
      $scope.Annuler = () => {
        $mdDialog.hide();document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      }

      function validateObj(ob) {
        var res = {
          status: true,
          index: -1,
          farms: [],
          parcel: []
        };
        var formatParcelFerm = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
        var dateReg = /^\d{1,2}[/]\d{1,2}[/]\d{2,4}$/;
        var canGo = true;
        for (var i = 0; i < ob.length; i++) {
          if (ob[i]["Date"].match(dateReg) == null || isNaN(ob[i]["Quantite"].replace(",", "."))) {
            res.status = false;
            res.index = i;
            break;
          } else {
            if (res.farms.indexOf(ob[i]["Ferme"].toLowerCase()) == -1) {
              res.farms.push(ob[i]["Ferme"].toLowerCase());
            }
            if (res.parcel.indexOf(ob[i]["Parcelle culturale"].toLowerCase()) == -1) {
              res.parcel.push(ob[i]["Parcelle culturale"].toLowerCase());
            }
          }
        }
        return res;
      }

      function validateObjGroupe(ob) {
        var res = {
          status: true,
          index: -1,
          farms: [],
          groupe: [],
          QT: []
        };
        var dateReg = /^\d{1,2}[/]\d{1,2}[/]\d{2,4}$/;
        for (var i = 0; i < ob.length; i++) {
          if (ob[i]["Date"].match(dateReg) == null || isNaN(ob[i]["Quantite"].replace(",", "."))) {
            res.status = false;
            res.index = i;
            break;
          } else {
            if (res.farms.indexOf(ob[i]["Ferme"].toLowerCase()) == -1) {
              res.farms.push(ob[i]["Ferme"].toLowerCase());
            }
            res.groupe.push(ob[i]["Groupe"].toLowerCase());
            res.QT.push(ob[i]["Quantite"].toLowerCase());
          }
        }
        return res;
      }

    }


    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        productionRealisee.getProductionRealisee().then(result => {
          angular.forEach(result.data, function(v, k) {
            v.date_pr = moment(v.date_pr).format('YYYY-MM-DD');
          })
          defer.resolve(result.data);
        });
        return defer.promise;
      })
      .withOption('createdRow', createdRow)
      .withDOM('<lf<t>ip>')
      .withPaginationType('simple_numbers')
      .withScroller()
      .withOption('scrollY', $(window).height() - 320)
      .withOption('responsive', true)
      
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
          extend: 'excel',
          text: "<i class='fa fa-file-excel-o'></i>",
          titleAttr: 'EXCEL'
        },
        {
          text: "<i class='fa fa-plus'></i>",
          key: '1',
          action: function(e, dt, node, config) {
            pc.isGroupeImportation = false;
            $scope.showAdvanced();
          },
          className: 'pull-left',
          titleAttr: translatedwords.getTranslatedWord($translate("Importation par parcelle culturale"))
        },
        {
          text: "<i class='fa fa-object-group'></i>",
          key: '1',
          action: function(e, dt, node, config) {
            pc.isGroupeImportation = true;
            $scope.showAdvanced();
          },
          className: 'pull-left',
          titleAttr: translatedwords.getTranslatedWord($translate("Importation par groupe"))
        }
      ]);

    pc.dtColumns = [
      DTColumnBuilder.newColumn('nom').withTitle(translatedwords.getTranslatedWord($translate("Ferme"))),
      DTColumnBuilder.newColumn('ref').withTitle(translatedwords.getTranslatedWord($translate("Parcelle culturale"))),
      DTColumnBuilder.newColumn('date_pr').withTitle(translatedwords.getTranslatedWord($translate("Date"))),
      DTColumnBuilder.newColumn('quantite').withTitle(translatedwords.getTranslatedWord($translate("Quantité"))).renderWith(function(data, type, full, meta) {
        return '<p align="right">' + $filter('numberwithspace')(parseFloat(full.quantite).toFixed(2)) + ' (U)</p>';
      })
    ];
    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    function createdRow(row, data, dataIndex) {
      // Recompiling so we can bind Angular directive to the DT
      $compile(angular.element(row).contents())($scope);
    }
  });