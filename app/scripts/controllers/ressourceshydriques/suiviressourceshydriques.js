'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RessourceshydriquesSuiviressourceshydriquesCtrl
 * @description
 * # RessourceshydriquesSuiviressourceshydriquesCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RessourceshydriquesSuiviressourceshydriquesCtrl', function($scope, translatedwords, ressourcesHydriques, $mdDialog, toastr, DTOptionsBuilder, $translatePartialLoader, $translate, suiviressourceshydriques, $window, DTColumnBuilder, $q, $compile, $state, DTDefaultOptions, $cookies, eclaircissagedesregimes, parcellecultural, Arbre) {

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
      $("#Type").selectpicker('refresh');
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
      ss_module: 'Suivi_des_ressources_hydriques'
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
      "Type": [1, 2],
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
      pc.Types = [{
        Type: 1,
        Name: "Eaux souterraines"
      }, {
        Type: 2,
        Name: "Eaux de surface"
      }];
      setTimeout(function() {
        $(".selectpicker").selectpicker('refresh');
        $("#Type").selectpicker('refresh');
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

    pc.type_change = function() {
      var Type = $scope.Type;
      if (validateInput(Type) || $scope.Type.length === 0 || $scope.Type.includes(0)) {
        Type = [1, 2];
      }

      pc.obj.Type = Type;

      setTimeout(function() {
        $("#Reference").selectpicker('refresh');
        $('#Reference').selectpicker('deselectAll');
        NProgress.done();
      }, 100);

    };

    $scope.filterFn = function(cn) {
      return pc.obj.Type.includes(cn.Type)
    }

    pc.reference_change = function() {

      var Reference = $scope.Reference;
      if (validateInput(Reference) || $scope.Reference.length === 0 || $scope.Reference.includes(0))
        Reference = [0];

      pc.obj.Reference = Reference;
    };

    //get data and refresh datatable
    $scope.updateDataeclaircissagedesregimes = function(data) {
      return suiviressourceshydriques.getFiltred(data);
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
          /*,
                    action: function(e, dt, node, config) {
                      $q.all([suiviressourceshydriques.getFiltredForXls(pc.obj)]).then((values) => {
                        var finalArray = values[0].data;
                        toastr.clear();
                        //use this if you need sheet styles
                        var arrayToExport = [{
                          id: 1,
                          name: "gas"
                        }];
                        if (!finalArray.name) {
                          alasql('SELECT * INTO XLSX("Suivi des ressources hydriques.xlsx",{headers:true}) FROM ?', [finalArray]);
                        } else {
                          toastr.error("Connexion au serveur perdu, réessayer ultérieurement", {
                            closeButton: true
                          });
                        }
                        NProgress.done();
                      })
                    }
          ,*/
        }, {
          text: "<i class='fa fa-table'></i>",
          action: function(e, dt, node, config) {
            $state.go("SuiviressourceshydriquesEtat");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Vue synthétique"))
        },
        {
          text: "<i class='fa fa-map-marker'></i>",
          action: function(e, dt, node, config) {
            $state.go('suiviressourceshydriquesmap');
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
      DTColumnBuilder.newColumn('Type').withTitle(translatedwords.getTranslatedWord($translate("Type de la ressource hydrique"))).renderWith(function(data, type, full, meta) {
        if (full.Type == 1)
          return "Eaux souterraines";
        return "Eaux de surface";
      }),
      DTColumnBuilder.newColumn('VolumeInitialeCompteur').withTitle(translatedwords.getTranslatedWord($translate("Volume initial du compteur (m3)"))).renderWith(function(data, type, full, meta) {
        if (full.VolumeInitialeCompteur)
          return full.VolumeInitialeCompteur.toFixed(2);
        return full.VolumeInitialeCompteur;
      }),
      DTColumnBuilder.newColumn('VolumeFinalCompteur').withTitle(translatedwords.getTranslatedWord($translate("Volume final du compteur (m3)"))).renderWith(function(data, type, full, meta) {
        if (full.VolumeFinalCompteur)
          return full.VolumeFinalCompteur.toFixed(2);
        return full.VolumeFinalCompteur;
      }),
      DTColumnBuilder.newColumn('Volume').withTitle(translatedwords.getTranslatedWord($translate("Volume (m3)"))).renderWith(function(data, type, full, meta) {
        if (full.Volume)
          return full.Volume.toFixed(2);
        return full.Volume;
      }),
      DTColumnBuilder.newColumn('DureeInitialeCompteur').withTitle(translatedwords.getTranslatedWord($translate("Durée initiale du compteur (h)"))).renderWith(function(data, type, full, meta) {
        if (full.DureeInitialeCompteur)
          return full.DureeInitialeCompteur.toFixed(2);
        return full.DureeInitialeCompteur;
      }),
      DTColumnBuilder.newColumn('DureeFinaleCompteur').withTitle(translatedwords.getTranslatedWord($translate("Durée finale du compteur (h)"))).renderWith(function(data, type, full, meta) {
        if (full.DureeFinaleCompteur)
          return full.DureeFinaleCompteur.toFixed(2);
        return full.DureeFinaleCompteur;
      }),
      DTColumnBuilder.newColumn('DureeFonctionnement').withTitle(translatedwords.getTranslatedWord($translate("Durée de fonctionnement (h)"))).renderWith(function(data, type, full, meta) {
        if (full.DureeFonctionnement)
          return full.DureeFonctionnement.toFixed(2);
        return full.DureeFonctionnement;
      }),

      DTColumnBuilder.newColumn('DureeFonctionnement').withTitle(translatedwords.getTranslatedWord($translate("Débit (m3/h)"))).renderWith(function(data, type, full, meta) {
        try {
          var resres = full.Volume / full.DureeFonctionnement;
          return resres.toFixed(2)
        } catch (e) {
          return "";
        }
      }),


      DTColumnBuilder.newColumn('ObservationsRecommendations').withTitle(translatedwords.getTranslatedWord($translate("Observations et recommandations"))),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).renderWith(function(data, type, full, meta) {
        pc.SuiviressourceshydriquesAction[data.IDSuivi_Ressource_hydrique_consommation] = data;
        var editbtn = ($scope.canIAction().update) ? '<button class="btn btn-success btn-xs" title="Modifier" ng-click="pc.edit(pc.SuiviressourceshydriquesAction[' + data.IDSuivi_Ressource_hydrique_consommation + '])" )"=""><i class="fa fa-edit"></i></button>' : '';
        var deletebtn = ($scope.canIAction().delete) ? '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.SuiviressourceshydriquesAction[' + data.IDSuivi_Ressource_hydrique_consommation + '])" )"=""><i class="fa fa-trash-o"></i></button>' : '';
        var etat = '<button class="btn btn-warning btn-xs" title="Détails" ng-click="pc.detailsorder(pc.SuiviressourceshydriquesAction[' + data.IDSuivi_Ressource_hydrique_consommation + '])" )"=""><i class="fa fa-eye"></i></button>';
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

      suiviressourceshydriques.getbyID({
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
      mywindow.document.write('<html><head><title>' + document.title + '</title>');
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
          templateUrl: '././views/templates/suiviressourceshydriques/Addsuiviressourceshydriques.html',
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

      $q.all([suiviressourceshydriques.showbyferme({
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
              VolumeInitialeCompteur: $scope.referenceRessourcesel[i].VolumeInitialeCompteur,
              VolumeFinalCompteur: 0,
              Volume: 0,
              DureeInitialeCompteur: $scope.referenceRessourcesel[i].DureeInitialeCompteur,
              DureeFinaleCompteur: 0,
              DureeFonctionnement: 0,
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
              (value.VolumeInitialeCompteur < 0 || value.VolumeInitialeCompteur === undefined || value.VolumeInitialeCompteur === null) ||
              (value.VolumeFinalCompteur < 0 || value.VolumeFinalCompteur === undefined || value.VolumeFinalCompteur === null) ||
              (value.Volume < 0 || value.Volume === undefined || value.Volume === null) ||
              (value.DureeInitialeCompteur < 0 || value.DureeInitialeCompteur === undefined || value.DureeInitialeCompteur === null) ||
              (value.DureeFinaleCompteur < 0 || value.DureeFinaleCompteur === undefined || value.DureeFinaleCompteur === null) ||
              (value.DureeFonctionnement < 0 || value.DureeFonctionnement === undefined || value.DureeFonctionnement === null)
            ) && ifoundIt) {
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }


      $scope.VolumeFinalCompteur_change = function(index) {
        $scope.foodsreference[index].Volume = $scope.foodsreference[index].VolumeFinalCompteur - $scope.foodsreference[index].VolumeInitialeCompteur;
      }

      $scope.Volume_change = function(index) {
        $scope.foodsreference[index].VolumeFinalCompteur = $scope.foodsreference[index].VolumeInitialeCompteur + $scope.foodsreference[index].Volume;
      }


      $scope.DureeFinaleCompteur_change = function(index) {
        $scope.foodsreference[index].DureeFonctionnement = $scope.foodsreference[index].DureeFinaleCompteur - $scope.foodsreference[index].DureeInitialeCompteur;
      }

      $scope.DureeFonctionnementCompteur_change = function(index) {
        $scope.foodsreference[index].DureeFinaleCompteur = $scope.foodsreference[index].DureeInitialeCompteur + $scope.foodsreference[index].DureeFonctionnement;
      }


      $scope.minDate = new Date();
      $scope.minDate.setDate($scope.minDate.getDate() - 1);

      //add click
      $scope.Ajouter = async function() {
        $scope.progress = true;
        toastr.clear();
        if ($scope.DateSuivi && $scope.referenceRessourcesel.length > 0) {

          if ($scope.checkfoodsData()) {

            pc.objAdd = {
              "DateSuivi": moment($scope.DateSuivi).format('YYYYMMDD'),
              "foodsreference": $scope.foodsreference,
              "Utilisateur": pc.User,
              "IDFermes": pc.IDferme,
              "IDUser": pc.IDUser
            }

            suiviressourceshydriques.createweb(pc.objAdd).then(async e => {
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

    //edit
    pc.edit = function(data) {
      $mdDialog.show({
          controller: DialogControllerEdit,
          templateUrl: '././views/templates/suiviressourceshydriques/Editsuiviressourceshydriques.html',
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
      $scope.Type = [];
      $scope.data = data;
      $scope.DateSuivi = ($scope.data.DateSuivi) ? new Date(moment($scope.data.DateSuivi).format("YYYY-MM-DD")) : undefined;
      /*$q.all([suiviressourceshydriques.getConsommationByID({
        ID: $scope.data.ID
      })]).then((values) => {
        $scope.foodsreference = values[0].data;
        NProgress.done();
        $scope.letmeclick = true;
      });*/


      $q.all([suiviressourceshydriques.showbyferme({
        Ferme: pc.IDferme
      })]).then((values) => {
        $scope.AllRessourcesHydriques = values[0].data;
        NProgress.done();
        $scope.letmeclick = true;
      });

      $scope.foodsreference = [];
      $scope.foodsreference.push({
        ReferenceRessource: $scope.data.ID,
        ReferenceRessourceDetails: $scope.data.IDSuivi_Ressource_hydrique_consommation,
        ReferenceRessourceRef: $scope.data.ReferenceRessourceHydrique,
        VolumeInitialeCompteur: $scope.data.VolumeInitialeCompteur,
        VolumeFinalCompteur: $scope.data.VolumeFinalCompteur,
        Volume: $scope.data.Volume,
        DureeInitialeCompteur: $scope.data.DureeInitialeCompteur,
        DureeFinaleCompteur: $scope.data.DureeFinaleCompteur,
        DureeFonctionnement: $scope.data.DureeFonctionnement,
        ObservationsRecommendations: $scope.data.ObservationsRecommendations
      });

      /*$scope.setfoodsRef = function() {
        $scope.foodsreference = [];
        if ($scope.referenceRessourcesel.length > 0) {
          for (var i = 0; i < $scope.referenceRessourcesel.length; i++) {
            $scope.foodsreference.push({
              ReferenceRessource: $scope.referenceRessourcesel[i].ID,
              ReferenceRessourceRef: $scope.referenceRessourcesel[i].ReferenceRessourceHydrique,
              VolumeInitialeCompteur: $scope.referenceRessourcesel[i].VolumeInitialeCompteur,
              VolumeFinalCompteur: 0,
              Volume: 0,
              DureeInitialeCompteur: $scope.referenceRessourcesel[i].DureeInitialeCompteur,
              DureeFinaleCompteur: 0,
              DureeFonctionnement: 0,
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
              (value.VolumeInitialeCompteur < 0 || value.VolumeInitialeCompteur === undefined || value.VolumeInitialeCompteur === null) ||
              (value.VolumeFinalCompteur < 0 || value.VolumeFinalCompteur === undefined || value.VolumeFinalCompteur === null) ||
              (value.Volume < 0 || value.Volume === undefined || value.Volume === null) ||
              (value.DureeInitialeCompteur < 0 || value.DureeInitialeCompteur === undefined || value.DureeInitialeCompteur === null) ||
              (value.DureeFinaleCompteur < 0 || value.DureeFinaleCompteur === undefined || value.DureeFinaleCompteur === null) ||
              (value.DureeFonctionnement < 0 || value.DureeFonctionnement === undefined || value.DureeFonctionnement === null)
            ) && ifoundIt) {
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }

      $scope.VolumeFinalCompteur_change = function(index) {
        $scope.foodsreference[index].Volume = $scope.foodsreference[index].VolumeFinalCompteur - $scope.foodsreference[index].VolumeInitialeCompteur;
      }

      $scope.Volume_change = function(index) {
        $scope.foodsreference[index].VolumeFinalCompteur = $scope.foodsreference[index].VolumeInitialeCompteur + $scope.foodsreference[index].Volume;
      }


      $scope.DureeFinaleCompteur_change = function(index) {
        $scope.foodsreference[index].DureeFonctionnement = $scope.foodsreference[index].DureeFinaleCompteur - $scope.foodsreference[index].DureeInitialeCompteur;
      }

      $scope.DureeFonctionnementCompteur_change = function(index) {
        $scope.foodsreference[index].DureeFinaleCompteur = $scope.foodsreference[index].DureeInitialeCompteur + $scope.foodsreference[index].DureeFonctionnement;
      }

      //add click
      $scope.Modifier = async function() {
        $scope.progress = true;
        toastr.clear();
        if ($scope.DateSuivi && $scope.foodsreference.length > 0 && $scope.referenceRessourcesel) {

          if ($scope.checkfoodsData()) {

            pc.objEdit = {
              "ID": $scope.data.ID,
              "DateSuivi": moment($scope.DateSuivi).format('YYYYMMDD'),
              "foodsreference": $scope.foodsreference,
              "Utilisateur": pc.User,
              "IDFermes": pc.IDferme,
              "IDUser": pc.IDUser,
              "IDreferenceRessourcesel": $scope.referenceRessourcesel,
              "IDSuivi_Ressource_hydrique_consommation": $scope.data.IDSuivi_Ressource_hydrique_consommation
            }

            suiviressourceshydriques.updateweb(pc.objEdit).then(async e => {
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

    };




    pc.delete = async function(c) {
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            suiviressourceshydriques.deleteweb({
              ID: c.ID,
              IDSuivi_Ressource_hydrique_consommation: c.IDSuivi_Ressource_hydrique_consommation
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