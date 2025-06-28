'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ConfigurationAttachementParcellesVAttachementParcellesCulturaleCtrl
 * @description
 * # ConfigurationAttachementParcellesVAttachementParcellesCulturaleCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ConfigurationAttachementParcellesVAttachementParcellesCulturaleCtrl', function (
    $q,
    $scope,$mdDialog,
    toastr,portGreffe,
    $timeout,
    _url,VarieteService,parcelleCulturalService,
    $window,
    $translatePartialLoader,produitrendement,
    $translate,
    _version,
    DTOptionsBuilder,
    $compile,
    DTColumnBuilder,
    DTDefaultOptions,
    $cookies,
    ferme,parcelleCultural, profilProduction,
    familleculture
  ) {
    var vm = this;
    vm._version = _version;

    vm.form_part = false;

    vm.hideshow_form_par = function() {
      vm.form_par = !vm.form_par;
    };

    vm.User = $cookies.getObject('beeoneAssistant').assistUser.Nom + " " + $cookies.getObject('beeoneAssistant').assistUser.Prenom;
    vm.IDUser = $cookies.getObject('beeoneAssistant').assistUser.ID;

    $translatePartialLoader.addPart("conduitetechnique");
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    $scope.fileName = "Aucun fichier choisi";
    $scope.uploadFile = function (element) {
      var file = element.files[0];
      if (file) {
        $scope.fileName = file.name;
        $scope.$apply();
      }
    };


    $scope.uploadFile = function (event) {
      var file = event.target.files[0];
      if (file) {
        $scope.fileName = file.name;
        $scope.$apply();
      }
    };

    $scope.isDragging = false;

    // Trigger file input when clicking on the card
    $scope.triggerFileInput = function () {
      document.getElementById("fileInput").click();
    };

    let allowedExtensions = ["xls", "xlsx"];
    vm.jsonData = [];
    // Handle file selection (when clicked)
    $scope.onFileSelected = function (file) {
      if (file) {
        // Get file extension (convert to lowercase for case-insensitive check)
        let fileExtension = file.name.split(".").pop().toLowerCase();

        // Allowed extensions

        if (allowedExtensions.includes(fileExtension)) {




          let reader = new FileReader();
          reader.readAsBinaryString(file);
          reader.onload = async function (e) {
            let data = e.target.result;
            let workbook = XLSX.read(data, { type: "binary" });

            // Assuming the first sheet contains the data
            let sheetName = workbook.SheetNames[0];
            let sheet = workbook.Sheets[sheetName];

            // Convert sheet to JSON

            vm.jsonData = XLSX.utils.sheet_to_json(sheet, {
              defval: "",  // Ensures empty cells are included
              raw: true    // Keeps data as-is without automatic conversion
          });

            let {status, message} = await $scope.checkExcelHeaders(vm.jsonData)



            if(status){

              vm.jsonData = await  vm.transformExcelData(vm.jsonData);



                 //infos
          vm.isFileSelected = true;
          vm.fileName = file.name;

          if (file.size >= 1024 * 1024) {
            vm.fileSize = (file.size / (1024 * 1024)).toFixed(2) + " MB";
          } else {
            vm.fileSize = (file.size / 1024).toFixed(2) + " KB";
          }

            }else{
              vm.isFileSelected = false;
              toastr.clear();
              toastr.warning(message, {
              closeButton: true,
             });
            }

           /* $scope.$apply(() => {
                $scope.excelData = jsonData; // Store JSON data in scope
            });*/



        };

        reader.onerror = function (error) {
          console.log("onerror",error);

            vm.isFileSelected = false;
            toastr.clear();
            toastr.warning("Error reading file", {
            closeButton: true,
          });
        };




        } else {
          vm.isFileSelected = false;
          toastr.clear();
          toastr.warning("Only XLS and XLSX files are allowed.", {
            closeButton: true,
          });
        }
      } else {
        vm.isFileSelected = false;
      }
    };

    vm.delete_file = function () {
      vm.isFileSelected = false;
      vm.resetErrExcel();
      vm.jsonData = [];
    };

    // Handle drag events
    $scope.onDragOver = function (event) {
      event.preventDefault();
      event.stopPropagation();
      $scope.isDragging = true;
      $scope.$apply();
    };

    $scope.onDragLeave = function (event) {
      $scope.isDragging = false;
      $scope.$apply();
    };

    // Handle file drop
    $scope.onDrop = function (file) {
      $scope.isDragging = false;
      if (file.length > 0) {
        vm.isFileSelected = true;
        vm.fileName = file.name;
        if (file.size >= 1024 * 1024) {
          // If size is 1MB or more, show in MB
          vm.fileSize = (file.size / (1024 * 1024)).toFixed(2) + " MB";
        } else {
          // Otherwise, show in KB
          vm.fileSize = (file.size / 1024).toFixed(2) + " KB";
        }
      } else {
        vm.isFileSelected = false;
      }
    };





    /** Table */

    vm.dtInstance = {};
    vm.selected = {};
    vm.selectAll = false;

    //get data and refresh datatable
    vm.data_parcelleCul = [];


    vm.reset = function () {
      vm.data_parcelleCulbyFarm = [];
      vm.data_variete = [];
      vm.data_Produit_Rendement = [];
      vm.data_profilProduction = [];
      vm.formData =  {
        IDFermes : null,
        IDParcelle: null,
        Ref: null,
        Reference: null,
        Groupe_culturale: null,
        Sup: null,
        IDVariete: null,
        id_bdg_profil_production: null,
        IDProduit_Rendement: null,
        Mode_Application: null,
        Type_plant: null,
        Generation: null,
        Dat_Plant: null,
        Date_prevu_recolte: null,
        Date_Previsionnelle: null,
        Nbre_plant: null,
        Nbr_plant_therique: null,
        NBr_manquants: null,
        Ecartement: null,
        Densite: null,
        surgreffee: 0,
        IDPorte_greffe: null,
        Date_debut_prouduction: null,
        Date_pleine_production: null,
        Date_fin_recolte: null,
        Dat_Arrach: null,
      }
     }
   vm.reset()

    NProgress.start();
    $q.all([
      ferme.get_all(),
      portGreffe.get_all()
    ]).then((values) => {
      vm.data_ferme = values[0].data;
      vm.data_Greffe = values[1].data;
      vm.data_search_Type_plant = [{
        ID : 1,
        name : 'Plants'
      },{
        ID : 2,
        name : 'Semence'
      }]
      NProgress.done();
    }).catch((error) => {
      NProgress.done();
      toastr.clear();
      toastr.error(error.message, {
        closeButton: true
      });
    });

    $scope.get_parcelle = function() {
          NProgress.start();

          $q.all([parcelleCultural.getbyferme({
            IDFermes: vm.formData.IDFermes
          }),
          VarieteService.getbyferme({
            IDFermes: vm.formData.IDFermes
          }),produitrendement.getbyferme({
            IDFermes: vm.formData.IDFermes
          }),profilProduction.getbyferme({
            IDFermes: vm.formData.IDFermes
          })]).then((values) => {
            NProgress.done();
            vm.data_parcellebyFarm = values[0].data;
            vm.data_variete = values[1].data;
            vm.data_Produit_Rendement = values[2].data;
            vm.data_profilProduction = values[3].data;
          })


      }


    vm.types = [{
      id : 1,
      name : 'Plein champ'
    },{
      id : 2,
      name : 'Sous serre'
    }]

    vm.selectedFarm = [];



    vm.modifier = async function  () {

        if(await vm.validateFormData()){
          NProgress.start()   ;

          parcelleCulturalService.edit(vm.formData).then(async e => {

              toastr.clear();
              toastr.success(e.data.message, {
                closeButton: true
              });
              NProgress.done();
              vm.dtInstance.reloadData();
              vm.reset();
              await $scope.undoSelect()

          }).catch(async e => {
            NProgress.done();
            toastr.clear();
            toastr.error(e.data.message, {
              closeButton: true
            });
          });
        }
    };


    vm.validateFormData = async function() {

          let rules = {
            IDFermes : "Ferme is required.",
            IDParcelle: "Parcelle is required.",
            Ref: "Réf is required.",
            Reference: "Référence is required.",
            Groupe_culturale: "Groupe culturale is required.",
            Sup: "Superficie is required.",
            IDVariete: "Variété is required.",
            Type_plant: "Mode de plantation is required",
            Dat_Plant: "Date de plantation is required",
            Date_Previsionnelle: "Date début de travaux is required",
            Ecartement: "Ecartement is required.",
            Densite: "Densité is required.",
          };


          for (let key in rules) {
              if (vm.formData[key] === null || vm.formData[key] === undefined || vm.formData[key] === '') {
                  toastr.clear();
                  toastr.warning(typeof rules[key] === "function" ? rules[key](vm.formData[key]) : rules[key], {
                    closeButton: true
                  });

                  return false;
              }
          }
          return true;
     };

    vm.ajouter = async function  () {
      toastr.clear();
        if(await vm.validateFormData()){
          NProgress.start()
          parcelleCulturalService.add(vm.formData).then(async e => {
              toastr.clear();
              toastr.success(e.data.message, {
                closeButton: true
              });
              await $scope.undoSelect()
              NProgress.done();
              vm.dtInstance.reloadData();
              vm.reset();
          }).catch(async e => {
            NProgress.done();
            toastr.clear();
            toastr.error(e.data.message, {
              closeButton: true
            });
          });

        }


    };


      vm.multiDelete = async function() {

        let selectedIds = await $scope.getSelectedIDs(vm.data_parcelleCul);

        toastr.clear();
        toastr.error("<button type='button' id='confirmationRevertYes' class='btn btn-danger' style='float : right;'>Je confirme </button>", "Veuillez confirmer !", {
          closeButton: true,
          allowHtml: true,
          onShown: function(toast) {

            $("#confirmationRevertYes").click(function() {
              NProgress.start()
              parcelleCultural.multidelete({
                IDs : selectedIds
              }).then(async function(result) {

                await $scope.undoSelect()
                toastr.clear();
                toastr.success(result.data.message, {
                  closeButton: true
                });
                NProgress.done();
                vm.dtInstance.reloadData();

              }).catch(async e => {
                NProgress.done();
                console.log();
                toastr.clear();
                toastr.error(e.data.message, {
                  closeButton: true
                });
              });
            });
          }
        });

      }


    vm.delete = async function(data) {

      toastr.clear();
      toastr.error("<button type='button' id='confirmationRevertYes' class='btn btn-danger' style='float : right;'>Je confirme </button>", "Veuillez confirmer !", {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            NProgress.start()
            parcelleCulturalService.delete(data).then(async function(result) {

              await $scope.undoSelect()
              toastr.clear();
              toastr.success(result.data.message, {
                closeButton: true
              });
              NProgress.done();
              vm.dtInstance.reloadData();

            }).catch(async e => {
              NProgress.done();
              toastr.clear();
              toastr.error(e.data.message, {
                closeButton: true
              });
            });
          });
        }
      });

    }



    $scope.check_all_data_input = async function(){
      var isDuplicate = vm.data_parcelleCul.some(function(societe) {
        return societe.Code === vm.formData.Code;
    });

    if (isDuplicate) {

      toastr.clear();
      toastr.warning("Raison Sociale already esist!", {
        closeButton: true,
      });
        return false
    } else {
        return true;
    }
    }

    $scope.check_all_data_input_edit = async function(){
      var isDuplicate = vm.data_parcelleCul.some(function(societe) {
        return (societe.Rais_Social === vm.formData.Rais_Social && societe.IDFermes != vm.formData.IDFermes);
    });

    if (isDuplicate) {

      toastr.clear();
      toastr.warning("Raison Sociale already esist!", {
        closeButton: true,
      });
        return false
    } else {
        return true;
    }
    }


    $scope.updatedata = function() {
      return parcelleCulturalService.get_all();
    };

    vm.dtOptions = DTOptionsBuilder.fromFnPromise(function () {
      var defer = $q.defer();
        $scope.updatedata().then(function(res) {
          vm.data_parcelleCul = res.data;
          console.log(res.data);

          defer.resolve(res.data);
          NProgress.done();
        });
        return defer.promise;
      })
      .withOption("createdRow", createdRow)
      .withDOM("<lf<t>ip>")
      .withPaginationType("simple_numbers")
      .withOption("pageLength", 5)  // Default number of items per page
       .withOption("lengthMenu", [5, 10, 20, 50, 100])  // Options for page length
      .withOption("responsive", true)
      .withOption("order", [])
      .withButtons([
        {
          extend: "copy",
          className: "pull-left pointer",
          text: "COPY",
          titleAttr: "Copie",
        },
        {
          extend: "excel",
          text: "EXCEL",
          titleAttr: "EXCEL",
          title: 'Liste Des Parcelles Culturale'
        },
      ]);



      vm.parcelleCu_action = {};
      function actionsHtml(data, type, full, meta) {
          vm.parcelleCu_action[data.ID] = data;
          var editbtn =
          '<button class="btnEdit_tb" ng-click="vm.edit(vm.parcelleCu_action[' +
          data.ID +
          '])"><img src="././images/main_configuration/edit.svg" alt="edit"></button>&nbsp;&nbsp;&nbsp;';

           var deletebtn =
          '<button class="btnEdit_tb" ng-click="vm.delete(vm.parcelleCu_action[' +
          data.ID +
          '])"><img src="././images/main_configuration/delete.svg" alt="delete"></button>';


          data.TokenPolygone = (data.TokenPolygone !== "0") ? data.TokenPolygone : null;
          data.TokenPolygone = (data.TokenPolygone) ? data.TokenPolygone : null;
        
          
          const hasPolygon = !!data.TokenPolygone;
          const imgSrc = hasPolygon
            ? '././images/main_configuration/polygone_done.svg'
            : '././images/main_configuration/no_polygone.svg';

          const polygonebtn = `
            <button class="btnEdit_tb" ng-click="vm.polygoneAction(vm.parcelleCu_action[${data.ID}])">
              <img src="${imgSrc}" alt="polygon">
            </button>
          `;


      return polygonebtn + "&nbsp;" + editbtn + deletebtn;
      
      }


      vm.edit = function (data) {
        vm.formData = data;
        vm.formData.Dat_Plant = (vm.formData.Dat_Plant) ? new Date(moment(vm.formData.Dat_Plant).format("YYYY-MM-DD")) : null;

        vm.formData.Date_prevu_recolte = (vm.formData.Date_prevu_recolte) ? new Date(moment(vm.formData.Date_prevu_recolte).format("YYYY-MM-DD")) : null;
        vm.formData.Date_Previsionnelle = (vm.formData.Date_Previsionnelle) ? new Date(moment(vm.formData.Date_Previsionnelle).format("YYYY-MM-DD")) : null;
        vm.formData.Date_debut_prouduction = (vm.formData.Date_debut_prouduction) ? new Date(moment(vm.formData.Date_debut_prouduction).format("YYYY-MM-DD")) : null;
        vm.formData.Date_pleine_production = (vm.formData.Date_pleine_production) ? new Date(moment(vm.formData.Date_pleine_production).format("YYYY-MM-DD")) : null;


        vm.formData.Date_fin_recolte = (vm.formData.Date_fin_recolte) ? new Date(moment(vm.formData.Date_fin_recolte).format("YYYY-MM-DD")) : null;
        vm.formData.Dat_Arrach = (vm.formData.Dat_Arrach) ? new Date(moment(vm.formData.Dat_Arrach).format("YYYY-MM-DD")) : null;

        $q.all([parcelleCultural.getbyferme({
          IDFermes: vm.formData.IDFermes
        }),
        VarieteService.getbyferme({
          IDFermes: vm.formData.IDFermes
        }),produitrendement.getbyferme({
          IDFermes: vm.formData.IDFermes
        }),profilProduction.getbyferme({
          IDFermes: vm.formData.IDFermes
        })]).then((values) => {
          NProgress.done();
          vm.data_parcellebyFarm = values[0].data;
          vm.data_variete = values[1].data;
          vm.data_Produit_Rendement = values[2].data;
          vm.data_profilProduction = values[3].data;
        })

       toastr.clear();
          toastr.success(`The form for editing has been filled out and is ready for modification: ${vm.formData.Ref}. 👆`, {
          closeButton: true
        });

      }





      $scope.allSelected = false; // Tracks "Select All" state

    // Toggle all checkboxes
    vm.toggleAllSelection = function() {
      $scope.allSelected = (!$scope.allSelected) ? true : false;
      vm.data_parcelleCul.forEach(societe => {
          societe.selected = $scope.allSelected; // Toggle selection
      });
      vm.dtInstance.reloadData();
  };

  // Expose function globally
  window.toggleAllSelection = function() {
      $scope.$apply(function() {
          vm.toggleAllSelection();
      });
  };


  $scope.undoSelect = async function(){
    vm.data_parcelleCul = vm.data_parcelleCul.map(societe => {
       return { ...societe, selected: false }; // Toggle selection
   });
  }


  $scope.getSelectedIDs = async function(data) {
    let selectedItems = data.filter(item => item.selected === true); // Get selected items

    let selectedIds = selectedItems.map(item => item.ID); // Extract IDs

    return selectedIds;
  };


    $scope.toggleSelection = function (id) {
      let found = false;
      vm.data_parcelleCul = vm.data_parcelleCul.map(societe => {
          if (societe.ID === id) {
              found = true;
              return { ...societe, selected: !societe.selected }; // Toggle selection
          }
          return societe;
      });
      /* if (!found) {
            vm.data_parcelleCul.push({ id_sco_temp: id, selected: true });
        }    */
  };

    function checkboxHtml(data, type, full, meta) {
        return `<input type="checkbox" ng-checked="data.selected" ng-click="toggleSelection(${data.ID})">`;
    }


    vm.updateSelectedCount = function () {
      return vm.data_parcelleCul.filter(societe => societe.selected).length;
    };


    vm.dtColumns = [
      DTColumnBuilder.newColumn(null)
        .withTitle(
          '#'// '<input type="checkbox" ng-model="vm.allSelected" onclick="toggleAllSelection()">'
        ).renderWith(checkboxHtml).notSortable().withOption("width", "15px"),
        DTColumnBuilder.newColumn("Ferme_nom").withTitle("Ferme").withOption("width", "100px"),
        DTColumnBuilder.newColumn("parcelleRef").withTitle("Parcelle Physique").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Ref").withTitle("Ref").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Reference").withTitle("Référence").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Groupe_culturale").withTitle("Groupe culturale").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Sup").withTitle("Superficie").renderWith(function(data, type, full, meta) {
        if (full.Sup)
              return full.Sup + ' Ha';
          return '';
        }).withOption("width", "100px"),
        DTColumnBuilder.newColumn("Nom_Variete").withTitle("Variété").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Produit_RendementName").withTitle("Produit Rendement").withOption("width", "100px"),
        DTColumnBuilder.newColumn("bdg_profils_production_designation").withTitle("Profile Production").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Type_plant").withTitle("Mode de plantation").renderWith(function(data, type, full, meta) {
          if (full.Type_plant == 1)
                return 'Plants';
            return 'Semence';
        }).withOption("width", "100px"),
        DTColumnBuilder.newColumn("Generation").withTitle("Géneration").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Dat_Plant").withTitle("Date de plantation").renderWith(function(data, type, full, meta) {
          if(full.Dat_Plant)
          return moment(full.Dat_Plant).format('DD/MM/YYYY');
          return ''
        }).withOption("width", "100px"),
        DTColumnBuilder.newColumn("Date_prevu_recolte").withTitle("Date prévue de récolte").renderWith(function(data, type, full, meta) {
          if(full.Date_prevu_recolte)
          return moment(full.Date_prevu_recolte).format('DD/MM/YYYY');
          return ''
        }).withOption("width", "100px"),
        DTColumnBuilder.newColumn("Date_Previsionnelle").withTitle("Date début de travaux").renderWith(function(data, type, full, meta) {
          if(full.Date_Previsionnelle)
          return moment(full.Date_Previsionnelle).format('DD/MM/YYYY');
          return ''
        }).withOption("width", "100px"),
        DTColumnBuilder.newColumn("Nbre_plant").withTitle("Nombre de plants réels").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Nbr_plant_therique").withTitle("Nombre de plants théoriques").withOption("width", "100px"),
        DTColumnBuilder.newColumn("NBr_manquants").withTitle("Nombre de plants manquants").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Ecartement").withTitle("Ecartement").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Densite").withTitle("Densité").withOption("width", "100px"),
        DTColumnBuilder.newColumn("surgreffee").withTitle("Surgreffée").renderWith(function(data, type, full, meta) {
          if (full.surgreffee)
                return 'Oui';
            return 'Non';
        }).withOption("width", "100px"),
        DTColumnBuilder.newColumn("Libile").withTitle("Porte-Greffe").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Mode_Application").withTitle("Mode d'application").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Date_debut_prouduction").withTitle("Date entrée en production").renderWith(function(data, type, full, meta) {
          if(full.Date_debut_prouduction)
          return moment(full.Date_debut_prouduction).format('DD/MM/YYYY');
          return ''
        }).withOption("width", "100px"),
        DTColumnBuilder.newColumn("Date_pleine_production").withTitle("Date plein production").renderWith(function(data, type, full, meta) {
          if(full.Date_pleine_production)
          return moment(full.Date_pleine_production).format('DD/MM/YYYY');
          return ''
        }).withOption("width", "100px"),
        DTColumnBuilder.newColumn("Date_fin_recolte").withTitle("Date fin de récolte").renderWith(function(data, type, full, meta) {
          if(full.Date_fin_recolte)
          return moment(full.Date_fin_recolte).format('DD/MM/YYYY');
          return ''
        }).withOption("width", "100px"),
        DTColumnBuilder.newColumn("Dat_Arrach").withTitle("Date d'arrachage").renderWith(function(data, type, full, meta) {
          if(full.Dat_Arrach)
          return moment(full.Dat_Arrach).format('DD/MM/YYYY');
          return ''
        }).withOption("width", "100px"),
        DTColumnBuilder.newColumn("Statut_Cycle").withTitle("Status").renderWith(function(data, type, full, meta) {
          if (full.Statut_Cycle == 2)
                return 'Arrachée';
            return 'En cours';
        }).withOption("width", "100px"),
        DTColumnBuilder.newColumn(null)
        .withTitle("Actions")
        .renderWith(actionsHtml)
        .withClass("nowrap actions-column nowraptd all") // Custom class for better control
        .withOption("width", "60px")
        .notSortable()
    ];


    DTDefaultOptions.setLoadingTemplate(
      '<center><img src="././images/loading.gif"/></center>'
    );






    vm.howto = true;

    function createdRow(row, data, dataIndex) {
      // Add row highlighting first
      if (data.newItem) {
        angular.element(row).addClass('new-row');
      }

      // Then handle Angular compilation
      $compile(angular.element(row).contents())($scope);
    }


    /** Step1 excel*/

    vm.headers =  [
       "Ferme",
       "Parcelle Physique",
       "Ref",
       "Variété",
       "Référence",
       "Groupe culturale",
       "Superficie",
       "Produit Rendement",
       "Profile Production",
       "Mode de plantation",
       "Géneration",
       "Date de plantation",
       "Date prévue de récolte",
       "Date début de travaux",
       "Nombre de plants réels",
       "Nombre de plants théoriques",
       "Nombre de plants manquants",
       "Ecartement",
       "Densité",
       "Surgreffée",
       "Porte-Greffe",
       "Mode d'application",
       "Date entrée en production",
       "Date plein production",
       "Date fin de récolte",
       "Date d'arrachage",
      ];




      $scope.checkExcelHeaders = async function (data) {
        if(data.length>0){
            // Define required headers
            var requiredHeaders = vm.headers

            // Extract headers from the first row of the data
            var fileHeaders = Object.keys(data[0] || {});
            console.log(fileHeaders);

            // Check if all required headers are present
            var isValid = requiredHeaders.every(header => fileHeaders.includes(header));
            if(isValid){
              return {
                status : true
              }
            }else{
              return {
                status : false,
                message : "Invalid file format! Please ensure all required headers are present."
              };
            }
        }else{
          return {
            status : false,
            message : "file is emplty!."
          };
        }


    };

    vm.cleanJsonKeys = async function (data) {
      return data.map(item => ({
        fermeName: item["Ferme"] || null,
        physiqueName: item["Parcelle Physique"] || null,
        varieteName: item["Variété"] || null,
        Ref: item["Ref"] || null,
        Reference: item["Référence"] || null,
        Groupe_culturale: item["Groupe culturale"] || null,
        Sup: item["Superficie"] || null,
        Produit_RendementName: item["Produit Rendement"] || null,
        Produit_ProductionName: item["Profile Production"] || null,
        Type_plant: item["Mode de plantation"] || null,
        Generation: item["Géneration"] || null,
        Dat_Plant: item["Date de plantation"]  ? XLSX.SSF.format("yyyy-mm-dd", item["Date de plantation"]) : null,
        Date_prevu_recolte: item["Date prévue de récolte"] ? XLSX.SSF.format("yyyy-mm-dd", item["Date prévue de récolte"]) : null,
        Date_Previsionnelle: item["Date début de travaux"]  ? XLSX.SSF.format("yyyy-mm-dd", item["Date début de travaux"]) : null,
        Nbre_plant: item["Nombre de plants réels"] || null,
        Nbr_plant_therique: item["Nombre de plants théoriques"] || null,
        NBr_manquants: item["Nombre de plants manquants"] || null,
        Ecartement: item["Ecartement"] || null,
        Densite: item["Densité"] || null,
        surgreffee: item["Surgreffée"] || null,
        PorteName: item["Porte-Greffe"] || null,
        Mode_ApplicationName: item["Mode d'application"] || null,
        Date_debut_prouduction: item["Date entrée en production"]  ? XLSX.SSF.format("yyyy-mm-dd", item["Date entrée en production"]) : null,
        Date_pleine_production: item["Date plein production"]  ? XLSX.SSF.format("yyyy-mm-dd", item["Date plein production"]) : null,
        Date_fin_recolte: item["Date fin de récolte"]  ? XLSX.SSF.format("yyyy-mm-dd", item["Date fin de récolte"]) : null,
        Dat_Arrach: item["Date d'arrachage"]  ? XLSX.SSF.format("yyyy-mm-dd", item["Date d'arrachage"]) : null,
       }));
    };



    vm.transformExcelData = async function (data) {
      return await vm.cleanJsonKeys(data);
    };


    vm.checkDuplicate__column_code = async function (newData, oldData) {


      // Ensure `seen` set is cleared each time the function is called
      let seen = new Set();
      let rowIndex = 2;  // To keep track of the row number

      // Add old data "" values to the set
      oldData.forEach(item => {
          if (item.Code) {
              seen.add(item.Code.toLowerCase()); // Convert to lowercase for case-insensitive check
          }
      });



      // Check for duplicates in new data
      for (let item of newData) {
          if (item.Code) {
              let lowerCaseName = item.Code.toLowerCase();



              if (seen.has(lowerCaseName)) {
                  return {
                      status: false,
                      message: `Duplicate Rférence found in row ${rowIndex}: ${item.Code}`
                  };
              }

              seen.add(lowerCaseName);
          }
          rowIndex++;
      }

      return {
          status: true
      }; // No duplicates found
    };

    vm.checkDuplicate__column_name = async function (newData, oldData) {


      // Ensure `seen` set is cleared each time the function is called
      let seen = new Set();
      let rowIndex = 2;  // To keep track of the row number

      // Add old data "" values to the set
      oldData.forEach(item => {
          if (item.Nom) {
              seen.add(item.Nom.toLowerCase()); // Convert to lowercase for case-insensitive check
          }
      });



      // Check for duplicates in new data
      for (let item of newData) {
          if (item.Nom) {
              let lowerCaseName = item.Nom.toLowerCase();



              if (seen.has(lowerCaseName)) {
                  return {
                    status_name: false,
                    message_name: `Duplicate Nom found in row ${rowIndex}: ${item.Nom}`
                  };
              }

              seen.add(lowerCaseName);
          }
          rowIndex++;
      }

      return {
        status_name: true
      }; // No duplicates found
    };



  vm.resetErrExcel = function(){
    vm.errData = {
      err : false
    }
  }


    vm.checkDuplicate = async function () {

    }

    vm.integer = async function(){



      if(vm.jsonData.length>0){

          NProgress.start();

          parcelleCulturalService.multiadd({
            parcellesculturales :vm.jsonData
          }).then(async e => {
              toastr.clear();
              toastr.success(e.data.message, {
                closeButton: true
              });
              await $scope.undoSelect()
              NProgress.done();
              vm.dtInstance.reloadData();
              vm.reset();
              vm.isFileSelected = false;
              vm.jsonData = [];
              vm.errData = {
                err : false
              }
          }).catch(async e => {
            NProgress.done();
            toastr.clear();
            toastr.error(e.data.message, {
              closeButton: true
            });
            vm.errData = {
              err : true,
              message : e.data.message
            }
          });







      }else{
        toastr.clear();
        toastr.warning("Upload your file!", {
        closeButton: true,
       });
      }
    }



      /**chat */
       // Initialize messages array
  $scope.messages = [{
    timestamp : new Date(),
    role: 'BeeOne assistant',
    content: 'Hello 👋! How can I assist you today?',
    wait:false
  }];

  $scope.newMessage = '';

  // Format timestamp
  $scope.formatTime = function(date) {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format date
  $scope.formatDate = function(date) {
    return new Date(date).toLocaleDateString('fr-FR', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  function scrollToBottom() {
    $timeout(function() {
      var chatMessages = document.querySelector('.chat_loop-container');
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });
  }

  // Send message function
  $scope.sendMessage = function() {
    if ($scope.newMessage.trim()) {
      const now = new Date();
      // Add user message
      $scope.messages.push({
        timestamp: now,
        role: 'user',
        content: $scope.newMessage.trim(),
        wait:false
      });

      $scope.messages.push({
        role: 'BeeOne assistant',
        content: 'thinking....',
        wait:true
     });

     const icons = ['🔜', '🕐', '🛠️', '📢', '🎬', '🎉', '👀', '🚧', '⌛', '🏗️'];
     let lastMessage = $scope.messages[$scope.messages.length - 1];
     let randomIcon = icons[Math.floor(Math.random() * icons.length)];
     setTimeout(() => {
      lastMessage.timestamp= new Date(now.getTime() + 1000), // 1 second later
      lastMessage.wait = false;
      lastMessage.content = `Task in progress stay tonned ${randomIcon}`;
      $scope.$apply(); // Apply changes to update the UI
      }, 2000);





      // Clear input
      $scope.newMessage = '';
      scrollToBottom();
    }
  };
  scrollToBottom();
  // Handle Enter key press
  $scope.handleKeyPress = function(event) {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
      $scope.sendMessage();
    }
  };


  vm.polygoneAction = async function(data) {

    $scope.parcelle_byfermes = parcelleCulturalService.getbyferme({IDFermes : data.IDFermes}).then(result => {
      return result.data;
    });
    

    $scope.showAdvanced("ev", data, $scope.parcelle_byfermes);
  }

  $scope.showAdvanced = function(ev, data, parcelle_byfermes) {
  $mdDialog.show({
      controller: DialogController,
      templateUrl: '././views/configuration/attachement_parcelles/polygone/v_polygone_parcelleculturalle.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: false,
      locals: {
        data: data,
        parcelle_byfermes : parcelle_byfermes
      }
    })
    .then(function(answer) {
      $scope.status = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.status = 'You cancelled the dialog.';
    });
};

  function DialogController($scope, $mdDialog, data, parcelle_byfermes) {

    $scope.annuler = function() {
      $mdDialog.cancel();
    };


  $scope.data = data;
  $scope.parcelle_byfermes = parcelle_byfermes;
  console.log("parcelle_byfermes", parcelle_byfermes);
  

  $scope.tokenpolygone = data.Polygone_Ferme;
  $scope.Latitude = ($scope.data.Latitude) ? parseFloat($scope.data.Latitude) : 0;
  $scope.Longitude = ($scope.data.Longitude) ? parseFloat($scope.data.Longitude) : 0;
  $scope.areaHa = ($scope.data.SuperficieTracer) ? parseFloat($scope.data.SuperficieTracer) : 0;

  
  $scope.LatPosition = ($scope.data.LatPosition) ? parseFloat($scope.data.LatPosition) : 0;
  $scope.LngPosition = ($scope.data.LngPosition) ? parseFloat($scope.data.LngPosition) : 0;


  $scope.isTracedEdit = false;
  $scope.save_rawClick = false;
  setTimeout(function() {
    jscolor.installByClassName("jscolor");
  }, 1000);

  $scope.hide = function() {
    $mdDialog.hide();
    document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
  };

  $scope.Annuler = function() {
    $mdDialog.cancel();
    document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
  };

  $scope.setsearchID_Pays = function() {
    $scope.searchID_Pays = $scope.Pays;
    $scope.searchID_Region = null;
    $scope.Region = null;
    $scope.Zone = null;
    $scope.IsearchID_Pays = true;
  }
  $scope.setsearchID_Region = function() {
    $scope.searchID_Region = $scope.Region;
    $scope.IsearchID_Region = true;
  }


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
    if (!$scope.Latitude || !$scope.Longitude || $scope.Latitude == 0 || $scope.Longitude == 0 || $scope.Latitude == "" || $scope.Longitude == "") {
      var latF = 33.9691409;
      var longF = -6.9273709;
      var zoooom = 4;
    } else {
      var latF = $scope.Latitude;
      var longF = $scope.Longitude;
      var zoooom = 15;
    }

    if ($scope.data.LatPosition && $scope.data.LngPosition && $scope.data.LatPosition != 0 && $scope.data.LngPosition != 0 && $scope.data.LatPosition != "" && $scope.data.LngPosition != "") {
      var latF = $scope.data.LatPosition;
      var longF = $scope.data.LngPosition;
      var zoooom = 16;
    }
    

    map = new google.maps.Map(document.getElementById("parcellemap"), {
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
        document.getElementById('t2').value = ($scope.data.LngPosition) ? $scope.data.LngPosition : 0;


        clearvar = false;

      };


      /*if ($scope.data.TokenPolygone && $scope.IsJsonString($scope.data.TokenPolygone)) {
        // Clear old shapes first
        for (var i = 0; i < shapes.length; ++i) {
          shapes[i].setMap(null);
        }
        shapes = [];
      
        // Draw new ones from TokenPolygone and keep reference
        var newShapes = IO.OUT(JSON.parse($scope.data.TokenPolygone), map, $scope.data.CouleurCalque, $scope.data.CouleurCadre);
        shapes = shapes.concat(newShapes);
      }*/

        if ($scope.data.Polygone_Ferme !== "" && $scope.IsJsonString($scope.data.Polygone_Ferme)) {
          IO.OUT(JSON.parse($scope.data.Polygone_Ferme), map, "rgba(196, 191, 125, 0.0)", "#8eb2a0");
        } else {
          IO.OUT(JSON.parse('[{"type": "POLYGON","id": null,"geometry": [[]]}]'), map, "rgba(196, 191, 125, 0.0)", "#8eb2a0");
        }
        
        $scope.parcelle_byfermes.forEach(function(item) {
          if (item.TokenPolygone !== "" && $scope.IsJsonString(item.TokenPolygone)) {
            IO.OUT(JSON.parse(item.TokenPolygone), map, item.CouleurCalque, item.CouleurCadre);
          } else {
            IO.OUT(JSON.parse('[{"type": "POLYGON","id": null,"geometry": [[]]}]'), map, "#c4bf7d", "#8eb2a0");
          }
        });





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
        window.alert("Autocomplete's returned place contains no geometry");
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


    google.maps.event.addListener(drawman, 'overlaycomplete', function(event) {
      if (event.type === google.maps.drawing.OverlayType.POLYGON) {
        var polygon = event.overlay;
        shapes.push(polygon); // Assuming 'shapes' is an array of polygons

        $scope.isTracedEdit = true;
        $scope.save_rawClick = false;

        // Prepare GeoJSON or custom JSON from polygon shapes
        var data = IO.IN(shapes, false);
        byId('data').value = JSON.stringify(data);
        var json = JSON.stringify(data, undefined, 4);

        // Calculate total area in hectares
        var area = 0;
        for (var i = 0; i < shapes.length; ++i) {
          area += google.maps.geometry.spherical.computeArea(shapes[i].getPath());
        }
        document.getElementById("areaHa").value = (area / 10000).toFixed(2);

        clearvar = true;

        console.log(document.getElementById('t1').value);
        console.log(document.getElementById('t2').value);
        console.log(document.getElementById('data').value);

        // Optional: disable drawing mode after drawing
        drawman.setDrawingMode(null);
      }
    });

    google.maps.event.addDomListener(byId('save_raw'), 'click', function() {

      NProgress.start()

      parcelleCulturalService.polygone({
        Latitude : document.getElementById('t1').value,
        Longitude : document.getElementById('t2').value,
        ID : data.ID,
        Polygone_Ferme : document.getElementById('data').value,
        SuperficieTracer : document.getElementById('areaHa').value
      }).then(async e => {
        //validate success


        /*let index = vm.data_societe.findIndex(item => item.ID === e.data.inserted_data.ID);

        if (index !== -1) {
          // Update the existing object
          vm.data_societe[index] = e.data.inserted_data;
        } else {
          // If not found, add it to the list (optional)
          vm.data_societe.push(e.data.inserted_data);
        }*/

        toastr.clear();
        toastr.success("Parcelle Culturuale bien tracée.", {
          closeButton: true
        });
        NProgress.done();
        vm.dtInstance.reloadData();
                    $mdDialog.cancel();

    }).catch(async ee => {
      console.log(ee);
      
      NProgress.done();
      toastr.clear();
      toastr.error(ee.data.message, {
        closeButton: true
      });
    });


    /*  $scope.isTracedEdit = true;
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

        console.log(document.getElementById('t1').value)
        console.log(document.getElementById('t2').value)
        console.log(document.getElementById('data').value)
*/
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

  $scope.IsJsonString = function(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

}



  /**model generate */
    vm.gen_canvas = function(ev) {
      $mdDialog.show({
          controller: DialogControllerGen,
          templateUrl: '././views/configuration/attachement_parcelles/canvas/canvas_parcelle_culturale.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            data: vm.data_ferme
          }
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    function DialogControllerGen($scope, $mdDialog, data) {
      $scope.scrollCards = function(direction) {
        const container = document.getElementById('cardContainer');
        const scrollAmount = 300; // Adjust scroll amount as needed

              if (direction === 'left') {
                 container.scroll({
                     left: container.scrollLeft - scrollAmount,
                     behavior: 'smooth'
                 });
             } else if (direction === 'right') {
                 container.scroll({
                     left: container.scrollLeft + scrollAmount,
                     behavior: 'smooth'
                 });
             }
          }

          $scope.annuler = function() {
            $mdDialog.cancel();
          };

      $scope.data_ferme = data;
      $scope.inrements = [{id : 1, increment : 'Oui'},{id : 2, increment : 'Non'}]
      $scope.formdata_gen = {
        ferme : null,
        physique : null,
        variete : null,
        nbrparcelle : null,
        increment : null
      }
      $scope.allformxls = [];


      $scope.getPhysiqueVariete = function () {
        NProgress.start();
          $q.all([parcelleCultural.getbyferme({
            IDFermes: $scope.formdata_gen.ferme.IDFermes
          }),
          VarieteService.getbyferme({
            IDFermes: $scope.formdata_gen.ferme.IDFermes
          })]).then((values) => {
            NProgress.done();
            $scope.data_physique = values[0].data;
            $scope.data_variete = values[1].data;
            console.log($scope.data_variete);
          })
      }
      $scope.canva_ajouter = function(){
        if(!$scope.formdata_gen.ferme){
          toastr.clear();
          toastr.warning("Veuillez choisir une ferme", {
            closeButton: true
          });
        }else if(!$scope.formdata_gen.physique){
          toastr.clear();
          toastr.warning("Veuillez choisir une Parcelle Physique", {
            closeButton: true
          });
        }else if(!$scope.formdata_gen.variete){
          toastr.clear();
          toastr.warning("Veuillez choisir une Variété", {
            closeButton: true
          });
        }else if ($scope.formdata_gen.nbrparcelle <= 0) {
          toastr.clear();
          toastr.warning("Veuillez saisir le nombre de parcelle", {
            closeButton: true
          });
        }else if (!$scope.formdata_gen.increment) {
          toastr.clear();
          toastr.warning("Veuillez choisir un type d'incrémentation", {
            closeButton: true
          });
        }else {
          $scope.formdata_gen.ferme.disabled = true;
          $scope.allformxls.push($scope.formdata_gen);
          console.log($scope.allformxls);
          $scope.formdata_gen = {};
        }
      }

      $scope.generateExcelData = async function() {
      let excelData = [];
      let headers = [
         "Ferme",
         "Parcelle Physique",
         "Variété",
         "Ref",
         "Référence",
         "Groupe culturale",
         "Superficie",
         "Produit Rendement",
         "Profile Production",
         "Mode de plantation",
         "Géneration",
         "Date de plantation",
         "Date prévue de récolte",
         "Date début de travaux",
         "Nombre de plants réels",
         "Nombre de plants théoriques",
         "Nombre de plants manquants",
         "Ecartement",
         "Densité",
         "Surgreffée",
         "Porte-Greffe",
         "Mode d'application",
         "Date entrée en production",
         "Date plein production",
         "Date fin de récolte",
         "Date d'arrachage",
        ];
      excelData.push(headers);
      let totalParcelles = 0; // Track total parcels
      $scope.allformxls.forEach(item => {
          let fermeName = item.ferme.Nom;
          let physiqueName = item.physique.Ref;
          let varieteName = item.variete.Variete;
          let refrence=null
          let ref=null

              for (let i = 1; i <= item.nbrparcelle; i++) {
                  if (item.increment === 1) {
                     refrence = `P${i.toString().padStart(item.nbrparcelle.toString().length, '0')}`;
                     ref = refrence
                  }
                  excelData.push([fermeName,
                  physiqueName,
                  varieteName,
                  refrence,ref,null,null,
                  null,null,null,null,null,
                  null,null,null,null,null,
                  null,null,null,null,
                  null,null,null,null]);
                   totalParcelles++;
              }


      });
      toastr.clear();
      toastr.success(`Génération réussie : ${totalParcelles} parcelle(s) ajoutée(s) au fichier excel`, { closeButton: true });

      return excelData;
  };

    $scope.downloadExcel = async function() {

      if($scope.allformxls.length>0){

        NProgress.start()
        let excelData = await $scope.generateExcelData();

        // Create a new workbook and a worksheet
        let ws = XLSX.utils.aoa_to_sheet(excelData);
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Parcelle Culturale");

        // Generate a binary string from the workbook
        let wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

        // Convert the binary string to a Blob
        let blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });

        // Create a link element and trigger the download
        let link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "Canvas Parcelle Culturale.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        NProgress.done();
      }else {
        toastr.clear();
        toastr.warning("Veuillez ajouter au moin un Paramètre", {
          closeButton: true
        });
      }

  };

  // Utility function to convert string to ArrayBuffer
  function s2ab(s) {
      let buf = new ArrayBuffer(s.length);
      let view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
  }


  $scope.deleteCanva = function(index) {

    toastr.clear();
    toastr.error("<button type='button' id='confirmationRevertYes' class='btn btn-danger' style='float : right;'>Je confirme </button>", "Veuillez confirmer !", {
      closeButton: true,
      allowHtml: true,
      onShown: function(toast) {

        $("#confirmationRevertYes").click(function() {
          $scope.allformxls.splice(index, 1);
          toastr.clear();
          toastr.success("Paramètre bien Supprimé", {
            closeButton: true
          });
          $scope.formdata_gen = {};
        });
      }
    });
  }



  $scope.editCanva = function(index) {
console.log($scope.allformxls);

    $scope.formdata_gen = {
      ferme : $scope.allformxls[index].ferme,
      nbrparcelle : $scope.allformxls[index].nbrparcelle,
      increment : $scope.allformxls[index].increment,
      update : true,
      index : index
    }

  }

  $scope.canva_modifer = function(){

    if(!$scope.formdata_gen.ferme){
      toastr.clear();
      toastr.warning("Veuillez choisir une ferme", {
        closeButton: true
      });
    }else if ($scope.formdata_gen.nbrparcelle <= 0) {
      toastr.clear();
      toastr.warning("Veuillez saisir le nombre de parcelle", {
        closeButton: true
      });
    }else if (!$scope.formdata_gen.increment) {
      toastr.clear();
      toastr.warning("Veuillez choisir un type d'incrémentation", {
        closeButton: true
      });
    }else {
      $scope.formdata_gen.ferme.disabled = true;
      let index = $scope.formdata_gen.index;
      $scope.allformxls[index].ferme = $scope.formdata_gen.ferme;
      $scope.allformxls[index].nbrparcelle = $scope.formdata_gen.nbrparcelle;
      $scope.allformxls[index].increment = $scope.formdata_gen.increment;
      $scope.formdata_gen = {};
      toastr.clear();
      toastr.success("Paramètre bien Modifié", {
        closeButton: true
      });
    }

  }


    }

  }



);
