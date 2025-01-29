'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:SocietefermesGestiondessocietesCtrl
 * @description
 * # SocietefermesGestiondessocietesCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('SocietefermesGestiondessocietesCtrl', function($scope, $translatePartialLoader, translatedwords, $translate, $window,
    $compile,
    $uibModal,
    _url,
    DTOptionsBuilder,
    DTColumnBuilder,
    DTDefaultOptions,
    $q,
    gestiondessocietes,
    $cookies,
    $mdDialog,
    toastr
  ) {
    var pc = this;
    pc.dtInstance = {};
    pc.parcel = {};
    pc.IDFerme = $cookies.getObject('globals').ferme.IDFerme;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        gestiondessocietes.getSociete().then(result => {
          defer.resolve(result.data);
        });
        return defer.promise;
      })
      .withOption('createdRow', createdRow)
      .withOption('fnRowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        $('td', nRow).bind('click', function() {
          $scope.$apply(function() {
            $('td').css("background-color", "");
            $('td', nRow).css('background-color', '#fff6b5');
            //pc.edit(aData);
          });
        });
        return nRow;
      })
      .withDOM('<lf<t>ip>')
      .withPaginationType('simple_numbers')
      .withScroller()
      .withOption('responsive', true)
      .withOption('scrollY', $(window).height() - 320)

      .withOption('order', [])
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
        }
      ]);

    pc.dtColumns = [
      DTColumnBuilder.newColumn('Rais_Social').withTitle(translatedwords.getTranslatedWord($translate("Société"))).notSortable(),
      DTColumnBuilder.newColumn('Adresse').withTitle(translatedwords.getTranslatedWord($translate("Adresse"))),
      DTColumnBuilder.newColumn('Ville').withTitle(translatedwords.getTranslatedWord($translate("Ville"))),
      DTColumnBuilder.newColumn('Tel').withTitle(translatedwords.getTranslatedWord($translate("Tél"))),
      DTColumnBuilder.newColumn('Fax').withTitle(translatedwords.getTranslatedWord($translate("Fax"))),
      DTColumnBuilder.newColumn('Email').withTitle(translatedwords.getTranslatedWord($translate("Email"))),
      DTColumnBuilder.newColumn('GSM').withTitle(translatedwords.getTranslatedWord($translate("GSM"))),
      DTColumnBuilder.newColumn('Patente').withTitle(translatedwords.getTranslatedWord($translate("Patente"))),
      DTColumnBuilder.newColumn('N_CNSS').withTitle(translatedwords.getTranslatedWord($translate("N°CNSS"))),
      DTColumnBuilder.newColumn('N_amo').withTitle(translatedwords.getTranslatedWord($translate("AMO"))),
      DTColumnBuilder.newColumn('IDFiscale').withTitle(translatedwords.getTranslatedWord($translate("ID. Fiscal"))).withClass('onelignetext'),
      DTColumnBuilder.newColumn('RC').withTitle(translatedwords.getTranslatedWord($translate("RC"))),
      DTColumnBuilder.newColumn('Compagnie_Assurance').withTitle(translatedwords.getTranslatedWord($translate("Compagne d'assurance"))).withClass('onelignetext'),
      DTColumnBuilder.newColumn('Police_Assurance').withTitle(translatedwords.getTranslatedWord($translate("Police d'assurance N°"))).withClass('onelignetext'),
      /*DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable()
      .renderWith(actionsHtml)*/
    ];
    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    function createdRow(row, data, dataIndex) {
      // Recompiling so we can bind Angular directive to the DT
      $compile(angular.element(row).contents())($scope);
    }

    function actionsHtml(data, type, full, meta) {
      //pc.ferme[data.ID] = data;

      return "<button class='btn btn-warning btn-xs'><i class='fa fa-edit'></i></button>";
    }

    pc.edit = function(data) {
      $scope.showAdvanced("ev", data);
    }

    $scope.showAdvanced = function(ev, data) {
      $mdDialog.show({
          controller: DialogController,
          templateUrl: '././views/templates/societeferme/EditSociete.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true,
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


    function DialogController($scope, $mdDialog, data) {
      $scope.data = data;

      $scope.hide = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Annuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Modifier = function() {
        /*
        toastr.clear();
        if (!$scope.activite) {
          $scope.activite = 'NULL';
        }

        if (!$scope.busnessunit) {
          $scope.busnessunit = 'NULL';
        }

        pc.obj = {
          "IDFERME": $scope.data.IDFermes,
          "Code": $scope.data.Code,
          "Gerant": $scope.data.Gerant,
          "Nom": $scope.data.Nom,
          "Ville": $scope.data.Ville,
          "Superficie": $scope.data.Superficie,
          "Fax": $scope.data.Fax,
          "datedecreation": moment($scope.datedecreation).format('YYYYMMDD'),
          "Tel": $scope.data.Tel,
          "statutfoncier": $scope.statutfoncier,
          "Adresse": $scope.data.Adresse,
          "busnessunit": $scope.busnessunit,
          "activite": $scope.activite,
          "Altitude": $scope.data.Altitude
        };

        domaine.EditFerme(pc.obj).then(function(res) {
          pc.rescreate = res.data;
          if (pc.rescreate[0].message == 'ajout reussi') {
            toastr.clear();
            toastr.info("Modification réussie", {
              closeButton: true
            });
            NProgress.done();
            $mdDialog.hide();document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
            pc.dtInstance.reloadData();
          } else {
            toastr.clear();
            toastr.error("Une erreur est survenue !", {
              closeButton: true
            });
          }
        });

*/
      };
    }



  });