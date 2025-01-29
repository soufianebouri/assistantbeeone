'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:AssolementParcelCulturaleCtrl
 * @description
 * # AssolementParcelCulturaleCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('AssolementParcelCulturaleCtrl', function($scope, translatedwords, $translatePartialLoader, $translate, $window,
    $compile,
    $uibModal,
    _url,
    DTOptionsBuilder,
    DTColumnBuilder, $http,
    DTDefaultOptions,
    $q,
    parcellecultural,
    domaine,
    cycle,
    VarieteService,
    portGreffe,
    parcelleCultural,
    ParcellePhysique,
    $cookies,
    $mdDialog,
    toastr, produitrendement, groupeculturaloperationnel, sousparcelle, profilcultural, generation, typeconduite, $filter
  ) {

    var pc = this;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.dtInstance = {};
    pc.parcel = {};
    pc.IDFerme = $cookies.getObject('globals').ferme.IDFerme;
    pc.NomFerme = $cookies.getObject('globals').ferme.NomFerme;

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        parcellecultural.getParcelleCulturalDetail(pc.IDFerme).then(result => {
          defer.resolve(result.data);
        });
        return defer.promise;
      })
      .withOption('createdRow', createdRow)
      .withDOM('<lf<t>ip>')
      .withPaginationType('simple_numbers')
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
        },
        {
          text: "<i class='fa fa-plus'></i>",
          key: '1',
          action: function(e, dt, node, config) {
            pc.Add();
          },
          className: 'pull-left',
          titleAttr: translatedwords.getTranslatedWord($translate("Ajouter"))
        },
        {
          text: "<i class='fa fa-qrcode'></i>",
          key: '1',
          action: function(e, dt, node, config) {
            NProgress.start();
            parcellecultural.generate_pdf_of_qrcode_byFarm({
              IDFerme: pc.IDFerme,
              farmName: pc.NomFerme
            }).then(result => {
              var blob = new Blob([result.data], {
                type: "application/pdf"
              });
              var objectUrl = URL.createObjectURL(blob);
              NProgress.done();
              window.open(objectUrl);
            });
          },
          className: 'pull-right',
          titleAttr: "QR codes PDF"
        }
        /*  ,
                  {
                    text: "<i class='fa fa-object-group'></i>",
                    key: '1',
                    action: function(e, dt, node, config) {
                      pc.isGroupeImportation = true;
                      $scope.showAdvanced();
                    },
                    className: 'pull-left',
                    titleAttr: 'Importation excel'
                  }*/
      ]);


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
        reader.onload = function() {
          var fileData = reader.result;
          var workbook = XLSX.read(fileData, {
            type: 'binary'
          });
          var excelJsonObj = "";
          if (workbook.SheetNames.length > 0) {
            var ob = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[workbook.SheetNames[0]]);


            // var res ;
            // if (pc.isGroupeImportation) {
            //   res = validateObjGroupe(ob);
            // }
            // else
            // res =  validateObj(ob);
            // if (!res.status) {
            //   toastr.clear();
            //   toastr.error("Veuillez vérifier les données de la ligne " + (res.index + 1), {
            //     closeButton: true
            //   });
            //   NProgress.done();
            // } else {
            //   var data = {
            //     farms: res.farms,
            //     creation: false
            //   };

            //   if (pc.isGroupeImportation) {
            //     data.groupe = res.groupe;
            //     data.QT=res.QT;
            //     productionRealisee.createPrdocutionRealiseegroup(data).then(e => {
            //     var values = "";
            //     var groupTemp={};
            //     angular.forEach(ob, (v, k) => {
            //       v.Ferme = e.data.farms.find(el => el.nom.toLowerCase() == v.Ferme.toLowerCase()).idfermes;
            //       groupTemp = e.data.group.find(el => el.groupName.toLowerCase() == v["Groupe"].toLowerCase());
            //       angular.forEach(groupTemp.parcel_group,(vv,k)=>
            //       {
            //         values += "(" + v.Ferme + "," + vv.idParcel + ",'" + moment(v.Date, 'MM/DD/YYYY').format('YYYY-MM-DD') + "'," + parseFloat((vv.sup*v.Quantite)/groupTemp.superficie_total).toFixed(2)  + "),";
            //       });
            //       groupTemp={};
            //    });
            //     values = values.slice(0, -1);
            //     var dataToInsert = {
            //       data: values,
            //       creation: true
            //     };
            //     productionRealisee.createPrdocutionRealisee(dataToInsert).then(e => {
            //       pc.dtInstance.reloadData();
            //       $mdDialog.hide();document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
            //       NProgress.done();
            //     });
            //     }).catch(e => {
            //       toastr.clear();
            //       toastr.error(((e.data.farm) ? "La ferme " : "Le groupe ") + e.data.data + " est introuvable", {
            //         closeButton: true
            //       });
            //       NProgress.done();
            //     });
            //   }else{
            //      data.parcel = res.parcel;
            //   productionRealisee.createPrdocutionRealisee(data).then(e => {
            //     var values = "";
            //     angular.forEach(ob, (v, k) => {
            //       v.Ferme = e.data.farms.find(el => el.nom.toLowerCase() == v.Ferme.toLowerCase()).idfermes;
            //       v['Parcelle culturale'] = e.data.parcel.find(el => el.ref.toLowerCase() == v["Parcelle culturale"].toLowerCase()).id;
            //       values += "(" + v.Ferme + "," + v['Parcelle culturale'] + ",'" + moment(v.Date, 'MM/DD/YYYY').format('YYYY-MM-DD') + "'," + v.Quantite + "),";
            //     });
            //     values = values.slice(0, -1);
            //     var dataToInsert = {
            //       data: values,
            //       creation: true
            //     };

            //     productionRealisee.createPrdocutionRealisee(dataToInsert).then(e => {
            //       pc.dtInstance.reloadData();
            //       $mdDialog.hide();document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
            //       NProgress.done();
            //     });
            //   }).catch(e => {
            //     toastr.clear();
            //     toastr.error("La " + ((e.data.prcl) ? " parcelle " : " ferme ") + e.data.data + " est introuvable", {
            //       closeButton: true
            //     });
            //     NProgress.done();
            //   });
            //   }

            // }

          }
        }

        reader.readAsBinaryString(input.files[0]);
      }
      $scope.Annuler = () => {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
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

    pc.dtColumns = [
      DTColumnBuilder.newColumn('Ferme').withTitle(translatedwords.getTranslatedWord($translate("Ferme"))).notVisible(),
      DTColumnBuilder.newColumn('Groupeoperationnel').withTitle(translatedwords.getTranslatedWord($translate("Groupe opérationnel"))).notVisible(),
      DTColumnBuilder.newColumn('Referenceparcellephysique').withTitle(translatedwords.getTranslatedWord($translate("Référence parcelle physique"))).notVisible(),
      DTColumnBuilder.newColumn('Parcellephysique').withTitle(translatedwords.getTranslatedWord($translate("Parcelle physique"))),
      DTColumnBuilder.newColumn('Reference').withTitle(translatedwords.getTranslatedWord($translate("Référence parcelle culturale"))),
      DTColumnBuilder.newColumn('Ref').withTitle(translatedwords.getTranslatedWord($translate("Parcelle culturale"))),
      DTColumnBuilder.newColumn('Sup').withTitle(translatedwords.getTranslatedWord($translate("Superficie"))).renderWith(function(data, type, full, meta) {
        if (full.Sup) {
          return '<p align="right">' + full.Sup.toFixed(2) + '</p>';
        } else {
          return '';
        }
      }),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Statut"))).renderWith(function(data, type, full, meta) {
        if (full.Statut_Cycle == 2) {
          return '<span class="badge-red_withe">Arrachée</span>';
        } else {
          return '<span class="badge-green_withe">En cours</span>';
        }
      }),
      DTColumnBuilder.newColumn('CultureName').withTitle(translatedwords.getTranslatedWord($translate("Culture"))),
      DTColumnBuilder.newColumn('Variete').withTitle(translatedwords.getTranslatedWord($translate("Variété"))),
      DTColumnBuilder.newColumn('Produit').withTitle(translatedwords.getTranslatedWord($translate("Produit"))).withClass('nowraptd'),
      DTColumnBuilder.newColumn('surgreffee').withTitle(translatedwords.getTranslatedWord($translate("Plantée/Surgreffée"))).renderWith(function(data, type, full, meta) {
        if (full.surgreffee) {
          return 'Oui';
        } else {
          return 'Non';
        }
      }).notVisible(),
      DTColumnBuilder.newColumn('Porte_greffe').withTitle(translatedwords.getTranslatedWord($translate("Porte-greffe"))),
      DTColumnBuilder.newColumn('Type_plant').withTitle(translatedwords.getTranslatedWord($translate("Mode de plantation"))).renderWith(function(data, type, full, meta) {
        if (full.Type_plant == 1) {
          return 'Plants';
        } else if (full.Type_plant == 2) {
          return 'Semence';
        } else {
          return '';
        }
      }).notVisible(),
      DTColumnBuilder.newColumn('Type_irrigation').withTitle(translatedwords.getTranslatedWord($translate("Zone"))).renderWith(function(data, type, full, meta) {
        if (full.Type_irrigation == 1) {
          return 'Irrigué';
        } else if (full.Type_irrigation == 2) {
          return 'Bour';
        } else if (full.Type_irrigation == 3) {
          return 'Commun';
        } else {
          return '';
        }
      }).notVisible(),
      DTColumnBuilder.newColumn('cycle').withTitle(translatedwords.getTranslatedWord($translate("Cycle cultural"))),
      DTColumnBuilder.newColumn('Dat_Plant').withTitle(translatedwords.getTranslatedWord($translate("Date de plantation"))).renderWith(function(data, type, full, meta) {
        if (full.Dat_Plant) {
          return moment(full.Dat_Plant).format('DD/MM/YYYY');
        } else {
          return '';
        }
      }),
      DTColumnBuilder.newColumn('Date_Previsionnelle').withTitle(translatedwords.getTranslatedWord($translate("Date de début travaux"))).renderWith(function(data, type, full, meta) {
        if (full.Date_Previsionnelle) {
          return moment(full.Date_Previsionnelle).format('DD/MM/YYYY');
        } else {
          return '';
        }
      }),
      DTColumnBuilder.newColumn('Dat_Arrach').withTitle(translatedwords.getTranslatedWord($translate("Date d'arrachage"))).renderWith(function(data, type, full, meta) {
        if (full.Dat_Arrach) {
          return moment(full.Dat_Arrach).format('DD/MM/YYYY');
        } else {
          return '';
        }
      }),
      DTColumnBuilder.newColumn('Date_debut_prouduction').withTitle(translatedwords.getTranslatedWord($translate("Date d'entrée en production"))).renderWith(function(data, type, full, meta) {
        if (full.Date_debut_prouduction) {
          return moment(full.Date_debut_prouduction).format('DD/MM/YYYY');
        } else {
          return '';
        }
      }).notVisible(),
      DTColumnBuilder.newColumn('Date_pleine_production').withTitle(translatedwords.getTranslatedWord($translate("Date de pleine production"))).renderWith(function(data, type, full, meta) {
        if (full.Date_pleine_production) {
          return moment(full.Date_pleine_production).format('DD/MM/YYYY');
        } else {
          return '';
        }
      }).notVisible(),
      DTColumnBuilder.newColumn('Date_prevu_recolte').withTitle(translatedwords.getTranslatedWord($translate("Date prévue de récolte"))).renderWith(function(data, type, full, meta) {
        if (full.Date_prevu_recolte) {
          return moment(full.Date_prevu_recolte).format('DD/MM/YYYY');
        } else {
          return '';
        }
      }).notVisible(),
      DTColumnBuilder.newColumn('Nbre_plant').withTitle(translatedwords.getTranslatedWord($translate("Nombre de plants"))).renderWith(function(data, type, full, meta) {
        if (full.Nbre_plant)
          return full.Nbre_plant;
        return '';
      }),
      DTColumnBuilder.newColumn('Densite').withTitle(translatedwords.getTranslatedWord($translate("Densité / ha"))).renderWith(function(data, type, full, meta) {
        if (full.Densite)
          return full.Densite.toFixed(2);
        return '';
      }),
      DTColumnBuilder.newColumn('Ecartement').withTitle(translatedwords.getTranslatedWord($translate("Ecartement"))).renderWith(function(data, type, full, meta) {
        if (full.Ecartement)
          return full.Ecartement;
        return '';
      }).notVisible(),
      DTColumnBuilder.newColumn('LatPosition').withTitle(translatedwords.getTranslatedWord($translate("Latitude"))).renderWith(function(data, type, full, meta) {
        if (full.LatPosition && full.LatPosition != 0) {
          return full.LatPosition;
        } else {
          return '';
        }
      }).notVisible(),
      DTColumnBuilder.newColumn('LngPosition').withTitle(translatedwords.getTranslatedWord($translate("Longitude"))).renderWith(function(data, type, full, meta) {
        if (full.LngPosition && full.LngPosition != 0) {
          return full.LngPosition;
        } else {
          return '';
        }
      }).notVisible(),
      DTColumnBuilder.newColumn('SuperficieTracer').withTitle(translatedwords.getTranslatedWord($translate("Superficie tracée"))).renderWith(function(data, type, full, meta) {
        if (full.SuperficieTracer) {
          return '<p align="right">' + full.SuperficieTracer.toFixed(2) + '</p>';
        } else {
          return '';
        }
      }).notVisible(),
      DTColumnBuilder.newColumn('CouleurCalque').withTitle(translatedwords.getTranslatedWord($translate("Couleur"))).renderWith(function(data, type, full, meta) {
        if (full.CouleurCalque) {
          return '<h1 style="background: ' + full.CouleurCalque + ';width: 50%;height: 10px;border-style:solid;border-color: ' + full.CouleurCadre + ';">';
        } else {
          return '';
        }
      }),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).withClass('nowraptd all').notSortable().renderWith(actionsHtml)
    ];
    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    //add
    pc.Add = function() {
      $q.all([ParcellePhysique.getParcellePhysique(_url, {
          IDFermes: pc.IDFerme
        }),
        VarieteService.getNameIdVariete(_url, {}),
        portGreffe.getPortGreffe(),
        domaine.DomaineByID({
          "IDFermes": pc.IDFerme
        }),
        groupeculturaloperationnel.byvariete({
          "IDFermes": pc.IDFerme
        }),
        typeconduite.getall()
      ]).then((values) => {
        NProgress.done();
        $scope.ParcellePhysiques = values[0].data;
        $scope.Varietes = values[1].data;
        $scope.portGreffes = values[2].data;
        $scope.fermes = values[3].data;
        $scope.groupeculturals = values[4].data;
        $scope.typeconduites = values[5].data;
        $scope.showAdvancedAdd("ev", $scope.ParcellePhysiques, $scope.Varietes, $scope.portGreffes, $scope.fermes, $scope.groupeculturals, $scope.typeconduites);
      })

    }

    $scope.showAdvancedAdd = function(ev, ParcellePhysiques, Varietes, portGreffes, fermes, groupeculturals, typeconduites) {
      $mdDialog.show({
          controller: DialogControllerAdd,
          templateUrl: '././views/templates/parcelleculturalle/AddParcelleCulturale.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            ParcellePhysiques: ParcellePhysiques,
            Varietes: Varietes,
            portGreffes: portGreffes,
            fermes: fermes,
            groupeculturals: groupeculturals,
            typeconduites: typeconduites
          }
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    function DialogControllerAdd($scope, $mdDialog, ParcellePhysiques, Varietes, portGreffes, fermes, groupeculturals, typeconduites) {
      $scope.ParcellePhysiques = ParcellePhysiques;
      $scope.Varietes = Varietes;
      $scope.portGreffes = portGreffes;
      $scope.fermes = fermes;
      $scope.groupeculturals = groupeculturals;
      $scope.typeconduites = typeconduites;
      $scope.suptracertracer = 0;
      $scope.Latitude = 0;
      $scope.Longitude = 0;
      $scope.Calque = "#FFFFFF";
      $scope.Cadre = "#FFFFFF";
      $scope.isTraced = false;
      $scope.save_rawClick = false;
      $scope.Statut = 1;
      $scope.surgreffee = true;
      $scope.type1 = 1;
      $scope.type2 = 1;
      $scope.antigel = 1;
      $scope.antigrele = 2;
      $scope.progress = false;
      setTimeout(function() {
        jscolor.installByClassName("jscolor");
      }, 1000);

      $scope.checkarrachage = function(statut, date) {
        if (statut == 2) {
          if (date) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      }

      $scope.checkdateproduction = function(date1, date2) {
        if (date1 && date2) {
          return true;
        } else if ((date1 && !date2) || (!date1 && date2)) {
          return false;
        } else {
          return true;
        }
      }

      $scope.getSuperficieDesParcelleCulturale = function() {
        $scope.sousparcelle = undefined;
        $scope.suptotal = undefined;
        $scope.sousparcelleID = [];
        $scope.totalsupsousparcelle = 0;

        $q.all([parcellecultural.getsumsupbyid({
          ID: $scope.physique.ID
        }), sousparcelle.byparcellephysique({
          IDPrcellePhysique: $scope.physique.ID
        })]).then((values) => {
          NProgress.done();
          $scope.suptotal = values[0].data[0].suptotal;
          $scope.sousparcelles = values[1].data;
        })
      }

      $scope.checkvalidatedata = async function() {
        $scope.youcan = true;

        // control  Sup  de Parcelle cultural avec sup de  physique
        if (($scope.suptotal + $scope.Superficie) > $scope.physique.Sup) {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez corriger la superficie : La superficie des parcelles culturales dépasse celle de la parcelle physique !")), {
            closeButton: true
          });
          $scope.youcan = false;
        }
        // control date arrachage
        if (moment($scope.dateplantation).isSameOrAfter(moment($scope.datearrachage)) && $scope.Statut == 2) {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("La date d'arrachage doit être supérieure à la date de plantation !")), {
            closeButton: true
          });
          $scope.youcan = false;
        }

        // control date debut prouduction
        if (moment($scope.dateentreeproduction).isSameOrAfter(moment($scope.datearrachage)) && $scope.Statut == 2 && $scope.dateentreeproduction) {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("La date d'arrachage  doit être supérieure à la date d'entrée en production !")), {
            closeButton: true
          });
          $scope.youcan = false;
        }

        if (moment($scope.dateplantation).isSameOrAfter(moment($scope.dateentreeproduction)) && $scope.dateentreeproduction) {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("La date d'entrée en production doit être supérieure à la date de plantation !")), {
            closeButton: true
          });
          $scope.youcan = false;
        }


        /*if (moment($scope.dateplantation).isSameOrAfter(moment($scope.datepleineproduction)) && $scope.datepleineproduction) {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("La date de pleine en production doit être supérieure à la date de plantation !")), {
            closeButton: true
          });
          $scope.youcan = false;
        }*/

        /*if (moment($scope.dateentreeproduction).isSameOrAfter(moment($scope.datepleineproduction)) && $scope.dateentreeproduction && $scope.datepleineproduction) {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("La date de pleine en pliene production doit être supérieure à la date d'entrée en production !")), {
            closeButton: true
          });
          $scope.youcan = false;
        }*/

        // control  Sup  de Parcelle cultural avec sup de  physique
        if ($scope.Superficie > $scope.totalsupsousparcelle && $scope.sousparcelleID.length > 0) {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez corriger la superficie : La superficie des parcelles culturales dépasse celle de la sous parcelle !")), {
            closeButton: true
          });
          $scope.youcan = false;
        }
        return $scope.youcan;
      }

      $scope.variete_change = function() {
        if ($scope.variete.ID && $scope.variete.culture && $scope.variete.filier) {
          $scope.produit = undefined;
          $scope.profilculture = undefined;
          $scope.generation = undefined;
          $scope.Cycle = undefined;
          $q.all([produitrendement.byvariete({
            VARIETE: $scope.variete.ID
          }), profilcultural.byvariete({
            VARIETE: $scope.variete.ID
          }), generation.byculture({
            IDCulture: $scope.variete.culture
          }), cycle.getbytype({
            TYPECYCLE: $scope.variete.filier,
            FERME: pc.IDFerme,
          })]).then((values) => {
            NProgress.done();
            $scope.produits = values[0].data;
            $scope.profilcultures = values[1].data;
            $scope.generations = values[2].data;
            $scope.cycles = values[3].data;
          })
        }
      }

      $scope.sousparcelle_change = function() {
        $scope.sousparcelleID = [];
        $scope.totalsupsousparcelle = 0;
        for (var i = 0; i < $scope.sousparcelle.length; i++) {
          $scope.sousparcelleID.push($scope.sousparcelle[i].ID);
          if ($scope.sousparcelle[i].Sup) {
            $scope.totalsupsousparcelle += $scope.sousparcelle[i].Sup;
          }
        }
      }

      $scope.Ajouter = async function() {
        toastr.clear();
        if ($scope.Reference && $scope.physique && $scope.variete && $scope.datedebuttravaux && $scope.dateplantation && $scope.checkarrachage($scope.Statut, $scope.datearrachage) && $scope.Superficie && $scope.Superficie > 0 && $scope.nbrplant && $scope.nbrplant > 0 && $scope.densite && $scope.densite > 0) {
          if ($scope.checkvalidatedata()) {
            if ($scope.Statut == 1) {
              $scope.datearrachage = undefined;
            }
            if ($scope.isTraced) {
              pc.objAdd = {
                "IDFermes": pc.IDFerme,
                "physique": $scope.physique.ID,
                "Superficie": $scope.Superficie,
                "dateplantation": moment($scope.dateplantation).format('YYYYMMDD'),
                "datearrachage": $scope.datearrachage,
                "portegreff": $scope.portegreff,
                "variete": $scope.variete.ID,
                "Cycle": $scope.Cycle,
                "suptracertracer": document.getElementById('areaHa').value,
                "Latitude": document.getElementById('t1').value,
                "Longitude": document.getElementById('t2').value,
                "Calque": document.getElementById('Calque').value,
                "Cadre": document.getElementById('Cadre').value,
                "tokenpolygone": document.getElementById('data').value,
                "Statut_Cycle": $scope.Statut,
                "dateentreeproduction": $scope.dateentreeproduction,
                "datepleineproduction": $scope.datepleineproduction,
                "parcelleculturale": $scope.Reference + ' ' + $scope.variete.Variete,
                "Reference": $scope.Reference,
                "produit": $scope.produit,
                "datedebuttravaux": moment($scope.datedebuttravaux).format('YYYYMMDD'),
                "nbrplant": $scope.nbrplant,
                "densite": $scope.densite,
                "ecartement": $scope.ecartement,
                "nbrplanttheorique": $scope.nbrplanttheorique,
                "nbrplantmanquants": $scope.nbrplantmanquants,
                "groupe": $scope.groupe,
                "sousparcelle": ($scope.sousparcelleID.length > 0) ? $scope.sousparcelleID : null,
                "dateprevuderecolte": $scope.dateprevuderecolte,
                "datefinderecolte": $scope.datefinderecolte,
                "profilculture": $scope.profilculture,
                "surgreffee": ($scope.surgreffee) ? 1 : 0,
                "generation": $scope.generation,
                "typedeconduite": $scope.typedeconduite,
                "type1": $scope.type1,
                "type2": $scope.type2,
                "antigel": $scope.antigel,
                "antigrele": $scope.antigrele,
                "couverrealisee": $scope.couverrealisee,
                "observation": $filter('textforsqlserver')($scope.observation)
              }
            } else {
              pc.objAdd = {
                "IDFermes": pc.IDFerme,
                "physique": $scope.physique.ID,
                "Superficie": $scope.Superficie,
                "dateplantation": moment($scope.dateplantation).format('YYYYMMDD'),
                "datearrachage": $scope.datearrachage,
                "portegreff": $scope.portegreff,
                "variete": $scope.variete.ID,
                "Cycle": $scope.Cycle,
                "suptracertracer": document.getElementById('areaHa').value,
                "Latitude": document.getElementById('t1').value,
                "Longitude": document.getElementById('t1').value,
                "Calque": document.getElementById('Calque').value,
                "Cadre": document.getElementById('Cadre').value,
                "tokenpolygone": "",
                "Statut_Cycle": $scope.Statut,
                "dateentreeproduction": $scope.dateentreeproduction,
                "datepleineproduction": $scope.datepleineproduction,
                "parcelleculturale": $scope.Reference + ' ' + $scope.variete.Variete,
                "Reference": $scope.Reference,
                "produit": $scope.produit,
                "datedebuttravaux": moment($scope.datedebuttravaux).format('YYYYMMDD'),
                "nbrplant": $scope.nbrplant,
                "densite": $scope.densite,
                "ecartement": $scope.ecartement,
                "nbrplanttheorique": $scope.nbrplanttheorique,
                "nbrplantmanquants": $scope.nbrplantmanquants,
                "groupe": $scope.groupe,
                "sousparcelle": ($scope.sousparcelleID.length > 0) ? $scope.sousparcelleID : null,
                "dateprevuderecolte": $scope.dateprevuderecolte,
                "datefinderecolte": $scope.datefinderecolte,
                "profilculture": $scope.profilculture,
                "surgreffee": ($scope.surgreffee) ? 1 : 0,
                "generation": $scope.generation,
                "typedeconduite": $scope.typedeconduite,
                "type1": $scope.type1,
                "type2": $scope.type2,
                "antigel": $scope.antigel,
                "antigrele": $scope.antigrele,
                "couverrealisee": $scope.couverrealisee,
                "observation": $filter('textforsqlserver')($scope.observation)
              }
            }
            if ($scope.save_rawClick) {
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("Veullez enregistrer les points de polygone!")), {
                closeButton: true
              });
            } else {
              $scope.progress = true;
              parcellecultural.createParcellesCulturale(pc.objAdd).then(async e => {
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
                  toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + e.data[0].description, {
                    closeButton: true
                  });
                  NProgress.done();
                }
              }).catch(async e => {
                $scope.progress = false;
                toastr.clear();
                toastr.error(e.data, {
                  closeButton: true
                });
              });
            }
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
      };



      var IO = {
        //returns array with storable google.maps.Overlay-definitions
        IN: function(arr, //array with google.maps.Overlays
          encoded //boolean indicating whether pathes should be stored encoded
        ) {
          var shapes = [],
            goo = google.maps,
            shape, tmp;
          if (arr) {
            for (var i = 0; i < arr.length; i++) {
              shape = arr[i];
              tmp = {
                type: this.t_(shape.type),
                id: shape.id || i + 1
              };


              switch (tmp.type) {
                case 'CIRCLE':
                  tmp.radius = shape.getRadius();
                  tmp.geometry = this.p_(shape.getCenter());
                  break;
                case 'MARKER':
                  tmp.geometry = this.p_(shape.getPosition());
                  break;
                case 'RECTANGLE':
                  tmp.geometry = this.b_(shape.getBounds());
                  break;
                case 'POLYLINE':
                  tmp.geometry = this.l_(shape.getPath(), encoded);
                  break;
                case 'POLYGON':
                  tmp.geometry = this.m_(shape.getPaths(), encoded);

                  break;
              }
              shapes.push(tmp);
            }
          }
          return shapes;
        },
        //returns array with google.maps.Overlays
        OUT: function(arr, //array containg the stored shape-definitions
          map, cadre, calque //map where to draw the shapes
        ) {
          var shapes = [],
            goo = google.maps,
            map = map || null,
            shape, tmp;
          if (arr) {
            for (var i = 0; i < arr.length; i++) {
              shape = arr[i];

              switch (shape.type) {
                case 'CIRCLE':
                  tmp = new goo.Circle({
                    radius: Number(shape.radius),
                    center: this.pp_.apply(this, shape.geometry),
                    strokeColor: calque,
                    strokeOpacity: 1,
                    strokeWeight: 1,
                    fillColor: cadre,
                    fillOpacity: 0.50
                  });
                  break;
                case 'MARKER':
                  tmp = new goo.Marker({
                    position: this.pp_.apply(this, shape.geometry),
                    strokeColor: calque,
                    strokeOpacity: 1,
                    strokeWeight: 1,
                    fillColor: cadre,
                    fillOpacity: 0.50
                  });
                  break;
                case 'RECTANGLE':
                  tmp = new goo.Rectangle({
                    bounds: this.bb_.apply(this, shape.geometry),
                    strokeColor: calque,
                    strokeOpacity: 1,
                    strokeWeight: 1,
                    fillColor: cadre,
                    fillOpacity: 0.50
                  });
                  break;
                case 'POLYLINE':
                  tmp = new goo.Polyline({
                    path: this.ll_(shape.geometry),
                    strokeColor: calque,
                    strokeOpacity: 1,
                    strokeWeight: 1,
                    fillColor: cadre,
                    fillOpacity: 0.50
                  });
                  break;
                case 'POLYGON':
                  tmp = new goo.Polygon({
                    paths: this.mm_(shape.geometry),
                    strokeColor: calque,
                    strokeOpacity: 1,
                    strokeWeight: 1,
                    fillColor: cadre,
                    fillOpacity: 0.50
                  });
                  break;
              }
              tmp.setValues({
                map: map,
                id: shape.id
              })
              shapes.push(tmp);
            }
          }
          return shapes;
        },
        l_: function(path, e) {
          path = (path.getArray) ? path.getArray() : path;
          if (e) {
            return google.maps.geometry.encoding.encodePath(path);
          } else {
            var r = [];
            for (var i = 0; i < path.length; ++i) {
              r.push(this.p_(path[i]));
            }
            return r;
          }
        },
        ll_: function(path) {
          if (typeof path === 'string') {
            return google.maps.geometry.encoding.decodePath(path);
          } else {
            var r = [];
            for (var i = 0; i < path.length; ++i) {
              r.push(this.pp_.apply(this, path[i]));
            }
            return r;
          }
        },

        m_: function(paths, e) {
          var r = [];
          paths = (paths.getArray) ? paths.getArray() : paths;
          for (var i = 0; i < paths.length; ++i) {
            r.push(this.l_(paths[i], e));
          }
          return r;
        },
        mm_: function(paths) {
          var r = [];
          for (var i = 0; i < paths.length; ++i) {
            r.push(this.ll_.call(this, paths[i]));

          }
          return r;
        },
        p_: function(latLng) {
          return ([latLng.lat(), latLng.lng()]);
        },
        pp_: function(lat, lng) {
          return new google.maps.LatLng(lat, lng);
        },
        b_: function(bounds) {
          return ([this.p_(bounds.getSouthWest()),
            this.p_(bounds.getNorthEast())
          ]);
        },
        bb_: function(sw, ne) {
          return new google.maps.LatLngBounds(this.pp_.apply(this, sw),
            this.pp_.apply(this, ne));
        },
        t_: function(s) {
          var t = ['CIRCLE', 'MARKER', 'RECTANGLE', 'POLYLINE', 'POLYGON'];
          for (var i = 0; i < t.length; ++i) {
            if (s === google.maps.drawing.OverlayType[t[i]]) {
              return t[i];
            }
          }
        }
      }

      var infoWindow = new google.maps.InfoWindow();

      var map;
      var selected_shape;
      var clearvar;
      var shapes = [];
      var drawman;
      var byId;
      var clearSelection;
      var setSelection;
      var clearShapes;

      function initMap() {
        if (!$scope.fermes[0].Latitude || !$scope.fermes[0].Longitude || $scope.fermes[0].Latitude == 0 || $scope.fermes[0].Longitude == 0 || $scope.fermes[0].Latitude == "" || $scope.fermes[0].Longitude == "") {
          var latF = 33.9691409;
          var longF = -6.9273709;
          var zoooom = 4;
        } else {
          var latF = $scope.fermes[0].Latitude;
          var longF = $scope.fermes[0].Longitude;
          var zoooom = 16;
        }
        map = new google.maps.Map(document.getElementById("parcelleculturalemap"), {
            center: new google.maps.LatLng(latF, longF),
            zoom: zoooom,
            mapTypeControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          }),
          selected_shape = null,
          drawman = new google.maps.drawing.DrawingManager({
            map: map,
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
            drawingControlOptions: {
              drawingModes: [
                google.maps.drawing.OverlayType.POLYGON
              ]
            },
            polygonOptions: {
              editable: false
            }
          }),
          byId = function(s) {
            return document.getElementById(s)
          },
          clearSelection = function() {
            if (selected_shape) {
              selected_shape.set((selected_shape.type ===
                google.maps.drawing.OverlayType.MARKER
              ) ? 'draggable' : 'editable', false);
              selected_shape = null;
            }
          },
          setSelection = function(shape) {
            $scope.save_rawClick = true;
            clearSelection();
            selected_shape = shape;

            selected_shape.set((selected_shape.type ===
              google.maps.drawing.OverlayType.MARKER
            ) ? 'draggable' : 'editable', true);


            byId('save_raw').disabled = false;

            var coordinatesArray = shape.getPath().getArray();
            var minX = coordinatesArray[0].lat();
            var maxX = coordinatesArray[0].lat();
            var minY = coordinatesArray[0].lng();
            var maxY = coordinatesArray[0].lng();
            for (var i = 0; i < coordinatesArray.length; i++) {

              minX = (coordinatesArray[i].lat() < minX || minX === null) ? coordinatesArray[i].lat() : minX;
              maxX = (coordinatesArray[i].lat() > maxX || maxX === null) ? coordinatesArray[i].lat() : maxX;
              minY = (coordinatesArray[i].lng() < minY || minY === null) ? coordinatesArray[i].lng() : minY;
              maxY = (coordinatesArray[i].lng() > maxY || maxY === null) ? coordinatesArray[i].lng() : maxY;
            }

            document.getElementById('t1').value = (minX + maxX) / 2;
            document.getElementById('t2').value = (minY + maxY) / 2;

            var negativeSpace = new google.maps.Polygon({
              path: shape.getPath().getArray(),
              strokeWeight: 0,
              strokeOpacity: 0,
              fillOpacity: 0,
              clickable: false,
              map: map
            });

          },
          clearShapes = function() {
            drawman.setOptions({
              drawingControl: true
            });
            $scope.save_rawClick = false;
            $scope.isTraced = false;
            document.getElementById("data").value = "";
            selected_shape = "";
            for (var i = 0; i < shapes.length; ++i) {
              shapes[i].setMap(null);
            }
            shapes = [];
            document.getElementById("areaHa").value = 0;
            byId('save_raw').disabled = true;

            document.getElementById('t1').value = '0';
            document.getElementById('t2').value = '0';


            clearvar = false;

            var mysnackbar = document.getElementById("snackbar");
            document.getElementById("snackbar").innerHTML = "Effacement réussite";
            mysnackbar.className = "show";
            setTimeout(function() {
              mysnackbar.className = mysnackbar.className.replace("show", "");
            }, 3000);

            effacerFermes();
          };


        if ($scope.fermes[0].Polygone_Ferme !== "" && pc.IsJsonString($scope.fermes[0].Polygone_Ferme)) {
          IO.OUT(JSON.parse($scope.fermes[0].Polygone_Ferme), map, "#c4bf7d", "#8eb2a0");
        } else {
          IO.OUT(JSON.parse('[{"type": "POLYGON","id": null,"geometry": [[]]}]'), map, "#c4bf7d", "#8eb2a0");
        }

        var infoWindow = new google.maps.InfoWindow();


        var input = document.getElementById('searchTextField');

        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);

        var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
          map: map,
          anchorPoint: new google.maps.Point(0, -29)
        });

        autocomplete.addListener('place_changed', function() {
          infowindow.close();
          marker.setVisible(false);
          var place = autocomplete.getPlace();
          if (!place.geometry) {
            //window.alert("Autocomplete's returned place contains no geometry");
            return;
          }

          // If the place has a geometry, then present it on a map.
          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(9);
          }

        });


        var markerCenter = new google.maps.Marker({
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 0
          },
          position: map.getCenter(),
          map: map
        });

        google.maps.event.addListener(map, 'zoom_changed', function() {
          var NewMapCenter = map.getCenter();
          var latitude = NewMapCenter.lat();
          var longitude = NewMapCenter.lng();
          markerCenter.setPosition(map.getCenter());
          var latLng = markerCenter.getPosition();
        });

        google.maps.event.addListener(markerCenter, 'drag', function() {
          var latLng = markerCenter.getPosition();
        });

        google.maps.event.addListener(map, 'click', function(event) {

        });
        google.maps.event.addListener(drawman, 'overlaycomplete', function(e) {
          drawman.setOptions({
            drawingControl: false
          });
          drawman.setDrawingMode(null);
          var shape = e.overlay;
          shape.type = e.type;
          google.maps.event.addListener(shape, 'click', function() {
            setSelection(this);
          });
          setSelection(shape);
          shapes.push(shape);

          marker = shape;


        });

        google.maps.event.addListener(map, 'click', clearSelection);
        google.maps.event.addDomListener(byId('clear_shapes'), 'click', clearShapes);

        google.maps.event.addDomListener(byId('save_raw'), 'click', function() {
          $scope.isTraced = true;
          $scope.save_rawClick = false;
          var data = IO.IN(shapes, false);
          byId('data').value = JSON.stringify(data);
          var json = JSON.stringify(data, undefined, 4);



          //var area = google.maps.geometry.spherical.computeArea(selected_shape.getPath());
          var area = 0;
          for (var i = 0; i < shapes.length; ++i) {
            area += google.maps.geometry.spherical.computeArea(shapes[i].getPath());
          }
          //document.getElementById("area").value = area.toFixed(2);
          document.getElementById("areaHa").value = (area / 10000).toFixed(2);
          clearvar = true;

          //                    var coordinatesArray1 = selected_shape.getPath().getArray();
          //                    alert(coordinatesArray1);


        });
        //         downloadUrl("markers.xml", function (data) {

        // var xml = data.responseXML;

        // });

        /*  google.maps.event.addListener(map, 'zoom_changed', function() {
         var zoomm = map.getZoom();
         markermine.setVisible(zoomm <= 15);
         //markerview.setVisible(zommm === 15);
         });*/


        if (map.getZoom() <= 14) {
          //document.getElementById("hotelCheckbox").checked = true;
          // toggleGroup('numbred1');


          var mapStyles = [{
            featureType: "administrative.country",
            stylers: [{
              visibility: "off"
            }]
          }];
          var mapType = new google.maps.StyledMapType(mapStyles, {
            name: "Maroc"
          });
          //map = new google.maps.Map(document.getElementById("map"), mapOptions);
          map.mapTypes.set('maroc', mapType);
          map.setMapTypeId('maroc');
        }

        if (map.getZoom() >= 8) {
          //alert("d");
          map.setMapTypeId(google.maps.MapTypeId.HYBRID);
        }
        //restaurantes
        new google.maps.event.addListener(map, 'zoom_changed', function() {
          var zoomm = map.getZoom();









          if (zoomm >= 8) {
            //alert("d");
            map.setMapTypeId(google.maps.MapTypeId.HYBRID);


          } else {
            var mapStyles = [{
              featureType: "administrative.country",
              stylers: [{
                visibility: "off"
              }]
            }];
            var mapType = new google.maps.StyledMapType(mapStyles, {
              name: "Maroc"
            });
            //map = new google.maps.Map(document.getElementById("map"), mapOptions);
            map.mapTypes.set('maroc', mapType);
            map.setMapTypeId('maroc');
          }
        });


        var centerControlDiv = document.createElement('div');
        var centerControl = new CenterControl(centerControlDiv, map);

        centerControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(centerControlDiv);


      }

      setTimeout(function() {
        initMap();
      }, 1000);




      google.maps.Polygon.prototype.my_getBounds = function() {
        var bounds = new google.maps.LatLngBounds()
        this.getPath().forEach(function(element, index) {
          bounds.extend(element);
        })
        return bounds;
      }


      function syntaxHighlight(json) {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
          var cls = 'number';
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = 'key';
            } else {
              cls = 'string';
            }
          } else if (/true|false/.test(match)) {
            cls = 'boolean';
          } else if (/null/.test(match)) {
            cls = 'null';
          }
          return '<span class="' + cls + '">' + match + '</span>';
        });
      }



      function decodeLevelss(encodedLevelsString) {
        var decodedLevels = [];

        for (var i = 0; i < encodedLevelsString.length; ++i) {
          var level = encodedLevelsString.charCodeAt(i) - 63;
          decodedLevels.push(level);
        }
        return decodedLevels;
      }









      function bindInfoWindow(marker, map, infoWindow, html) {
        google.maps.event.addListener(marker, 'click', function() {
          infoWindow.setContent(html);
          infoWindow.open(map, marker);

        });
      }

      function downloadUrl(url, callback) {
        var request = window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();

        request.onreadystatechange = function() {
          if (request.readyState === 4) {
            request.onreadystatechange = doNothing;
            callback(request, request.status);
          }
        };

        request.open('GET', url, true);
        request.send(null);
      }

      function doNothing() {}




      function xmlParse(str) {
        if (typeof ActiveXObject != 'undefined' && typeof GetObject != 'undefined') {
          var doc = new ActiveXObject('Microsoft.XMLDOM');
          doc.loadXML(str);
          return doc;
        }

        if (typeof DOMParser != 'undefined') {
          return (new DOMParser()).parseFromString(str, 'text/xml');
        }

        return createElement('div', null);
      }

      function CenterControl(controlDiv, map) {

      }


      function showRegionByPays(str) {
        if (str === "") {
          document.getElementById("idRegionnn").innerHTML = "";
          return;
        }
        if (window.XMLHttpRequest) {
          // code for IE7+, Firefox, Chrome, Opera, Safari
          xmlhttp = new XMLHttpRequest();
        } else { // code for IE6, IE5
          xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.open("GET", "ParamerageListeRegionByPays.jsp?q=" + str, true);
        xmlhttp.send();

        xmlhttp.onreadystatechange = function() {
          if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            document.getElementById("idRegionnn").innerHTML = xmlhttp.responseText;
          }
        }

      }


    }

    //edit
    pc.edit = function(dataparcelle) {
      $q.all([ParcellePhysique.getParcellePhysique(_url, {
          IDFermes: pc.IDFerme
        }),
        VarieteService.getNameIdVariete(_url, {}),
        portGreffe.getPortGreffe(),
        domaine.DomaineByID({
          "IDFermes": pc.IDFerme
        }),
        groupeculturaloperationnel.byvariete({
          "IDFermes": pc.IDFerme
        }),
        typeconduite.getall(),
        produitrendement.byvariete({
          VARIETE: dataparcelle.id_variete
        }), profilcultural.byvariete({
          VARIETE: dataparcelle.id_variete
        }), generation.byculture({
          IDCulture: dataparcelle.Culture
        }), cycle.getbytype({
          TYPECYCLE: dataparcelle.filier,
          FERME: pc.IDFerme
        }), sousparcelle.byparcellephysique({
          IDPrcellePhysique: dataparcelle.id_parcelle
        }), parcellecultural.getsumsupbyid({
          ID: dataparcelle.id_parcelle,
          IDParcelleCulturale: dataparcelle.id
        })
      ]).then((values) => {
        NProgress.done();
        $scope.ParcellePhysiques = values[0].data;
        $scope.Varietes = values[1].data;
        $scope.portGreffes = values[2].data;
        $scope.fermes = values[3].data;
        $scope.groupeculturals = values[4].data;
        $scope.typeconduites = values[5].data;
        $scope.produits = values[6].data;
        $scope.profilcultures = values[7].data;
        $scope.generations = values[8].data;
        $scope.cycles = values[9].data;
        $scope.sousparcelles = values[10].data;
        $scope.suptotal = values[11].data[0].suptotal;
        $scope.showAdvancedEdit("ev", $scope.ParcellePhysiques, $scope.Varietes, $scope.portGreffes, $scope.fermes, $scope.groupeculturals, $scope.typeconduites, $scope.produits, $scope.profilcultures, $scope.generations, $scope.cycles, $scope.sousparcelles, $scope.suptotal, dataparcelle);
      })
    }


    $scope.showAdvancedEdit = function(ev, ParcellePhysiques, Varietes, portGreffes, fermes, groupeculturals, typeconduites, produits, profilcultures, generations, cycles, sousparcelles, suptotal, dataparcelle) {
      $mdDialog.show({
          controller: DialogControllerEdit,
          templateUrl: '././views/templates/parcelleculturalle/EditParcelleCulturale.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            ParcellePhysiques: ParcellePhysiques,
            Varietes: Varietes,
            portGreffes: portGreffes,
            fermes: fermes,
            groupeculturals: groupeculturals,
            typeconduites: typeconduites,
            produits: produits,
            profilcultures: profilcultures,
            generations: generations,
            cycles: cycles,
            sousparcelles: sousparcelles,
            suptotal: suptotal,
            dataparcelle: dataparcelle
          }
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    function DialogControllerEdit($scope, $mdDialog, ParcellePhysiques, Varietes, portGreffes, fermes, groupeculturals, typeconduites, produits, profilcultures, generations, cycles, sousparcelles, suptotal, dataparcelle) {
      $scope.data = dataparcelle;
      $scope.data.Ref = $scope.data.Ref;
      $scope.Dat_Plant = ($scope.data.Dat_Plant) ? new Date(moment($scope.data.Dat_Plant).format("YYYY-MM-DD")) : null;
      $scope.dateentreeproduction = ($scope.data.Date_debut_prouduction) ? new Date(moment($scope.data.Date_debut_prouduction).format("YYYY-MM-DD")) : null;
      $scope.datepleineproduction = ($scope.data.Date_pleine_production) ? new Date(moment($scope.data.Date_pleine_production).format("YYYY-MM-DD")) : null;
      $scope.datedebuttravaux = ($scope.data.Date_Previsionnelle) ? new Date(moment($scope.data.Date_Previsionnelle).format("YYYY-MM-DD")) : null;
      $scope.dateprevuderecolte = ($scope.data.Date_prevu_recolte) ? new Date(moment($scope.data.Date_prevu_recolte).format("YYYY-MM-DD")) : null;
      $scope.datefinderecolte = ($scope.data.Date_fin_recolte) ? new Date(moment($scope.data.Date_fin_recolte).format("YYYY-MM-DD")) : null;
      $scope.Dat_Arrach = ($scope.data.Dat_Arrach) ? new Date(moment($scope.data.Dat_Arrach).format("YYYY-MM-DD")) : null;
      $scope.suptracertracer = ($scope.data.SuperficieTracer) ? $scope.data.SuperficieTracer : 0;
      $scope.Latitude = ($scope.data.LatPosition) ? $scope.data.LatPosition : 0;
      $scope.Longitude = ($scope.data.LngPosition) ? $scope.data.LngPosition : 0;
      $scope.Calque = ($scope.data.CouleurCalque) ? $scope.data.CouleurCalque : "#FFFFFF";
      $scope.Cadre = ($scope.data.CouleurCadre) ? $scope.data.CouleurCadre : "#FFFFFF";
      $scope.Statut = ($scope.data.Statut_Cycle == 2) ? 2 : 1;
      $scope.surgreffee = ($scope.data.surgreffee) ? $scope.data.surgreffee : false;
      $scope.type1 = ($scope.data.Type_plant) ? $scope.data.Type_plant : 1;
      $scope.type2 = ($scope.data.Type_irrigation) ? $scope.data.Type_irrigation : 1;
      $scope.antigel = ($scope.data.Anti_Gel) ? $scope.data.Anti_Gel : 1;
      $scope.antigrele = ($scope.data.Anti_grele) ? $scope.data.Anti_grele : 2;
      $scope.progress = false;


      $scope.ParcellePhysiques = ParcellePhysiques;
      $scope.Varietes = Varietes;
      $scope.portGreffes = portGreffes;
      $scope.fermes = fermes;
      $scope.groupeculturals = groupeculturals;
      $scope.typeconduites = typeconduites;
      $scope.produits = produits;
      $scope.profilcultures = profilcultures;
      $scope.generations = generations;
      $scope.cycles = cycles;
      $scope.sousparcelles = sousparcelles;
      $scope.suptotal = suptotal;

      $scope.sousparcelleID = [];
      $scope.isTracedEdit = false;
      $scope.save_rawClick = false;

      setTimeout(function() {
        jscolor.installByClassName("jscolor");
      }, 1000);
      //i need to add on ng select one condition like variete check is true niiiiice but later because i have samething to do bye..
      $scope.getSuperficieDesParcelleCulturale = function() {
        if ($scope.ichangeparcelle) {
          $scope.sousparcelle = undefined;
          $scope.suptotal = undefined;
          $scope.sousparcelleID = [];
          $scope.totalsupsousparcelle = 0;

          $q.all([sousparcelle.byparcellephysique({
            IDPrcellePhysique: $scope.physique.ID
          }), parcellecultural.getsumsupbyid({
            ID: $scope.physique.ID,
            IDParcelleCulturale: dataparcelle.id
          })]).then((values) => {
            NProgress.done();
            $scope.sousparcelles = values[0].data;
            $scope.suptotal = values[1].data[0].suptotal;
          })
        } else {
          $scope.ichangeparcelle = true;
        }
      }

      $scope.variete_change = function() {
        if ($scope.ichangevariete) {
          $scope.produit = undefined;
          $scope.profilculture = undefined;
          $scope.generation = undefined;
          $scope.Cycle = undefined;

          $scope.data.IDProduit_Rendement = undefined;
          $scope.data.IDProfil_cultural = undefined;
          $scope.data.IDGeneration = undefined;
          $scope.data.cycle = undefined;


          $q.all([produitrendement.byvariete({
            VARIETE: $scope.variete.ID
          }), profilcultural.byvariete({
            VARIETE: $scope.variete.ID
          }), generation.byculture({
            IDCulture: $scope.variete.culture
          }), cycle.getbytype({
            TYPECYCLE: $scope.variete.filier,
            FERME: pc.IDFerme
          })]).then((values) => {
            NProgress.done();
            $scope.produits = values[0].data;
            $scope.profilcultures = values[1].data;
            $scope.generations = values[2].data;
            $scope.cycles = values[3].data;
          })
        } else {
          $scope.ichangevariete = true;
        }
      }

      $scope.sousparcelle_change = function() {
        $scope.sousparcelleID = [];
        $scope.totalsupsousparcelle = 0;
        for (var i = 0; i < $scope.sousparcelle.length; i++) {
          $scope.sousparcelleID.push($scope.sousparcelle[i].ID);
          if ($scope.sousparcelle[i].Sup) {
            $scope.totalsupsousparcelle += $scope.sousparcelle[i].Sup;
          }
        }
      }

      $scope.onUpdate = () => {
        if (!$scope.physique) {
          $scope.physique = $scope.data.id_parcelle;
        }
        if (!$scope.portegreff) {
          $scope.portegreff = $scope.data.IDPorte_greffe;
        }
        if (!$scope.variete) {
          $scope.variete = $scope.data.id_variete;
        }
        if (!$scope.Cycle) {
          $scope.Cycle = $scope.data.IDCycle;
        }
        if (!$scope.produit) {
          $scope.produit = $scope.data.IDProduit_Rendement;
        }
        if (!$scope.groupe) {
          $scope.groupe = $scope.data.GroupeCultural;
        }
        if (!$scope.profilculture) {
          $scope.profilculture = $scope.data.IDProfil_cultural;
        }
        if (!$scope.generation) {
          $scope.generation = $scope.data.IDGeneration;
        }
        if (!$scope.typedeconduite) {
          $scope.typedeconduite = $scope.data.IDType_conduite;
        }
      }

      $scope.checkarrachage = function(statut, date) {
        if (statut == 2) {
          if (date) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      }

      $scope.checkdateproduction = function(date1, date2) {
        if (date1 && date2) {
          return true;
        } else if ((date1 && !date2) || (!date1 && date2)) {
          return false;
        } else {
          return true;
        }
      }

      $scope.checkvalidatedata = async function() {
        $scope.youcan = true;

        // control  Sup  de Parcelle cultural avec sup de  physique
        /*if (($scope.suptotal + $scope.data.Sup) > $scope.physique.Sup) {
          toastr.clear();
          toastr.error("Veuillez corriger la superficie : La superficie des parcelles culturales dépasse celle de la parcelle physique !", {
            closeButton: true
          });
          $scope.youcan = false;
        }*/
        // control date arrachage
        if (moment($scope.Dat_Plant).isSameOrAfter(moment($scope.Dat_Arrach)) && $scope.Statut == 2) {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("La date d'arrachage doit être supérieure à la date de plantation !")), {
            closeButton: true
          });
          $scope.youcan = false;
        }

        // control date debut prouduction
        if (moment($scope.dateentreeproduction).isSameOrAfter(moment($scope.Dat_Arrach)) && $scope.Statut == 2 && $scope.dateentreeproduction) {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("La date d'arrachage  doit être supérieure à la date d'entrée en production !")), {
            closeButton: true
          });
        }

        if (moment($scope.Dat_Plant).isSameOrAfter(moment($scope.dateentreeproduction)) && $scope.dateentreeproduction) {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("La date d'entrée en production doit être supérieure à la date de plantation !")), {
            closeButton: true
          });
          $scope.youcan = false;
        }


        /*if (moment($scope.Dat_Plant).isSameOrAfter(moment($scope.datepleineproduction)) && $scope.datepleineproduction) {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("La date de pleine en production doit être supérieure à la date de plantation !")), {
            closeButton: true
          });
          $scope.youcan = false;
        }*/

        /*if (moment($scope.dateentreeproduction).isSameOrAfter(moment($scope.datepleineproduction)) && $scope.dateentreeproduction && $scope.datepleineproduction) {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("La date de pleine en pliene production doit être supérieure à la date d'entrée en production !")), {
            closeButton: true
          });
          $scope.youcan = false;
        }*/

        // control  Sup  de Parcelle cultural avec sup de  physique
        /*if ($scope.data.Sup > $scope.totalsupsousparcelle && $scope.sousparcelleID.length > 0) {
          toastr.clear();
          toastr.error("Veuillez corriger la superficie : La superficie des parcelles culturales dépasse celle de la sous parcelle !", {
            closeButton: true
          });
          $scope.youcan = false;
        }*/
        return $scope.youcan;
      }

      $scope.Modifer = async function() {
        toastr.clear();
        $scope.onUpdate();
        if ($scope.data.Reference && $scope.physique && $scope.variete && $scope.datedebuttravaux && $scope.Dat_Plant && $scope.checkarrachage($scope.Statut, $scope.Dat_Arrach) && $scope.data.Sup && $scope.data.Sup > 0 && $scope.data.Nbre_plant && $scope.data.Nbre_plant > 0 && $scope.data.Densite && $scope.data.Densite > 0 && $scope.checkdateproduction($scope.dateentreeproduction, $scope.datepleineproduction)) {
          if ($scope.checkvalidatedata()) {
            if ($scope.Statut == 1) {
              $scope.Dat_Arrach = undefined;
            }

            pc.objEdit = {
              "isTraced": $scope.isTracedEdit,
              "IDParcelleCulturale": $scope.data.id,
              "IDFermes": pc.IDFerme,
              "physique": $scope.physique.ID,
              "Superficie": $scope.data.Sup,
              "dateplantation": moment($scope.Dat_Plant).format('YYYYMMDD'),
              "datearrachage": $scope.Dat_Arrach,
              "portegreff": $scope.portegreff,
              "variete": $scope.variete.ID,
              "Cycle": $scope.Cycle,
              "suptracertracer": document.getElementById('areaHa').value,
              "Latitude": document.getElementById('t1').value,
              "Longitude": document.getElementById('t2').value,
              "Calque": document.getElementById('Calque').value,
              "Cadre": document.getElementById('Cadre').value,
              "tokenpolygone": document.getElementById('data').value,
              "Statut_Cycle": $scope.Statut,
              "dateentreeproduction": $scope.dateentreeproduction,
              "datepleineproduction": $scope.datepleineproduction,
              "parcelleculturale": $scope.data.Ref,
              "Reference": $scope.data.Reference,
              "produit": $scope.produit,
              "datedebuttravaux": moment($scope.datedebuttravaux).format('YYYYMMDD'),
              "nbrplant": $scope.data.Nbre_plant,
              "densite": $scope.data.Densite,
              "ecartement": $scope.data.Ecartement,
              "nbrplanttheorique": $scope.data.Nbr_plant_therique,
              "nbrplantmanquants": $scope.data.NBr_manquants,
              "groupe": $scope.groupe,
              "sousparcelle": ($scope.sousparcelleID.length > 0) ? $scope.sousparcelleID : null,
              "dateprevuderecolte": $scope.dateprevuderecolte,
              "datefinderecolte": $scope.datefinderecolte,
              "profilculture": $scope.profilculture,
              "surgreffee": ($scope.surgreffee) ? 1 : 0,
              "generation": $scope.generation,
              "typedeconduite": $scope.typedeconduite,
              "type1": $scope.type1,
              "type2": $scope.type2,
              "antigel": $scope.antigel,
              "antigrele": $scope.antigrele,
              "couverrealisee": $scope.data.suivre,
              "observation": $filter('textforsqlserver')($scope.data.OBSERVATION)
            }
            if ($scope.save_rawClick) {
              toastr.clear();
              toastr.info(await translatedwords.getTranslatedWord($translate("Veullez enregistrer les points de polygone!")), {
                closeButton: true
              });
            } else {
              $scope.progress = true;
              parcellecultural.updateParcellesCulturale(pc.objEdit).then(async e => {
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
                  if (e.data[0].description.includes("WDIDX_ParcelleCulturale_Ref_parcelleIDFermes")) {
                    toastr.error(await translatedwords.getTranslatedWord($translate("Cette parcelle existe déjà dans la ferme choisi !")), {
                      closeButton: true
                    });
                  } else {
                    toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + e.data[0].description, {
                      closeButton: true
                    });
                  }
                  NProgress.done();
                }
              }).catch(e => {
                $scope.progress = false;
                toastr.clear();
                toastr.error(e.data, {
                  closeButton: true
                });
              });
            }
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
      };



      var IO = {
        //returns array with storable google.maps.Overlay-definitions
        IN: function(arr, //array with google.maps.Overlays
          encoded //boolean indicating whether pathes should be stored encoded
        ) {
          var shapes = [],
            goo = google.maps,
            shape, tmp;
          if (arr) {
            for (var i = 0; i < arr.length; i++) {
              shape = arr[i];
              tmp = {
                type: this.t_(shape.type),
                id: shape.id || i + 1
              };


              switch (tmp.type) {
                case 'CIRCLE':
                  tmp.radius = shape.getRadius();
                  tmp.geometry = this.p_(shape.getCenter());
                  break;
                case 'MARKER':
                  tmp.geometry = this.p_(shape.getPosition());
                  break;
                case 'RECTANGLE':
                  tmp.geometry = this.b_(shape.getBounds());
                  break;
                case 'POLYLINE':
                  tmp.geometry = this.l_(shape.getPath(), encoded);
                  break;
                case 'POLYGON':
                  tmp.geometry = this.m_(shape.getPaths(), encoded);

                  break;
              }
              shapes.push(tmp);
            }
          }
          return shapes;
        },
        //returns array with google.maps.Overlays
        OUT: function(arr, //array containg the stored shape-definitions
          map, cadre, calque //map where to draw the shapes
        ) {
          var shapes = [],
            goo = google.maps,
            map = map || null,
            shape, tmp;
          if (arr) {
            for (var i = 0; i < arr.length; i++) {
              shape = arr[i];

              switch (shape.type) {
                case 'CIRCLE':
                  tmp = new goo.Circle({
                    radius: Number(shape.radius),
                    center: this.pp_.apply(this, shape.geometry),
                    strokeColor: calque,
                    strokeOpacity: 1,
                    strokeWeight: 1,
                    fillColor: cadre,
                    fillOpacity: 0.50
                  });
                  break;
                case 'MARKER':
                  tmp = new goo.Marker({
                    position: this.pp_.apply(this, shape.geometry),
                    strokeColor: calque,
                    strokeOpacity: 1,
                    strokeWeight: 1,
                    fillColor: cadre,
                    fillOpacity: 0.50
                  });
                  break;
                case 'RECTANGLE':
                  tmp = new goo.Rectangle({
                    bounds: this.bb_.apply(this, shape.geometry),
                    strokeColor: calque,
                    strokeOpacity: 1,
                    strokeWeight: 1,
                    fillColor: cadre,
                    fillOpacity: 0.50
                  });
                  break;
                case 'POLYLINE':
                  tmp = new goo.Polyline({
                    path: this.ll_(shape.geometry),
                    strokeColor: calque,
                    strokeOpacity: 1,
                    strokeWeight: 1,
                    fillColor: cadre,
                    fillOpacity: 0.50
                  });
                  break;
                case 'POLYGON':
                  tmp = new goo.Polygon({
                    paths: this.mm_(shape.geometry),
                    strokeColor: calque,
                    strokeOpacity: 1,
                    strokeWeight: 1,
                    fillColor: cadre,
                    fillOpacity: 0.50
                  });
                  break;
              }
              tmp.setValues({
                map: map,
                id: shape.id
              })
              shapes.push(tmp);
            }
          }
          return shapes;
        },
        l_: function(path, e) {
          path = (path.getArray) ? path.getArray() : path;
          if (e) {
            return google.maps.geometry.encoding.encodePath(path);
          } else {
            var r = [];
            for (var i = 0; i < path.length; ++i) {
              r.push(this.p_(path[i]));
            }
            return r;
          }
        },
        ll_: function(path) {
          if (typeof path === 'string') {
            return google.maps.geometry.encoding.decodePath(path);
          } else {
            var r = [];
            for (var i = 0; i < path.length; ++i) {
              r.push(this.pp_.apply(this, path[i]));
            }
            return r;
          }
        },

        m_: function(paths, e) {
          var r = [];
          paths = (paths.getArray) ? paths.getArray() : paths;
          for (var i = 0; i < paths.length; ++i) {
            r.push(this.l_(paths[i], e));
          }
          return r;
        },
        mm_: function(paths) {
          var r = [];
          for (var i = 0; i < paths.length; ++i) {
            r.push(this.ll_.call(this, paths[i]));

          }
          return r;
        },
        p_: function(latLng) {
          return ([latLng.lat(), latLng.lng()]);
        },
        pp_: function(lat, lng) {
          return new google.maps.LatLng(lat, lng);
        },
        b_: function(bounds) {
          return ([this.p_(bounds.getSouthWest()),
            this.p_(bounds.getNorthEast())
          ]);
        },
        bb_: function(sw, ne) {
          return new google.maps.LatLngBounds(this.pp_.apply(this, sw),
            this.pp_.apply(this, ne));
        },
        t_: function(s) {
          var t = ['CIRCLE', 'MARKER', 'RECTANGLE', 'POLYLINE', 'POLYGON'];
          for (var i = 0; i < t.length; ++i) {
            if (s === google.maps.drawing.OverlayType[t[i]]) {
              return t[i];
            }
          }
        }
      }

      var infoWindow = new google.maps.InfoWindow();

      var map;
      var selected_shape;
      var clearvar;
      var shapes = [];
      var drawman;
      var byId;
      var clearSelection;
      var setSelection;
      var clearShapes;

      function initMap() {

        if (!$scope.fermes[0].Latitude || !$scope.fermes[0].Longitude || $scope.fermes[0].Latitude == 0 || $scope.fermes[0].Longitude == 0 || $scope.fermes[0].Latitude == "" || $scope.fermes[0].Longitude == "") {
          var latF = 33.9691409;
          var longF = -6.9273709;
          var zoooom = 4;
        } else {
          var latF = $scope.fermes[0].Latitude;
          var longF = $scope.fermes[0].Longitude;
          var zoooom = 16;
        }

        if ($scope.data.LatPosition && $scope.data.LngPosition && $scope.data.LatPosition != 0 && $scope.data.LngPosition != 0 && $scope.data.LatPosition != "" && $scope.data.LngPosition != "") {
          var latF = $scope.data.LatPosition;
          var longF = $scope.data.LngPosition;
          var zoooom = 16;
        }

        map = new google.maps.Map(document.getElementById("parcelleculturalemap"), {
            center: new google.maps.LatLng(latF, longF),
            zoom: zoooom,
            mapTypeControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          }),
          selected_shape = null,
          drawman = new google.maps.drawing.DrawingManager({
            map: map,
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
            drawingControlOptions: {
              drawingModes: [
                google.maps.drawing.OverlayType.POLYGON
              ]
            },
            polygonOptions: {
              editable: false
            }
          }),
          byId = function(s) {
            return document.getElementById(s)
          },
          clearSelection = function() {
            if (selected_shape) {
              selected_shape.set((selected_shape.type ===
                google.maps.drawing.OverlayType.MARKER
              ) ? 'draggable' : 'editable', false);
              selected_shape = null;
            }
          },
          setSelection = function(shape) {
            $scope.save_rawClick = true;
            clearSelection();
            selected_shape = shape;

            selected_shape.set((selected_shape.type ===
              google.maps.drawing.OverlayType.MARKER
            ) ? 'draggable' : 'editable', true);


            byId('save_raw').disabled = false;

            var coordinatesArray = shape.getPath().getArray();

            var minX = coordinatesArray[0].lat();
            var maxX = coordinatesArray[0].lat();
            var minY = coordinatesArray[0].lng();
            var maxY = coordinatesArray[0].lng();
            for (var i = 0; i < coordinatesArray.length; i++) {

              minX = (coordinatesArray[i].lat() < minX || minX === null) ? coordinatesArray[i].lat() : minX;
              maxX = (coordinatesArray[i].lat() > maxX || maxX === null) ? coordinatesArray[i].lat() : maxX;
              minY = (coordinatesArray[i].lng() < minY || minY === null) ? coordinatesArray[i].lng() : minY;
              maxY = (coordinatesArray[i].lng() > maxY || maxY === null) ? coordinatesArray[i].lng() : maxY;
            }

            document.getElementById('t1').value = (minX + maxX) / 2;
            document.getElementById('t2').value = (minY + maxY) / 2;


            var negativeSpace = new google.maps.Polygon({
              path: shape.getPath().getArray(),
              strokeWeight: 0,
              strokeOpacity: 0,
              fillOpacity: 0,
              clickable: false,
              map: map
            });

          },
          clearShapes = function() {
            drawman.setOptions({
              drawingControl: true
            });
            $scope.save_rawClick = false;
            $scope.isTracedEdit = false;
            document.getElementById("data").value = "";
            selected_shape = "";
            for (var i = 0; i < shapes.length; ++i) {
              shapes[i].setMap(null);
            }
            shapes = [];
            document.getElementById("areaHa").value = ($scope.data.SuperficieTracer) ? $scope.data.SuperficieTracer : 0;
            byId('save_raw').disabled = true;

            document.getElementById('t1').value = ($scope.data.LatPosition) ? $scope.data.LatPosition : 0;
            document.getElementById('t2').value = $scope.data.LngPosition ? $scope.data.LngPosition : 0;


            clearvar = false;

            var mysnackbar = document.getElementById("snackbar");
            document.getElementById("snackbar").innerHTML = "Effacement réussite";
            mysnackbar.className = "show";
            setTimeout(function() {
              mysnackbar.className = mysnackbar.className.replace("show", "");
            }, 3000);

            effacerFermes();
          };

        //            var drawingManager = new google.maps.drawing.DrawingManager();
        //            drawingManager.setOptions({
        //                drawingControl: true,
        //                drawingControlOptions: {
        //                    position: google.maps.ControlPosition.TOP_CENTER,
        //                    drawingModes: [
        //                        google.maps.drawing.OverlayType.CIRCLE,
        //                        google.maps.drawing.OverlayType.POLYGON,
        //                        google.maps.drawing.OverlayType.MARKER
        //                    ]
        //                }
        //            });
        //            drawingManager.setMap(map);


        if ($scope.fermes[0].Polygone_Ferme !== "" && pc.IsJsonString($scope.fermes[0].Polygone_Ferme)) {
          IO.OUT(JSON.parse($scope.fermes[0].Polygone_Ferme), map, "#c4bf7d", "#8eb2a0");
        } else {
          IO.OUT(JSON.parse('[{"type": "POLYGON","id": null,"geometry": [[]]}]'), map, "#c4bf7d", "#8eb2a0");
        }

        if ($scope.data.TokenPolygone != "" && $scope.data.TokenPolygone && pc.IsJsonString($scope.data.TokenPolygone)) {
          IO.OUT(JSON.parse($scope.data.TokenPolygone), map, $scope.Calque, $scope.Cadre);
        }





        var infoWindow = new google.maps.InfoWindow();


        var input = document.getElementById('searchTextField');

        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);

        var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
          map: map,
          anchorPoint: new google.maps.Point(0, -29)
        });

        autocomplete.addListener('place_changed', function() {
          infowindow.close();
          marker.setVisible(false);
          var place = autocomplete.getPlace();
          if (!place.geometry) {
            //window.alert("Autocomplete's returned place contains no geometry");
            return;
          }

          // If the place has a geometry, then present it on a map.
          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(9);
          }


        });


        var markerCenter = new google.maps.Marker({
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 0
          },
          position: map.getCenter(),
          map: map
        });

        google.maps.event.addListener(map, 'zoom_changed', function() {
          var NewMapCenter = map.getCenter();
          var latitude = NewMapCenter.lat();
          var longitude = NewMapCenter.lng();
          markerCenter.setPosition(map.getCenter());
          var latLng = markerCenter.getPosition();
        });

        google.maps.event.addListener(markerCenter, 'drag', function() {
          var latLng = markerCenter.getPosition();
        });

        google.maps.event.addListener(map, 'click', function(event) {

        });
        google.maps.event.addListener(drawman, 'overlaycomplete', function(e) {
          drawman.setOptions({
            drawingControl: false
          });
          drawman.setDrawingMode(null);
          var shape = e.overlay;
          shape.type = e.type;
          google.maps.event.addListener(shape, 'click', function() {
            setSelection(this);
          });
          setSelection(shape);
          shapes.push(shape);
          marker = shape;
        });

        google.maps.event.addListener(map, 'click', clearSelection);
        google.maps.event.addDomListener(byId('clear_shapes'), 'click', clearShapes);

        google.maps.event.addDomListener(byId('save_raw'), 'click', function() {
          $scope.isTracedEdit = true;
          $scope.save_rawClick = false;
          var data = IO.IN(shapes, false);
          byId('data').value = JSON.stringify(data);
          var json = JSON.stringify(data, undefined, 4);
          var area = 0;
          for (var i = 0; i < shapes.length; ++i) {
            area += google.maps.geometry.spherical.computeArea(shapes[i].getPath());
          }
          document.getElementById("areaHa").value = (area / 10000).toFixed(2);
          clearvar = true;
        });


        if (map.getZoom() <= 14) {
          var mapStyles = [{
            featureType: "administrative.country",
            stylers: [{
              visibility: "off"
            }]
          }];
          var mapType = new google.maps.StyledMapType(mapStyles, {
            name: "Maroc"
          });
          map.mapTypes.set('maroc', mapType);
          map.setMapTypeId('maroc');
        }

        if (map.getZoom() >= 8) {
          map.setMapTypeId(google.maps.MapTypeId.HYBRID);
        }
        new google.maps.event.addListener(map, 'zoom_changed', function() {
          var zoomm = map.getZoom();
          if (zoomm >= 8) {
            map.setMapTypeId(google.maps.MapTypeId.HYBRID);
          } else {
            var mapStyles = [{
              featureType: "administrative.country",
              stylers: [{
                visibility: "off"
              }]
            }];
            var mapType = new google.maps.StyledMapType(mapStyles, {
              name: "Maroc"
            });
            map.mapTypes.set('maroc', mapType);
            map.setMapTypeId('maroc');
          }
        });
        var centerControlDiv = document.createElement('div');
        var centerControl = new CenterControl(centerControlDiv, map);
        centerControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(centerControlDiv);
      }

      setTimeout(function() {
        initMap();
      }, 1000);




      google.maps.Polygon.prototype.my_getBounds = function() {
        var bounds = new google.maps.LatLngBounds()
        this.getPath().forEach(function(element, index) {
          bounds.extend(element);
        })
        return bounds;
      }


      function syntaxHighlight(json) {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
          var cls = 'number';
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = 'key';
            } else {
              cls = 'string';
            }
          } else if (/true|false/.test(match)) {
            cls = 'boolean';
          } else if (/null/.test(match)) {
            cls = 'null';
          }
          return '<span class="' + cls + '">' + match + '</span>';
        });
      }

      function decodeLevelss(encodedLevelsString) {
        var decodedLevels = [];

        for (var i = 0; i < encodedLevelsString.length; ++i) {
          var level = encodedLevelsString.charCodeAt(i) - 63;
          decodedLevels.push(level);
        }
        return decodedLevels;
      }

      function bindInfoWindow(marker, map, infoWindow, html) {
        google.maps.event.addListener(marker, 'click', function() {
          infoWindow.setContent(html);
          infoWindow.open(map, marker);

        });
      }

      function downloadUrl(url, callback) {
        var request = window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();

        request.onreadystatechange = function() {
          if (request.readyState === 4) {
            request.onreadystatechange = doNothing;
            callback(request, request.status);
          }
        };
        request.open('GET', url, true);
        request.send(null);
      }

      function doNothing() {}

      function xmlParse(str) {
        if (typeof ActiveXObject != 'undefined' && typeof GetObject != 'undefined') {
          var doc = new ActiveXObject('Microsoft.XMLDOM');
          doc.loadXML(str);
          return doc;
        }
        if (typeof DOMParser != 'undefined') {
          return (new DOMParser()).parseFromString(str, 'text/xml');
        }
        return createElement('div', null);
      }

      function CenterControl(controlDiv, map) {}


      function showRegionByPays(str) {
        if (str === "") {
          document.getElementById("idRegionnn").innerHTML = "";
          return;
        }
        if (window.XMLHttpRequest) {
          // code for IE7+, Firefox, Chrome, Opera, Safari
          xmlhttp = new XMLHttpRequest();
        } else { // code for IE6, IE5
          xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.open("GET", "ParamerageListeRegionByPays.jsp?q=" + str, true);
        xmlhttp.send();

        xmlhttp.onreadystatechange = function() {
          if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            document.getElementById("idRegionnn").innerHTML = xmlhttp.responseText;
          }
        }
      }
    }


    pc.delete = async function(c) {
      pc.idParcel = c.id;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            parcellecultural.deleteParcellesCulturale({
              ID: pc.idParcel
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
                toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + ", " + result.data[0].description, {
                  closeButton: true
                });
              }
            });
          });
        }
      });

    }

    function createdRow(row, data, dataIndex) {
      $compile(angular.element(row).contents())($scope);
    }

    pc.IsJsonString = function(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    }

    function actionsHtml(data, type, full, meta) {
      pc.parcel[data.id] = data;
      return '<button class="btn btn-warning btn-xs" ng-click="pc.edit(pc.parcel[' + data.id + '])" title="Modifier"><i class="fa fa-edit"></i></button>&nbsp;' +
        '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.parcel[' + data.id + '])" )"=""><i class="fa fa-trash-o"></i></button>';
    }

  });