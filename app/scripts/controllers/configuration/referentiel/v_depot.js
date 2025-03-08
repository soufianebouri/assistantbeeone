'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ConfigurationReferentielVDepotCtrl
 * @description
 * # ConfigurationReferentielVDepotCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ConfigurationReferentielVDepotCtrl', function (
    $q,
    $scope,$mdDialog,
    toastr,
    $timeout,cultureService,
    _url,VarieteService,
    $window,
    $translatePartialLoader,
    $translate,uniteoperation,
    _version,
    DTOptionsBuilder,
    $compile,
    DTColumnBuilder,
    DTDefaultOptions,depot,
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



    $scope.get_produit = function () {

      vm.formData.IDProduit_Rendement = null;
      NProgress.start();
      if(vm.formData.fermes && !vm.formData.IDDepots){
        $q.all([produitrendement.getbymultiferme({
          IDFermes: vm.formData.fermes
        })]).then((values) => {
          NProgress.done();
          vm.data_produit = values[0].data;
          console.log(vm.data_produit);
        })
      }else {
          NProgress.done();
          vm.data_culture = []
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

          depot.edit(vm.formData).then(async e => {

              toastr.clear();
              toastr.success('Depot bien modifé', {
                closeButton: true
              });
              NProgress.done();
              let index = vm.data_depot.findIndex(item => item.IDDepots === e.data.IDDepots);
              vm.data_depot[index] = e.data;

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
          IDFermes: "Ferme is required.",
          Reference : "Référence dépôt is required.",
          Name : "Désignation dépôt is required.",
          Superficie : "Superficie is required."
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
          depot.add(vm.formData).then(async e => {
              toastr.clear();
              toastr.success('Dépôt bien ajouté', {
                closeButton: true
              });
              await $scope.undoSelect()
              NProgress.done();
              vm.data_depot.unshift(e.data);
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

        let selectedIds = await $scope.getSelectedIDs(vm.data_depot);

        toastr.clear();
        toastr.error("<button type='button' id='confirmationRevertYes' class='btn btn-danger' style='float : right;'>Je confirme </button>", "Veuillez confirmer !", {
          closeButton: true,
          allowHtml: true,
          onShown: function(toast) {

            $("#confirmationRevertYes").click(function() {
              NProgress.start()
              depot.multidelete({
                IDs : selectedIds
              }).then(async function(result) {

                await $scope.undoSelect()
                toastr.clear();
                toastr.success("Dépôt(s) successfully deleted.", {
                  closeButton: true
                });
                vm.data_depot = vm.data_depot.filter(item => !selectedIds.includes(item.IDDepots));
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
            depot.delete(data).then(async function(result) {

              await $scope.undoSelect()
              toastr.clear();
              toastr.success("Suppression réussie", {
                closeButton: true
              });

              vm.data_depot = vm.data_depot.filter(item => item.IDDepots !== data.IDDepots);
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
      var isDuplicate = vm.data_depot.some(function(societe) {
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
      var isDuplicate = vm.data_depot.some(function(societe) {
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

      if (!vm.data_depot) {
          var stopCheck = setInterval(function () {
              if (vm.data_depot) {
                  clearInterval(stopCheck);
                  defer.resolve(vm.data_depot);
              }
          }, 500);
      } else {
          defer.resolve(vm.data_depot);
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
          title: 'Liste Des Dépôts'
        },
      ]);



      vm.depot_action = {};
      function actionsHtml(data, type, full, meta) {
          vm.depot_action[data.IDDepots] = data;
          var editbtn =
          '<button class="btnEdit_tb" ng-click="vm.edit(vm.depot_action[' +
          data.IDDepots +
          '])"><img src="././images/main_configuration/edit.svg" alt="edit"></button>&nbsp;&nbsp;&nbsp;';

           var deletebtn =
          '<button class="btnEdit_tb" ng-click="vm.delete(vm.depot_action[' +
          data.IDDepots +
          '])"><img src="././images/main_configuration/delete.svg" alt="delete"></button>';
      return editbtn + deletebtn;
      }


      vm.edit = async function (data) {


        var copiedArray = angular.copy(data);
        vm.formData = copiedArray;

       toastr.clear();
          toastr.success(`The form for editing has been filled out and is ready for modification: ${vm.formData.Reference}. 👆`, {
          closeButton: true
        });

      }





      $scope.allSelected = false; // Tracks "Select All" state

    // Toggle all checkboxes
    vm.toggleAllSelection = function() {
      $scope.allSelected = (!$scope.allSelected) ? true : false;
      vm.data_depot.forEach(societe => {
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
    vm.data_depot = vm.data_depot.map(societe => {
       return { ...societe, selected: false }; // Toggle selection
   });
  }


  $scope.getSelectedIDs = async function(data) {
    let selectedItems = data.filter(item => item.selected === true); // Get selected items

    let selectedIds = selectedItems.map(item => item.IDDepots); // Extract IDs

    return selectedIds;
  };


    $scope.toggleSelection = function (id) {
      let found = false;
      vm.data_depot = vm.data_depot.map(societe => {
          if (societe.IDDepots === id) {
              found = true;
              return { ...societe, selected: !societe.selected }; // Toggle selection
          }
          return societe;
      });
      /* if (!found) {
            vm.data_depot.push({ id_sco_temp: id, selected: true });
        }    */
  };

    function checkboxHtml(data, type, full, meta) {
        return `<input type="checkbox" ng-checked="data.selected" ng-click="toggleSelection(${data.IDDepots})">`;
    }


    vm.updateSelectedCount = function () {
      return (vm.data_depot) ? vm.data_depot.filter(dt_depot => dt_depot.selected).length : 0;
    };


    vm.dtColumns = [
      DTColumnBuilder.newColumn(null)
        .withTitle(
          '#'// '<input type="checkbox" ng-model="vm.allSelected" onclick="toggleAllSelection()">'
        ).renderWith(checkboxHtml).notSortable().withOption("width", "10px"),
        DTColumnBuilder.newColumn("Nom").withTitle("Ferme").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Reference").withTitle("Référence").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Name").withTitle("Désignation").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Superficie").withTitle("Superficie (ha)").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Liaison_fournisseur").withTitle("Liaison fournisseur").renderWith(function(data, type, full, meta) {
          if (full.Liaison_fournisseur)
            return "Oui"
          return "Non";
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
        IDFermes : null,
        Reference : null,
        Name : null,
        Superficie : null,
        Liaison_fournisseur : false,
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
          depot.get_all(),
          ferme.get_all(),
          uniteoperation.get_all()
        ]).then((values) => {
            NProgress.done();
          vm.data_depot = values[0].data;
          vm.data_ferme = values[1].data;
          vm.data_unite = values[2].data;
        }).catch((error) => {
            NProgress.done();
          toastr.clear();
          toastr.error(error.message, {
            closeButton: true
          });
        });


    /** Step1 excel*/

    vm.headers = [
      "Fermes",
      "Référence engrais",
      "Désignation engrais",
      "Catégorie",
      "Sous catégorie",
      "Unité",
      "Dose",
      "Unité dose",
      "N",
      "P",
      "K",
      "CaO",
      "NH4",
      "MgO",
      "Cu",
      "B",
      "Fe",
      "Zn",
      "Mn",
      "Mo",
      "% TVA",
      "Prix UHT",
      "TVA récup",
      "Transité par module achat",
      "Demande d'achat obligatoire",
      "Bon de commande obligatoire"
    ];

      vm.exportToExcel = function () {
         let headers=  vm.headers
          var ws_data = [headers]
          var ws = XLSX.utils.aoa_to_sheet(ws_data);

          // Create workbook
          var wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Dépôts");

          // Write the file and trigger download
          var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
          var blob = new Blob([wbout], { type: "application/octet-stream" });

          saveAs(blob, "Canvas Dépôts.xlsx");
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
        FermeName: item["Fermes"] || null,
        Ref: item["Référence engrais"] || null,
        Designation: item["Désignation engrais"] || null,
        Categorie: item["Catégorie"] || null,
        Sous_Categorie: item["Sous catégorie"] || null,
        Unite: item["Unité"] || null,
        Dose: item["Dose"] || null,
        Unite_Dose: item["Unité dose"] || null,
        N: item["N"] || null,
        P: item["P"] || null,
        K: item["K"] || null,
        CAO: item["CaO"] || null,
        NH4: item["NH4"] || null,
        MGO: item["MgO"] || null,
        Cu: item["Cu"] || null,
        B: item["B"] || null,
        Fe: item["Fe"] || null,
        Zn: item["Zn"] || null,
        Mn  : item["Mn"] || null,
        Mo  : item["Mo"] || null,
        Taux_TVA: item["% TVA"] || null,
        PU: item["Prix UHT"] || null,
        TVA: item["TVA récup"] || null,
        Peut_etre_achete: item["Transité par module achat"] || null,
        DA_obligatoire: item["Demande d'achat obligatoire"] || null,
        BC_obligatoire: item["Bon de commande obligatoire"] || null
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

    vm.getProduitcheck = async function () {

      return $q.all([produitrendement.getall_min()]).then((values) => {
        return values[0].data;
      })
    }



    $scope.getReealName = function(field) {
      const fieldNames = {
          'Peut_etre_achete': 'Transité par module achat',
          'DA_obligatoire': 'Demande d\'achat obligatoire',
          'BC_obligatoire': 'Bon de commande obligatoire',
          'TVA': 'TVA Recupérable'
      };
      return fieldNames[field] || null;
  };

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



              if (!item.Ref) {
                errors.push(`Row ${rowNum}: Missing Référence Dépôt as required field`);
            } else {
              let newRef = vm.data_depot.some(data_depot => String(data_depot.Ref).toUpperCase() === String(item.Ref).toUpperCase() );
                if(newRef){
                errors.push(`Row ${rowNum}: Référence Dépôt '${item.Ref}' already exist`);
              }
            }

            if (!item.Designation) {
                errors.push(`Row ${rowNum}: Missing Désignation Dépôt as required field`);
            }else {
              let newDesignation = vm.data_depot.some(data_depot => String(data_depot.Designation).toUpperCase() === String(item.Designation).toUpperCase());
              if(newDesignation){
                errors.push(`Row ${rowNum}: Désignation '${item.Designation}' already exist`);
              }
            }

            if (item.Dose !== null && (isNaN(item.Dose) || item.Dose < 0)) {
                errors.push(`Row ${rowNum}: Dose must be a number >= 0.`);
            }
            if (item.Taux_TVA !== null && (isNaN(item.Taux_TVA) || item.Taux_TVA < 0)) {
                errors.push(`Row ${rowNum}: % TVA must be a number >= 0.`);
            }
            if (item.PU !== null && (isNaN(item.PU) || item.PU < 0)) {
                errors.push(`Row ${rowNum}: Prix UHT must be a number >= 0.`);
            }
            if (item.N !== null && (isNaN(item.N) || item.N < 0)) {
                errors.push(`Row ${rowNum}: N must be a number >= 0.`);
            }
            if (item.P !== null && (isNaN(item.P) || item.P < 0)) {
                errors.push(`Row ${rowNum}: P must be a number >= 0.`);
            }
            if (item.K !== null && (isNaN(item.K) || item.K < 0)) {
                errors.push(`Row ${rowNum}: K must be a number >= 0.`);
            }
            if (item.CAO !== null && (isNaN(item.CAO) || item.CAO < 0)) {
                errors.push(`Row ${rowNum}: CAO must be a number >= 0.`);
            }
            if (item.NH4 !== null && (isNaN(item.NH4) || item.NH4 < 0)) {
                errors.push(`Row ${rowNum}: NH4 must be a number >= 0.`);
            }
            if (item.MGO !== null && (isNaN(item.MGO) || item.MGO < 0)) {
                errors.push(`Row ${rowNum}: MGO must be a number >= 0.`);
            }
            if (item.Cu !== null && (isNaN(item.Cu) || item.Cu < 0)) {
                errors.push(`Row ${rowNum}: Cu must be a number >= 0.`);
            }
            if (item.Mn !== null && (isNaN(item.Mn) || item.Mn < 0)) {
                errors.push(`Row ${rowNum}: Mn must be a number >= 0.`);
            }
            if (item.B !== null && (isNaN(item.B) || item.B < 0)) {
                errors.push(`Row ${rowNum}: B must be a number >= 0.`);
            }
            if (item.Fe !== null && (isNaN(item.Fe) || item.Fe < 0)) {
                errors.push(`Row ${rowNum}: Fe must be a number >= 0.`);
            }
            if (item.Mo !== null && (isNaN(item.Mo) || item.Mo < 0)) {
                errors.push(`Row ${rowNum}: Mo must be a number >= 0.`);
            }
            if (item.Zn !== null && (isNaN(item.Zn) || item.Zn < 0)) {
                errors.push(`Row ${rowNum}: Zn must be a number >= 0.`);
            }



             ['TVA', 'Peut_etre_achete', 'DA_obligatoire', 'BC_obligatoire'].forEach(field => {
                if (item[field] !== null && item[field] !== 'Oui' && item[field] !== 'Non') {
                    errors.push(`Row ${rowNum}: ${$scope.getReealName(field)} must be 'Oui' or 'Non'.`);
                }
            });


            if (item.IDFermes && item.Ref) {
            let pairKey = `${item.IDFermes}_${item.Ref.toUpperCase()}`;
            if (seenPairs.has(pairKey)) {
               errors.push(`Row ${rowNum}: Duplicate combination of Ferme '${item.FermeName}' and Référence '${item.Ref}' found.`);
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
        if(await $scope.validateData()){

                    depot.multiadd({
                      depots :vm.jsonData
                    }).then(async e => {
                        toastr.clear();
                        toastr.success(e.data.message, {
                          closeButton: true
                        });
                        await $scope.undoSelect()
                        NProgress.done();

                        vm.data_depot.unshift(...e.data.inserted_data);

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
