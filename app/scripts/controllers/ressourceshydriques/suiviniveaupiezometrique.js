'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RessourceshydriquesSuiviniveaupiezometriqueCtrl
 * @description
 * # RessourceshydriquesSuiviniveaupiezometriqueCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RessourceshydriquesSuiviniveaupiezometriqueCtrl', function($scope, translatedwords, ressourcesHydriques, $mdDialog, toastr, DTOptionsBuilder, $translatePartialLoader, $translate, suiviniveaupiezometrique, $window, DTColumnBuilder, $q, $compile, $state, DTDefaultOptions, $cookies, eclaircissagedesregimes, parcellecultural, Arbre) {

    var pc = this;
    pc.dtInstance = {};
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    pc.SuiviressourceshydriquesAction = {};

    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Reference").selectpicker('refresh');
    }, 1000);

    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    pc.User = $cookies.getObject('globals').currentUser.Nom + " " + $cookies.getObject('globals').currentUser.Prenom;
    pc.IDUser = $cookies.getObject('globals').currentUser.ID;
    pc.IDferme = $cookies.getObject('globals').ferme.IDFerme;
    pc.IDSociete = $cookies.getObject('globals').ferme.IDSociete;
    pc.NomFerme = $cookies.getObject('globals').ferme.NomFerme;
    pc.YearNow = moment().format('YYYY');
    pc.DateNow = moment().format('DD/MM/YYYY');
    pc.TimeNow = moment().format('HH:mm');

    pc.showtable = true;
    var permission_data = JSON.parse($window.localStorage.getItem('permission'));
    var permission = {
      modules_array: permission_data[0],
      rubriques_array: permission_data[1],
      sous_modules_array: permission_data[2]
    }

    pc.isAdmin = $cookies.getObject('globals').currentUser.isAdmin;

    var opsemisAccess = _.filter(permission.sous_modules_array, {
      ss_module: 'suivi_niveau_piezometrique'
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
          $scope.Add()
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

    pc.obj = {
      "IDferme": $cookies.getObject('globals').ferme.IDFerme,
      "DATE_DEBUT": 0,
      "DATE_FIN": moment($scope.date_fin).format('YYYYMMDD'),
      "Reference": [0]
    };

    //set date input
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

    $scope.date_debut_sel = 0;
    $scope.date_fin_sel = moment($scope.date_fin).format('YYYYMMDD');

    $q.all([ressourcesHydriques.showbyferme({
      Ferme: pc.IDferme
    })]).then((values) => {
      pc.References = values[0].data;
      setTimeout(function() {
        $(".selectpicker").selectpicker('refresh');
        $("#Reference").selectpicker('refresh');
      }, 100);
      NProgress.done();
    })

    $scope.search = () => {
      pc.dtInstance.reloadData();
    }


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

    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
    }

    pc.reference_change = function() {

      var Reference = $scope.Reference;
      if (validateInput(Reference) || $scope.Reference.length === 0 || $scope.Reference.includes(0))
        Reference = [0];

      pc.obj.Reference = Reference;
    };

    //get data and refresh datatable
    $scope.updateDataeclaircissagedesregimes = function(data) {
      return suiviniveaupiezometrique.getFiltred(data);
    };



    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        $scope.updateDataeclaircissagedesregimes(pc.obj).then(function(res) {
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
          text: "<i class='fa fa-map-marker'></i>",
          action: function(e, dt, node, config) {
            $state.go('suiviniveaupiezometriquemap');
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Vue cartographique"))
        }
      ].concat($scope.btnadd));

    pc.dtColumns = [
      DTColumnBuilder.newColumn('DateSuivi').withTitle(translatedwords.getTranslatedWord($translate("Date de suivi"))).renderWith(function(data, type, full, meta) {
        if (full.DateSuivi)
          return moment(full.DateSuivi).format('DD/MM/YYYY');
        return "";
      }),
      DTColumnBuilder.newColumn('ReferenceRessourceHydrique').withTitle(translatedwords.getTranslatedWord($translate("Référence de la ressource"))),
      DTColumnBuilder.newColumn('NiveauStatique').withTitle(translatedwords.getTranslatedWord($translate("Niveau statique (m)"))).renderWith(function(data, type, full, meta) {
        if (full.NiveauStatique)
          return full.NiveauStatique.toFixed(2);
        return full.NiveauStatique;
      }),
      DTColumnBuilder.newColumn('NiveauDynamique').withTitle(translatedwords.getTranslatedWord($translate("Niveau dynamique (m)"))).renderWith(function(data, type, full, meta) {
        if (full.NiveauDynamique)
          return full.NiveauDynamique.toFixed(2);
        return full.NiveauDynamique;
      }),
      DTColumnBuilder.newColumn('EC').withTitle(translatedwords.getTranslatedWord($translate("EC (mS/cm)"))).renderWith(function(data, type, full, meta) {
        if (full.EC)
          return full.EC.toFixed(2);
        return full.EC;
      }),
      DTColumnBuilder.newColumn('ObservationsRecommendations').withTitle(translatedwords.getTranslatedWord($translate("Observations et recommandations"))),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).renderWith(function(data, type, full, meta) {
        pc.SuiviressourceshydriquesAction[data.IDSuivi_niveau_piezometrique_consommation] = data;
        var editbtn = ($scope.canIAction().update) ? '<button class="btn btn-success btn-xs" title="Modifier" ng-click="pc.edit(pc.SuiviressourceshydriquesAction[' + data.IDSuivi_niveau_piezometrique_consommation + '])" )"=""><i class="fa fa-edit"></i></button>' : '';
        var deletebtn = ($scope.canIAction().delete) ? '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.SuiviressourceshydriquesAction[' + data.IDSuivi_niveau_piezometrique_consommation + '])" )"=""><i class="fa fa-trash-o"></i></button>' : '';
        var etat = '<button class="btn btn-warning btn-xs" title="Détails" ng-click="pc.detailsorder(pc.SuiviressourceshydriquesAction[' + data.IDSuivi_niveau_piezometrique_consommation + '])" )"=""><i class="fa fa-eye"></i></button>';
        return etat + editbtn + deletebtn;
      }).withOption('width', '10%').withClass('nowraptd all')
    ];

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    pc.showtable_toggle = function() {
      pc.showtable = true;
    }
    //détails ordre
    pc.detailsorder = function(data) {
      pc.ordretraitementByID = data;
      pc.ArbresSetter = [];
      pc.showtable = false;
      document.getElementById('filter_form').style.display = "none";

      suiviniveaupiezometrique.getbyID({
        "ID": pc.ordretraitementByID.ID
      }).then(function(res) {
        pc.rhdata = res.data;
        NProgress.done();
      });


    }

    pc.printdetails = function(data) {
      //alert(data);



      var w = 1000;
      var h = 1000;
      var left = Number((screen.width / 2) - (w / 2));
      var tops = Number((screen.height / 2) - (h / 2));

      var mywindow = window.open('_self', 'PRINT', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + tops + ', left=' + left, '');

      //window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
      mywindow.document.write('<html><head><title></title>');
      mywindow.document.write('</head><body >');
      //header
      mywindow.document.write('<table border="1" style="width:100%; background:#e0efda" >' +
        '<tr>' +
        '<th rowspan="2" style="width:30%;">' + pc.NomFerme + '</th>' +
        '<th style="width:40%;">Le ' + moment(data.DateSuivi).format('DD/MM/YYYY') + '</th>' +

        '<th rowspan="2" style="width:30%;"></th>' +
        '</tr>' +

        '<tr>' +
        '<th style="width:40%;">Liste de diffusion</th>' +
        '</tr>' +
        '</table>');

      mywindow.document.write('<br/>');

      mywindow.document.write('<table border="1" style="background:#e0efda;right: 0;width:100%" ><tr><td align="right">Imprimé le ' + pc.DateNow + ' à ' + pc.TimeNow + '</td></tr></table>');

      mywindow.document.write('<br/>');

      mywindow.document.write('<table border="1" class="pull-right" style="width:50%;" >' +
        '<tr>' +
        "<td style='background:#e0e0e0;'>Date de suivi</td>" +
        '<td>' + moment(data.DateSuivi).format('DD/MM/YYYY') + '</td>' +
        '</tr>' +
        '</table>');

      mywindow.document.write('<br/>');

      $('table').attr('border', '1');
      mywindow.document.write(document.getElementById("tab_1").innerHTML);
      $('table').attr('border', '0');

      mywindow.document.write('<br/>');



      //mywindow.document.write(document.getElementById("sss").innerHTML);
      mywindow.document.write('</body></html>');

      mywindow.document.close(); // necessary for IE >= 10
      mywindow.focus(); // necessary for IE >= 10*/

      mywindow.print();
      mywindow.close();

      return true;
    }
    //Add
    $scope.Add = function() {
      $mdDialog.show({
          controller: DialogControllerAdd,
          templateUrl: '././views/templates/suiviniveaupiezometrique/Addsuiviniveaupiezometrique.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true,
          escapeToClose: false
        })
        .then(function(answer) {}, function() {});
    }

    //Add AddAnalyse
    function DialogControllerAdd($scope, $mdDialog) {
      $scope.Type = [];

      $q.all([suiviniveaupiezometrique.showbyferme({
        Ferme: pc.IDferme
      })]).then((values) => {
        $scope.AllRessourcesHydriques = values[0].data;
        NProgress.done();
        $scope.letmeclick = true;
      });

      $scope.referenceRessourcesel = [];

      $scope.foodsreference = [];

      $scope.setfoodsRef = function() {
        $scope.foodsreference = [];
        if ($scope.referenceRessourcesel.length > 0) {
          for (var i = 0; i < $scope.referenceRessourcesel.length; i++) {
            $scope.foodsreference.push({
              ReferenceRessource: $scope.referenceRessourcesel[i].ID,
              ReferenceRessourceRef: $scope.referenceRessourcesel[i].ReferenceRessourceHydrique,
              NiveauStatique: 0,
              NiveauDynamique: 0,
              EC: 0,
              ObservationsRecommendations: ''
            })
          }
        }
      }

      $scope.Typechange = function() {
        $scope.referenceRessourcesel = [];
        $scope.foodsreference = [];
      }

      $scope.filterFn = function(item) {
        if ($scope.Type.length > 0)
          return $scope.Type.indexOf(item.Type) > -1;
        return true;
      };

      $scope.Retirer = async function(index) {
        var confirm = $mdDialog.confirm()
          .title(await translatedwords.getTranslatedWord($translate("Veuillez confirmer la suppression")))
          .textContent('')
          .ariaLabel('Lucky day')
          .ok(await translatedwords.getTranslatedWord($translate("Ok")))
          .cancel(await translatedwords.getTranslatedWord($translate("Annuler")))

        $mdDialog.show(confirm.multiple(true)).then(function() {
          //ok
          $scope.foodsreference.splice(index, 1);
        }, function() {
          //cancel
        })
      }


      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;

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



      $scope.checkfoodsData = function() {
        var ifoundIt = true;
        angular.forEach($scope.foodsreference, function(value, key) {
          if (
            (
              (value.NiveauStatique < 0 || value.NiveauStatique === undefined || value.NiveauStatique === null) ||
              (value.NiveauDynamique < 0 || value.NiveauDynamique === undefined || value.NiveauDynamique === null) ||
              (value.EC < 0 || value.EC === undefined || value.EC === null)
            ) && ifoundIt) {
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }

      $scope.checkNiveauData = function() {
        var ifoundIt = true;
        angular.forEach($scope.foodsreference, function(value, key) {
          if (
            (value.NiveauStatique >= value.NiveauDynamique) &&
            ifoundIt) {
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }




      $scope.checkniveau = function(dynamic, statique) {
        if (statique >= 0 && dynamic >= 0) {
          if (statique >= dynamic) {
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      }

      //add click
      $scope.Ajouter = async function() {
        $scope.progress = true;
        toastr.clear();
        if ($scope.DateSuivi && $scope.referenceRessourcesel.length > 0) {

          if ($scope.checkfoodsData()) {
            if ($scope.checkNiveauData()) {
              pc.objAdd = {
                "DateSuivi": moment($scope.DateSuivi).format('YYYYMMDD'),
                "foodsreference": $scope.foodsreference,
                "Utilisateur": pc.User,
                "IDFermes": pc.IDferme,
                "IDUser": pc.IDUser
              }

              suiviniveaupiezometrique.createweb(pc.objAdd).then(async e => {
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
                toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement : ")) + e.data, {
                  closeButton: true
                });
              });

            } else {
              $scope.progress = false;
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("Le niveau statique doit toujours être inférieur au dynamique")), {
                closeButton: true
              });
            }


          } else {
            $scope.progress = false;
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Les valeurs de consommation doivent être superieur ou égal à zéro")), {
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


      $scope.hideAvancer = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Annuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };


    }

    pc.edit = function(data) {
      $mdDialog.show({
          controller: DialogControllerEdit,
          templateUrl: '././views/templates/suiviniveaupiezometrique/Editsuiviniveaupiezometrique.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true,
          escapeToClose: false,
          locals: {
            data: data
          }
        })
        .then(function(answer) {}, function() {});
    }

    function DialogControllerEdit($scope, $mdDialog, data) {
      $scope.data = data;
      $scope.DateSuivi = ($scope.data.DateSuivi) ? new Date(moment($scope.data.DateSuivi).format("YYYY-MM-DD")) : undefined;
      $scope.Type = [];

      /*  $q.all([suiviniveaupiezometrique.getConsommationByID({
          ID: $scope.data.ID
        })]).then((values) => {
          $scope.foodsreference = values[0].data;
          NProgress.done();
          $scope.letmeclick = true;
        });*/

      $q.all([suiviniveaupiezometrique.showbyferme({
        Ferme: pc.IDferme
      })]).then((values) => {
        $scope.AllRessourcesHydriques = values[0].data;
        NProgress.done();
        $scope.letmeclick = true;
      });


      $scope.foodsreference = [];
      $scope.foodsreference.push({
        NiveauStatique: $scope.data.NiveauStatique,
        NiveauDynamique: $scope.data.NiveauDynamique,
        EC: $scope.data.EC,
        ObservationsRecommendations: $scope.data.ObservationsRecommendations
      })

      /*
            $scope.setfoodsRef = function() {
              $scope.foodsreference = [];
              if ($scope.referenceRessourcesel.length > 0) {
                for (var i = 0; i < $scope.referenceRessourcesel.length; i++) {
                  $scope.foodsreference.push({
                    ReferenceRessource: $scope.referenceRessourcesel[i].ID,
                    ReferenceRessourceRef: $scope.referenceRessourcesel[i].ReferenceRessourceHydrique,
                    NiveauStatique: 0,
                    NiveauDynamique: 0,
                    EC: 0,
                    ObservationsRecommendations: ''
                  })
                }
              }
            }*/

      $scope.Typechange = function() {
        $scope.referenceRessourcesel = [];
      }

      $scope.filterFn = function(item) {
        if ($scope.Type.length > 0)
          return $scope.Type.indexOf(item.Type) > -1;
        return true;
      };

      $scope.Retirer = async function(index) {
        var confirm = $mdDialog.confirm()
          .title(await translatedwords.getTranslatedWord($translate("Veuillez confirmer la suppression")))
          .textContent('')
          .ariaLabel('Lucky day')
          .ok(await translatedwords.getTranslatedWord($translate("Ok")))
          .cancel(await translatedwords.getTranslatedWord($translate("Annuler")))

        $mdDialog.show(confirm.multiple(true)).then(function() {
          //ok
          $scope.foodsreference.splice(index, 1);
        }, function() {
          //cancel
        })
      }


      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;

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



      $scope.checkfoodsData = function() {
        var ifoundIt = true;
        angular.forEach($scope.foodsreference, function(value, key) {
          if (
            (
              (value.NiveauStatique < 0 || value.NiveauStatique === undefined || value.NiveauStatique === null) ||
              (value.NiveauDynamique < 0 || value.NiveauDynamique === undefined || value.NiveauDynamique === null) ||
              (value.EC < 0 || value.EC === undefined || value.EC === null)
            ) && ifoundIt) {
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }

      $scope.checkNiveauData = function() {
        var ifoundIt = true;
        angular.forEach($scope.foodsreference, function(value, key) {
          if (
            (value.NiveauStatique >= value.NiveauDynamique) &&
            ifoundIt) {
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }




      $scope.checkniveau = function(dynamic, statique) {
        if (statique >= 0 && dynamic >= 0) {
          if (statique >= dynamic) {
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      }


      //add click
      $scope.Modifier = async function() {
        $scope.progress = true;
        toastr.clear();
        if ($scope.DateSuivi && $scope.foodsreference.length > 0 && $scope.referenceRessourcesel) {

          if ($scope.checkfoodsData()) {
            if ($scope.checkNiveauData()) {
              pc.objAdd = {
                "ID": $scope.data.ID,
                "DateSuivi": moment($scope.DateSuivi).format('YYYYMMDD'),
                "foodsreference": $scope.foodsreference,
                "Utilisateur": pc.User,
                "IDFermes": pc.IDferme,
                "IDreferenceRessourcesel": $scope.referenceRessourcesel,
                "IDUser": pc.IDUser,
                "IDSuivi_niveau_piezometrique_consommation": $scope.data.IDSuivi_niveau_piezometrique_consommation
              }

              suiviniveaupiezometrique.updateweb(pc.objAdd).then(async e => {
                if (e.data[0].message == "ajout reussi") {
                  //validate success
                  toastr.clear();
                  toastr.info(await translatedwords.getTranslatedWord($translate("Modification réussie")), {
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
                toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement : ")) + e.data, {
                  closeButton: true
                });
              });

            } else {
              $scope.progress = false;
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("Le niveau statique doit toujours être inférieur au dynamique")), {
                closeButton: true
              });
            }


          } else {
            $scope.progress = false;
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Les valeurs de consommation doivent être superieur ou égal à zéro")), {
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


      $scope.hideAvancer = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Annuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };


    }



    //edit ordre Eclaircissage des régimes
    function DialogControllereditOrdre($scope, $mdDialog, data) {
      $scope.data = data;
      $scope.DateOrdre = new Date(moment($scope.data.DateOrdre).format("YYYY-MM-DD"));


      $q.all([eclaircissagedesregimes.getparcelles({
        IDferme: pc.IDferme
      }), eclaircissagedesregimes.getObs_Comptage_Arbre_Ordre({
        ID: $scope.data.ID
      })]).then((values) => {
        $scope.parcelleculturals = values[0].data;
        $scope.Arbres = values[1].data;
        NProgress.done();
        $scope.letmeclick = true;
      });

      $scope.parcelleculturalsel = [];


      $scope.setfoodsParcelle = function() {
        eclaircissagedesregimes.getarbres({
          IDferme: pc.IDferme,
          PARCELLE: $scope.parcelleculturalsel
        }).then(async e => {
          NProgress.done();
          $scope.Arbres = e.data;
          try {
            if ($scope.Arbres.name === "ConnectionError") {
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
                closeButton: true
              });
              $scope.Arbres = [];
            }
          } catch (e) {

          }
        }).catch(async e => {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
            closeButton: true
          });
        });
      }





      $scope.Retirer = async function(index) {
        var confirm = $mdDialog.confirm()
          .title(await translatedwords.getTranslatedWord($translate("Veuillez confirmer la suppression")))
          .textContent('')
          .ariaLabel('Lucky day')
          .ok(await translatedwords.getTranslatedWord($translate("Ok")))
          .cancel(await translatedwords.getTranslatedWord($translate("Annuler")))

        $mdDialog.show(confirm.multiple(true)).then(function() {
          //ok
          $scope.Arbres.splice(index, 1);
        }, function() {
          //cancel
        })
      }








      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;

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









      $scope.checkfoodsArbreData = function() {
        var ifoundIt = true;
        angular.forEach($scope.Arbres, function(value, key) {
          if ((value.Nombre < 0 || value.Nombre === undefined || value.Nombre === null) && ifoundIt) {
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }

      $scope.checkfoodsArbreDataCompte = function() {
        var ifoundIt = true;
        angular.forEach($scope.Arbres, function(value, key) {
          if ((value.NombreCompte < 0 || value.NombreCompte === undefined || value.NombreCompte === null) && ifoundIt) {
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }


      //edit btn
      $scope.Modifier = async function() {

        $scope.progress = true;
        toastr.clear();
        if ($scope.data.Reference && $scope.DateOrdre && $scope.Arbres.length > 0) {

          if ($scope.checkfoodsArbreData() && $scope.checkfoodsArbreDataCompte()) {

            pc.objEdit = {
              "Reference": $scope.data.Reference,
              "DateOrdre": moment($scope.DateOrdre).format('YYYYMMDD'),
              "Arbres": $scope.Arbres,
              "ID": $scope.data.ID
            }

            eclaircissagedesregimes.updateweb(pc.objEdit).then(async e => {
              if (e.data[0].message == "ajout reussi") {
                //validate success
                toastr.clear();
                toastr.info(await translatedwords.getTranslatedWord($translate("Modification réussie")), {
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
              toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement : ")) + e.data, {
                closeButton: true
              });
            });




          } else {
            $scope.progress = false;
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner les Nombres de régimes à conserver")), {
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


      $scope.hideAvancer = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Annuler = function() {
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
            suiviniveaupiezometrique.deleteweb({
              ID: c.ID,
              IDSuivi_niveau_piezometrique_consommation: c.IDSuivi_niveau_piezometrique_consommation
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