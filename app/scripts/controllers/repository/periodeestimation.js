'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RepositoryPeriodeestimationCtrl
 * @description
 * # RepositoryPeriodeestimationCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RepositoryPeriodeestimationCtrl', function($scope, _url, translatedwords, DTOptionsBuilder, $translatePartialLoader, $translate, $window, DTColumnBuilder, $q, $compile, $state, DTDefaultOptions, $cookies, PeriodeEstimation, societe, campagneagricole, toastr) {

    var pc = this;
    pc.dtInstance = {};
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    pc.disabledsubmit = true;
    pc.periodeestimationchecker = true;
    pc.userdata = $cookies.getObject('globals');
    if (pc.userdata.currentUser.isAdmin) {
      pc.cretedby = "Admin";
    } else {
      pc.cretedby = pc.userdata.currentUser.Nom + " " + pc.userdata.currentUser.Prenom;
    }
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Societe").selectpicker('refresh');
      $("#Campagne").selectpicker('refresh');
      $("#CampagneSel").selectpicker('refresh');
      $("#SocieteSel").selectpicker('refresh');
    }, 1000);

    $scope.ReverseDisplayfilter_form = function() {
      if (document.getElementById('add_form').style.display = "block") {
        document.getElementById('add_form').style.display = "none";
      }
      if (document.getElementById('filter_form').style.display === "none") {
        document.getElementById('filter_form').style.display = "block";
      } else {
        document.getElementById('filter_form').style.display = "none";
      }
    }

    $scope.ReverseDisplayadd_form = function() {
      if (document.getElementById('filter_form').style.display = "block") {
        document.getElementById('filter_form').style.display = "none";
      }
      if (document.getElementById('add_form').style.display === "none") {
        document.getElementById('add_form').style.display = "block";
      } else {
        document.getElementById('add_form').style.display = "none";
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


    //load Societe
    $scope.LoadSociete = societe.getSociete(_url).then(function(res) {
      pc.societes = res.data;
    });

    //Load campagnes
    $scope.LoadCampagne = campagneagricole.getCampagneAgricole(_url).then(function(res) {
      pc.campagnes = res.data;
    });

    //set date input
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

    $q.all([$scope.LoadSociete, $scope.LoadCampagne]).then(function(values) {
      setTimeout(function() {
        $("#Societe").selectpicker('refresh');
        $("#Campagne").selectpicker('refresh');
        $("#CampagneSel").selectpicker('refresh');
        $("#SocieteSel").selectpicker('refresh');
      }, 1000);
    });

    pc.obj = {
      "DOMAINE": $cookies.getObject('globals').ferme.IDFerme,
      "SOCIETE": [$cookies.getObject('globals').ferme.IDSociete],
      "CAMPAGNE": "0"
    };

    pc.objCheck = {
      "SOCIETE": 0,
      "CAMPAGNE": "0"
    };

    pc.loadData = () => {

      $q.all([PeriodeEstimation.getByFiltrecheck(pc.objCheck)]).then(async function(values) {
        pc.checkperiodeestimation = values[0].data;
        if (pc.checkperiodeestimation[0].nbrperiodes != 0) {
          pc.periodeestimationchecker = false;
        } else {
          toastr.clear();
          pc.periodeestimationchecker = true;
        }
        NProgress.done();
      });
    }

    $scope.societe_sel = [0];
    $scope.campagne_sel = "0";
    //by societe
    $scope.societe_change = function() {
      if ($scope.societe.societe === null || $scope.societe.societe === "" || $scope.societe.societe === undefined || $scope.societe.societe === 0 || $scope.societe.societe === "0" || !$scope.societe.societe || $scope.societe.societe.length === 0 || $scope.societe.societe.includes(0)) {
        $scope.societe_sel = [0];
      } else {
        $scope.societe_sel = $scope.societe.societe;
      }

      pc.obj.SOCIETE = $scope.societe_sel;

      pc.obj.CAMPAGNE = "0";
      setTimeout(function() {
        $('#Campagne option').attr("selected", false);
        $("#Campagne").selectpicker('refresh');
      }, 1000);

      try {
        pc.dtInstance.reloadData();
      } catch (error) {}

    };

    $scope.campagne_change = function() {
      if ($scope.campagne.campagne === null || $scope.campagne.campagne === "" || $scope.campagne.campagne === undefined || $scope.campagne.campagne === 0 || $scope.campagne.campagne === "0" || !$scope.campagne.campagne || $scope.campagne.campagne.length === 0) {
        $scope.campagne_sel = "0";
      } else {
        $scope.campagne_sel = $scope.campagne.campagne;
      }
      pc.obj.CAMPAGNE = $scope.campagne_sel;
      try {
        pc.dtInstance.reloadData();
      } catch (error) {}
    };

    //get dates between two dates
    $scope.enumerateDaysBetweenDates = function(startDate, endDate) {
      var dates = [];

      startDate = moment(startDate);
      endDate = moment(endDate);

      var now = startDate,
        dates = [];

      while (now.isBefore(endDate) || now.isSame(endDate)) {
        dates.push(now.format('DD/MM/YYYY'));
        now.add(1, 'days');
      }
      return dates;
    };

    $scope.campagnecheck_change = function() {
      if ($scope.CampagneSel === null || $scope.CampagneSel === "" || $scope.CampagneSel === undefined || $scope.CampagneSel === 0 || $scope.CampagneSel === "0" || !$scope.CampagneSel || $scope.CampagneSel.length === 0) {
        $scope.CampagneSel_sel = "0";
      } else {
        $scope.CampagneSel_sel = $scope.CampagneSel;
      }
      pc.objCheck.CAMPAGNE = $scope.CampagneSel_sel.Code_compagne;
      pc.loadData();
    };

    $scope.societecheck_change = function() {
      if ($scope.SocieteSel === null || $scope.SocieteSel === "" || $scope.SocieteSel === undefined || $scope.SocieteSel === 0 || $scope.SocieteSel === "0" || !$scope.SocieteSel || $scope.SocieteSel.length === 0) {
        $scope.SocieteSel_sel = "0";
      } else {
        $scope.SocieteSel_sel = $scope.SocieteSel;
      }
      pc.objCheck.SOCIETE = $scope.SocieteSel_sel;
      pc.objCheck.CAMPAGNE = "0";
      setTimeout(function() {
        $('#CampagneSel option').attr("selected", false);
        $("#CampagneSel").selectpicker('refresh');
      }, 1000);
      pc.loadData();
    };

    pc.AddPeriodeEstimation = async function() {
      $scope.datainsert = "";

      console.log($scope.CampagneSel);
      if ($scope.date_lencement && $scope.CampagneSel && $scope.nbrjour && pc.periodeestimationchecker) {
        pc.ID_societe = $scope.SocieteSel;
        pc.Date_Start = $scope.date_lencement;
        pc.Date_Start_campagne = $scope.CampagneSel.Date_debut;
        pc.Date_End = $scope.CampagneSel.Date_Fin;
        pc.CampagneSelected = $scope.CampagneSel.Code;
        pc.nbrjour = parseInt($scope.nbrjour);
        if (moment(pc.Date_Start, 'YYYY-MM-DD').isBetween(moment(pc.Date_Start_campagne, 'YYYY-MM-DD').subtract(1, "days"), moment(pc.Date_End, 'YYYY-MM-DD').add(1, 'days'))) {
          pc.alldates = $scope.enumerateDaysBetweenDates(moment(pc.Date_Start).format('YYYYMMDD'), moment(pc.Date_End).format('YYYYMMDD'));

          var p = pc.nbrjour;
          var firstcase = 0;
          var lastcase = p - 1;
          if ((pc.alldates.length / p) >= 1) {
            for (var i = 0; i < pc.alldates.length / p; i++) {
              var myday = moment(pc.alldates[firstcase], "DD-MM-YYYY");
              var myyear = myday.format('YYYY');
              var mymounth = myday.format('YYYY');
              var myweek = "S" + myday.format('WW') + "-" + myyear;
              if (pc.alldates[firstcase] && pc.alldates[lastcase]) {
                $scope.datainsert += "('" + moment().format('YYYYMMDD') + "";
                $scope.datainsert += "','" + moment().format('HH:mm') + "";
                $scope.datainsert += "','" + pc.cretedby + "";
                $scope.datainsert += "','" + pc.CampagneSelected + "";
                $scope.datainsert += "','" + 0 + "";
                $scope.datainsert += "','" + myweek + "";
                $scope.datainsert += "','" + moment(pc.Date_Start, 'DD-MM-YYYY').format('YYYYMMDD') + "";
                $scope.datainsert += "','" + pc.nbrjour + "";
                $scope.datainsert += "','" + moment(pc.alldates[firstcase], 'DD-MM-YYYY').format('YYYYMMDD') + "";
                $scope.datainsert += "','" + moment(pc.alldates[lastcase], 'DD-MM-YYYY').format('YYYYMMDD') + "";
                $scope.datainsert += "','" + pc.ID_societe + "";
                $scope.datainsert += "'),";
              }
              firstcase += p;
              lastcase += p;
            }

            PeriodeEstimation.create({
              "DATAINSERT": $scope.datainsert.substring(0, $scope.datainsert.length - 1)
            }).then(async function(res) {
              pc.rescreate = res.data;
              if (pc.rescreate[0].message == 'ajout reussi') {
                toastr.clear();
                toastr.info(await translatedwords.getTranslatedWord($translate("Ajout reussi!")), {
                  closeButton: true
                });
                NProgress.done();
                $scope.ReverseDisplayadd_form();
                $('#SocieteSel option').attr("selected", false);
                $("#SocieteSel").selectpicker('refresh');
                $('#CampagneSel option').attr("selected", false);
                $("#CampagneSel").selectpicker('refresh');
                $scope.date_lencement = null;
                $scope.nbrjour = null;
                $scope.datainsert = "";
                pc.dtInstance.reloadData();
              } else {
                toastr.clear();
                if (res.data[0].description.includes("duplicate key")) {
                  toastr.error(await translatedwords.getTranslatedWord($translate("Attention les valeurs se chevauchent ou sont existes déjà  !")), {
                    closeButton: true
                  });
                } else {
                  toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + res.data[0].description, {
                    closeButton: true
                  });
                }
                NProgress.done();
              }
            });
          } else {
            toastr.clear();
            toastr.info(await translatedwords.getTranslatedWord($translate("Le nbr des jours des périodes d'estimation trouvées est inferieur aux nbr de jours de période choisie")), {
              closeButton: true
            });
            NProgress.done();
          }

        } else {
          toastr.clear();
          toastr.info(await translatedwords.getTranslatedWord($translate("La date de lencement n'appartienne pas au periode de campagne agricole !!")), {
            closeButton: true
          });
          NProgress.done();
        }
      }
      if (!pc.periodeestimationchecker) {
        toastr.clear();
        toastr.info(await translatedwords.getTranslatedWord($translate("Les plages d'estimation sont deja existes !!")), {
          closeButton: true
        });
        NProgress.done();
      }
    };


    //get data and refresh datatable
    $scope.updateDataPeriodeEstimation = function(data) {
      return PeriodeEstimation.getByFiltre(data);
    };

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        $scope.updateDataPeriodeEstimation(pc.obj).then(function(res) {
          defer.resolve(res.data);
          $scope.updatechart(res.data);
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
      .withOption('fnRowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        var daynow = moment().format('YYYY-MM-DD');
        var day1 = moment(aData.Date_Debut, 'YYYY-MM-DD').subtract(1, "days").format('YYYY-MM-DD');
        var day2 = moment(aData.Date_Fin, 'YYYY-MM-DD').add(1, 'days').format('YYYY-MM-DD');
        if (moment(daynow).isBetween(day1, day2)) {
          $('td', nRow).css('background-color', 'rgb(255, 246, 181)');
        }
      })
      .withOption('order', false)
      .withScroller()
      .withOption('responsive', true)
      .withLanguage($.getJSON(`/scripts/i18n/datatable/${$window.localStorage.getItem("lang").toLowerCase()}.json`, function(data) {
        return data
      }))


      .withButtons([{
          text: "<i class='fa fa-plus'></i>",
          key: '1',
          action: function(e, dt, node, config) {
            $scope.ReverseDisplayadd_form();
          },
          className: 'pull-left',
          titleAttr: translatedwords.getTranslatedWord($translate("Ajouter"))
        },
        {
          text: "<i class='fa fa-search'></i>",
          action: function(e, dt, node, config) {
            $scope.ReverseDisplayfilter_form();
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
          extend: 'excel',
          text: "<i class='fa fa-file-excel-o'></i>",
          titleAttr: 'EXCEL'
        }
      ]);

    pc.dtColumns = [
      DTColumnBuilder.newColumn('DATE').withTitle(translatedwords.getTranslatedWord($translate("Date Création"))).renderWith(function(data, type, full, meta) {
        return moment(full.DateCreated).format('DD/MM/YYYY') + " " + full.TimeCreated;
      }),
      DTColumnBuilder.newColumn('CodePeriode').withTitle(translatedwords.getTranslatedWord($translate("Code"))),
      DTColumnBuilder.newColumn('Date_Debut').withTitle(translatedwords.getTranslatedWord($translate("Date début"))).renderWith(function(data, type, full, meta) {
        return moment(full.Date_Debut).format('DD/MM/YYYY');
      }),
      DTColumnBuilder.newColumn('Date_Fin').withTitle(translatedwords.getTranslatedWord($translate("Date fin"))).renderWith(function(data, type, full, meta) {
        return moment(full.Date_Fin).format('DD/MM/YYYY');
      }),
      DTColumnBuilder.newColumn('Campagne').withTitle(translatedwords.getTranslatedWord($translate("Campagne agricole"))),
      DTColumnBuilder.newColumn('Rais_Social').withTitle(translatedwords.getTranslatedWord($translate("Société"))),
      DTColumnBuilder.newColumn('Statut').withTitle(translatedwords.getTranslatedWord($translate("Statut"))).renderWith(function(data, type, full, meta) {
        if (full.Blocked) {
          return "<span class='badge-red_withe'>Fermée</span>";
        } else {
          return "<span class='badge-orange_withe'>Ouverte</span>";
        }
      }),
      DTColumnBuilder.newColumn('CreatedBy').withTitle(translatedwords.getTranslatedWord($translate("Créé par"))),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).notSortable().withClass('nowraptd all')
      .renderWith(function(data, type, full, meta) {
        if (full.Blocked) {
          return '<a class="dt-withcolor-button-conge pull-left" title="Reouvrir" ng-click="pc.cloturerreouvrir(' + full.ID + ', 0)">Reouvrir</a>';
        } else {
          return '<a class="dt-withcolor-button-ferie pull-left" title="Clôturer" ng-click="pc.cloturerreouvrir(' + full.ID + ', 1)">Clôturer</a>';
        }
      })
    ];

    pc.cloturerreouvrir = async function(ID, etat) {
      toastr.clear();
      if (etat == 0) {
        var strmsg = await translatedwords.getTranslatedWord($translate("Veuillez confirmer l'ouverture du période"));
      } else {
        var strmsg = await translatedwords.getTranslatedWord($translate("Veuillez confirmer la clôture du période"));
      }
      if (ID) {
        toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", strmsg, {
          closeButton: true,
          allowHtml: true,
          onShown: function(toast) {
            $("#confirmationRevertYes").click(function() {
              PeriodeEstimation.cloture({
                "ID": ID,
                "ETAT": etat
              }).then(async function(res) {
                pc.resdelete = res.data;
                if (pc.resdelete[0].message == 'ajout reussi') {
                  toastr.clear();
                  toastr.info(await translatedwords.getTranslatedWord($translate("Action reussite!")), {
                    closeButton: true
                  });
                  NProgress.done();
                  try {
                    pc.dtInstance.reloadData();
                  } catch (error) {}
                } else {
                  toastr.clear();
                  toastr.error(await translatedwords.getTranslatedWord($translate("Une erreur est survenue !")), {
                    closeButton: true
                  });
                }
              });
            });
          }
        });
      }
    }


    function actionsHtml(data, type, full, meta) {
      pc.intensiteObject[data.ID] = data;
      return '<button class="btn btn-warning btn-xs" ng-click="pc.edit(pc.intensiteObject[' + data.ID + '])">' +
        '   <i class="fa fa-edit"></i>' +
        '</button>&nbsp;' +
        '<button class="btn btn-danger btn-xs" ng-click="pc.delete(pc.intensiteObject[' + data.ID + '])" )"="">' +
        '   <i class="fa fa-trash-o"></i>' +
        '</button>';
    }


    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    $scope.updatechart = function(data) {
      return "";
    }


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
      return '<button class="btn btn-warning btn-xs" ng-click="pc.edit(pc.obj[' + data.ID + '])">' +
        '   <i class="fa fa-edit"></i>' +
        '</button>&nbsp;' +
        '<button class="btn btn-danger btn-xs" ng-click="pc.delete(pc.obj[' + data.ID + '])" )"="">' +
        '   <i class="fa fa-trash-o"></i>' +
        '</button>';
    }

  });