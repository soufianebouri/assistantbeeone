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
    ferme,parcelleCultural,
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
      vm.formData =  {
        IDFermes : null,
        IDParcelle: null,
        Ref: null,
        Reference: null,
        Groupe_culturale: null,
        Sup: null,
        IDVariete: null,
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


    $q.all([
      ferme.get_all(),
      portGreffe.get_all(),
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
    }).catch((error) => {
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
          })]).then((values) => {
            NProgress.done();
            vm.data_parcellebyFarm = values[0].data;
            vm.data_variete = values[1].data;
            vm.data_Produit_Rendement = values[2].data;
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
      console.log(vm.formData);


        if(await vm.validateFormData()){
          NProgress.start()   ;

          parcelleCultural.edit(vm.formData).then(async e => {

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
            parcelleCultural.delete(data).then(async function(result) {

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
          title: 'Liste des fermes'
        },
      ]);



      vm.parcelle_action = {};
      function actionsHtml(data, type, full, meta) {
          vm.parcelle_action[data.ID] = data;
          var editbtn =
          '<button class="btnEdit_tb" ng-click="vm.edit(vm.parcelle_action[' +
          data.ID +
          '])"><img src="././images/main_configuration/edit.svg" alt="edit"></button>&nbsp;&nbsp;&nbsp;';

           var deletebtn =
          '<button class="btnEdit_tb" ng-click="vm.delete(vm.parcelle_action[' +
          data.ID +
          '])"><img src="././images/main_configuration/delete.svg" alt="delete"></button>';
      return editbtn + deletebtn;
      }


      vm.edit = function (data) {
        vm.formData = data;

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
              return full.Sup + 'Ha';
          return '';
        }).withOption("width", "100px"),
        DTColumnBuilder.newColumn("Nom_Variete").withTitle("Variété").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Produit_RendementName").withTitle("Produit Rendement").withOption("width", "100px"),
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

    vm.headers = ["Ferme", "Réference Technique", "Parcelle Physique", "Superficie", "Type Parcelle"]




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




  /**model generate */
    vm.gen_canvas = function(ev) {
      $mdDialog.show({
          controller: DialogControllerGen,
          templateUrl: '././views/configuration/attachement_parcelles/canvas/canvas_parcelle.html',
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
        nbrparcelle : null,
        increment : null
      }
      $scope.allformxls = [];

      $scope.canva_ajouter = function(){
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
          $scope.allformxls.push($scope.formdata_gen);

          console.log($scope.allformxls);

          $scope.formdata_gen = {};
        }
      }

      $scope.generateExcelData = async function() {
      let excelData = [];
      let headers = ["Ferme", "Réference Technique", "Parcelle Physique", "Superficie", "Type Parcelle"];
      excelData.push(headers);
      let totalParcelles = 0; // Track total parcels
      $scope.allformxls.forEach(item => {
          let fermeName = item.ferme.Nom;
          let refrence = null;
          let ref = null;
          let superficie = null;
          let typeParcelle = null;


              for (let i = 1; i <= item.nbrparcelle; i++) {
                  if (item.increment === 1) {
                     refrence = `P${i.toString().padStart(item.nbrparcelle.toString().length, '0')}`;
                     ref = refrence
                  }
                  excelData.push([fermeName, refrence, ref, superficie, typeParcelle]);
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
        XLSX.utils.book_append_sheet(wb, ws, "Parcelle Physique");

        // Generate a binary string from the workbook
        let wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

        // Convert the binary string to a Blob
        let blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });

        // Create a link element and trigger the download
        let link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "Canvas Parcelle Physique.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        NProgress.done();
      }else {
        toastr.clear();
        toastr.warning("Veuillez choisir au moin un Paramètre", {
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
