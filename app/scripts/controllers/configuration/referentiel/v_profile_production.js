'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ConfigurationReferentielVProfileProductionCtrl
 * @description
 * # ConfigurationReferentielVProfileProductionCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ConfigurationReferentielVProfileProductionCtrl', function (
    $q,
    $scope,$mdDialog,
    toastr,
    $timeout,cultureService,
    _url,VarieteService,
    $window,groupeOperation ,   familleOperation,uniteOperation,
    $translatePartialLoader,
    $translate,uniteoperation,
    _version,
    DTOptionsBuilder,profilProduction,
    $compile,
    DTColumnBuilder,societe,typeconduite,typeirrigation,ModeApplication,
    DTDefaultOptions,
    $cookies,
    ferme,produitrendement,
    familleculture
  ) {
    var vm = this;
    vm._version = _version;

    vm.User = $cookies.getObject('beeoneAssistant').assistUser.Nom + " " + $cookies.getObject('beeoneAssistant').assistUser.Prenom;
    vm.IDUser = $cookies.getObject('beeoneAssistant').assistUser.ID;

    $translatePartialLoader.addPart("conduitetechnique");
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());



    $scope.get_varietes = function () {

      vm.formData.varietes = [];
      NProgress.start();
      if(vm.formData.fermes){
        $q.all([VarieteService.getbyMultiferme({
          IDFermes: vm.formData.fermes
        })]).then((values) => {
          NProgress.done();
          vm.data_variete = values[0].data;
        })
      }else {
          NProgress.done();
          vm.data_variete = []
      }


    }


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






    vm.selectedFarm = [];



    vm.modifier = async function  () {

        if(await vm.validateFormData()){
          NProgress.start()   ;

          profilProduction.edit(vm.formData).then(async e => {

              toastr.clear();
              toastr.success('Opération bien modifé', {
                closeButton: true
              });
              NProgress.done();
              let index = vm.data_profil_production.findIndex(item => item.id_bdg_profil_production === e.data.id_bdg_profil_production);
              vm.data_profil_production[index] = e.data;

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
        fermes : "Ferme is required.",
        varietes : "Variété is required.",
        reference : "Reference is required.",
        designation : "Désignation is required.",
        duree : "Durée is required.",
        date_debut : "Date début is required.",
        date_fin : "Date fin is required.",
      };

      for (let key in rules) {
          let value = vm.formData[key];

          // Check if value is null, undefined, empty string, or an empty array
          if (value === null || value === undefined || value === '' ||
            (Array.isArray(value) && value.length === 0) ||
            (key === "fermes" && Array.isArray(value) && value.length === 2 && value.every(v => v === null))) {
                toastr.clear();
              toastr.warning(rules[key], { closeButton: true });
              return false;
          }
      }
      return true;
  };



    vm.ajouter = async function  () {
      toastr.clear();
        if(await vm.validateFormData()){
          NProgress.start()
          profilProduction.add(vm.formData).then(async e => {
              toastr.clear();
              toastr.success('Profile de production bien ajouté', {
                closeButton: true
              });
              await $scope.undoSelect()
              NProgress.done();
              vm.data_profil_production.unshift(e.data);
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

        let selectedIds = await $scope.getSelectedIDs(vm.data_profil_production);

        toastr.clear();
        toastr.error("<button type='button' id='confirmationRevertYes' class='btn btn-danger' style='float : right;'>Je confirme </button>", "Veuillez confirmer !", {
          closeButton: true,
          allowHtml: true,
          onShown: function(toast) {

            $("#confirmationRevertYes").click(function() {
              NProgress.start()
              profilProduction.multidelete({
                IDs : selectedIds
              }).then(async function(result) {

                await $scope.undoSelect()
                toastr.clear();
                toastr.success("Opération(s) successfully deleted.", {
                  closeButton: true
                });
                vm.data_profil_production = vm.data_profil_production.filter(item => !selectedIds.includes(item.id_bdg_profil_production));
                vm.dtInstance.reloadData();
                NProgress.done();

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
            profilProduction.delete(data).then(async function(result) {

              await $scope.undoSelect()
              toastr.clear();
              toastr.success("Suppression réussie", {
                closeButton: true
              });

              vm.data_profil_production = vm.data_profil_production.filter(item => item.id_bdg_profil_production !== data.id_bdg_profil_production);
              vm.dtInstance.reloadData();

              NProgress.done();

            }).catch(async e => {
              NProgress.done();
              console.log(e);
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
      var isDuplicate = vm.data_profil_production.some(function(societe) {
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
      var isDuplicate = vm.data_profil_production.some(function(societe) {
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




    vm.dtOptions = DTOptionsBuilder.fromFnPromise(function () {
      var defer = $q.defer();

      if (!vm.data_profil_production) {
          var stopCheck = setInterval(function () {
              if (vm.data_profil_production) {
                  clearInterval(stopCheck);
                  defer.resolve(vm.data_profil_production);
              }
          }, 500);
      } else {
          defer.resolve(vm.data_profil_production);
      }

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
          title: 'Liste Des Profile De Production'
        },
      ]);



      vm.operarion_action = {};
      function actionsHtml(data, type, full, meta) {
          vm.operarion_action[data.id_bdg_profil_production] = data;
          var editbtn =
          '<button class="btnEdit_tb" ng-click="vm.edit(vm.operarion_action[' +
          data.id_bdg_profil_production +
          '])"><img src="././images/main_configuration/edit.svg" alt="edit"></button>&nbsp;&nbsp;&nbsp;';

           var deletebtn =
          '<button class="btnEdit_tb" ng-click="vm.delete(vm.operarion_action[' +
          data.id_bdg_profil_production +
          '])"><img src="././images/main_configuration/delete.svg" alt="delete"></button>';
      return editbtn + deletebtn;
      }


      vm.edit = async function (data) {


        var copiedArray = angular.copy(data);
        vm.formData = copiedArray;
        copiedArray.fermes =  copiedArray.fermes.map(item => item.id_ferme);
        copiedArray.varietes =  copiedArray.varietes.map(item => item.id_variete);
        copiedArray.types_conduite =  copiedArray.types_conduite.map(item => item.id_type_conduite);
        copiedArray.types_irrigation =  copiedArray.types_irrigation.map(item => item.id_type_irrigation);
        copiedArray.modes_application =  copiedArray.modes_application.map(item => item.id_mode_application);
        copiedArray.date_debut = (copiedArray.date_debut) ? new Date(moment(copiedArray.date_debut).format("YYYY-MM-DD")) : null;
        copiedArray.date_fin = (copiedArray.date_fin) ? new Date(moment(copiedArray.date_fin).format("YYYY-MM-DD")) : null;
        NProgress.start();

          $q.all([VarieteService.getbyMultiferme({
            IDFermes: vm.formData.fermes
          })]).then((values) => {
            NProgress.done();
            vm.data_variete = values[0].data;
          })
        console.log(copiedArray);
       toastr.clear();
          toastr.success(`The form for editing has been filled out and is ready for modification. 👆`, {
          closeButton: true
        });

      }





      $scope.allSelected = false; // Tracks "Select All" state

    // Toggle all checkboxes
    vm.toggleAllSelection = function() {
      $scope.allSelected = (!$scope.allSelected) ? true : false;
      vm.data_profil_production.forEach(societe => {
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
    vm.data_profil_production = vm.data_profil_production.map(societe => {
       return { ...societe, selected: false }; // Toggle selection
   });
  }


  $scope.getSelectedIDs = async function(data) {
    let selectedItems = data.filter(item => item.selected === true); // Get selected items

    let selectedIds = selectedItems.map(item => item.id_bdg_profil_production); // Extract IDs

    return selectedIds;
  };


    $scope.toggleSelection = function (id) {
      let found = false;
      vm.data_profil_production = vm.data_profil_production.map(societe => {
          if (societe.id_bdg_profil_production === id) {
              found = true;
              return { ...societe, selected: !societe.selected }; // Toggle selection
          }
          return societe;
      });
      /* if (!found) {
            vm.data_profil_production.push({ id_sco_temp: id, selected: true });
        }    */
  };

    function checkboxHtml(data, type, full, meta) {
        return `<input type="checkbox" ng-checked="data.selected" ng-click="toggleSelection(${data.id_bdg_profil_production})">`;
    }


    vm.updateSelectedCount = function () {
      return (vm.data_profil_production) ? vm.data_profil_production.filter(dt_operation => dt_operation.selected).length : 0;
    };

    vm.data_processrecolte = [
      {ID : 1,
      Nom : "Process A"},
      {ID : 2,
      Nom : "Process B"}
    ];

    vm.data_typeproduit = [
      {ID : 1,
      Nom : "Type A"},
      {ID : 2,
      Nom : "Type B"},
      {ID : 3,
      Nom : "Type C"}
    ];



    vm.dtColumns = [
      DTColumnBuilder.newColumn(null)
        .withTitle(
          '#'// '<input type="checkbox" ng-model="vm.allSelected" onclick="toggleAllSelection()">'
        ).renderWith(checkboxHtml).notSortable().withOption("width", "10px"),
        DTColumnBuilder.newColumn("fermes").withTitle("Ferme").renderWith(function(data, type, full, meta) {
          if (full.fermes && Array.isArray(full.fermes)) {
            return full.fermes.map(f => f.Nom).join(", ");
        }
        return "";
       }).withOption("width", "100px"),
      DTColumnBuilder.newColumn("varietes").withTitle("Variété").renderWith(function(data, type, full, meta) {
        if (full.varietes && Array.isArray(full.varietes)) {
          return full.varietes.map(f => f.Variete).join(", ");
      }
      return "";
     }).withOption("width", "100px"),
        DTColumnBuilder.newColumn("reference").withTitle("Référence profile").withOption("width", "100px"),
        DTColumnBuilder.newColumn("designation").withTitle("Désignation profile").withOption("width", "100px"),
        DTColumnBuilder.newColumn("desriptif").withTitle("Déscription").withOption("width", "100px"),
        DTColumnBuilder.newColumn("duree").withTitle("Durée").withOption("width", "100px"),
        DTColumnBuilder.newColumn("periode").withTitle("Périodicité").renderWith(function(data, type, full, meta) {
          if (full.periode == 1) return "Semaine"
          if (full.periode == 2) return "Quinzaine"
          if (full.periode == 3) return "Mois"
          return "";
        }).withOption("width", "100px"),
        DTColumnBuilder.newColumn("date_debut").withTitle("Date début").renderWith(function(data, type, full, meta) {
          if(full.date_debut)
          return moment(full.date_debut).format('DD/MM/YYYY');
          return ''
        }).withOption("width", "100px"),
        DTColumnBuilder.newColumn("date_fin").withTitle("Date fin").renderWith(function(data, type, full, meta) {
          if(full.date_fin)
          return moment(full.date_fin).format('DD/MM/YYYY');
          return ''
        }).withOption("width", "100px"),
        DTColumnBuilder.newColumn("systeme_production").withTitle("Système de production").withOption("width", "100px"),
        DTColumnBuilder.newColumn("types_conduite").withTitle("Mode conduite").renderWith(function(data, type, full, meta) {
          if (full.types_conduite && Array.isArray(full.types_conduite)) {
            return full.types_conduite.map(f => f.Type_conduite).join(", ");
        }
        return "";
       }).withOption("width", "100px"),
       DTColumnBuilder.newColumn("types_irrigation").withTitle("Type irrigation").renderWith(function(data, type, full, meta) {
         if (full.types_irrigation && Array.isArray(full.types_irrigation)) {
           return full.types_irrigation.map(f => f.Libelle).join(", ");
       }
       return "";
      }).withOption("width", "100px"),
      DTColumnBuilder.newColumn("modes_application").withTitle("Mode application").renderWith(function(data, type, full, meta) {
        if (full.modes_application && Array.isArray(full.modes_application)) {
          return full.modes_application.map(f => f.Mode_Application).join(", ");
      }
      return "";
     }).withOption("width", "100px"),
     DTColumnBuilder.newColumn("densite").withTitle("Densité").withOption("width", "100px"),
     DTColumnBuilder.newColumn("archive").withTitle("Status").renderWith(function(data, type, full, meta) {
       if(full.archive)
       return "Archivé";
       return 'En cours'
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





    vm.reset = function () {
      vm.formData =  {
        fermes : [],
        varietes : [],
        reference : null,
        designation : null,
        desriptif : null,
        duree : null,
        periode : 1,
        date_debut : null,
        date_fin : null,
        systeme_production : null,
        types_conduite : [],
        types_irrigation : [],
        modes_application : [],
        densite : null
      }
     }
   vm.reset()

    vm.howto = true;

    function createdRow(row, data, dataIndex) {
      // Add row highlighting first
      if (data.newItem) {
        angular.element(row).addClass('new-row');
      }

      // Then handle Angular compilation
      $compile(angular.element(row).contents())($scope);
    }


    NProgress.start();
        $q.all([
          profilProduction.get_all(),
          ferme.get_all(),
          typeconduite.get_all(),
          typeirrigation.get_all(),
          ModeApplication.get_all()
        ]).then((values) => {
            NProgress.done();
          vm.data_profil_production = values[0].data;
          vm.data_ferme = values[1].data;
          vm.data_typeconduite = values[2].data;
          vm.data_typeirrigation = values[3].data;
          vm.data_modeapplication = values[4].data;
        }).catch((error) => {
            NProgress.done();
          toastr.clear();
          toastr.error(error.message, {
            closeButton: true
          });
        });


    /** Step1 excel*/

    vm.headers = [
      "Ferme",
      "Variété",
      "Référence profile",
      "Désignation profile",
      "Déscription",
      "Durée",
      "Périodicité",
      "Date début",
      "Date fin",
      "Système de production",
      "Mode conduite",
      "Type irrigation",
      "Mode application",
      "Densité"
    ];

      vm.exportToExcel = function () {
         let headers=  vm.headers
          var ws_data = [headers]
          var ws = XLSX.utils.aoa_to_sheet(ws_data);

          // Create workbook
          var wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Profile De Production");

          // Write the file and trigger download
          var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
          var blob = new Blob([wbout], { type: "application/octet-stream" });

          saveAs(blob, "Canvas Profile De Production.xlsx");
      };


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
      FermeName : item["Ferme"] || null,
      VarieteName : item["Variété"] || null,
      reference : item["Référence profile"] || null,
      designation : item["Désignation profile"] || null,
      desriptif : item["Déscription"] || null,
      duree : item["Durée"] || null,
      periode : item["Périodicité"] || null,
      date_debut : item["Date début"] ? XLSX.SSF.format("yyyy-mm-dd", item["Date début"]) : null,
      date_fin : item["Date fin"] ? XLSX.SSF.format("yyyy-mm-dd", item["Date fin"]) : null,
      systeme_production : item["Système de production"] || null,
      types_conduite : item["Mode conduite"] || null,
      types_irrigation : item["Type irrigation"] || null,
      modes_application : item["Mode application"] || null,
      densite : item["Densité"] || null
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












    $scope.validateData = async function() {

        let errors = [];
        let seenPairs = new Set();
        vm.jsonData.forEach(async (item, index)  =>  {
            let rowNum = index + 2;

            if (!item.FermeName ) {
                errors.push(`Row ${rowNum}: Missing Ferme as required field`);
            }

            if (item.FermeName ) {
              let newferme = vm.data_ferme.find(ferme => String(ferme.Nom).toUpperCase() === String(item.FermeName).toUpperCase());

               if(!newferme){
                 errors.push(`Row ${rowNum}: Ferme '${item.FermeName}' does not exist`);
               }else {
                 vm.jsonData[index].IDFermes = newferme.IDFermes;
               }
            }

            if (!item.Reference) {
                errors.push(`Row ${rowNum}: Missing Référence opération as required field`);
            } else {
              let newRef = vm.data_profil_production.some(data_fournisseur => String(data_fournisseur.Reference).toUpperCase() === String(item.Reference).toUpperCase() );
              console.log("newRef" , newRef);
              if(newRef){
                errors.push(`Row ${rowNum}: Référence opération '${item.Reference}' already exist`);
              }
            }

            if (!item.OpeRef_Intitule) {
                errors.push(`Row ${rowNum}: Missing Désignation opération as required field`);
            } else {
              let newRef = vm.data_profil_production.some(data_fournisseur => String(data_fournisseur.OpeRef_Intitule).toUpperCase() === String(item.OpeRef_Intitule).toUpperCase() );
              console.log("newRef" , newRef);
              if(newRef){
                errors.push(`Row ${rowNum}: Désignation opération '${item.OpeRef_Intitule}' already exist`);
              }
            }

            if (!item.Groupe) {
                errors.push(`Row ${rowNum}: Missing Groupe as required field`);
            }

            if (!item.Famille) {
                errors.push(`Row ${rowNum}: Missing Famille as required field`);
            }

            if (item.Recolte !== null && item.Recolte !== 'Oui' && item.Recolte !== 'Non') {
                errors.push(`Row ${rowNum}: Liés à la récolte must be 'Oui' or 'Non'.`);
            }

            if (item.Gardiennage !== null && item.Gardiennage !== 'Oui' && item.Gardiennage !== 'Non') {
                errors.push(`Row ${rowNum}: Gardiennage must be 'Oui' or 'Non'.`);
            }


            if (item.Montant_prime !== null && (isNaN(item.Montant_prime) || item.Montant_prime < 0)) {
                errors.push(`Row ${rowNum}: % Montant prime associée (dhs) must be a number >= 0.`);
            }

            if (item.SEUIL_gardiennage !== null && (isNaN(item.SEUIL_gardiennage) || item.SEUIL_gardiennage < 0)) {
                errors.push(`Row ${rowNum}: Nbr heure gardiennage must be a number >= 0.`);
            }

            if (item.methode_calcul_prime !== null && item.methode_calcul_prime !== 'Oui' && item.methode_calcul_prime !== 'Non') {
                errors.push(`Row ${rowNum}: Nature prime must be 'Forfaitaire' or 'Unitaire'.`);
            }

            if (item.Process_recolte_autre !== null && item.Process_recolte_autre !== 'Process A' && item.Process_recolte_autre !== 'Process B' && item.Process_recolte_autre !== 'Process C') {
                errors.push(`Row ${rowNum}: Process récolte be 'Process A', 'Process B' or 'Process C'.`);
            }

            if (item.Type_parcelle_centre !== null && item.Type_parcelle_centre !== 'Type A' && item.Type_parcelle_centre !== 'Type B'&& item.Type_parcelle_centre !== 'Type C') {
                errors.push(`Row ${rowNum}: Process récolte be 'Type A', 'Type B' or 'Type C'.`);
            }


            vm.jsonData[index].ID_Groupe = null;
            let newgroupe = vm.data_groupe.find(groupe => String(groupe.Groupe).toUpperCase() === String(item.Groupe).toUpperCase());
            if(newgroupe){
            vm.jsonData[index].ID_Groupe = newgroupe.ID;
            }

            vm.jsonData[index].ID_Famille = null;
            let newFamille = vm.data_famille.find(famille => String(famille.Famille).toUpperCase() === String(item.Famille).toUpperCase());
            if(newFamille){
            vm.jsonData[index].ID_Famille = newFamille.ID;
            }

            vm.jsonData[index].IDUnite_Operation = null;
            let newUnite = vm.data_unite.find(famille => String(famille.Code).toUpperCase() === String(item.Unite_Operation).toUpperCase());
            if(newUnite){
            vm.jsonData[index].IDUnite_Operation = newUnite.IDUnite_Operation;
            }



          /*
            TO DO ===>
            if found get ID else ID = 0 to create in server side
            Unite_Operation
            Groupe
            Famille

            */




            if (item.IDFermes && item.Reference) {
            let pairKey = `${item.IDFermes}_${item.Reference.toUpperCase()}`;
            if (seenPairs.has(pairKey)) {
               errors.push(`Row ${rowNum}: Duplicate combination of Ferme '${item.FermeName}' and Référence opération '${item.Reference}' found.`);
               } else {
                   seenPairs.add(pairKey);
               }
           }

        });

        if (errors.length > 0) {
            NProgress.done();
            vm.errData = {
              err : true,
              message : errors.join('\n')
            }
            toastr.clear();
            toastr.error("Please correct all file errors, details bellow 👇 ", {
              closeButton: true
            });
            return false
        } else {
            return true
        }
    };

    vm.integer = async function(){
      if(vm.jsonData.length>0){
             NProgress.start();
             vm.data_groupe


           $q.all([
             groupeOperation.get_all(),
             familleOperation.get_all(),
             uniteOperation.get_all()
           ]).then(async (values) => {
               NProgress.done();
             vm.data_groupe = values[0].data;
             vm.data_famille = values[1].data;
             vm.data_unite = values[2].data;
             console.log(vm.jsonData);
             if(await $scope.validateData()){

                      profilProduction.multiadd({
                           operations :vm.jsonData
                         }).then(async e => {
                             toastr.clear();
                             toastr.success(e.data.message, {
                               closeButton: true
                             });
                             await $scope.undoSelect()
                             NProgress.done();

                             vm.data_profil_production.unshift(...e.data.inserted_data);

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

                     }

           }).catch((error) => {
               NProgress.done();
             toastr.clear();
             toastr.error(error.message, {
               closeButton: true
             });
           });



        }else{
          NProgress.done();
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



  }
);
