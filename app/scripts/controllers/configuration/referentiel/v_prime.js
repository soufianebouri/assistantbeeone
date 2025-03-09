'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ConfigurationReferentielVPrimeCtrl
 * @description
 * # ConfigurationReferentielVPrimeCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ConfigurationReferentielVPrimeCtrl', function (
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
    DTColumnBuilder,societe,
    DTDefaultOptions,prime,
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

          prime.edit(vm.formData).then(async e => {

              toastr.clear();
              toastr.success('Prime bien modifé', {
                closeButton: true
              });
              NProgress.done();
              let index = vm.data_prime.findIndex(item => item.IDPrime === e.data.IDPrime);
              vm.data_prime[index] = e.data;

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
          fermes: "Ferme is required.",
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
          prime.add(vm.formData).then(async e => {
              toastr.clear();
              toastr.success('Prime bien ajouté', {
                closeButton: true
              });
              await $scope.undoSelect()
              NProgress.done();
              vm.data_prime.unshift(e.data);
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

        let selectedIds = await $scope.getSelectedIDs(vm.data_prime);

        toastr.clear();
        toastr.error("<button type='button' id='confirmationRevertYes' class='btn btn-danger' style='float : right;'>Je confirme </button>", "Veuillez confirmer !", {
          closeButton: true,
          allowHtml: true,
          onShown: function(toast) {

            $("#confirmationRevertYes").click(function() {
              NProgress.start()
              prime.multidelete({
                IDs : selectedIds
              }).then(async function(result) {

                await $scope.undoSelect()
                toastr.clear();
                toastr.success("Prime(s) successfully deleted.", {
                  closeButton: true
                });
                vm.data_prime = vm.data_prime.filter(item => !selectedIds.includes(item.IDPrime));
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
            prime.delete(data).then(async function(result) {

              await $scope.undoSelect()
              toastr.clear();
              toastr.success("Suppression réussie", {
                closeButton: true
              });

              vm.data_prime = vm.data_prime.filter(item => item.IDPrime !== data.IDPrime);
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
      var isDuplicate = vm.data_prime.some(function(societe) {
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
      var isDuplicate = vm.data_prime.some(function(societe) {
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

      if (!vm.data_prime) {
          var stopCheck = setInterval(function () {
              if (vm.data_prime) {
                  clearInterval(stopCheck);
                  defer.resolve(vm.data_prime);
              }
          }, 500);
      } else {
          defer.resolve(vm.data_prime);
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
          title: 'Liste Des Primes'
        },
      ]);



      vm.prime_action = {};
      function actionsHtml(data, type, full, meta) {
          vm.prime_action[data.IDPrime] = data;
          var editbtn =
          '<button class="btnEdit_tb" ng-click="vm.edit(vm.prime_action[' +
          data.IDPrime +
          '])"><img src="././images/main_configuration/edit.svg" alt="edit"></button>&nbsp;&nbsp;&nbsp;';

           var deletebtn =
          '<button class="btnEdit_tb" ng-click="vm.delete(vm.prime_action[' +
          data.IDPrime +
          '])"><img src="././images/main_configuration/delete.svg" alt="delete"></button>';
      return editbtn + deletebtn;
      }


      vm.edit = async function (data) {


        var copiedArray = angular.copy(data);
        vm.formData = copiedArray;
        copiedArray.fermes   =[1,2,3,4,5]
      //  copiedArray.fermes =  copiedArray.fermes.map(ferme => ferme.IDFermes);
       toastr.clear();
          toastr.success(`The form for editing has been filled out and is ready for modification: ${vm.formData.Reference}. 👆`, {
          closeButton: true
        });

      }





      $scope.allSelected = false; // Tracks "Select All" state

    // Toggle all checkboxes
    vm.toggleAllSelection = function() {
      $scope.allSelected = (!$scope.allSelected) ? true : false;
      vm.data_prime.forEach(societe => {
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
    vm.data_prime = vm.data_prime.map(societe => {
       return { ...societe, selected: false }; // Toggle selection
   });
  }


  $scope.getSelectedIDs = async function(data) {
    let selectedItems = data.filter(item => item.selected === true); // Get selected items

    let selectedIds = selectedItems.map(item => item.IDPrime); // Extract IDs

    return selectedIds;
  };


    $scope.toggleSelection = function (id) {
      let found = false;
      vm.data_prime = vm.data_prime.map(societe => {
          if (societe.IDPrime === id) {
              found = true;
              return { ...societe, selected: !societe.selected }; // Toggle selection
          }
          return societe;
      });
      /* if (!found) {
            vm.data_prime.push({ id_sco_temp: id, selected: true });
        }    */
  };

    function checkboxHtml(data, type, full, meta) {
        return `<input type="checkbox" ng-checked="data.selected" ng-click="toggleSelection(${data.IDPrime})">`;
    }


    vm.updateSelectedCount = function () {
      return (vm.data_prime) ? vm.data_prime.filter(dt_prime => dt_prime.selected).length : 0;
    };


    vm.dtColumns = [
      DTColumnBuilder.newColumn(null)
        .withTitle(
          '#'// '<input type="checkbox" ng-model="vm.allSelected" onclick="toggleAllSelection()">'
        ).renderWith(checkboxHtml).notSortable().withOption("width", "10px"),
        DTColumnBuilder.newColumn("societes").withTitle("Société").renderWith(function(data, type, full, meta) {
          if (full.societes && Array.isArray(full.societes)) {
            return full.societes.map(f => f.Rais_Social).join(", ");
        }
        return "";
       }).withOption("width", "100px"),
        DTColumnBuilder.newColumn("CODE").withTitle("Code prime").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Nom_prime").withTitle("Désignation prime").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Categorie_prime").withTitle("Catégorie").renderWith(function(data, type, full, meta) {
          if (full.Categorie_prime == 2)
            return "Indemnité"
          return "Prime";
        }).withOption("width", "100px"),
        DTColumnBuilder.newColumn("imposable").withTitle("Imposable").withOption("width", "100px").renderWith(function(data, type, full, meta) {
          if (full.imposable)
            return "Oui"
          return "Non";
        }),
        DTColumnBuilder.newColumn("Surplus").withTitle("Surplus").withOption("width", "100px").renderWith(function(data, type, full, meta) {
          if (full.Surplus)
            return "Oui"
          return "Non";
        }),
        DTColumnBuilder.newColumn("Seuil_mois").withTitle("Seuil").withOption("width", "100px"),
        DTColumnBuilder.newColumn("rang_surplus").withTitle("Range").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Prime_Poncuelle").withTitle("Prime ponctuelle").withOption("width", "100px").renderWith(function(data, type, full, meta) {
          if (full.Prime_Poncuelle)
            return "Oui"
          return "Non";
        }),
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
        societes : [],
        CODE : null,
        Nom_prime : null,
        Categorie_prime : 1,
        imposable : false,
        Surplus : false,
        Seuil_mois : false,
        rang_surplus : null,
        Prime_Poncuelle : false
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
          prime.get_all(),
          societe.get_all()
        ]).then((values) => {
            NProgress.done();
          vm.data_prime = values[0].data;
          vm.data_societe = values[1].data;
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
      "Référence",
      "Désignation",
      "Superficie (ha)",
      "Liaison fournisseur"
    ];

      vm.exportToExcel = function () {
         let headers=  vm.headers
          var ws_data = [headers]
          var ws = XLSX.utils.aoa_to_sheet(ws_data);

          // Create workbook
          var wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Primes");

          // Write the file and trigger download
          var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
          var blob = new Blob([wbout], { type: "application/octet-stream" });

          saveAs(blob, "Canvas Primes.xlsx");
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
          FermeName: item["Ferme"] || null,
          Reference : item["Référence"] || null,
          Name : item["Désignation"] || null,
          Superficie : item["Superficie (ha)"] || null,
          Liaison_fournisseur : item["Liaison fournisseur"] || null
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

            if (!item.Superficie) {
                errors.push(`Row ${rowNum}: Missing Superficie as required field`);
            }

            if (item.FermeName ) {
              let newferme = vm.data_societe.find(ferme => String(ferme.Nom).toUpperCase() === String(item.FermeName).toUpperCase());

               if(!newferme){
                 errors.push(`Row ${rowNum}: Ferme '${item.FermeName}' does not exist`);
               }else {
                 vm.jsonData[index].IDFermes = newferme.IDFermes;
                 vm.jsonData[index].ID_societe = newferme.ID_societe;
               }
            }



              if (!item.Reference) {
                errors.push(`Row ${rowNum}: Missing Référence Dépôt as required field`);
            } else {
              let newRef = vm.data_prime.some(data_prime => String(data_prime.Reference).toUpperCase() === String(item.Reference).toUpperCase() );
                if(newRef){
                errors.push(`Row ${rowNum}: Référence Dépôt '${item.Reference}' already exist`);
              }
            }

            if (!item.Name) {
                errors.push(`Row ${rowNum}: Missing Désignation Dépôt as required field`);
            }else {
              let newDesignation = vm.data_prime.some(data_prime => String(data_prime.Name).toUpperCase() === String(item.Name).toUpperCase());
              if(newDesignation){
                errors.push(`Row ${rowNum}: Désignation Dépôt '${item.Name}' already exist`);
              }
            }

            if (item.Superficie !== null && (isNaN(item.Superficie) || item.Superficie < 0)) {
                errors.push(`Row ${rowNum}: Dose must be a number >= 0.`);
            }



             ['Liaison_fournisseur'].forEach(field => {
                if (item[field] !== null && item[field] !== 'Oui' && item[field] !== 'Non') {
                    errors.push(`Row ${rowNum}: Liaison fournisseur must be 'Oui' or 'Non'.`);
                }
            });


            if (item.IDFermes && item.Reference) {
            let pairKey = `${item.IDFermes}_${item.Reference.toUpperCase()}`;
            if (seenPairs.has(pairKey)) {
               errors.push(`Row ${rowNum}: Duplicate combination of Ferme '${item.FermeName}' and Référence '${item.Reference}' found.`);
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

                    prime.multiadd({
                      primes :vm.jsonData
                    }).then(async e => {
                        toastr.clear();
                        toastr.success(e.data.message, {
                          closeButton: true
                        });
                        await $scope.undoSelect()
                        NProgress.done();

                        vm.data_prime.unshift(...e.data.inserted_data);

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
