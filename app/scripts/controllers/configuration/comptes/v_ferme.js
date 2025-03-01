'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ConfigurationComptesVFermeCtrl
 * @description
 * # ConfigurationComptesVFermeCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ConfigurationComptesVFermeCtrl',
    function (
      $q,
      $scope,
      toastr,
      $timeout,
      _url,
      $window,
      $translatePartialLoader,
      $translate,
      _version,
      DTOptionsBuilder,
      $compile,
      DTColumnBuilder,
      DTDefaultOptions,
      societe,$cookies,
      ferme
    ) {
      var vm = this;
      vm._version = _version;

      vm.User = $cookies.getObject('globals').assistUser.Nom + " " + $cookies.getObject('globals').assistUser.Prenom;
      vm.IDUser = $cookies.getObject('globals').assistUser.ID;

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



      vm.currect_step = 1;
      vm.stepUrl = "views/configuration/comptes/v_societe.html";
      vm.step = async function (params, stepUrl) {
        vm.currect_step = params;
        vm.stepUrl = stepUrl
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

              vm.jsonData = await  vm.transformExcelData(vm.jsonData);

              if(status){





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
      vm.societes = {};

      //get data and refresh datatable
      vm.data_societe = [];
NProgress.start();
      $q.all([
        ferme.get_all(),
        societe.get_all()
      ]).then((values) => {
        vm.data_societe = values[0].data;
        vm.data_societe_all = values[1].data;
        vm.old_items = vm.data_societe.length;
        vm.dtInstance.reloadData();
          NProgress.done();
      }).catch((error) => {
          NProgress.done();
        if (error && error.message) {
          console.error("Error message:", error.message);
          toastr.clear();
          toastr.error("Error message:", error.message, {
            closeButton: true
          });
        } else {
          console.error("Connot acces to the server, call our support team", error);
          toastr.clear();
          toastr.error("Connot acces to the server, call our support team", error, {
            closeButton: true
          });
        }
      });



      vm.validateCoordinates = async function () {
        let isValidCoordinates = true;
        let messageCoordinates = ''

        if (vm.formData.Latitude === undefined ) {
          isValidCoordinates = true;
        }

        if ( vm.formData.Longitude === undefined) {
          isValidCoordinates = true;
        }

        if (vm.formData.Latitude < -90 || vm.formData.Latitude > 90) {
          isValidCoordinates = false;
          messageCoordinates = 'Latitude should be between -90 and 90'
        }

        if (vm.formData.Longitude < -180 || vm.formData.Longitude > 180) {
          isValidCoordinates = false;
          messageCoordinates = 'Longitude should be between -180 and 180'
        }

        return {
          isValidCoordinates,
          messageCoordinates
        };
    };



      vm.modifier = async function  () {

          if(await vm.validateFormData()){

            NProgress.start()   ;


            ferme.edit(vm.formData).then(async e => {
                //validate success


                let index = vm.data_societe.findIndex(item => item.IDFermes === e.data.inserted_data.IDFermes);

                if (index !== -1) {
                  // Update the existing object
                  vm.data_societe[index] = e.data.inserted_data;
                } else {
                  // If not found, add it to the list (optional)
                  vm.data_societe.push(e.data.inserted_data);
                }

                toastr.clear();
                toastr.success("Ferme bien modifiée.", {
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
                Code: "Référence ferme is required.",
                Nom: "Nom de la is required.",
                societe: "Société is required.",
                Superficie: (value) => value > 0 ? null : "Superficie must be greater than 0.",
                Date_Creatio_Ferme: "Date de création de la ferme is required."
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

            let {isValidCoordinates,
              messageCoordinates} = await vm.validateCoordinates();
            if (!isValidCoordinates) {
              toastr.clear();
                    toastr.warning(messageCoordinates, {
                    closeButton: true
              });
              return false;
            }
            return true;
       };

      vm.ajouter = async function  () {
        toastr.clear();
          if(await vm.validateFormData()){

            NProgress.start()


            ferme.add(vm.formData).then(async e => {
                //validate success

                vm.data_societe.unshift(e.data.inserted_data);


                toastr.clear();
                toastr.success("Ferme bien ajoutée.", {
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

          let { selectedIds, newItemCount } = await $scope.getSelectedIDs(vm.data_societe);

          toastr.clear();
          toastr.error("<button type='button' id='confirmationRevertYes' class='btn btn-danger' style='float : right;'>Je confirme </button>", "Veuillez confirmer !", {
            closeButton: true,
            allowHtml: true,
            onShown: function(toast) {

              $("#confirmationRevertYes").click(function() {
                NProgress.start()
                ferme.multidelete({
                  IDs : selectedIds
                }).then(async function(result) {

                  vm.data_societe = vm.data_societe.filter(item => !selectedIds.includes(item.IDFermes));


                  await $scope.undoSelect()
                  toastr.clear();
                  toastr.success("Suppression réussie", {
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


      vm.delete = async function(data) {

        toastr.clear();
        toastr.error("<button type='button' id='confirmationRevertYes' class='btn btn-danger' style='float : right;'>Je confirme </button>", "Veuillez confirmer !", {
          closeButton: true,
          allowHtml: true,
          onShown: function(toast) {
            $("#confirmationRevertYes").click(function() {
              NProgress.start()
              ferme.delete(data).then(async function(result) {

                vm.data_societe = vm.data_societe.filter(item => item.IDFermes !== data.IDFermes);


                await $scope.undoSelect()
                toastr.clear();
                toastr.success("Suppression réussie", {
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
        var isDuplicate = vm.data_societe.some(function(societe) {
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
        var isDuplicate = vm.data_societe.some(function(societe) {
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
        //var defer = $q.defer();
        return $q.resolve(vm.data_societe);
      })
        .withOption("createdRow", createdRow)
        .withDOM("<lf<t>ip>")
        .withPaginationType("simple_numbers")
        .withOption("pageLength", 5)  // Default number of items per page
         .withOption("lengthMenu", [5, 10, 20, 50, 100])  // Options for page length
        .withOption("responsive", true)
      /*  .withOption('scrollX', false) // Add this line
         .withOption('autoWidth', false)
        .withDisplayLength(5)
        .withScroller(false)*/
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
            title: 'Liste Des Fermes'
          },
        ]);



        function actionsHtml(data, type, full, meta) {
            vm.societes[data.IDFermes] = data;
            var editbtn =
            '<button class="btnEdit_tb" ng-click="vm.edit(vm.societes[' +
            data.IDFermes +
            '])"><img src="././images/main_configuration/edit.svg" alt="edit"></button>&nbsp;&nbsp;&nbsp;';

          var deletebtn =
            '<button class="btnEdit_tb" ng-click="vm.delete(vm.societes[' +
            data.IDFermes +
            '])"><img src="././images/main_configuration/delete.svg" alt="delete"></button>';
        return editbtn + deletebtn;
        }

        vm.edit = function (data) {
          vm.formData = data;

          vm.formData.Latitude = parseFloat(vm.formData.Latitude || 0);  // or set a default value
          vm.formData.Longitude = parseFloat(vm.formData.Longitude || 0);
          vm.formData.Date_Creatio_Ferme = (vm.formData.Date_Creatio_Ferme) ? new Date(moment(vm.formData.Date_Creatio_Ferme).format("YYYY-MM-DD")) : null;

          vm.formData.societe = vm.data_societe_all.find(societe => societe.ID === vm.formData.ID_societe);

          toastr.clear();
            toastr.success(`The form for editing has been filled out and is ready for modification: ${vm.formData.Nom}. 👆`, {
            closeButton: true
          });

        }





        $scope.allSelected = false; // Tracks "Select All" state

      // Toggle all checkboxes
      vm.toggleAllSelection = function() {
        $scope.allSelected = (!$scope.allSelected) ? true : false;
        vm.data_societe.forEach(societe => {
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
      vm.data_societe = vm.data_societe.map(societe => {
         return { ...societe, selected: false }; // Toggle selection
     });
    }
    $scope.getSelectedIDs = async function(data) {
      let selectedItems = data.filter(item => item.selected === true); // Get selected items

      let selectedIds = selectedItems.map(item => item.IDFermes); // Extract IDs
      let newItemCount =0 // Count `newItem === true`

      return {
        selectedIds,  // Array of selected IDs
        newItemCount  // Count of new items
      };
    };


      $scope.toggleSelection = function (id) {
        let found = false;
        vm.data_societe = vm.data_societe.map(societe => {
            if (societe.IDFermes === id) {
                found = true;
                return { ...societe, selected: !societe.selected }; // Toggle selection
            }
            return societe;
        });
        /* if (!found) {
              vm.data_societe.push({ id_sco_temp: id, selected: true });
          }    */
    };

      function checkboxHtml(data, type, full, meta) {
          return `<input type="checkbox" ng-checked="data.selected" ng-click="toggleSelection(${data.IDFermes})">`;
      }


      vm.updateSelectedCount = function () {
        return vm.data_societe.filter(societe => societe.selected).length;
      };


      vm.dtColumns = [
        DTColumnBuilder.newColumn(null)
          .withTitle(
            '#'// '<input type="checkbox" ng-model="vm.allSelected" onclick="toggleAllSelection()">'
          ).renderWith(checkboxHtml).notSortable().withOption("width", "15px"),
        DTColumnBuilder.newColumn("Rais_Social").withTitle("Société").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Code").withTitle("Référence").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Nom").withTitle("Nom").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Superficie").withTitle("Superficie").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Date_Creatio_Ferme").withTitle("Date De Création").renderWith(function(data, type, full, meta) {
          if(full.Date_Creatio_Ferme)
          return moment(full.Date_Creatio_Ferme).format('DD/MM/YYYY');
          return ''
        }).withOption("width", "100px"),
        DTColumnBuilder.newColumn("Adresse").withTitle("Adresse").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Gerant").withTitle("Gérant").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Ville").withTitle("Ville").withOption("width", "100px"),
        DTColumnBuilder.newColumn("statut_foncier").withTitle("Statut Foncier").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Fax").withTitle("Fax").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Tel").withTitle("Téléphone").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Latitude").withTitle("Latitude").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Longitude").withTitle("Longitude").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Altitude").withTitle("Altitude").withOption("width", "100px"),
        DTColumnBuilder.newColumn(null).withTitle("Actions").renderWith(actionsHtml).withClass("nowraptd all").notSortable(),
      ];


      DTDefaultOptions.setLoadingTemplate(
        '<center><img src="././images/loading.gif"/></center>'
      );

     vm.reset = function () {

      vm.formData =  {
        Code: null,
        Nom: null,
        societe: null,
        Superficie: null,
        Date_Creatio_Ferme: null,
        Gerant: null,
        Adresse: null,
        Ville: null,
        Fax: null,
        Tel: null,
        statut_foncier: null,
        Latitude: null,
        Longitude: null,
        Altitude: null,
        ID : null,
        newItem : true
      }
     }
     vm.reset()




      vm.howto = true;

      function createdRow(row, data, dataIndex) {
        // Add row highlighting first
        /*if (data.newItem) {
          angular.element(row).addClass('new-row');
        }*/

        // Then handle Angular compilation
        $compile(angular.element(row).contents())($scope);
      }


      /** Step1 excel*/

      vm.headers = [
        "Référence","Nom","Société",
        "Superficie","Date De Création","Gérant",
        "Adresse","Ville","Fax",
        "Téléphone","Statut Foncier","Latitude",
        "Longitude","Altitude"];

        vm.exportToExcel = function () {
           let headers=  vm.headers
            var ws_data = [headers]
            var ws = XLSX.utils.aoa_to_sheet(ws_data);

            // Create workbook
            var wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Fermes");

            // Write the file and trigger download
            var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            var blob = new Blob([wbout], { type: "application/octet-stream" });

            saveAs(blob, "Canvas Fermes.xlsx");
        };


        $scope.checkExcelHeaders = async function (data) {
          if(data.length>0){
              // Define required headers
              var requiredHeaders = vm.headers

              // Extract headers from the first row of the data
              var fileHeaders = Object.keys(data[0] || {});


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
          Code: item["Référence"] || null,
          Nom: item["Nom"] || null,
          societe: item["Société"] || null,
          Superficie: item["Superficie"] || null,
          Date_Creatio_Ferme: item["Date De Création"] ? XLSX.SSF.format("yyyy-mm-dd", item["Date De Création"]) : null,
          Gerant: item["Gérant"] || null,
          Adresse: item["Adresse"] || null,
          Ville : item["Ville"] || null,
          Fax: item["Fax"] || null,
          Tel: item["Téléphone"] || null,
          statut_foncier: item["Statut Foncier"] || null,
          Latitude: item["Latitude"] || null,
          Longitude: item["Longitude"] || null,
          Altitude: item["Altitude"] || null
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




      vm.integer = async function(){


        if(vm.jsonData.length>0){

          let { status , message} = await vm.checkDuplicate__column_code(vm.jsonData, vm.data_societe);




          if(status){
            let { status_name , message_name} = await vm.checkDuplicate__column_name(vm.jsonData, vm.data_societe);

            if(status_name){
              /**Create en masse */

            NProgress.start()


            ferme.multiadd({
              fermes :vm.jsonData
            }).then(async e => {
                //validate success

                vm.data_societe.unshift(...e.data.inserted_data);



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
              vm.errData = {
                err : true,
                status : status_name,
                message : message_name
              }
              toastr.clear();
              toastr.warning(message_name, {
              closeButton: true,
            });
            }



          }else{
            vm.errData = {
              err : true,
              status : status,
              message : message
            }
            toastr.clear();
            toastr.warning(message, {
            closeButton: true,
          });
          }




        }else{
          toastr.clear();
          toastr.warning("Upload your file!", {
          closeButton: true,
         });
        }
      }

      /** */
      /*function actionsHtml(data, type, full, meta) {
        vm.societes[data.id_sco_temp] = data;
        var editbtn =
          '<button class="btnEdit_tb"  ng-click="vm.edit(vm.societes[' +
          data.id_sco_temp +
          '])"><img src="././images/main_configuration/edit.svg" alt="time"</button>&nbsp;';
        var deletebtn =
          '<button class="btnEdit_tb"  ng-click="vm.delete(vm.societes[' +
          data.id_sco_temp +
          '])" )"=""><img src="././images/main_configuration/delete.svg" alt="time"</button>';
        return editbtn + "" + deletebtn;
      }*/

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

      /**** Step 1 *****/

      /**** Step 2 *****/

      /**** Step 3 *****/
    }
  );
