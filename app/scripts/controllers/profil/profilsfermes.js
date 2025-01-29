'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ProfilProfilsfermesCtrl
 * @description
 * # ProfilProfilsfermesCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ProfilProfilsfermesCtrl', function($scope, $translatePartialLoader, translatedwords, $translate, $window, DTOptionsBuilder, DTColumnBuilder, $q, $compile, $state, DTDefaultOptions, $cookies, profilsfermes, _url, toastr, $mdDialog, $interval, domaine, gestionprofils) {

    var pc = this;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.dtInstance = {};
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    pc.AllProfilsFermes = [];
    pc.domaines = [];
    pc.users = [];
    $scope.reload = true;


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

    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Users").selectpicker('refresh');
      $("#Domaine").selectpicker('refresh');
    }, 1000);



    $scope.showAdvanced = function(ev) {
      $mdDialog.show({
          controller: DialogController,
          templateUrl: '././views/templates/profil/Addprofilsfermes.html',
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

    $scope.checkedFruits = [];
    $scope.toggleCheck = function(data) {

    };



    function DialogController($scope, $mdDialog) {
      //$scope.dmydomaines = pc.domaines;
      $scope.dmyusers = pc.users;
      $scope.selectedDomaines = [];
      $scope.selectedUser = [];
      $scope.dmyprofilferme = pc.AllProfilsFermes;

      $scope.refresh = function() {
        $q.all([
          profilsfermes.getavailibalefermes({
            ID: $scope.selectedUser.ID
          })
        ]).then((values) => {
          $scope.dmydomaines = values[0].data;
          $scope.selectedDomaines = [];
          NProgress.done();
        });

      }


      $scope.selectAllItems = function(dmydomaines) {
        // Check if all items are already selected
        if ($scope.selectedDomaines.length === dmydomaines.length) {
          // If all items are selected, deselect all
          $scope.selectedDomaines = [];
        } else {
          // If not all items are selected, select all
          $scope.selectedDomaines = dmydomaines.slice();
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

      $scope.Ajouter = async function() {
        toastr.clear();
        var datadomaines = [];
        var datainsert = "";
        if ($scope.selectedDomaines.length > 0 && $scope.selectedUser) {
          angular.forEach($scope.selectedDomaines, function(mydt) {
            if (mydt)
              datadomaines.push(mydt.IDFermes);
          })
          for (var i = 0; i < datadomaines.length; i++) {
            datainsert += "('Admin',";
            datainsert += "'" + moment().format('YYYYMMDD') + "',";
            datainsert += "'" + $scope.selectedUser.ID + "',";
            datainsert += "'" + datadomaines[i] + "'";
            datainsert += "),";
          }
          profilsfermes.Create({
            "DATAINSERT": datainsert.substring(0, datainsert.length - 1)
          }).then(async function(res) {
            pc.rescreate = res.data;
            if (pc.rescreate[0].message == 'ajout reussi') {
              toastr.clear();
              toastr.info(await translatedwords.getTranslatedWord($translate("Ajout reussi!")), {
                closeButton: true
              });
              NProgress.done();
              $mdDialog.hide();
              document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
              pc.loadData();
            } else {
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("Une erreur est survenue !")), {
                closeButton: true
              });
            }
          });
        } else {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs !")), {
            closeButton: true
          });
        }
      };
    }

    pc.Retirer = async function(ID) {
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            profilsfermes.Retirer({
              "ID": ID
            }).then(async function(res) {
              pc.resdelete = res.data;
              if (pc.resdelete[0].message == 'ajout reussi') {
                toastr.clear();
                toastr.info(await translatedwords.getTranslatedWord($translate("Action reussite")), {
                  closeButton: true
                });
                NProgress.done();
                pc.loadData();
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

    //load domaines
    $scope.Loaddomaines = domaine.getDomaine().then(function(res) {
      pc.domaines = res.data;
    });

    //load users
    $scope.Loadusers = gestionprofils.getUsers().then(function(res) {
      pc.users = res.data;
    });

    $q.all([$scope.Loaddomaines, $scope.Loadusers]).then(function(values) {
      setTimeout(function() {
        $("#Users").selectpicker('refresh');
        $("#Domaine").selectpicker('refresh');
      }, 1000);
    });

    pc.obj = {
      "FERMES": [0],
      "USERS": [0]
    };

    pc.manageViews = () => {
      if ($scope.reload) {
        $("#loadingData").show();
        $("#printThis").hide();
      } else {
        $("#loadingData").hide();
        $("#printThis").show();
      }
    };

    pc.loadData = () => {
      $q.all([profilsfermes.getProfilsFermes(pc.obj)]).then(function(values) {
        pc.AllProfilsFermes = values[0].data;
        $scope.reload = false;
        pc.manageViews();
        NProgress.done();
      });
    }

    pc.loadData();


    //by users
    $scope.users_change = function() {
      if ($scope.users.users === null || $scope.users.users === "" || $scope.users.users === undefined || $scope.users.users === 0 || $scope.users.users === "0" || !$scope.users.users || $scope.users.users.length === 0 || $scope.users.users.includes(0)) {
        $scope.users_sel = [0];
      } else {
        $scope.users_sel = $scope.users.users;
      }
      pc.obj.USERS = $scope.users_sel;
      $scope.reload = true;
      pc.manageViews();
      pc.loadData();
    };

    //by users
    $scope.domaine_change = function() {
      if ($scope.domaine.domaine === null || $scope.domaine.domaine === "" || $scope.domaine.domaine === undefined || $scope.domaine.domaine === 0 || $scope.domaine.domaine === "0" || !$scope.domaine.domaine || $scope.domaine.domaine.length === 0 || $scope.domaine.domaine.includes(0)) {
        $scope.domaine_sel = [0];
      } else {
        $scope.domaine_sel = $scope.domaine.domaine;
      }
      pc.obj.FERMES = $scope.domaine_sel;
      pc.loadData();
    };

    //print table pdf
    pc.printPdf = (e) => {
      $("#printThis").height("100%");
      javascript: window.print();
    };

    //print table Excel
    pc.printExcel = (e) => {
      $("#tableDataShow").table2excel({
        exclude: ".noExl",
        exclude_img: true,
        file_ext: ".xls",
        name: "AffectationDomaines",
        filename: "Affectation des domaines.xls",
        preserveColors: true
      });
    };

    //search table listner
    $("#search").on("keyup", function() {
      if (pc.AllProfilsFermes.length != 0) {
        var value = $(this).val().toLowerCase();
        var classShow = [];
        $("table tr").each(function(index) {
          if (index != 0) {

            var $row = $(this);

            $row.find("td").each(function(index) {
              var id = $(this).text().toLowerCase();
              if (id.indexOf(value) != 0) {
                if (!classShow.includes($row.attr('class'))) {
                  $("." + $row.attr('class')).hide();
                }
              } else {
                $("." + $row.attr('class')).show();
                classShow.push($row.attr('class'));
              }

            });
          }
        });
      }
    })

    pc.markThoseLine = (Reference) => {
      $('tr').css('background-color', '');
      $('.' + Reference.replace(/ /g, "_")).css('background-color', '#fff6b5');
    };

    pc.printPdf = (e) => {
      $("#printThis").height("100%");
      javascript: window.print();
    };


    //DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');



  });