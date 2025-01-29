"use strict";

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ProfilGestionprofilsCtrl
 * @description
 * # ProfilGestionprofilsCtrl
 * Controller of the beeOneWebFrontApp
 */
angular
  .module("beeOneWebFrontApp")
  .controller(
    "ProfilGestionprofilsCtrl",
    function(
      $scope,
      $translatePartialLoader,
      translatedwords,
      $translate,
      $window,
      DTOptionsBuilder,
      DTColumnBuilder,
      $q,
      $compile,
      gestionprofils,
      $state,
      DTDefaultOptions,
      $cookies,
      $templateCache,
      toastr,
      ModuleManager
    ) {
      var pc = this;
      $translatePartialLoader.addPart("conduitetechnique");
      $translate.use($window.localStorage.getItem("lang").toLowerCase());
      $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
      pc.dtInstance = {};
      var titleHtml =
        '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
      pc.selected = {};
      pc.selectAll = false;
      pc.toggleAll = toggleAll;
      pc.toggleOne = toggleOne;
      pc.userLoged =
        $cookies.getObject("globals").currentUser.Nom +
        " " +
        $cookies.getObject("globals").currentUser.Prenom;
      pc.profiledata = [];

      $scope.ReverseDisplay = function(d) {
        if (document.getElementById(d).style.display === "none") {
          document.getElementById(d).style.display = "block";
        } else {
          document.getElementById(d).style.display = "none";
        }
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

      //set date input
      $scope.date_fin = moment(
        moment().format("YYYY-MM-DD"),
        "YYYY-MM-DD"
      ).toDate();
      $scope.current_date = moment(
        moment().format("YYYY-MM-DD"),
        "YYYY-MM-DD"
      ).toDate();

      pc.obj = {
        Non: "",
        Prenom: "",
        Email: "",
        Phone: "",
        Login: "",
        Password: "",
        IsAdmin: 1,
      };

      //get data and refresh datatable
      $scope.updateProfil = function(data) {
        return gestionprofils.getUsers(data);
      };

      $scope.AddEditProfile = function() {
        $("#confirmpassword").val("");
        document.getElementById("table").style.display = "none";
        document.getElementById("form").style.display = "block";

        document.getElementById("remove").style.display = "block";
        document.getElementById("delete").style.display = "block";
        document.getElementById("block").style.display = "block";
      };

      $scope.ShowTable = function() {
        $("#confirmpassword").val("");
        pc.profiledata = [];
        document.getElementById("table").style.display = "block";
        document.getElementById("form").style.display = "none";
        document.getElementById("remove").style.display = "none";
        document.getElementById("delete").style.display = "none";
        document.getElementById("block").style.display = "none";
      };

      $scope.AddEditProfileForm = function(mydata) {
        $scope.AddEditProfile();
        pc.profiledata = mydata;
        $scope.passwordconfirm = pc.profiledata.Password;
        //$('#confirmpassword').val(mydata.Password);
      };
      //defer.resolve(res.data); defer.promise;
      pc.checklogin = async function(login) {
        $scope.loginchecker = false;
        var deferr = $q.defer();
        await $scope.updateProfil().then(async function(res) {
          await angular.forEach(res.data, function(allprofils) {
            if (login == allprofils.Login) {
              $scope.loginchecker = true;
            }
          });
          NProgress.done();
        });
        return $scope.loginchecker;
      };

      pc.checkloginEdit = async function(login, IDprofile) {
        $scope.loginchecker = false;
        var deferr = $q.defer();
        await $scope.updateProfil().then(async function(res) {
          await angular.forEach(res.data, function(allprofils) {
            if (login == allprofils.Login && IDprofile != allprofils.ID) {
              $scope.loginchecker = true;
            }
          });
          NProgress.done();
        });
        return $scope.loginchecker;
      };

      pc.MAJUser = async function(ID_Profil) {
        if (ID_Profil) {
          //EDIT

          if (pc.profiledata.Password == $scope.passwordconfirm) {
            pc.checkloginEdit(pc.profiledata.Login, ID_Profil).then(
              async function(result) {
                if (!result) {
                  if (!pc.profiledata.isAdmin) {
                    pc.heIsAdmin = 0;
                  } else {
                    pc.heIsAdmin = 1;
                  }

                  if (!pc.profiledata.is_colab) {
                    pc.heis_colab = 0;
                  } else {
                    pc.heis_colab = 1;
                  }

                  if (!pc.profiledata.Phone) {
                    pc.profiledata.Phone = "";
                  }

                  if (!pc.profiledata.Mail) {
                    pc.profiledata.Mail = "";
                  }
                  pc.profiledata.role = (pc.profiledata.role == 2 && !pc.profiledata.isAdmin) ? pc.profiledata.role : 1;

                  $scope.datainsert =
                    "set Nom = '" + pc.profiledata.Nom + "', ";
                  $scope.datainsert +=
                    "Prenom = '" + pc.profiledata.Prenom + "', ";
                  $scope.datainsert +=
                    "Phone = '" + pc.profiledata.Phone + "', ";
                  $scope.datainsert += "Mail = '" + pc.profiledata.Mail + "', ";
                  $scope.datainsert +=
                    "Login = '" + pc.profiledata.Login + "', ";
                  $scope.datainsert +=
                    "Password = '" + pc.profiledata.Password + "', ";
                  $scope.datainsert +=
                    "role = '" + pc.profiledata.role + "', ";
                  $scope.datainsert +=
                    "isAdmin =  " +
                    pc.heIsAdmin + " , is_colab = " + pc.heis_colab +
                    "  WHERE ID = '" +
                    ID_Profil +
                    "';";

                  gestionprofils
                    .UpdateUsers({
                      DATAINSERT: $scope.datainsert,
                    })
                    .then(async function(res) {
                      pc.rescreate = res.data;
                      if (pc.rescreate[0].message == "ajout reussi") {
                        toastr.clear();
                        toastr.info(
                          await translatedwords.getTranslatedWord(
                            $translate("Modification réussie")
                          ), {
                            closeButton: true,
                          }
                        );
                        NProgress.done();
                        $scope.datainsert = "";
                        $scope.ShowTable();
                        pc.dtInstance.reloadData();
                      } else {
                        toastr.clear();
                        toastr.error(
                          await translatedwords.getTranslatedWord(
                            $translate("Une erreur est survenue !")
                          ), {
                            closeButton: true,
                          }
                        );
                      }
                    });
                } else {
                  toastr.clear();
                  toastr.info(
                    await translatedwords.getTranslatedWord(
                      $translate("Login deja exist !!")
                    ), {
                      closeButton: true,
                    }
                  );
                }
              }
            );
          } else {
            toastr.clear();
            toastr.info(
              await translatedwords.getTranslatedWord(
                $translate("Les mots de passe saisis ne sont pas identiques !!")
              ), {
                closeButton: true,
              }
            );
          }
        } else {
          //ADD
          if (
            pc.profiledata.Nom &&
            pc.profiledata.Prenom &&
            pc.profiledata.Login &&
            pc.profiledata.Password &&
            $scope.passwordconfirm
          ) {
            if (pc.profiledata.Password == $scope.passwordconfirm) {
              pc.checklogin(pc.profiledata.Login).then(async function(result) {
                if (!result) {
                  if (!pc.profiledata.isAdmin) {
                    pc.heIsAdmin = 0;
                  } else {
                    pc.heIsAdmin = 1;
                  }

                  if (!pc.profiledata.is_colab) {
                    pc.heis_colab = 0;
                  } else {
                    pc.heis_colab = 1;
                  }

                  if (!pc.profiledata.Phone) {
                    pc.profiledata.Phone = "";
                  }

                  if (!pc.profiledata.Mail) {
                    pc.profiledata.Mail = "";
                  }

                  pc.profiledata.role = (pc.profiledata.role && !pc.profiledata.isAdmin) ? pc.profiledata.role : 1;

                  $scope.datainsert = "('" + pc.profiledata.Nom + "";
                  $scope.datainsert += "','" + pc.profiledata.Prenom + "";
                  $scope.datainsert += "','" + pc.profiledata.Phone + "";
                  $scope.datainsert += "','" + pc.profiledata.Mail + "";
                  $scope.datainsert += "','" + pc.profiledata.Login + "";
                  $scope.datainsert += "','" + pc.profiledata.Password + "";
                  $scope.datainsert += "','" + pc.heIsAdmin + "";
                  $scope.datainsert += "','" + pc.heis_colab + "";
                  $scope.datainsert += "','" + 0 + "";
                  $scope.datainsert += "','" + pc.userLoged + "";
                  $scope.datainsert += "','" + moment().format("YYYYMMDD") + "";
                  $scope.datainsert += "','" + pc.profiledata.role + "";
                  $scope.datainsert += "')";

                  gestionprofils
                    .CreateUsers({
                      DATAINSERT: $scope.datainsert,
                    })
                    .then(async function(res) {
                      pc.rescreate = res.data;
                      if (pc.rescreate[0].message == "ajout reussi") {
                        toastr.clear();
                        toastr.info(
                          await translatedwords.getTranslatedWord(
                            $translate("Ajout reussi!")
                          ), {
                            closeButton: true,
                          }
                        );
                        NProgress.done();
                        $scope.datainsert = "";
                        $scope.ShowTable();
                        pc.dtInstance.reloadData();
                      } else {
                        toastr.clear();
                        toastr.error(
                          await translatedwords.getTranslatedWord(
                            $translate("Une erreur est survenue !")
                          ), {
                            closeButton: true,
                          }
                        );
                      }
                    });
                } else {
                  toastr.clear();
                  toastr.info(
                    await translatedwords.getTranslatedWord(
                      $translate("Login deja exist !!")
                    ), {
                      closeButton: true,
                    }
                  );
                }
              });
            } else {
              toastr.clear();
              toastr.info(
                await translatedwords.getTranslatedWord(
                  $translate(
                    "Les mots de passe saisis ne sont pas identiques !!"
                  )
                ), {
                  closeButton: true,
                }
              );
            }
          } else {
            toastr.clear();
            toastr.info(
              await translatedwords.getTranslatedWord(
                $translate("Veuillez renseigner les champs obligatoires (*)!!")
              ), {
                closeButton: true,
              }
            );
          }
        }
      };

      pc.DeleteUser = async function(ID_Profil) {
        toastr.clear();
        if (ID_Profil) {
          toastr.info(
            "<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" +
            (await translatedwords.getTranslatedWord(
              $translate("Je confirme")
            )) +
            "</button>",
            await translatedwords.getTranslatedWord(
              $translate("Veuillez confirmer la suppression")
            ), {
              closeButton: true,
              allowHtml: true,
              onShown: function(toast) {
                $("#confirmationRevertYes").click(function() {
                  gestionprofils
                    .DeleteUsers({
                      idprofil: ID_Profil,
                    })
                    .then(async function(res) {
                      pc.resdelete = res.data;
                      if (pc.resdelete[0].message == "ajout reussi") {
                        toastr.clear();
                        toastr.info(
                          await translatedwords.getTranslatedWord(
                            $translate("Suppression réussie")
                          ), {
                            closeButton: true,
                          }
                        );
                        NProgress.done();
                        $scope.datainsert = "";
                        $scope.ShowTable();
                        pc.dtInstance.reloadData();
                      } else {
                        toastr.clear();
                        toastr.error(
                          await translatedwords.getTranslatedWord(
                            $translate("Une erreur est survenue !")
                          ), {
                            closeButton: true,
                          }
                        );
                      }
                    });
                });
              },
            }
          );
        }
      };

      pc.BlockUser = async function(ID_Profil, etat) {
        toastr.clear();
        if (ID_Profil) {
          toastr.info(
            "<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" +
            (await translatedwords.getTranslatedWord(
              $translate("Je confirme")
            )) +
            "</button>",
            await translatedwords.getTranslatedWord(
              $translate("Veuillez confirmer le bloque")
            ), {
              closeButton: true,
              allowHtml: true,
              onShown: function(toast) {
                $("#confirmationRevertYes").click(function() {
                  gestionprofils
                    .BlockerUsers({
                      idprofil: ID_Profil,
                      etat: etat,
                    })
                    .then(async function(res) {
                      pc.resdelete = res.data;
                      if (pc.resdelete[0].message == "ajout reussi") {
                        toastr.clear();
                        toastr.info(
                          await translatedwords.getTranslatedWord(
                            $translate("Bloquage reussite")
                          ), {
                            closeButton: true,
                          }
                        );
                        NProgress.done();
                        $scope.datainsert = "";
                        $scope.ShowTable();
                        pc.dtInstance.reloadData();
                      } else {
                        toastr.clear();
                        toastr.error(
                          await translatedwords.getTranslatedWord(
                            $translate("Une erreur est survenue !")
                          ), {
                            closeButton: true,
                          }
                        );
                      }
                    });
                });
              },
            }
          );
        }
      };

      pc.moduleManager = (profile) => {
        ModuleManager.showModal({
          profilData: profile,
        });
      };
      pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
          var defer = $q.defer();
          $scope.updateProfil().then(function(res) {
            defer.resolve(res.data);
            NProgress.done();
          });
          return defer.promise;
        })
        .withOption("deferRender", true)
        .withDOM("<lf<t>ip>")
        .withPaginationType("simple_numbers")
        .withDisplayLength(10)
        .withOption("createdRow", createdRow)
        .withOption("headerCallback", headerCallback)
        .withOption(
          "fnRowCallback",
          function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $("td", nRow).bind("click", function() {
              $scope.$apply(function() {
                $("td").css("background-color", "");
                $("td", nRow).css("background-color", "#ECECDE");
                $scope.AddEditProfileForm(aData);
              });
            });
            return nRow;
          }
        )
        .withOption("order", [0, "asc"])
        .withScroller()
        .withOption('responsive', true)
        .withLanguage(
          $.getJSON(
            `/scripts/i18n/datatable/${$window.localStorage
              .getItem("lang")
              .toLowerCase()}.json`,
            function(data) {
              return data;
            }
          )
        )
        .withOption("scrollY", "50vh")
        .withOption("scrollX", "auto")
        .withButtons([{
            extend: "colvis",
            text: "<i class='fa fa-eye'></i>",
            className: "pull-left",
            titleAttr: translatedwords.getTranslatedWord(
              $translate("Visibilité")
            ),
          },
          {
            text: "<i class='fa fa-plus'></i>",
            action: function(e, dt, node, config) {
              $scope.AddEditProfile();
            },
            className: "pull-left",
            titleAttr: translatedwords.getTranslatedWord($translate("Ajouter")),
          },
          {
            extend: "copy",
            text: "<i class='fa fa-copy'></i>",
            titleAttr: translatedwords.getTranslatedWord($translate("Copie")),
          },
          {
            extend: "print",
            text: "<i class='fa fa-print'></i>",
            titleAttr: translatedwords.getTranslatedWord(
              $translate("Imprimer")
            ),
          },
          {
            extend: "pdf",
            text: "<i class='fa fa-file-pdf-o'></i>",
            titleAttr: "PDF",
          },
          {
            extend: "excel",
            text: "<i class='fa fa-file-excel-o'></i>",
            titleAttr: "EXCEL",
          },
        ]);
      pc.dtColumns = [
        DTColumnBuilder.newColumn("DateCreated")
        .withTitle(
          translatedwords.getTranslatedWord($translate("Date de création"))
        )
        .renderWith(function(data, type, full, meta) {
          return moment(full.DateCreated).format("DD/MM/YYYY");
        }),
        DTColumnBuilder.newColumn("Nom").withTitle(
          translatedwords.getTranslatedWord($translate("Nom"))
        ),
        DTColumnBuilder.newColumn("Prenom").withTitle(
          translatedwords.getTranslatedWord($translate("Prénon"))
        ),
        DTColumnBuilder.newColumn("Mail").withTitle(
          translatedwords.getTranslatedWord($translate("E-mail"))
        ),
        DTColumnBuilder.newColumn("Phone").withTitle(
          translatedwords.getTranslatedWord($translate("Téléphone"))
        ),
        DTColumnBuilder.newColumn("Login")
        .withTitle(translatedwords.getTranslatedWord($translate("Login")))
        .renderWith(function(data, type, full, meta) {
          if (
            $cookies.getObject("globals").currentUser.username == full.Login
          ) {
            return (
              "<span class='badge-green'>" +
              full.Login +
              "</span>&nbsp;&nbsp;<span class='badge-blue-unclear_withe'>Moi</span>"
            );
          } else {
            return "<span class='badge-green'> " + full.Login + "</span>";
          }
        }),
        DTColumnBuilder.newColumn("Etat")
        .withTitle(translatedwords.getTranslatedWord($translate("Etat")))
        .renderWith(function(data, type, full, meta) {
          var msgetat = "";
          if (full.Etat) {
            msgetat += "<i class='fa fa-lock'></i>";
          } else {
            msgetat += "<i class='fa fa-unlock'></i>";
          }
          if (full.isAdmin) {
            msgetat +=
              "&nbsp;&nbsp;<span class='badge-blue-unclear_withe'> <i class='fa fa-user-secret'></i>&nbsp;Administrateur </span>";
          } else {
            msgetat += (full.role == 1) ?
              "&nbsp;&nbsp;<span class='badge-orange_withe'> <i class='fa fa-user'></i>&nbsp;Opérateur </span>" :
              "&nbsp;&nbsp;<span class='badge-pink_withe'> <i class='fa fa-user'></i>&nbsp;Responsable qualité </span>";
          }
          return msgetat;
        }),
        DTColumnBuilder.newColumn("is_colab")
        .withTitle(translatedwords.getTranslatedWord($translate("BeeOne Manager")))
        .renderWith(function(data, type, full, meta) {
          if (full.is_colab)
            return "Oui";
          return "";
        }),
        DTColumnBuilder.newColumn("CreatedBy").withTitle(
          translatedwords.getTranslatedWord($translate("Créé par"))
        ),
      ];

      DTDefaultOptions.setLoadingTemplate(
        '<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>'
      );

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
        return (
          '<button class="btn btn-warning btn-xs" ng-click="pc.edit(pc.obj[' +
          data.ID +
          '])">' +
          '   <i class="fa fa-edit"></i>' +
          "</button>&nbsp;" +
          '<button class="btn btn-danger btn-xs" ng-click="pc.delete(pc.obj[' +
          data.ID +
          '])" )"="">' +
          '   <i class="fa fa-trash-o"></i>' +
          "</button>"
        );
      }
    }
  );