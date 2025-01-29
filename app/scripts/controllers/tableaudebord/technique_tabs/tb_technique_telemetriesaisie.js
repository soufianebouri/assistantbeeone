'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:TableaudebordTechniqueTabsTbTechniqueTelemetriesaisieCtrl
 * @description
 * # TableaudebordTechniqueTabsTbTechniqueTelemetriesaisieCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('TableaudebordTechniqueTabsTbTechniqueTelemetriesaisieCtrl', function($scope, translatedwords, $window, campagneagricole, $http, $cookies, $q, $translatePartialLoader, $translate, $rootScope, tbTechnique, gestionprofils) {
    moment.locale('fr');
    var pc = this;
    pc.IDferme = $cookies.getObject('globals').ferme.IDFerme;
    pc.NomFerme = $cookies.getObject('globals').ferme.NomFerme;
    pc.IDSOCIETE = $cookies.getObject('globals').ferme.IDSociete;
    var Pivot_TableauDernieresSaisiesParUtilisateur = undefined;
    pc.obj = {
      "FERME": pc.IDferme,
      "IDSOCIETE": pc.IDSOCIETE,
      "DateDebut": moment().subtract(6, "days").format("YYYYMMDD"),
      "DateFin": moment().format("YYYYMMDD"),
      "USER": [0],
      "USERID": [0],
      "MODULE": [0]
    }
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#user").selectpicker('refresh');
      $("#module").selectpicker('refresh');
      $("#compagne").selectpicker('refresh');
    }, 1000);

    $rootScope.$on('broadcastDashboard', function(event, data) {
      $scope.tb_technique_telemetrieSaisies_TableauDernieresSaisiesParUtilisateur = data.tb_technique_telemetrieSaisies_TableauDernieresSaisiesParUtilisateur;
    })

    pc.modules = [{
      ID: 1,
      Title: "Suivi des stades"
    }, {
      ID: 2,
      Title: "Suivi de pourcentage d'ouverture"
    }, {
      ID: 3,
      Title: "Suivi intensité des fleurs / type de fleurs"
    }, {
      ID: 4,
      Title: "irrigation"
    }, {
      ID: 5,
      Title: "Test de conformité"
    }, {
      ID: 6,
      Title: "Aspect végétal"
    }, {
      ID: 7,
      Title: "Fertilisation"
    }, {
      ID: 8,
      Title: "Contrôle pH, EC"
    }, {
      ID: 9,
      Title: "Observation phytosanitaire"
    }, {
      ID: 10,
      Title: "Comptage des ravageurs"
    }, {
      ID: 11,
      Title: "Comptage piégeage"
    }, {
      ID: 12,
      Title: "Traitement phytosanitaire"
    }, {
      ID: 13,
      Title: "Ramassage / destructions des fruits"
    }, {
      ID: 14,
      Title: "Piqûres sur fruits"
    }, {
      ID: 15,
      Title: "Changement des phéromones"
    }, {
      ID: 16,
      Title: "Codification des pièges"
    }, {
      ID: 17,
      Title: "Programme d'application du pollen"
    }, {
      ID: 18,
      Title: "Récolte du pollen"
    }, {
      ID: 19,
      Title: "Comptage par arbre"
    }, {
      ID: 20,
      Title: "Eclaircissage des régimes"
    }]

    $q.all([gestionprofils.getUsers(), tbTechnique.getTableauDernieresSaisiesParUtilisateur(pc.obj), campagneagricole.getCampagneAgricoleByIDSociete($cookies.getObject('globals').ferme.IDSociete)]).then(function(values) {
      pc.users = values[0].data;
      pc.TableauDernieresSaisiesParUtilisateur = values[1].data;
      pc.compagne_array = values[2].data;
      pc.loadWidgets(pc.TableauDernieresSaisiesParUtilisateur);
      setTimeout(function() {
        $("#user").selectpicker('refresh');
        $("#module").selectpicker('refresh');
        $("#compagne").selectpicker('refresh');
      }, 1000);
      NProgress.done();
    });

    pc.loadWidgets = (data_ParUser) => {
      pc.loadTableauDernieresSaisiesParUtilisateur(data_ParUser);
    }

    var formatpuvot = [{
      name: "format_number",
      maxDecimalPlaces: 2,
      decimalPlaces: 2,
      decimalSeparator: ".",
      maxSymbols: 20,
      textAlign: "right",
      divideByZeroValue: "",
      thousandsSeparator: " ",
      nullValue: ""
    }]

    //variete
    pc.loadTableauDernieresSaisiesParUtilisateur = async (data) => {
      if (data.length == 0) {
        pc.title = "Sorry, Data Not Available, Please Check The Filtre Settings";
      } else {
        pc.title = "";
      }
      var modeldataTableauDernieresSaisiesParUtilisateur = [{
        "Module": {
          type: "String"
        },
        "Utilisateur": {
          type: "String"
        },
        "lastdate": {
          type: "string"
        }
      }];
      Pivot_TableauDernieresSaisiesParUtilisateur = new Flexmonster({
        container: "#wdr-Pivot_TableauDernieresSaisiesParUtilisateur",
        componentFolder: "https://cdn.flexmonster.com/",
        width: "100%",
        height: 400,
        toolbar: false,
        report: {
          dataSource: {
            data: modeldataTableauDernieresSaisiesParUtilisateur.concat(data)
          },
          options: {
            grid: {
              title: pc.title,
              type: "classic",
              showTotals: "off",
              showGrandTotals: "off"
            },
            datePattern: "dd/MM/yyyy"
          },
          formats: formatpuvot,
          slice: {
            rows: [{
              uniqueName: "Utilisateur",
              caption: await translatedwords.getTranslatedWord($translate("Utilisateur"))
            }, {
              uniqueName: "lastdate",
              caption: await translatedwords.getTranslatedWord($translate("Date de la dernière saisie"))
            }, {
              uniqueName: "Module",
              caption: await translatedwords.getTranslatedWord($translate("Module"))
            }],
            columns: [{
              uniqueName: "[Measures]"
            }],
            measures: [{
              uniqueName: "Utilisateur",
              format: "format_number",
              caption: "",
              formula: "COUNT('Utilisateur') / 0"
            }]
          }
        },
        global: {
          localization: `/scripts/i18n/webdatarock/${$window.localStorage.getItem("lang").toLowerCase()}.json`
        }
      });
      Pivot_TableauDernieresSaisiesParUtilisateur.expandAllData();

    }

    $scope.exportData = (type) => {
      Pivot_TableauDernieresSaisiesParUtilisateur.exportTo(type, {
        filename: "Tableau des dernières saisies par utilisateur",
        excelSheetName: "Tableau des dernières saisies par utilisateur",
        pageFormat: "A0",
        pageOrientation: "landscape",
      });
    }

    pc.search = () => {
      console.log(pc.obj);
      $q.all([tbTechnique.getTableauDernieresSaisiesParUtilisateur(pc.obj)]).then(function(values) {
        pc.TableauDernieresSaisiesParUtilisateur = values[0].data;
        pc.loadWidgets(pc.TableauDernieresSaisiesParUtilisateur);
        NProgress.done();
      });
    }

    pc.user_change = () => {
      pc.obj.USER = [];
      pc.obj.USERID = [];
      if ($scope.user && $scope.user.length > 0) {
        angular.forEach($scope.user, function(value, key) {
          pc.obj.USER.push("'" + value.Nom + ' ' + value.Prenom + "'");
          pc.obj.USERID.push(value.ID);
        })
      } else {
        pc.obj.USER = [0];
        pc.obj.USERID = [0];
      }
    }

    pc.module_change = () => {
      if ($scope.module && $scope.module.length > 0 && !$scope.module.includes(0)) {
        pc.obj.MODULE = $scope.module;
      } else {
        pc.obj.MODULE = [0];
      }
    }

    $("#reportrange_tb_technique input").change((e) => {
      var periode = $("#reportrange_tb_technique input").val().split(" - ");
      if (periode.length == 1) {
        pc.obj.DateDebut = moment().startOf('year').format('YYYYMMDD');
        pc.obj.DateFin = moment().endOf('year').format('YYYYMMDD');
      } else {
        pc.obj.DateDebut = periode[0];
        pc.obj.DateFin = periode[1];
      }

    });


    pc.compagne_change = () => {
      if ($scope.compagne) {

        $("#reportrange_tb_technique span").html(moment($scope.compagne.Date_debut).format('DD/MM/YYYYY') + " - " + moment($scope.compagne.Date_Fin).format('DD/MM/YYYYY'))
        $("#reportrange_tb_technique input").val(moment($scope.compagne.Date_debut).format('DD/MM/YYYYY') + " - " + moment($scope.compagne.Date_Fin).format('DD/MM/YYYYY'))
        $("#reportrange_tb_technique input").trigger("change");

        pc.obj.DateDebut = moment($scope.compagne.Date_debut).format('YYYYMMDD');
        pc.obj.DateFin = moment($scope.compagne.Date_Fin).format('YYYYMMDD');
      }
    }

    async function daterange_tb_technique(from, to) {
      to = moment();
      from = moment().subtract(6, "days");
      var range = {
        'Semaine1': [moment().subtract(6, "days"), moment()],
        '15 jours1': [moment().subtract(14, "days"), moment()],
        '1 mois1': [moment().startOf("month"), moment().endOf("month")],
        'Trimestre1': [moment().subtract(2, 'month').startOf("month"), moment().endOf("month")]
      }

      range[await translatedwords.getTranslatedWord($translate("Semaine"))] = range['Semaine1'];
      range[await translatedwords.getTranslatedWord($translate("15 jours"))] = range['15 jours1'];
      range[await translatedwords.getTranslatedWord($translate("1 mois"))] = range['1 mois1'];
      range[await translatedwords.getTranslatedWord($translate("Trimestre"))] = range['Trimestre1'];
      delete range['Semaine1'];
      delete range['15 jours1'];
      delete range['1 mois1'];
      delete range['Trimestre1'];
      if ("undefined" != typeof $.fn.daterangepicker) {
        var a = function(a, b, c) {
            if (c == "Annuel") {
              $("#reportrange_tb_technique span").html(a.format("YYYY"))
              $("#reportrange_tb_technique input").val(a.format("YYYY"))
              $("#reportrange_tb_technique input").trigger("change");
            } else {
              $("#reportrange_tb_technique span").html(a.format("DD/MM/YYYY") + " - " + b.format("DD/MM/YYYY"))
              $("#reportrange_tb_technique input").val(a.format("YYYYMMDD") + " - " + b.format("YYYYMMDD"))
              $("#reportrange_tb_technique input").trigger("change");
            }
          },
          b = {
            startDate: moment().subtract(6, "days"),
            endDate: moment(),
            showDropdowns: !0,
            showWeekNumbers: !0,
            timePicker: !1,
            timePickerIncrement: 1,
            timePicker12Hour: !0,
            ranges: range,
            opens: "left",
            buttonClasses: ["btn btn-default"],
            applyClass: "btn-small btn-primary",
            cancelClass: "btn-small",
            format: "DD/MM/YYYY",
            separator: await translatedwords.getTranslatedWord($translate(" à ")),
            locale: {
              applyLabel: await translatedwords.getTranslatedWord($translate("Valider")),
              cancelLabel: await translatedwords.getTranslatedWord($translate("Vider")),
              fromLabel: await translatedwords.getTranslatedWord($translate("De")),
              toLabel: await translatedwords.getTranslatedWord($translate("à")),
              customRangeLabel: await translatedwords.getTranslatedWord($translate("Personnalisée")),
              daysOfWeek: [await translatedwords.getTranslatedWord($translate("Lun")),
                await translatedwords.getTranslatedWord($translate("Mar")),
                await translatedwords.getTranslatedWord($translate("Mer")),
                await translatedwords.getTranslatedWord($translate("Jeu")),
                await translatedwords.getTranslatedWord($translate("Ven")),
                await translatedwords.getTranslatedWord($translate("Sam")),
                await translatedwords.getTranslatedWord($translate("Dim"))
              ],
              monthNames: [await translatedwords.getTranslatedWord($translate("Janvier")),
                await translatedwords.getTranslatedWord($translate("février")),
                await translatedwords.getTranslatedWord($translate("mars")),
                await translatedwords.getTranslatedWord($translate("avril")),
                await translatedwords.getTranslatedWord($translate("mai")),
                await translatedwords.getTranslatedWord($translate("juin")),
                await translatedwords.getTranslatedWord($translate("juillet")),
                await translatedwords.getTranslatedWord($translate("août")),
                await translatedwords.getTranslatedWord($translate("septembre")),
                await translatedwords.getTranslatedWord($translate("octobre")),
                await translatedwords.getTranslatedWord($translate("novembre")),
                await translatedwords.getTranslatedWord($translate("décembre"))
              ],
              firstDay: 1
            }
          };
        $("#reportrange_tb_technique span").html(moment().subtract(6, "days").format("DD/MM/YYYY") + " - " + moment().format("DD/MM/YYYY")), $("#reportrange_tb_technique").daterangepicker(b, a), $("#reportrange_tb_technique").on("show.daterangepicker", function() {
          //console.log("show event fired")
        }), $("#reportrange_tb_technique").on("hide.daterangepicker", function() {
          //console.log("hide event fired")
        }), $("#reportrange_tb_technique").on("apply.daterangepicker", function(a, b) {
          //console.log("apply event fired, start/end dates are " + b.startDate.format("MMMM D, YYYY") + " to " + b.endDate.format("MMMM D, YYYY"))
        }), $("#reportrange_tb_technique").on("cancel.daterangepicker", function(a, b) {
          //console.log("cancel event fired")
        }), $("#options1").click(function() {
          $("#reportrange_tb_technique").data("daterangepicker").setOptions(b, a)
        }), $("#options2").click(function() {
          $("#reportrange_tb_technique").data("daterangepicker").setOptions(optionSet2, a)
        }), $("#destroy").click(function() {
          $("#reportrange_tb_technique").data("daterangepicker").remove()
        })
      }
    }

    setTimeout(function() {
      daterange_tb_technique(null, null)
    }, 100);







  });