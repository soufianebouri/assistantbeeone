'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RepositoryVarieteCtrl
 * @description
 * # RepositoryVarieteCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RepositoryVarieteCtrl', function($scope, translatedwords, $translatePartialLoader, $translate, $window,
    $compile,
    $uibModal,
    _url,
    DTOptionsBuilder,
    DTColumnBuilder,
    DTDefaultOptions,
    $q,
    VarieteService, $cookies, domaine, cultureService, TypeVarieteService, $mdDialog, $filter, toastr
  ) {
    var pc = this;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.IDFermes = $cookies.getObject('globals').ferme.IDFerme;
    pc.obj = {
      "IDFermes": pc.IDFermes
    };
    pc.edit = edit;
    pc.delete = deleteRow;
    pc.dtInstance = {};
    pc.varieteObject = {};
    pc.idVariete = -1;
    pc.data = {
      "modalTitle": {
        "create": "Ajouter une variete",
        "update": "Mise a jour"
      },
      "varieteName": "Variete",
      "culture": "Culture",
      "couleur": "Couleur",
      "descriptif": "Descriptif",
      "famille_variete": "Type variete",
      "reference": "Reference",
      "age_entree_production": "Age d\'entrée en production",
      "age_adulte": "Age adulte",
      "mois_debut_cycle": "Mois debut du cycle",
      "mois_fin_cycle": "Mois fin du cycle",
      "jour_debut_cycle": "Jour debut du cycle",
      "jour_fin_cycle": "Jour fin du cycle",
      "iS_Envoi": "IS Envoi",
      "abreviation": "Abreviation",
      "couleurCalque": "Couleur calque",
      "couleurCadre": "Couleur cadre",
      "baseUrl": _url,
      "confirmeDeleteText": "Etes-vous sur de supprimer cette variete ?",
      "confirme": "Confirmation",
      "action": "insert",
      "updateVariete": {}
    };

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        VarieteService.getVarieteByFerme(pc.obj).then(function(result) {
          NProgress.done();
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
            pc.AddVariete();
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Ajouter"))
        }
      ]);

    pc.dtColumns = [

      DTColumnBuilder.newColumn('Reference').withTitle(translatedwords.getTranslatedWord($translate("Référence"))),
      DTColumnBuilder.newColumn('Variete').withTitle(translatedwords.getTranslatedWord($translate("Variété"))),
      DTColumnBuilder.newColumn('Abreviation').withTitle(translatedwords.getTranslatedWord($translate("Abréviation"))),
      DTColumnBuilder.newColumn('CultureName').withTitle(translatedwords.getTranslatedWord($translate("Culture"))),
      DTColumnBuilder.newColumn('Libile').withTitle(translatedwords.getTranslatedWord($translate("Type de variété"))),
      DTColumnBuilder.newColumn('kG').withTitle(translatedwords.getTranslatedWord($translate("Poid en Kg"))),
      DTColumnBuilder.newColumn('Descriptif').withTitle(translatedwords.getTranslatedWord($translate("Descriptif"))),
      DTColumnBuilder.newColumn('age_entree_production').withTitle(translatedwords.getTranslatedWord($translate("Age d'entrée en production (en année)"))),
      DTColumnBuilder.newColumn('age_adulte').withTitle(translatedwords.getTranslatedWord($translate("Age adulte (en année)"))),
      DTColumnBuilder.newColumn('mois_debut_cycle').withTitle(translatedwords.getTranslatedWord($translate("Mois debut du cycle"))),
      DTColumnBuilder.newColumn('mois_fin_cycle').withTitle(translatedwords.getTranslatedWord($translate("Mois fin du cycle"))),
      DTColumnBuilder.newColumn('jour_debut_cycle').withTitle(translatedwords.getTranslatedWord($translate("Jour debut du cycle"))),
      DTColumnBuilder.newColumn('jour_fin_cycle').withTitle(translatedwords.getTranslatedWord($translate("Jour fin du cycle"))),
      DTColumnBuilder.newColumn('CouleurCalque').withTitle(translatedwords.getTranslatedWord($translate("Couleur Calque"))).renderWith(function(data, type, full, meta) {
        if (full.CouleurCalque) {
          return '<h1 style="background: ' + full.CouleurCalque + ';width: 100%;height: 20px;border-style:solid;border-color: ' + full.CouleurCalque + ';border-width: 12px;">';
        } else {
          return '';
        }
      }),
      DTColumnBuilder.newColumn('CouleurCadre').withTitle(translatedwords.getTranslatedWord($translate("Couleur Cadre"))).renderWith(function(data, type, full, meta) {
        if (full.CouleurCadre) {
          return '<h1 style="background: ' + full.CouleurCadre + ';width: 100%;height: 20px;border-style:solid;border-color: ' + full.CouleurCadre + ';border-width: 12px;">';
        } else {
          return '';
        }
      }),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).notSortable().withClass('nowraptd td-small all')
      .renderWith(actionsHtml)
    ];
    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    //AddVariete
    pc.AddVariete = function() {
      $q.all([domaine.getDomaine(), cultureService.getCulture(_url), TypeVarieteService.getTypeVariete(_url)]).then((values) => {
        NProgress.done();
        $scope.domaines = values[0].data;
        $scope.cultures = values[1].data;
        $scope.typevarietes = values[2].data;
        $scope.showAdvancedAdd("ev", $scope.domaines, $scope.cultures, $scope.typevarietes);
      });
    }

    //AddVariete
    $scope.showAdvancedAdd = function(ev, domaines, cultures, typevarietes) {
      $mdDialog.show({
          controller: DialogControllerAddVariete,
          templateUrl: '././views/templates/variete/AddVariete.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          locals: {
            domaines: domaines,
            cultures: cultures,
            typevarietes: typevarietes
          }
        })
        .then(function(answer) {}, function() {});
    }

    //add code
    function DialogControllerAddVariete($scope, $mdDialog, domaines, cultures, typevarietes) {
      $scope.progress = false;
      $scope.domaines = domaines;
      $scope.cultures = cultures;
      $scope.typevarietes = typevarietes;
      $scope.Calque = "#FFFFFF";
      $scope.Cadre = "#FFFFFF";
      $scope.selectedDomaines = [];
      setTimeout(function() {
        jscolor.installByClassName("jscolor");
      }, 1000);
      $scope.AjouterVariete = async function() {
        toastr.clear();
        if ($scope.Variete && $scope.Abreviation && $scope.Culture && $scope.TypeVariete && $scope.selectedDomaines.length > 0) {
          pc.objNewVariete = {
            "Variete": $scope.Variete,
            "Abreviation": $scope.Abreviation,
            "Culture": $scope.Culture,
            "TypeVariete": $scope.TypeVariete,
            "IDFermes": $scope.selectedDomaines,
            "Poid": $scope.Poid,
            "Reference": ($scope.Reference) ? $scope.Reference : "",
            "Descriptif": ($scope.Descriptif) ? $filter('textforsqlserver')($scope.Descriptif) : "",
            "AgeEntree": $scope.AgeEntree,
            "AgeAdulte": $scope.AgeAdulte,
            "mois_debut_cycle": $scope.mois_debut_cycle,
            "mois_fin_cycle": $scope.mois_fin_cycle,
            "jour_debut_cycle": $scope.jour_debut_cycle,
            "jour_fin_cycle": $scope.jour_fin_cycle,
            "Calque": document.getElementById('Calque').value,
            "Cadre": document.getElementById('Cadre').value
          }
          $scope.progress = true;
          VarieteService.pushDataVariete(pc.objNewVariete).then(async e => {
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
            toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + e.data, {
              closeButton: true
            });
          });


        } else {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
            closeButton: true
          });
        }

      };


      $scope.hideVariete = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.AnnulerVariete = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };




    }



    //edit
    pc.edit = function(datavariete) {
      $q.all([domaine.getDomaine(), cultureService.getCulture(_url), TypeVarieteService.getTypeVariete(_url)]).then((values) => {
        NProgress.done();
        $scope.domaines = values[0].data;
        $scope.cultures = values[1].data;
        $scope.typevarietes = values[2].data;
        $scope.showAdvancedEdit("ev", datavariete, $scope.domaines, $scope.cultures, $scope.typevarietes);
      });
    }

    $scope.showAdvancedEdit = function(ev, datavariete, domaines, cultures, typevarietes) {
      $mdDialog.show({
          controller: DialogControllerEdit,
          templateUrl: '././views/templates/variete/EditVariete.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            datavariete: datavariete,
            domaines: domaines,
            cultures: cultures,
            typevarietes: typevarietes
          }
        })
        .then(function(answer) {}, function() {});
    };

    function DialogControllerEdit($scope, $mdDialog, datavariete, domaines, cultures, typevarietes) {
      $scope.data = datavariete;
      $scope.domaines = domaines;
      $scope.cultures = cultures;
      $scope.typevarietes = typevarietes;

      $scope.Calque = ($scope.data.CouleurCalque) ? $scope.data.CouleurCalque : "#FFFFFF";
      $scope.Cadre = ($scope.data.CouleurCadre) ? $scope.data.CouleurCadre : "#FFFFFF";
      $scope.selectedDomaines = [];
      setTimeout(function() {
        jscolor.installByClassName("jscolor");
      }, 1000);
      if ($scope.data.FermeID) {
        try {
          $scope.data.FermeID = $scope.data.FermeID.split(",").map(Number);
        } catch (e) {
          $scope.data.FermeID = $scope.data.FermeID;
        }
      } else {
        $scope.data.FermeID = [];
      }

      $scope.onUpdate = () => {
        if (!$scope.Culture) {
          $scope.Culture = $scope.data.IDCulture;
        }
        if (!$scope.TypeVariete) {
          $scope.TypeVariete = $scope.data.IDFamille_variete;
        }
        if ($scope.selectedDomaines.length == 0) {
          $scope.selectedDomaines = $scope.data.FermeID;
        }
      }

      $scope.progress = false;
      $scope.selectedDomaines = [];
      $scope.ModiferVariete = async function() {
        toastr.clear();
        $scope.onUpdate();
        if ($scope.data.Variete && $scope.data.Abreviation && $scope.Culture && $scope.TypeVariete && $scope.selectedDomaines.length > 0) {
          pc.objEdit = {
            "Variete": $scope.data.Variete,
            "Abreviation": $scope.data.Abreviation,
            "Culture": $scope.Culture,
            "TypeVariete": $scope.TypeVariete,
            "IDFermes": $scope.selectedDomaines,
            "Poid": $scope.data.Poid,
            "Reference": ($scope.data.Reference) ? $scope.data.Reference : "",
            "Descriptif": ($scope.data.Descriptif) ? $filter('textforsqlserver')($scope.data.Descriptif) : "",
            "AgeEntree": $scope.data.age_entree_production,
            "AgeAdulte": $scope.data.age_adulte,
            "mois_debut_cycle": $scope.data.mois_debut_cycle,
            "mois_fin_cycle": $scope.data.mois_fin_cycle,
            "jour_debut_cycle": $scope.data.jour_debut_cycle,
            "jour_fin_cycle": $scope.data.jour_fin_cycle,
            "Calque": document.getElementById('Calque').value,
            "Cadre": document.getElementById('Cadre').value,
            "ID": $scope.data.ID
          }
          $scope.progress = true;
          VarieteService.updateDataVariete(pc.objEdit).then(async e => {
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
              if (e.data[0].description.includes("duplicate key")) {
                $scope.progress = false;
                toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez noter que cette variété existe déjà !")), {
                  closeButton: true
                });
              } else {
                $scope.progress = false;
                toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + e.data[0].description, {
                  closeButton: true
                });
              }
              NProgress.done();
            }
          }).catch(async e => {
            toastr.clear();
            $scope.progress = false;
            toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + e.data, {
              closeButton: true
            });
          });

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

      $scope.AnnulerVariete = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

    }

    //delete
    pc.delete = async function(c) {
      pc.ID = c.ID;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            VarieteService.deleteVariete({
              ID: pc.ID
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
            }).catch(async function(e) {
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("An error occured, Server connectivity is down !")), {
                closeButton: true
              });
            });;
          });
        }
      });

    }


    function edit(c) {
      pc.data.updateVariete.varieteName = c.Variete;
      pc.data.updateVariete.kg = c.kG;
      pc.data.updateVariete.culture = c.Culture;
      pc.data.updateVariete.cultureName = c.cultureName;
      pc.data.updateVariete.couleur = c.Couleur;
      pc.data.updateVariete.descriptif = c.Descriptif;
      pc.data.updateVariete.refFamille_variete = (c.IDFamille_variete == null) ? null : c.IDFamille_variete;
      pc.data.updateVariete.Type_variete = c.Type_variete;
      pc.data.updateVariete.iS_Envoi = (c.iS_Envoi == null) ? null : c.iS_Envoi;
      pc.data.updateVariete.reference = c.Reference;
      pc.data.updateVariete.age_entree_production = c.age_entree_production;
      pc.data.updateVariete.age_adulte = c.age_adulte;
      pc.data.updateVariete.mois_debut_cycle = c.mois_debut_cycle;
      pc.data.updateVariete.mois_fin_cycle = c.mois_fin_cycle;
      pc.data.updateVariete.jour_debut_cycle = c.jour_debut_cycle;
      pc.data.updateVariete.jour_fin_cycle = c.jour_fin_cycle;
      pc.data.updateVariete.abreviation = c.Abreviation;
      pc.data.updateVariete.couleurCalque = c.CouleurCalque;
      pc.data.updateVariete.couleurCadre = c.CouleurCadre;
      pc.data.updateVariete.ID = c.ID;
      pc.showModal('', "u");
      // Edit some data and call server to make changes...
      // Then reload the data so that DT is refreshed
      //pc.dtInstance.reloadData();
    }

    function deleteRow(c) {
      pc.idVariete = c.ID;
      pc.showModal('', "d");
      // Delete some data and call server to make changes...
      // Then reload the data so that DT is refreshed
    }

    function createdRow(row, data, dataIndex) {
      // Recompiling so we can bind Angular directive to the DT
      $compile(angular.element(row).contents())($scope);
    }

    function actionsHtml(data, type, full, meta) {
      pc.varieteObject[data.ID] = data;
      return '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.edit(pc.varieteObject[' + data.ID + '])">' +
        '   <i class="fa fa-edit"></i>' +
        '</button>&nbsp;' +
        '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.varieteObject[' + data.ID + '])" )"="">' +
        '   <i class="fa fa-trash-o"></i>' +
        '</button>';
    }

    pc.showModal = function(size, req) {
      var template = './views/templates/addvarietemodal.html';
      pc.data.action = "insert";

      if (req == "d") {
        template = './views/templates/modalconfirmedelete.html';
        pc.data.action = "delete";
      } else if (req == "u") {
        pc.data.action = "update";
      }

      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: template,
        controller: 'ModalVarieteeCtrl',
        controllerAs: 'pc',
        size: size,
        resolve: {
          data: function() {
            return pc.data;
          }
        }
      });

      modalInstance.result.then(function(res) {
        if (res == 'delete') {
          VarieteService.deleteVariete(_url, {
            id: pc.idVariete
          }).then(function(result) {
            if (result.data[0].message == "ajout reussi") {
              pc.dtInstance.reloadData();
            } else {
              alert("Error : " + result.data[0].description);
            }
          });
        } else if (res == 'insert') {
          pc.dtInstance.reloadData();
        }
      }, function() {});

    };



  });