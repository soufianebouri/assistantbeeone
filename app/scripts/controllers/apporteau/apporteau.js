'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ApporteauApporteauCtrl
 * @description
 * # ApporteauApporteauCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ApporteauApporteauCtrl', function($scope, translatedwords, parametretechnique, $translatePartialLoader, $window, $translate, DTOptionsBuilder, DTColumnBuilder, $q, $compile, ApportEau, secteurirrigation, parcellecultural, GroupeOperationnel, campagneagricole, sousparcelle, $state, $uibModal, $cookies, Bloc, DTDefaultOptions, $filter, toastr, savefilter, $mdDialog) {
    var pc = this;
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    var heightOfTable = $(window).height() - ($("#filter_form").height() * 4);
    pc.selected = {};
    $scope._ = _;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    pc.dtInstance = {};
    pc.apportEauAvancee = [];
    pc.apportEau = {};
    pc.mode_irrigation = 1;
    pc.IDFerme = $cookies.getObject('globals').ferme.IDFerme;
    pc.IDSociete = $cookies.getObject('globals').ferme.IDSociete;
    pc.User = $cookies.getObject('globals').currentUser.Nom + " " + $cookies.getObject('globals').currentUser.Prenom;
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    pc.obj = {
      "STANDARD": true,
      "FERME": [pc.IDFerme],
      "DATE_DEBUT": 0,
      "DATE_FIN": moment().format('YYYYMMDD')
    };

    //check saved filter
    if (!angular.equals(savefilter.getFilters(), {})) {
      pc.obj.DATE_DEBUT = savefilter.getFilters().DATE_DEBUT;
      pc.obj.DATE_FIN = savefilter.getFilters().DATE_FIN;

      $scope.date_debut = moment(pc.obj.DATE_DEBUT, 'YYYY-MM-DD').toDate();
      $scope.date_fin = moment(pc.obj.DATE_FIN, 'YYYY-MM-DD').toDate();
    }

    pc.apporteauaction = {};
    $scope.showDetailModal = function(id) {
      var tableDetail = [];
      angular.forEach(pc.apportEauAvancee, function(value, key) {
        if (value.ID == id) {
          tableDetail.push(value);
        }
      })
      pc.showApportAvance(tableDetail);
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

    function formatHour(h) {
      try {
        return h.slice(0, 2) + ":" + h.slice(2, 4);
      } catch (e) {
        return h;
      }
    }

    pc.getApportEauAvancee = function(d) {
      return ApportEau.getApportAvancee(pc.obj).then(function(result) {
        var filtredTable = [];
        for (var i = 0; i < result.data.length; i++) {
          result.data[i].DATE = moment(result.data[i].DATE).format('DD/MM/YYYY');
          result.data[i].Dose_odre = result.data[i].Dose_odre;
          result.data[i].Duree = formatHour(result.data[i].Duree);
          result.data[i].Duree_Ordre = formatHour(result.data[i].Duree_Ordre);
          result.data[i].Heure_debut = formatHour(result.data[i].Heure_debut);
          result.data[i].Heure_fin = formatHour(result.data[i].Heure_fin);
          result.data[i].Dose = result.data[i].Dose;
        }
        pc.apportEauAvancee = result.data;

        angular.forEach(pc.apportEauAvancee, function(value, key) {
          if (key > 0) {
            if (value.ID != pc.apportEauAvancee[key - 1].ID) {
              filtredTable.push(value);
            }
          } else {
            filtredTable.push(value);
          }
        })
        NProgress.done();
        NProgress.remove();
        d.resolve(filtredTable);
      });
    }

    pc.getApportEauSimple = function(d) {
      return ApportEau.getApportEau(pc.obj).then(function(result) {
        for (var i = 0; i < result.data.length; i++) {
          result.data[i].DateCreated = moment(result.data[i].Date).format('YYYY-MM-DD');
        }
        NProgress.done();
        NProgress.remove();
        d.resolve(result.data);
      });
    }

    function loadingStart() {
      $("#tableData").hide();
      $("#loadingData").show();
    }

    function loadingEnd() {
      $("#tableData").show();
      $("#loadingData").hide();
    }

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(async function() {
        NProgress.start();
        loadingStart();
        var defer = $q.defer();
        if (pc.obj.STANDARD) {
          ApportEau.getModeIrrigation({
            id_ferme: $cookies.getObject('globals').ferme.IDFerme
          }).then(async e => {
            pc.mode_irrigation = e.data[0].mode_irrigation;

            //pc.mode_irrigation = 2;
            if (pc.mode_irrigation == 1) {
              await pc.getApportEauAvancee(defer);
              showApportEauAvancee();
            } else {
              await pc.getApportEauSimple(defer);
              showApportEauSimple();
            }
            pc.obj.STANDARD = false;
            loadingEnd();
            return defer.promise;
          });
        } else {
          if (pc.mode_irrigation == 1) {
            await pc.getApportEauAvancee(defer);
            //showApportEauAvancee();
          } else {
            await pc.getApportEauSimple(defer);
            //showApportEauSimple();
          }
          loadingEnd();
          return defer.promise;
        }
      })
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
          text: "<i class='fa fa-area-chart'></i>",
          action: function(e, dt, node, config) {
            $state.go("bilan_hydrique");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Bilan hydrique"))
        },
        {
          text: "<i class='fa fa-table'></i>",
          action: function(e, dt, node, config) {
            $state.go("bilanConsomation");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Bilan des consommations"))
        },
        {
          text: "<i class='fa fa-plus'></i>",
          key: '1',
          className: 'pull-left',
          action: function(e, dt, node, config) {
            (pc.mode_irrigation == 1) ? $scope.AddAvancer(): $scope.AddSimple()
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Ajouter"))
        }
        /*,
                {
                  text: "<i class='fa fa-table'></i>",
                  action: function(e, dt, node, config) {
                    $state.go("SyntheseApportEau");
                  }
                }*/
      ]);

    pc.dtColumns = [
      DTColumnBuilder.newColumn('REF_ordre').withTitle(translatedwords.getTranslatedWord($translate("Réfrénce"))).withOption('defaultContent', ''),
      DTColumnBuilder.newColumn('DATE').withTitle(translatedwords.getTranslatedWord($translate("Date"))).withOption('defaultContent', ''),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Détails"))).withOption('defaultContent', '').renderWith(function(data, type, full, meta) {
        if (pc.mode_irrigation == 1) {
          return '<button class="btn btn-success btn-xs" ng-click="showDetailModal(' + full.ID + ')">' +
            '   <i class="fa fa-eye"></i>' +
            '</button>';
        }
      }).withOption('width', '5%'),
      DTColumnBuilder.newColumn('DateCreated').withTitle(translatedwords.getTranslatedWord($translate("Date"))).withOption('defaultContent', ''),
      DTColumnBuilder.newColumn('Numero_ordre').withTitle(translatedwords.getTranslatedWord($translate("Numéro d'ordre"))).withOption('defaultContent', ''),
      DTColumnBuilder.newColumn('dose_totale').withTitle(translatedwords.getTranslatedWord($translate("Dose totale"))).withOption('defaultContent', '').renderWith(function(data, type, full, meta) {
        pc.apportEau[full.ID] = full;
        if (full.parcel && full.dose_per_parcel) {
          return $filter('getNumberAsSpace')(full.dose_totale);
        } else {
          return '0.00';
        }
      }),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Unité"))).withOption('defaultContent', '').renderWith(function(data, type, full, meta) {
        if (pc.mode_irrigation == 1)
          return 'm3';
        return 'mm'
      }).withOption('width', '5%'),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Détails"))).withOption('defaultContent', '').renderWith(function(data, type, full, meta) {
        pc.apportEau[full.ID] = full;
        if (full.parcel && full.dose_per_parcel) {
          return '<button class="btn btn-success btn-xs" ng-click="pc.showMore(pc.apportEau[' + full.ID + '])">' +
            '   <i class="fa fa-eye"></i>' +
            '</button>';
        } else {
          return translatedwords.getTranslatedWord($translate("Aucune parcelles trouvées"));
        }
      }).withOption('width', '5%').withClass('nowraptd all'),
      DTColumnBuilder.newColumn('parcel').withOption('defaultContent', '').withTitle(translatedwords.getTranslatedWord($translate("Parcelle culturale"))).notVisible(),
      DTColumnBuilder.newColumn('dose_per_parcel').withOption('defaultContent', '').withTitle(translatedwords.getTranslatedWord($translate("Dose"))).notVisible(),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).withClass('nowraptd all').withOption('width', '5%').renderWith(actionsHtml)
    ];

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    //Add avancer
    $scope.AddAvancer = function() {
      $q.all([Bloc.getallbyfermeWithSup(pc.obj), secteurirrigation.getallbyfermemin({
        FERME: pc.IDFerme
      }), sousparcelle.byferme({
        IDFermes: pc.IDFerme
      }), ApportEau.getlastRefAvancer({
        IDFermes: pc.IDFerme
      })]).then((values) => {
        NProgress.done();
        $scope.blocs = values[0].data;
        $scope.secteurs = values[1].data;
        $scope.sousparcelles = values[2].data;
        $scope.lastRefAvancer = values[3].data;
        $scope.showAdvancedAddAvancer("ev", $scope.blocs, $scope.secteurs, $scope.sousparcelles, $scope.lastRefAvancer);
      });
    }

    //Add avancer
    $scope.showAdvancedAddAvancer = function(ev, blocs, secteurs, sousparcelles, lastRefAvancer) {
      $mdDialog.show({
          controller: DialogControllerAddAvancer,
          templateUrl: '././views/templates/apporteau/AddApportAvancer.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true,
          escapeToClose: false,
          locals: {
            blocs: blocs,
            secteurs: secteurs,
            sousparcelles: sousparcelles,
            lastRefAvancer: lastRefAvancer
          }
        })
        .then(function(answer) {}, function() {});
    }

    function DialogControllerAddAvancer($scope, $mdDialog, blocs, secteurs, sousparcelles, lastRefAvancer) {
      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
      $scope.blocs = blocs;
      $scope.secteurs = secteurs;
      $scope.sousparcelles = sousparcelles;
      $scope.lastRefAvancer = lastRefAvancer;

      $scope.foods = [];

      function pad(num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
      }
      if ($scope.lastRefAvancer.length > 0) {
        $scope.REF_ordre = "IR-" + pad(parseInt($scope.lastRefAvancer[0].REF_ordre.match(/\d+/)) + 1, 6);
      } else {
        $scope.REF_ordre = "IR-" + pad(1, 6);
      }

      $scope.GetOtherReference = async function() {
        ApportEau.getlastRefAvancer({
          IDFermes: pc.IDFerme
        }).then(async e => {
          NProgress.done();
          if (e.data.length > 0) {
            $scope.REF_ordre = "IR-" + pad(parseInt(e.data[0].REF_ordre.match(/\d+/)) + 1, 6);
          } else {
            $scope.REF_ordre = "IR-" + pad(1, 6);
          }
        }).catch(async e => {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement :")) + e.data, {
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

      $scope.whatIndex = async function(ID) {
        var position = null;
        await asyncForEach($scope.foods, async (value, key) => {
          if (value.blocsirrigation.ID === ID && position == null) {
            position = key;
          }
        });
        return position;
      }

      $scope.notIn = function(ID) {
        var ifoundIt = false;
        angular.forEach($scope.foods, function(value, key) {
          if (value.blocsirrigation.ID == ID && ifoundIt == false) {
            ifoundIt = true;
          }
        })
        return ifoundIt;
      }

      $scope.RetirerBloc = async function(index) {
        var confirm = $mdDialog.confirm()
          .title(await translatedwords.getTranslatedWord($translate("Veuillez confirmer la suppression de bloc?")))
          .textContent('')
          .ariaLabel('Lucky day')
          .ok(await translatedwords.getTranslatedWord($translate("Ok")))
          .cancel(await translatedwords.getTranslatedWord($translate("Annuler")))

        $mdDialog.show(confirm.multiple(true)).then(function() {
          //ok
          $scope.foods.splice(index, 1);
          $scope.blocsirrigation = undefined;
        }, function() {
          //cancel
        })
      }

      $scope.setFoods = function() {
        $scope.secteursFood = [];
        angular.forEach($scope.secteurs, function(value, key) {
          if (value.ID_bloc == $scope.blocsirrigation.ID) {
            $scope.secteursFood.push({
              secteur: value,
              checked: false,
              totalSP: 0,
              Volume: null,
              hr: null,
              min: null,
              sousparcelleirrigation: []
            });
          }
        })
        $scope.foods.push({
          blocsirrigation: $scope.blocsirrigation,
          VolumeGlobal: null,
          hrGlobal: null,
          minGlobal: null,
          secteurs: $scope.secteursFood
        });
      }


      $scope.OnSetVolumeGlobal = function(IDBloc) {
        var ifoundIt = false;
        angular.forEach($scope.foods, function(value, key) {
          if (value.blocsirrigation.ID == IDBloc && ifoundIt == false) {
            ifoundIt = true;
            var TimeGlobal = (value.blocsirrigation.PluvioAllSecteur * value.blocsirrigation.SupAllSecteur) / (1000 * value.VolumeGlobal);
            var hr = parseInt(TimeGlobal);
            var min = (TimeGlobal - hr) / 60;
            value.hrGlobal = hr;
            value.minGlobal = parseInt(min);
            for (var i = 0; i < value.secteurs.length; i++) {
              var volumeSec = (value.VolumeGlobal * value.secteurs[i].secteur.Superficie) / value.blocsirrigation.SupAllSecteur;
              value.secteurs[i].Volume = parseFloat(volumeSec.toFixed(2));
              var TimeSec = (value.secteurs[i].secteur.Pluvio * value.secteurs[i].secteur.Superficie) / (1000 * value.secteurs[i].Volume);
              var hrsec = parseInt(TimeSec);
              var minsec = (TimeSec - hrsec) / 60;
              value.secteurs[i].hr = (hrsec) ? hrsec : 0;
              value.secteurs[i].min = (minsec) ? parseInt(minsec) : 0;
            }
          }
        })
      }

      $scope.OnSetHrGlobal = function(IDBloc) {
        var ifoundIt = false;
        angular.forEach($scope.foods, function(value, key) {
          if (value.blocsirrigation.ID == IDBloc && ifoundIt == false) {
            ifoundIt = true;
            var hrGlobal = value.hrGlobal + (((value.minGlobal) ? (value.minGlobal) : 0) * 0.0166667);
            var VolumeGlobal = (value.blocsirrigation.PluvioAllSecteur * value.blocsirrigation.SupAllSecteur) / (1000 * hrGlobal);
            value.VolumeGlobal = parseFloat(VolumeGlobal.toFixed(2));
            value.minGlobal = (value.minGlobal) ? (value.minGlobal) : 0;
            for (var i = 0; i < value.secteurs.length; i++) {
              var volumeSec = (value.VolumeGlobal * value.secteurs[i].secteur.Superficie) / value.blocsirrigation.SupAllSecteur;
              value.secteurs[i].Volume = parseFloat(volumeSec.toFixed(2));
              var TimeSec = (value.secteurs[i].secteur.Pluvio * value.secteurs[i].secteur.Superficie) / (1000 * value.secteurs[i].Volume);
              var hrsec = parseInt(TimeSec);
              var minsec = (TimeSec - hrsec) / 60;
              value.secteurs[i].hr = (hrsec) ? hrsec : 0;
              value.secteurs[i].min = (minsec) ? parseInt(minsec) : 0;
            }
          }
        })
      }

      $scope.OnSetMinGlobal = function(IDBloc) {
        var ifoundIt = false;
        angular.forEach($scope.foods, function(value, key) {
          if (value.blocsirrigation.ID == IDBloc && ifoundIt == false) {
            ifoundIt = true;
            var hrGlobal = ((value.hrGlobal) ? value.hrGlobal : 0) + (value.minGlobal * 0.0166667);

            var VolumeGlobal = (value.blocsirrigation.PluvioAllSecteur * value.blocsirrigation.SupAllSecteur) / (1000 * hrGlobal);
            value.VolumeGlobal = parseFloat(VolumeGlobal.toFixed(2));
            value.hrGlobal = (value.hrGlobal) ? (value.hrGlobal) : 0;
            for (var i = 0; i < value.secteurs.length; i++) {
              var volumeSec = (value.VolumeGlobal * value.secteurs[i].secteur.Superficie) / value.blocsirrigation.SupAllSecteur;
              value.secteurs[i].Volume = parseFloat(volumeSec.toFixed(2));
              var TimeSec = (value.secteurs[i].secteur.Pluvio * value.secteurs[i].secteur.Superficie) / (1000 * value.secteurs[i].Volume);
              var hrsec = parseInt(TimeSec);
              var minsec = (TimeSec - hrsec) / 60;
              value.secteurs[i].hr = (hrsec) ? hrsec : 0;
              value.secteurs[i].min = (minsec) ? parseInt(minsec) : 0;
            }
          }
        })
      }

      $scope.OnSetVolume = function(IDBloc, IDSecteur) {
        var ifoundIt = false;
        var VolumeG = 0
        angular.forEach($scope.foods, function(value, key) {
          if (value.blocsirrigation.ID === IDBloc && ifoundIt == false) {
            ifoundIt = true;
            value.VolumeGlobal = 0;
            for (var i = 0; i < value.secteurs.length; i++) {
              if (value.secteurs[i].secteur.ID === IDSecteur) {
                var TimeSec = (value.secteurs[i].secteur.Pluvio * value.secteurs[i].secteur.Superficie) / (1000 * value.secteurs[i].Volume);
                var hrsec = parseInt(TimeSec);
                var minsec = (TimeSec - hrsec) / 60;
                value.secteurs[i].hr = (hrsec) ? hrsec : 0;
                value.secteurs[i].min = (minsec) ? parseInt(minsec) : 0;
              }
              value.VolumeGlobal += (value.secteurs[i].Volume) ? parseFloat(value.secteurs[i].Volume.toFixed(2)) : 0;
              value.hrGlobal += (value.secteurs[i].hr) ? parseFloat(value.secteurs[i].hr.toFixed(2)) : 0;
              value.minGlobal += (value.secteurs[i].min) ? parseFloat(value.secteurs[i].min.toFixed(2)) : 0;
            }
          }
        })
      }


      $scope.OnSetHr = function(IDBloc, IDSecteur, hr) {
        if (hr >= 0) {
          var ifoundIt = false;
          angular.forEach($scope.foods, function(value, key) {
            if (value.blocsirrigation.ID == IDBloc && ifoundIt == false) {
              ifoundIt = true;
              value.hrGlobal = 0;
              for (var i = 0; i < value.secteurs.length; i++) {
                if (value.secteurs[i].secteur.ID === IDSecteur) {
                  value.secteurs[i].min = 0;
                  var Volume = (value.blocsirrigation.PluvioAllSecteur * value.blocsirrigation.SupAllSecteur) / (1000 * value.secteurs[i].hr);
                  value.secteurs[i].Volume = parseFloat(Volume.toFixed(2));
                }
                value.hrGlobal += (value.secteurs[i].hr) ? parseFloat(value.secteurs[i].hr.toFixed(2)) : 0;
                value.VolumeGlobal += (value.secteurs[i].Volume) ? parseFloat(value.secteurs[i].Volume.toFixed(2)) : 0;
              }
            }
          })
        }
      }



      $scope.AjouterAvancer = async function() {
        $scope.progress = true;
        angular.forEach($scope.foods, function(value, key) {
          var sp = 0;
          for (var i = 0; i < value.secteurs.length; i++) {
            if (value.secteurs[i].checked) {
              for (var j = 0; j < value.secteurs[i].sousparcelleirrigation.length; j++) {
                sp += value.secteurs[i].sousparcelleirrigation[j].Debit_SP;
              }
              value.secteurs[i].totalSP = sp;
              sp = 0;
            }
          }
        })
        toastr.clear();
        parametretechnique.checkcloture({
          idferme: pc.IDFerme,
          module: 'Technique',
          rubrique: 'Irrigation',
          dateaction: moment($scope.dateirrigation).format('YYYYMMDD')
        }).then(async respense => {
          if (respense.data.length == 0) {
            if ($scope.REF_ordre && $scope.dateirrigation && $scope.moyenneirrigation >= 0 && $scope.blocsirrigation) {
              if ($scope.foods[0].secteurs[0].Volume != null && $scope.foods[0].secteurs[0].hr != null && $scope.foods[0].secteurs[0].min != null) {
                pc.objAdd = {
                  "REF_ordre": $scope.REF_ordre,
                  "Date": moment($scope.dateirrigation).format('YYYYMMDD'),
                  "Moyen": $scope.moyenneirrigation,
                  "OBSERV": ($scope.Descriptif) ? $filter('textforsqlserver')($scope.Descriptif) : "",
                  "Utilisateur": pc.User,
                  "IDFermes": pc.IDFerme,
                  "Code_compagne": "",
                  "apporteau": $scope.foods
                }

                campagneagricole.CheckCodeCompagnebyTwoDates({
                  date_debut: moment($scope.dateirrigation).format('YYYYMMDD'),
                  IDSOCIETE: pc.IDSociete
                }).then(async e => {
                  if (e.data.length > 0) {
                    pc.objAdd.Code_compagne = e.data[0].Code_compagne;
                    //add

                    ApportEau.createWeb(pc.objAdd).then(async e => {
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
                    toastr.error(await translatedwords.getTranslatedWord($translate("la date n'appartient a aucune campagne agricole !")), {
                      closeButton: true
                    });
                  }
                }).catch(async e => {
                  $scope.progress = false;
                  toastr.clear();
                  toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
                    closeButton: true
                  });
                });


              } else {
                $scope.progress = false;
                toastr.clear();
                toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez saisir au moins un secteur")), {
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
            toastr.error("Tout ajout, modification ou suppression dont la date d'exécution est compromise entre " + moment(respense.data[0].Date_debut).format('DD/MM/YYYY') + " et " + moment(respense.data[0].Date_fin).format('DD/MM/YYYY') + " est bloqué", {
              closeButton: true
            });
          }
        })


      };


      $scope.hideAvancer = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.AnnulerAvancer = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };




    }

    //edit Avancer
    pc.editAvancer = function(data) {
      $q.all([Bloc.getallbyfermeWithSup(pc.obj), secteurirrigation.getallbyfermemin({
        FERME: pc.IDFerme
      }), sousparcelle.byferme({
        IDFermes: pc.IDFerme
      }), ApportEau.getSecteurApporteau({
        ID: data.ID
      }), ApportEau.getSousParcelleApporteau({
        ID: data.ID
      })]).then((values) => {
        NProgress.done();
        $scope.blocs = values[0].data;
        $scope.secteurs = values[1].data;
        $scope.sousparcelles = values[2].data;
        $scope.SecteurApporteau = values[3].data;
        $scope.SousParcelleApporteau = values[4].data;
        $scope.showAdvancedEditAvancer("ev", data, $scope.blocs, $scope.secteurs, $scope.sousparcelles, $scope.SecteurApporteau, $scope.SousParcelleApporteau);
      });
    }

    //edit avancer
    $scope.showAdvancedEditAvancer = function(ev, data, blocs, secteurs, sousparcelles, SecteurApporteau, SousParcelleApporteau) {

      parametretechnique.checkcloture({
        idferme: pc.IDFerme,
        module: 'Technique',
        rubrique: 'Irrigation',
        dateaction: moment(data.DATE, "DD/MM/YYYY").format('YYYYMMDD')
      }).then(async respense => {
        if (respense.data.length == 0) {

          $mdDialog.show({
              controller: DialogControllerEditAvancer,
              templateUrl: '././views/templates/apporteau/EditApportAvancer.html',
              parent: angular.element(document.body),
              targetEvent: "ev",
              clickOutsideToClose: false,
              hasBackdrop: true,
              escapeToClose: false,
              locals: {
                data: data,
                blocs: blocs,
                secteurs: secteurs,
                sousparcelles: sousparcelles,
                SecteurApporteau: SecteurApporteau,
                SousParcelleApporteau: SousParcelleApporteau
              }
            })
            .then(function(answer) {}, function() {});

        } else {
          toastr.clear();
          toastr.error("Tout ajout, modification ou suppression dont la date d'exécution est compromise entre " + moment(respense.data[0].Date_debut).format('DD/MM/YYYY') + " et " + moment(respense.data[0].Date_fin).format('DD/MM/YYYY') + " est bloqué", {
            closeButton: true
          });
        }

      })



    }

    function DialogControllerEditAvancer($scope, $mdDialog, data, blocs, secteurs, sousparcelles, SecteurApporteau, SousParcelleApporteau) {

      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
      $scope.data = data;
      $scope.blocs = blocs;
      $scope.secteurs = secteurs;
      $scope.sousparcelles = sousparcelles;
      $scope.SecteurApporteau = SecteurApporteau;
      $scope.SousParcelleApporteau = SousParcelleApporteau;
      $scope.dateirrigation = ($scope.data.DATE) ? new Date(moment($scope.data.DATE).format("YYYY-MM-DD")) : null;

      $scope.foods = [];

      async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
      }

      $scope.BlocisIN = function(IDbloc) {
        var i = false;
        angular.forEach($scope.SecteurApporteau, function(value, key) {
          if (value.ID_bloc === IDbloc && i == false) {
            i = true;
          }
        });
        return i;
      }

      $scope.SousParcelleisIN = function(IDsP) {
        var i = false;
        angular.forEach($scope.SousParcelleApporteau, function(value, key) {
          if (parseInt(value.SousParc) === IDsP && i == false) {
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



      $scope.notIn = function(ID) {
        var ifoundIt = false;
        angular.forEach($scope.foods, function(value, key) {
          if (value.blocsirrigation.ID == ID && ifoundIt == false) {
            ifoundIt = true;
          }
        })
        return ifoundIt;
      }

      $scope.RetirerBloc = async function(index) {
        var confirm = $mdDialog.confirm()
          .title(await translatedwords.getTranslatedWord($translate("Veuillez confirmer la suppression de bloc?")))
          .textContent('')
          .ariaLabel('Lucky day')
          .ok(await translatedwords.getTranslatedWord($translate("Ok")))
          .cancel(await translatedwords.getTranslatedWord($translate("Annuler")))

        $mdDialog.show(confirm.multiple(true)).then(function() {
          //ok
          $scope.foods.splice(index, 1);
          $scope.blocsirrigation = undefined;
        }, function() {
          //cancel
        })
      }

      $scope.setFoods = function() {
        $scope.secteursFood = [];
        var vol = null;
        var hr = null;
        var min = null;
        var volt = 0;
        var hrt = 0;
        var mint = 0;
        var hrmint = 0;
        angular.forEach($scope.secteurs, function(value, key) {
          if (value.ID_bloc == $scope.blocsirrigation.ID) {
            angular.forEach($scope.SecteurApporteau, function(valueR, key) {
              if (valueR.ID_bloc == value.ID_bloc && valueR.IDSecteur == value.ID) {
                vol = valueR.Dose;
                hr = parseInt(valueR.Duree.substring(0, 2));
                min = parseInt(valueR.Duree.slice(-2));
                volt += vol;
                hrmint += hr + (min * 0.0166667);
              }
            });
            $scope.secteursFood.push({
              secteur: value,
              checked: false,
              totalSP: 0,
              Volume: vol,
              hr: hr,
              min: min,
              sousparcelleirrigation: []
            });
            vol = null;
            hr = null;
            min = null;
          }
        })
        $scope.foods.push({
          blocsirrigation: $scope.blocsirrigation,
          VolumeGlobal: volt,
          hrGlobal: parseInt(hrmint),
          minGlobal: parseInt((hrmint - parseInt(hrmint)) * 60),
          secteurs: $scope.secteursFood
        });
      }


      $scope.OnSetVolumeGlobal = function(IDBloc) {
        var ifoundIt = false;
        angular.forEach($scope.foods, function(value, key) {
          if (value.blocsirrigation.ID == IDBloc && ifoundIt == false) {
            ifoundIt = true;
            var TimeGlobal = (value.blocsirrigation.PluvioAllSecteur * value.blocsirrigation.SupAllSecteur) / (1000 * value.VolumeGlobal);
            var hr = parseInt(TimeGlobal);
            var min = (TimeGlobal - hr) / 60;
            value.hrGlobal = hr;
            value.minGlobal = parseInt(min);
            for (var i = 0; i < value.secteurs.length; i++) {
              var volumeSec = (value.VolumeGlobal * value.secteurs[i].secteur.Superficie) / value.blocsirrigation.SupAllSecteur;
              value.secteurs[i].Volume = parseFloat(volumeSec.toFixed(2));
              var TimeSec = (value.secteurs[i].secteur.Pluvio * value.secteurs[i].secteur.Superficie) / (1000 * value.secteurs[i].Volume);
              var hrsec = parseInt(TimeSec);
              var minsec = (TimeSec - hrsec) / 60;
              value.secteurs[i].hr = (hrsec) ? hrsec : 0;
              value.secteurs[i].min = (minsec) ? parseInt(minsec) : 0;
            }
          }
        })
      }

      $scope.OnSetHrGlobal = function(IDBloc) {
        var ifoundIt = false;
        angular.forEach($scope.foods, function(value, key) {
          if (value.blocsirrigation.ID == IDBloc && ifoundIt == false) {
            ifoundIt = true;
            var hrGlobal = value.hrGlobal + (((value.minGlobal) ? (value.minGlobal) : 0) * 0.0166667);
            var VolumeGlobal = (value.blocsirrigation.PluvioAllSecteur * value.blocsirrigation.SupAllSecteur) / (1000 * hrGlobal);
            value.VolumeGlobal = parseFloat(VolumeGlobal.toFixed(2));
            value.minGlobal = (value.minGlobal) ? (value.minGlobal) : 0;
            for (var i = 0; i < value.secteurs.length; i++) {
              var volumeSec = (value.VolumeGlobal * value.secteurs[i].secteur.Superficie) / value.blocsirrigation.SupAllSecteur;
              value.secteurs[i].Volume = parseFloat(volumeSec.toFixed(2));
              var TimeSec = (value.secteurs[i].secteur.Pluvio * value.secteurs[i].secteur.Superficie) / (1000 * value.secteurs[i].Volume);
              var hrsec = parseInt(TimeSec);
              var minsec = (TimeSec - hrsec) / 60;
              value.secteurs[i].hr = (hrsec) ? hrsec : 0;
              value.secteurs[i].min = (minsec) ? parseInt(minsec) : 0;
            }
          }
        })
      }

      $scope.OnSetMinGlobal = function(IDBloc) {
        var ifoundIt = false;
        angular.forEach($scope.foods, function(value, key) {
          if (value.blocsirrigation.ID == IDBloc && ifoundIt == false) {
            ifoundIt = true;
            var hrGlobal = ((value.hrGlobal) ? value.hrGlobal : 0) + (value.minGlobal * 0.0166667);

            var VolumeGlobal = (value.blocsirrigation.PluvioAllSecteur * value.blocsirrigation.SupAllSecteur) / (1000 * hrGlobal);
            value.VolumeGlobal = parseFloat(VolumeGlobal.toFixed(2));
            value.hrGlobal = (value.hrGlobal) ? (value.hrGlobal) : 0;
            for (var i = 0; i < value.secteurs.length; i++) {
              var volumeSec = (value.VolumeGlobal * value.secteurs[i].secteur.Superficie) / value.blocsirrigation.SupAllSecteur;
              value.secteurs[i].Volume = parseFloat(volumeSec.toFixed(2));
              var TimeSec = (value.secteurs[i].secteur.Pluvio * value.secteurs[i].secteur.Superficie) / (1000 * value.secteurs[i].Volume);
              var hrsec = parseInt(TimeSec);
              var minsec = (TimeSec - hrsec) / 60;
              value.secteurs[i].hr = (hrsec) ? hrsec : 0;
              value.secteurs[i].min = (minsec) ? parseInt(minsec) : 0;
            }
          }
        })
      }

      $scope.OnSetVolume = function(IDBloc, IDSecteur) {
        var ifoundIt = false;
        var VolumeG = 0
        angular.forEach($scope.foods, function(value, key) {
          if (value.blocsirrigation.ID === IDBloc && ifoundIt == false) {
            ifoundIt = true;
            value.VolumeGlobal = 0;
            for (var i = 0; i < value.secteurs.length; i++) {
              if (value.secteurs[i].secteur.ID === IDSecteur) {
                var TimeSec = (value.secteurs[i].secteur.Pluvio * value.secteurs[i].secteur.Superficie) / (1000 * value.secteurs[i].Volume);
                var hrsec = parseInt(TimeSec);
                var minsec = (TimeSec - hrsec) / 60;
                value.secteurs[i].hr = (hrsec) ? hrsec : 0;
                value.secteurs[i].min = (minsec) ? parseInt(minsec) : 0;
              }
              value.VolumeGlobal += (value.secteurs[i].Volume) ? parseFloat(value.secteurs[i].Volume.toFixed(2)) : 0;
              value.hrGlobal += (value.secteurs[i].hr) ? parseFloat(value.secteurs[i].hr.toFixed(2)) : 0;
              value.minGlobal += (value.secteurs[i].min) ? parseFloat(value.secteurs[i].min.toFixed(2)) : 0;
            }
          }
        })
      }


      $scope.OnSetHr = function(IDBloc, IDSecteur, hr) {
        if (hr >= 0) {
          var ifoundIt = false;
          angular.forEach($scope.foods, function(value, key) {
            if (value.blocsirrigation.ID == IDBloc && ifoundIt == false) {
              ifoundIt = true;
              value.hrGlobal = 0;
              for (var i = 0; i < value.secteurs.length; i++) {
                if (value.secteurs[i].secteur.ID === IDSecteur) {
                  value.secteurs[i].min = 0;
                  var Volume = (value.blocsirrigation.PluvioAllSecteur * value.blocsirrigation.SupAllSecteur) / (1000 * value.secteurs[i].hr);
                  value.secteurs[i].Volume = parseFloat(Volume.toFixed(2));
                }
                value.hrGlobal += (value.secteurs[i].hr) ? parseFloat(value.secteurs[i].hr.toFixed(2)) : 0;
                value.VolumeGlobal += (value.secteurs[i].Volume) ? parseFloat(value.secteurs[i].Volume.toFixed(2)) : 0;
              }
            }
          })
        }
      }



      $scope.EditAvancer = async function() {
        $scope.progress = true;
        angular.forEach($scope.foods, function(value, key) {
          var sp = 0;
          for (var i = 0; i < value.secteurs.length; i++) {
            if (value.secteurs[i].checked) {
              for (var j = 0; j < value.secteurs[i].sousparcelleirrigation.length; j++) {
                sp += value.secteurs[i].sousparcelleirrigation[j].Debit_SP;
              }
              value.secteurs[i].totalSP = sp;
              sp = 0;
            } else {
              value.secteurs[i].sousparcelleirrigation = [];
            }
          }
        })
        toastr.clear();
        if ($scope.dateirrigation && $scope.data.Moyen >= 0 && $scope.blocsirrigation) {
          if ($scope.foods[0].secteurs[0].Volume != null && $scope.foods[0].secteurs[0].hr != null && $scope.foods[0].secteurs[0].min != null) {
            pc.objEdit = {
              "ID": $scope.data.ID,
              "Date": moment($scope.dateirrigation).format('YYYYMMDD'),
              "Moyen": $scope.data.Moyen,
              "OBSERV": ($scope.data.OBSERV) ? $filter('textforsqlserver')($scope.data.OBSERV) : "",
              "Code_compagne": "",
              "apporteau": $scope.foods
            }

            campagneagricole.CheckCodeCompagnebyTwoDates({
              date_debut: moment($scope.dateirrigation).format('YYYYMMDD'),
              IDSOCIETE: pc.IDSociete
            }).then(async e => {
              if (e.data.length > 0) {
                pc.objEdit.Code_compagne = e.data[0].Code_compagne;
                //add

                ApportEau.updateWeb(pc.objEdit).then(async e => {
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
                    toastr.error(await translatedwords.getTranslatedWord($translate("An error occured ")) + e.data[0].description, {
                      closeButton: true
                    });
                    NProgress.done();
                  }
                }).catch(async e => {
                  $scope.progress = false;
                  toastr.clear();
                  toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement : ")) + e.data[0].description, {
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
            }).catch(async e => {
              $scope.progress = false;
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
                closeButton: true
              });
            });


          } else {
            $scope.progress = false;
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez saisir au moins un secteur")), {
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

      $scope.AnnulerAvancer = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };




    }


    //Add simplifier
    $scope.AddSimple = function() {
      $q.all([GroupeOperationnel.getGroupeOperationnelByFerme({
          idferme: pc.IDFerme
        }), parcellecultural.getParcelleCulturalByFerme(pc.obj.FERME),
        ApportEau.getlastRefSimple({
          IDFermes: pc.IDFerme
        })
      ]).then((values) => {
        NProgress.done();
        $scope.GroupeOperationnels = values[0].data;
        $scope.parcelleculturals = values[1].data;
        $scope.lastRefSimple = values[2].data;
        $scope.showAdvancedAddSimple("ev", $scope.GroupeOperationnels, $scope.parcelleculturals, $scope.lastRefSimple);
      });
    }

    //Add simplifier
    $scope.showAdvancedAddSimple = function(ev, GroupeOperationnels, parcelleculturals, lastRefSimple) {
      $mdDialog.show({
          controller: DialogControllerAddSimple,
          templateUrl: '././views/templates/apporteau/AddApportSimple.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true,
          escapeToClose: false,
          locals: {
            GroupeOperationnels: GroupeOperationnels,
            parcelleculturals: parcelleculturals,
            lastRefSimple: lastRefSimple
          }
        })
        .then(function(answer) {}, function() {});
    }

    //Add simplifier
    function DialogControllerAddSimple($scope, $mdDialog, GroupeOperationnels, parcelleculturals, lastRefSimple) {
      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
      $scope.GroupeOperationnels = GroupeOperationnels;
      $scope.parcelleculturals = parcelleculturals;
      $scope.lastRefSimple = lastRefSimple;
      $scope.foods = [];

      function pad(num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
      }

      if ($scope.lastRefSimple.length > 0) {
        $scope.Numero_ordre = "IR-" + pad(parseInt($scope.lastRefSimple[0].Numero_ordre.match(/\d+/)) + 1, 6);
      } else {
        $scope.Numero_ordre = "IR-" + pad(1, 6);
      }

      $scope.GetOtherReference = async function() {
        ApportEau.getlastRefSimple({
          IDFermes: pc.IDFerme
        }).then(async e => {
          NProgress.done();
          if (e.data.length > 0) {
            $scope.Numero_ordre = "IR-" + pad(parseInt(e.data[0].Numero_ordre.match(/\d+/)) + 1, 6);
          } else {
            $scope.Numero_ordre = "IR-" + pad(1, 6);
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

      $scope.notIn = function(ID) {
        var ifoundIt = false;
        angular.forEach($scope.foods, function(value, key) {
          if (value.parcelle.ID == ID && ifoundIt == false) {
            ifoundIt = true;
          }
        })
        return ifoundIt;
      }

      $scope.RetirerParcelle = async function(index) {
        var confirm = $mdDialog.confirm()
          .title(await translatedwords.getTranslatedWord($translate("Veuillez confirmer la suppression de la Parcelle?")))
          .textContent('')
          .ariaLabel('Lucky day')
          .ok(await translatedwords.getTranslatedWord($translate("Ok")))
          .cancel(await translatedwords.getTranslatedWord($translate("Annuler")))

        $mdDialog.show(confirm.multiple(true)).then(function() {
          //ok
          $scope.foods.splice(index, 1);
          $scope.parcelleculturalsel = undefined;
        }, function() {
          //cancel
        })
      }

      $scope.setFoods = function() {
        $scope.foods.push({
          parcelle: $scope.parcelleculturalsel,
          dose: null,
          dosem3: null
        })
      }

      $scope.getSumDose = () => {
        return parseFloat(_.sumBy($scope.foods, 'dose').toFixed(2))
      }

      $scope.setdosem3 = (dose, sup) => {
        return parseFloat((dose * 10 * sup).toFixed(2));
      }

      $scope.getSumDosem3 = () => {
        return parseFloat(_.sumBy($scope.foods, 'dosem3').toFixed(2))
      }

      $scope.getParcellesByGO = async () => {
        parcellecultural.showbydomaineandgroupe({
          idferme: pc.IDFerme,
          idgroupe: $scope.GroupeOperationnelsel
        }).then(async e => {
          NProgress.done();
          $scope.parcelleculturals = e.data;
        }).catch(async e => {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
            closeButton: true
          });
        });
      }

      $scope.AjouterSimple = async function() {
        $scope.progress = true;
        toastr.clear();

        parametretechnique.checkcloture({
          idferme: pc.IDFerme,
          module: 'Technique',
          rubrique: 'Irrigation',
          dateaction: moment($scope.dateirrigation).format('YYYYMMDD')
        }).then(async respense => {
          if (respense.data.length == 0) {

            if ($scope.Numero_ordre && $scope.dateirrigation && $scope.foods.length > 0) {
              if ($scope.foods[0].dose) {
                pc.objAdd = {
                  "Numero_ordre": $scope.Numero_ordre,
                  "Date": moment($scope.dateirrigation).format('YYYYMMDD'),
                  "Utilisateur": pc.User,
                  "IDFermes": pc.IDFerme,
                  "Code_compagne": "",
                  "DoseTotal": $scope.getSumDose(),
                  "Dosem3Total": $scope.getSumDosem3(),
                  "irrigation": $scope.foods
                }
                campagneagricole.CheckCodeCompagnebyTwoDates({
                  date_debut: moment($scope.dateirrigation).format('YYYYMMDD'),
                  IDSOCIETE: pc.IDSociete
                }).then(async e => {
                  if (e.data.length > 0) {
                    pc.objAdd.Code_compagne = e.data[0].Code_compagne;
                    //add

                    ApportEau.createWebSimple(pc.objAdd).then(async e => {
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
                    toastr.error(await translatedwords.getTranslatedWord($translate("la date n'appartient a aucune campagne agricole !")), {
                      closeButton: true
                    });
                  }
                }).catch(async e => {
                  $scope.progress = false;
                  toastr.clear();
                  toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
                    closeButton: true
                  });
                });


              } else {
                $scope.progress = false;
                toastr.clear();
                toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez saisir au moins une parcelle culturale")), {
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
            toastr.error("Tout ajout, modification ou suppression dont la date d'exécution est compromise entre " + moment(respense.data[0].Date_debut).format('DD/MM/YYYY') + " et " + moment(respense.data[0].Date_fin).format('DD/MM/YYYY') + " est bloqué", {
              closeButton: true
            });
          }

        })





      };


      $scope.hideSimple = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.AnnulerSimple = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };




    }


    //Edit simplifier
    pc.editSimple = function(data) {
      $q.all([GroupeOperationnel.getGroupeOperationnelByFerme({
          idferme: pc.IDFerme
        }), parcellecultural.getParcelleCulturalByFerme(pc.obj.FERME),
        ApportEau.getParcelleCulturalleApporteau({
          ID: data.ID
        })
      ]).then((values) => {
        NProgress.done();
        $scope.GroupeOperationnels = values[0].data;
        $scope.parcelleculturals = values[1].data;
        $scope.ParcelleCulturalleApporteau = values[2].data;
        $scope.showAdvancedEditSimple("ev", data, $scope.GroupeOperationnels, $scope.parcelleculturals, $scope.ParcelleCulturalleApporteau);
      });
    }

    //Edit simplifier
    $scope.showAdvancedEditSimple = function(ev, data, GroupeOperationnels, parcelleculturals, ParcelleCulturalleApporteau) {
      parametretechnique.checkcloture({
        idferme: pc.IDFerme,
        module: 'Technique',
        rubrique: 'Irrigation',
        dateaction: moment(data.DATE, "DD/MM/YYYY").format('YYYYMMDD')
      }).then(async respense => {
        if (respense.data.length == 0) {

          $mdDialog.show({
              controller: DialogControllerEditSimple,
              templateUrl: '././views/templates/apporteau/EditApportSimple.html',
              parent: angular.element(document.body),
              targetEvent: "ev",
              clickOutsideToClose: false,
              hasBackdrop: true,
              escapeToClose: false,
              locals: {
                data: data,
                GroupeOperationnels: GroupeOperationnels,
                parcelleculturals: parcelleculturals,
                ParcelleCulturalleApporteau: ParcelleCulturalleApporteau
              }
            })
            .then(function(answer) {}, function() {});

        } else {
          toastr.clear();
          toastr.error("Tout ajout, modification ou suppression dont la date d'exécution est compromise entre " + moment(respense.data[0].Date_debut).format('DD/MM/YYYY') + " et " + moment(respense.data[0].Date_fin).format('DD/MM/YYYY') + " est bloqué", {
            closeButton: true
          });
        }

      })


    }

    //Edit simplifier
    function DialogControllerEditSimple($scope, $mdDialog, data, GroupeOperationnels, parcelleculturals, ParcelleCulturalleApporteau) {
      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
      $scope.data = data;
      $scope.dateirrigation = ($scope.data.Date) ? new Date(moment($scope.data.Date).format("YYYY-MM-DD")) : null;
      $scope.GroupeOperationnels = GroupeOperationnels;
      $scope.parcelleculturals = parcelleculturals;
      $scope.ParcelleCulturalleApporteau = ParcelleCulturalleApporteau;
      $scope.foods = [];

      function pad(num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
      }


      async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
      }


      $scope.ParcelleisIN = function(IDParcelle) {
        var i = false;
        angular.forEach($scope.ParcelleCulturalleApporteau, function(value, key) {
          if (value.ParcCul_ID === IDParcelle && i == false) {
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

      $scope.notIn = function(ID) {
        var ifoundIt = false;
        angular.forEach($scope.foods, function(value, key) {
          if (value.parcelle.ID == ID && ifoundIt == false) {
            ifoundIt = true;
          }
        })
        return ifoundIt;
      }

      $scope.RetirerParcelle = async function(index) {
        var confirm = $mdDialog.confirm()
          .title(await translatedwords.getTranslatedWord($translate("Veuillez confirmer la suppression de la Parcelle?")))
          .textContent('')
          .ariaLabel('Lucky day')
          .ok(await translatedwords.getTranslatedWord($translate("Ok")))
          .cancel(await translatedwords.getTranslatedWord($translate("Annuler")))

        $mdDialog.show(confirm.multiple(true)).then(function() {
          //ok
          $scope.foods.splice(index, 1);
          $scope.parcelleculturalsel = undefined;
        }, function() {
          //cancel
        })
      }




      $scope.setFoods = function() {
        var dose = null;
        var dosem3 = null;
        angular.forEach($scope.ParcelleCulturalleApporteau, function(value, key) {
          if (value.ParcCul_ID == $scope.parcelleculturalsel.ID) {
            dose = value.DOSE_Ordre;
            dosem3 = value.Dose_realise;
          }
        })
        $scope.foods.push({
          parcelle: $scope.parcelleculturalsel,
          dose: dose,
          dosem3: dosem3
        });
      }

      $scope.getSumDose = () => {
        return parseFloat(_.sumBy($scope.foods, 'dose').toFixed(2))
      }

      $scope.setdosem3 = (dose, sup) => {
        return parseFloat((dose * 10 * sup).toFixed(2));
      }

      $scope.getSumDosem3 = () => {
        return parseFloat(_.sumBy($scope.foods, 'dosem3').toFixed(2))
      }

      $scope.getParcellesByGO = async () => {
        parcellecultural.showbydomaineandgroupe({
          idferme: pc.IDFerme,
          idgroupe: $scope.GroupeOperationnelsel
        }).then(async e => {
          NProgress.done();
          $scope.parcelleculturals = e.data;
        }).catch(async e => {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
            closeButton: true
          });
        });
      }

      $scope.EditSimple = async function() {
        $scope.progress = true;
        toastr.clear();
        if ($scope.dateirrigation && $scope.foods.length > 0) {
          if ($scope.foods[0].dose) {
            pc.objEdit = {
              "ID": $scope.data.ID,
              "Date": moment($scope.dateirrigation).format('YYYYMMDD'),
              "Code_compagne": "",
              "DoseTotal": $scope.getSumDose(),
              "Dosem3Total": $scope.getSumDosem3(),
              "irrigation": $scope.foods
            }
            campagneagricole.CheckCodeCompagnebyTwoDates({
              date_debut: moment($scope.dateirrigation).format('YYYYMMDD'),
              IDSOCIETE: pc.IDSociete
            }).then(async e => {
              if (e.data.length > 0) {
                pc.objEdit.Code_compagne = e.data[0].Code_compagne;
                //add

                ApportEau.updateWebSimple(pc.objEdit).then(async e => {
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
                    toastr.error(await translatedwords.getTranslatedWord($translate("An error occured ")) + e.data[0].description, {
                      closeButton: true
                    });
                    NProgress.done();
                  }
                }).catch(async e => {
                  $scope.progress = false;
                  toastr.clear();
                  toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement : ")) + e.data[0].description, {
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
            }).catch(async e => {
              $scope.progress = false;
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
                closeButton: true
              });
            });


          } else {
            $scope.progress = false;
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez saisir au moins une parcelle culturale")), {
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


      $scope.hideSimple = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.AnnulerSimple = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };




    }


    function showApportEauAvancee() {
      for (var i = 3; i < pc.dtColumns.length - 1; i++) {
        pc.dtColumns[i].notVisible();
      }
    }

    function showApportEauSimple() {
      pc.dtColumns[0].notVisible();
      pc.dtColumns[1].notVisible();
      pc.dtColumns[2].notVisible();
    }

    pc.showMore = function(obj) {
      document.getElementById('filter_form').style.display = "none";
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: './views/templates/apporteau/detail.html',
        controller: 'TemplatesApporteauDetailCtrl',
        controllerAs: 'pc',
        resolve: {
          data: function() {
            return obj;
          }
        }
      });

      modalInstance.result.then(function(res) {

      }, function() {});

    };

    pc.showApportAvance = function(obj) {
      document.getElementById('filter_form').style.display = "none";
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: './views/templates/apporteau/advenceddetail.html',
        controller: 'ApporteauAdvenceddetailCtrl',
        controllerAs: 'pc',
        resolve: {
          data: function() {
            return obj;
          }
        }
      });

      modalInstance.result.then(function(res) {

      }, function() {});

    };

    function edit(c) {}

    function deleteRow(c) {}

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

    function actionsHtml(data, type, full, meta) {
      pc.apporteauaction[data.ID] = data;
      var editbtn = (pc.mode_irrigation == 1) ? '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.editAvancer(pc.apporteauaction[' + data.ID + '])" )"=""><i class="fa fa-edit"></i></button>' : '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.editSimple(pc.apporteauaction[' + data.ID + '])" )"=""><i class="fa fa-edit"></i></button>';
      return editbtn + '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.apporteauaction[' + data.ID + '])" )"=""><i class="fa fa-trash-o"></i></button>';
    }

    pc.delete = async function(c) {
      pc.IDapporteauaction = c.ID;
      parametretechnique.checkcloture({
        idferme: pc.IDFerme,
        module: 'Technique',
        rubrique: 'Irrigation',
        dateaction: moment(c.DATE, "DD/MM/YYYY").format('YYYYMMDD')
      }).then(async respense => {
        if (respense.data.length == 0) {

          toastr.clear();
          toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
            closeButton: true,
            allowHtml: true,
            onShown: function(toast) {
              $("#confirmationRevertYes").click(function() {
                ApportEau.delete({
                  ID: pc.IDapporteauaction,
                  Mode: pc.mode_irrigation
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
                    toastr.error(await translatedwords.getTranslatedWord($translate("An error occured :")) + result.data[0].description, {
                      closeButton: true
                    });
                  }
                });
              });
            }
          });

        } else {
          toastr.clear();
          toastr.error("Tout ajout, modification ou suppression dont la date d'exécution est compromise entre " + moment(respense.data[0].Date_debut).format('DD/MM/YYYY') + " et " + moment(respense.data[0].Date_fin).format('DD/MM/YYYY') + " est bloqué", {
            closeButton: true
          });
        }

      })



    }

    //starting date change listner
    pc.date_debut_change = function() {
      pc.obj.DATE_DEBUT = moment($scope.date_debut).format('YYYYMMDD');
      savefilter.setFilters(pc.obj);
      $scope.date_debut = moment(moment(pc.obj.DATE_DEBUT).format('YYYYMMDD'), 'YYYY-MM-DD').toDate();
      $scope.reload = true;
      try {
        pc.dtInstance.reloadData();
      } catch (e) {}
    };

    //by date_fin
    pc.date_fin_change = function() {
      pc.obj.DATE_FIN = moment($scope.date_fin).format('YYYYMMDD');
      savefilter.setFilters(pc.obj);
      $scope.date_fin = moment(moment(pc.obj.DATE_FIN).format('YYYYMMDD'), 'YYYY-MM-DD').toDate();
      $scope.reload = true;
      try {
        pc.dtInstance.reloadData();
      } catch (e) {}
    };

    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
    }

  });