'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RecolteProfileCalibreDataIntegrationCtrl
 * @description
 * # RecolteProfileCalibreDataIntegrationCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RecolteProfileCalibreDataIntegrationCtrl', function($scope, $translatePartialLoader, Arbre, _url, _appFor, $anchorScroll, translatedwords, $rootScope, $window, $translate, DTOptionsBuilder, $filter, scoring,campagneagricole, $mdDialog, toastr, DTColumnBuilder, $q, $compile, ProfilCalibre, $state, parcellecultural, GroupeOperationnel, VarieteService, $cookies, DTDefaultOptions) {

    //alert();
    var pc = this;
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    pc.ProfileCalibreAction = {};
    pc.showtable = true;
    $scope.visibleAtt = (_appFor == 'domaine') ? false : true;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    pc.dtInstance = {};
    pc.User = $cookies.getObject('globals').currentUser.Nom + " " + $cookies.getObject('globals').currentUser.Prenom;
    pc.IDUser = $cookies.getObject('globals').currentUser.ID;
    pc.IDferme = $cookies.getObject('globals').ferme.IDFerme;
    pc.IDSociete = $cookies.getObject('globals').ferme.IDSociete;
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();


    var permission_data = JSON.parse($window.localStorage.getItem('permission'));
    var permission = {
      modules_array: permission_data[0],
      rubriques_array: permission_data[1],
      sous_modules_array: permission_data[2]
    }

    pc.isAdmin = $cookies.getObject('globals').currentUser.isAdmin;
    

    pc.obj = {
      "DATE_DEBUT": 0,
      "DATE_FIN": moment().format('YYYYMMDD'),
      "id_user" : pc.IDUser
    };

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



    pc.data_to_clone = [];
    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        scoring.get_data_from_profile_profile(pc.obj).then(function(result) {  
          pc.data_to_clone = result.data;
          defer.resolve(pc.data_to_clone);
          NProgress.done();
        });
        return defer.promise;
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
          text: "<i class='fa fa-reorder'></i>",
          action: function(e, dt, node, config) {
            $state.go("scoring");
          },
          titleAttr: "Scoring"
        }
      ]);

    pc.dtColumns = [      
      DTColumnBuilder.newColumn('ferme_name').withTitle("Ferme"),
      DTColumnBuilder.newColumn('dateObservation').withTitle("Date Profile Calibre").renderWith(function(data, type, full, meta) {
        return moment(full.dateObservation).format('DD/MM/YYYY');
      }),
      DTColumnBuilder.newColumn('Ref').withTitle(translatedwords.getTranslatedWord($translate("Parcelle"))),
      DTColumnBuilder.newColumn('Culture').withTitle(translatedwords.getTranslatedWord($translate("Culture"))),
      DTColumnBuilder.newColumn('Variete').withTitle(translatedwords.getTranslatedWord($translate("Variété")))
    ];

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');


    pc.clone_data = function() {
      $mdDialog.show({
          controller: Dialogscript_forcumulbufarm,
          templateUrl: '././views/templates/clone_data_scoring/procession.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true,
          escapeToClose: false
        })
        .then(function(answer) {}, function() {});
    }


    function Dialogscript_forcumulbufarm($scope, $mdDialog) {

      
      toastr.clear();

      scoring.clone_data(pc.obj).then(async e => {
        if (e.data.message == "Integration réussie") {
          //validate success
          toastr.clear();
          toastr.info("Integration réussie", {
            closeButton: true
          });
          NProgress.done();
          document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
          pc.dtInstance.reloadData();
          $mdDialog.cancel();
        } else {
          toastr.clear();
          toastr.error(e.data, {
            closeButton: true
          });
          NProgress.done();          
          $mdDialog.cancel();
        }
      }).catch(async e => {
        toastr.clear();
        toastr.error(e.data.description, {
          closeButton: true
        });        
        $mdDialog.cancel();
        NProgress.done();
      });


      $scope.hideAvancer = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Annuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };


    }






    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
    }
    //starting date change listner
    pc.date_debut_change = function() {

      var dateToChoose = $scope.date_debut;
      if (validateInput(dateToChoose))
        dateToChoose = 0;

      pc.obj.DATE_DEBUT = moment(dateToChoose).format('YYYYMMDD');
      try {
        pc.dtInstance.reloadData();
      } catch (e) {}


    };

    //by date_fin
    pc.date_fin_change = function() {

      var dateToChoose = $scope.date_fin;
      if (validateInput(dateToChoose))
        dateToChoose = 0;

      pc.obj.DATE_FIN = moment(dateToChoose).format('YYYYMMDD');
      try {
        pc.dtInstance.reloadData();
      } catch (e) {}


    };

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