'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ConfigurationReferentielVFamilleCultureCtrl
 * @description
 * # ConfigurationReferentielVFamilleCultureCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ConfigurationReferentielVFamilleCultureCtrl', function (
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
    $cookies,
    ferme,
    familleculture
  ) {
    var vm = this;
    vm._version = _version;

    vm.User = $cookies.getObject('globals').currentUser.Nom + " " + $cookies.getObject('globals').currentUser.Prenom;
    vm.IDUser = $cookies.getObject('globals').currentUser.ID;

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
    vm.data_familleculture = [];

    $q.all([
      ferme.get_all()
    ]).then((values) => {
      vm.data_ferme = values[0].data;
      console.log(vm.data_ferme);
    }).catch((error) => {
      toastr.clear();
      toastr.error(error.message, {
        closeButton: true
      });
    });

    vm.data_filier = [{
      id : 1,
      name : 'Maraichage'
    },{
      id : 2,
      name : 'Arboriculture'
    },
    {
      id : 3,
      name : 'Grande Culture'
    },
    {
      id : 4,
      name : 'Floriculture'
    },
    {
      id : 5,
      name : 'Fruits rouges'
    }]

    vm.selectedFarm = [];
    /*vm.isSelected =  function(selcted, data) {
      return  selcted.some( function(selectedFerme) {
          return selectedFerme.IDFermes === data.IDFermes;
      });
    };*/


    vm.modifier = async function  () {
      console.log(vm.formData);


        if(await vm.validateFormData()){
          NProgress.start()   ;

          familleculture.edit(vm.formData).then(async e => {

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
              fermes: "Ferme is required.",
              filier: "Filière is required.",
              Reference: "Référence famille is required.",
              Nom_Famille: "Désignation Famille is required."
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
          familleculture.add(vm.formData).then(async e => {
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

        let selectedIds = await $scope.getSelectedIDs(vm.data_familleculture);

        toastr.clear();
        toastr.error("<button type='button' id='confirmationRevertYes' class='btn btn-danger' style='float : right;'>Je confirme </button>", "Veuillez confirmer !", {
          closeButton: true,
          allowHtml: true,
          onShown: function(toast) {

            $("#confirmationRevertYes").click(function() {
              NProgress.start()
              familleculture.multidelete({
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
            familleculture.delete(data).then(async function(result) {

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
      var isDuplicate = vm.data_familleculture.some(function(societe) {
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
      var isDuplicate = vm.data_familleculture.some(function(societe) {
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
      return familleculture.get_all();
    };

    vm.dtOptions = DTOptionsBuilder.fromFnPromise(function () {
      var defer = $q.defer();
        $scope.updatedata().then(function(res) {
          vm.data_familleculture = res.data;
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
          title: 'Liste des fermes'
        },
      ]);



      vm.familleculture_action = {};
      function actionsHtml(data, type, full, meta) {
          vm.familleculture_action[data.IDFamille_Culture] = data;
          var editbtn =
          '<button class="btnEdit_tb" ng-click="vm.edit(vm.familleculture_action[' +
          data.IDFamille_Culture +
          '])"><img src="././images/main_configuration/edit.svg" alt="edit"></button>&nbsp;&nbsp;&nbsp;';

           var deletebtn =
          '<button class="btnEdit_tb" ng-click="vm.delete(vm.familleculture_action[' +
          data.IDFamille_Culture +
          '])"><img src="././images/main_configuration/delete.svg" alt="delete"></button>';
      return editbtn + deletebtn;
      }


      vm.edit = function (data) {
        vm.formData = data;
        const matches = data.fermes.map(ferme => { // from previous example
          const data_ferme = vm.data_ferme.find(df => df.IDFermes === ferme.IDFermes);
          return data_ferme ? { data_ferme, ferme } : null;
        }).filter(match => match !== null);

        vm.formData.fermes = matches.map(match => match.data_ferme);

       toastr.clear();
          toastr.success(`The form for editing has been filled out and is ready for modification: ${vm.formData.Reference}. 👆`, {
          closeButton: true
        });

      }





      $scope.allSelected = false; // Tracks "Select All" state

    // Toggle all checkboxes
    vm.toggleAllSelection = function() {
      $scope.allSelected = (!$scope.allSelected) ? true : false;
      vm.data_familleculture.forEach(societe => {
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
    vm.data_familleculture = vm.data_familleculture.map(societe => {
       return { ...societe, selected: false }; // Toggle selection
   });
  }


  $scope.getSelectedIDs = async function(data) {
    let selectedItems = data.filter(item => item.selected === true); // Get selected items

    let selectedIds = selectedItems.map(item => item.IDFamille_Culture); // Extract IDs

    return selectedIds;
  };


    $scope.toggleSelection = function (id) {
      let found = false;
      vm.data_familleculture = vm.data_familleculture.map(societe => {
          if (societe.IDFamille_Culture === id) {
              found = true;
              return { ...societe, selected: !societe.selected }; // Toggle selection
          }
          return societe;
      });
      /* if (!found) {
            vm.data_familleculture.push({ id_sco_temp: id, selected: true });
        }    */
  };

    function checkboxHtml(data, type, full, meta) {
        return `<input type="checkbox" ng-checked="data.selected" ng-click="toggleSelection(${data.IDFamille_Culture})">`;
    }


    vm.updateSelectedCount = function () {
      return vm.data_familleculture.filter(societe => societe.selected).length;
    };


    vm.dtColumns = [
      DTColumnBuilder.newColumn(null)
        .withTitle(
          '#'// '<input type="checkbox" ng-model="vm.allSelected" onclick="toggleAllSelection()">'
        ).renderWith(checkboxHtml).notSortable().withOption("width", "10px"),
        DTColumnBuilder.newColumn("fermes").withTitle("Fermes").renderWith(function(data, type, full, meta) {
          if (full.fermes && Array.isArray(full.fermes)) {
            return full.fermes.map(f => f.Nom).join(", ");
        }
        return "";
       }).withOption("width", "110px"),
      DTColumnBuilder.newColumn("filier").withTitle("Filière").renderWith(function(data, type, full, meta) {
        if (full.filier == 1) {
          return "Maraichage";
        } else if (full.filier == 2) {
          return "Arboriculture";
        } else if (full.filier == 3) {
          return "Grande Culture";
        } else if (full.filier == 4) {
          return "Floriculture";
        } else if (full.filier == 5) {
          return "Fruits rouges";
        } else {
          return '';
        }
      }).withOption("width", "100px"),
      DTColumnBuilder.newColumn("Reference").withTitle("Référence famille").withOption("width", "100px"),
      DTColumnBuilder.newColumn("Nom_Famille").withTitle("Désignation Famille").withOption("width", "100px"),

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
        IDFamille_Culture : null,
        Reference : null,
        Nom_Famille : null,
        filier : null,
        fermes : []
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


    /** Step1 excel*/

    vm.headers = [
      "Ferme",
      "Filière",
      "Référence famille",
      "Désignation Famille"];

      vm.exportToExcel = function () {
         let headers=  vm.headers
          var ws_data = [headers]
          var ws = XLSX.utils.aoa_to_sheet(ws_data);

          // Create workbook
          var wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Famille Culturale");

          // Write the file and trigger download
          var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
          var blob = new Blob([wbout], { type: "application/octet-stream" });

          saveAs(blob, "Canvas Famille Culturale.xlsx");
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
        FiliereName: item["Filière"] || null,
        Reference: item["Référence famille"] || null,
        Nom_Famille: item["Désignation Famille"] || null
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

          familleculture.multiadd({
            familles :vm.jsonData
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

    /**** Step 1 *****/

    /**** Step 2 *****/

    /**** Step 3 *****/
  }
);
