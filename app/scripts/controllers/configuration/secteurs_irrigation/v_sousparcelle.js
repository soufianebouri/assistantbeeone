'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ConfigurationSecteursIrrigationVSousparcelleCtrl
 * @description
 * # ConfigurationSecteursIrrigationVSousparcelleCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ConfigurationSecteursIrrigationVSousparcelleCtrl', function (
    $q,
    $scope,$mdDialog,
    toastr,
    $timeout,cultureService,
    _url,VarieteService,
    $window,
    $translatePartialLoader,
    $translate,uniteoperation,
    _version,
    DTOptionsBuilder,Produit,
    $compile,
    DTColumnBuilder,
    DTDefaultOptions,
    $cookies,
    ferme,
    familleculture, SecteurService, Bloc, modeirrigation, sousparcelle, parcelleCultural
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

          sousparcelle.edit(vm.formData).then(async e => {

              toastr.clear();
              toastr.success('Sous parcelle bien modifé', {
                closeButton: true
              });
              NProgress.done();
              let index = vm.data_sousparcelle.findIndex(item => item.ID === e.data.ID);
              console.log("index" ,index);
              console.log(e.data);
              console.log(vm.data_sousparcelle[index]);
              vm.data_sousparcelle[index] = e.data;

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

    vm.setBloc = async function() {
      vm.formData.parcelle = null;
      vm.formData.Secteur = null;
    }

    vm.validateFormData = async function() {

          let rules = {
            IDFermes : "Ferme is required.",
            parcelle : "Parcelle is required.",
            Secteur : "Secteur is required.",
            Ref : "Sous Parcell is required.",
            Sup :  "Superficie is required."
          };


          for (let key in rules) {
              let value = vm.formData[key];

              // Check if value is null, undefined, empty string, or an empty array
              if (value === null || value === undefined || value === '' ||
                (Array.isArray(value) && value.length === 0) ||
                (key === "fermes" && Array.isArray(value) && value.length === 2 && value.every(v => v === null))) {
                    toastr.clear();
                  toastr.warning(typeof rules[key] === "function" ? rules[key](value) : rules[key], {
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
          sousparcelle.add(vm.formData).then(async e => {
              toastr.clear();
              toastr.success('Sous parcelle bien ajouté', {
                closeButton: true
              });
              await $scope.undoSelect()
              NProgress.done();
              vm.data_sousparcelle.unshift(e.data);
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

        let selectedIds = await $scope.getSelectedIDs(vm.data_sousparcelle);

        toastr.clear();
        toastr.error("<button type='button' id='confirmationRevertYes' class='btn btn-danger' style='float : right;'>Je confirme </button>", "Veuillez confirmer !", {
          closeButton: true,
          allowHtml: true,
          onShown: function(toast) {

            $("#confirmationRevertYes").click(function() {
              NProgress.start()
              sousparcelle.multidelete({
                IDs : selectedIds
              }).then(async function(result) {

                await $scope.undoSelect()
                toastr.clear();
                toastr.success("Sousparcelle(s) successfully deleted.", {
                  closeButton: true
                });
                vm.data_sousparcelle = vm.data_sousparcelle.filter(item => !selectedIds.includes(item.ID));
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
            sousparcelle.delete(data).then(async function(result) {

              await $scope.undoSelect()
              toastr.clear();
              toastr.success("Suppression réussie", {
                closeButton: true
              });

              vm.data_sousparcelle = vm.data_sousparcelle.filter(item => item.ID !== data.ID);
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
      var isDuplicate = vm.data_sousparcelle.some(function(societe) {
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
      var isDuplicate = vm.data_sousparcelle.some(function(societe) {
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

      if (!vm.data_sousparcelle) {
          var stopCheck = setInterval(function () {
              if (vm.data_sousparcelle) {
                  clearInterval(stopCheck);
                  defer.resolve(vm.data_sousparcelle);
              }
          }, 500);
      } else {
          defer.resolve(vm.data_sousparcelle);
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
          title: 'Liste Des sousparcelle'
        },
      ]);



      vm.produit_action = {};
      function actionsHtml(data, type, full, meta) {
          vm.produit_action[data.ID] = data;
          var editbtn =
          '<button class="btnEdit_tb" ng-click="vm.edit(vm.produit_action[' +
          data.ID +
          '])"><img src="././images/main_configuration/edit.svg" alt="edit"></button>&nbsp;&nbsp;&nbsp;';

           var deletebtn =
          '<button class="btnEdit_tb" ng-click="vm.delete(vm.produit_action[' +
          data.ID +
          '])"><img src="././images/main_configuration/delete.svg" alt="delete"></button>';
      return editbtn + deletebtn;
      }


      vm.edit = function (data) {
        var copiedArray = angular.copy(data);
        vm.formData = copiedArray;
        //copiedArray.fermes =  copiedArray.fermes.map(ferme => ferme.IDFermes);
       toastr.clear();
          toastr.success(`The form for editing has been filled out and is ready for modification. 👆`, {
          closeButton: true
        });

      }





      $scope.allSelected = false; // Tracks "Select All" state

    // Toggle all checkboxes
    vm.toggleAllSelection = function() {
      $scope.allSelected = (!$scope.allSelected) ? true : false;
      vm.data_sousparcelle.forEach(societe => {
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
    vm.data_sousparcelle = vm.data_sousparcelle.map(societe => {
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
      vm.data_sousparcelle = vm.data_sousparcelle.map(societe => {
          if (societe.ID === id) {
              found = true;
              return { ...societe, selected: !societe.selected }; // Toggle selection
          }
          return societe;
      });
      /* if (!found) {
            vm.sousparcelle.push({ id_sco_temp: id, selected: true });
        }    */
  };

    function checkboxHtml(data, type, full, meta) {
        return `<input type="checkbox" ng-checked="data.selected" ng-click="toggleSelection(${data.ID})">`;
    }


    vm.updateSelectedCount = function () {
      return (vm.data_sousparcelle) ? vm.data_sousparcelle.filter(sousparcelle => sousparcelle.selected).length : 0;
    };


    vm.dtColumns = [
      DTColumnBuilder.newColumn(null)
        .withTitle(
          '#'// '<input type="checkbox" ng-model="vm.allSelected" onclick="toggleAllSelection()">'
        ).renderWith(checkboxHtml).notSortable().withOption("width", "10px"),
        DTColumnBuilder.newColumn("FarmName").withTitle("Ferme").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Ref").withTitle("Sous Parcelle").withOption("width", "100px"),
        DTColumnBuilder.newColumn("ParcelleRef").withTitle("Parcelle").withOption("width", "100px"),
        DTColumnBuilder.newColumn("SecteurName").withTitle("Secteur").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Vane").withTitle("Vane").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Sup").withTitle("Superficie").renderWith(function(data, type, full, meta) {
        if (full.Sup)
              return full.Sup.toFixed(2) + ' Ha';
          return '';
        }).withOption("width", "100px"),
        DTColumnBuilder.newColumn("Nbre_Gouteur").withTitle("Nbr Gouteur").renderWith(function(data, type, full, meta) {
        if (full.Nbre_Gouteur)
              return full.Nbre_Gouteur.toFixed(2) + ' %';
          return '';
        }).withOption("width", "100px"),
        DTColumnBuilder.newColumn("Debit_Gouteur").withTitle("Debit Gouteur").renderWith(function(data, type, full, meta) {
        if (full.Debit_Gouteur)
              return full.Debit_Gouteur.toFixed(2) + ' %';
          return '';
        }).withOption("width", "100px"),
        DTColumnBuilder.newColumn("Debit_SP").withTitle("Debit SP").renderWith(function(data, type, full, meta) {
        if (full.Debit_SP)
              return full.Debit_SP.toFixed(2) + ' %';
          return '';
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




      /**model generate */
        vm.gen_canvas = function(ev) {
          $mdDialog.show({
              controller: DialogControllerGen,
              templateUrl: '././views/configuration/secteurs_irrigation/canvas/canvas_sousparcelle.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose: false,
              locals: {
                data: vm.data_ferme,
                data_secteur: vm.data_secteur,
                data_parcelle: vm.data_parcelle
              }
            })
            .then(function(answer) {
              $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
              $scope.status = 'You cancelled the dialog.';
            });
        };

        function DialogControllerGen($scope, $mdDialog, data, data_secteur ,data_parcelle ) {
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
          $scope.data_secteur = data_secteur;
          $scope.data_parcelle = data_parcelle;

          $scope.inrements = [{id : 1, increment : 'Oui'},{id : 2, increment : 'Non'}]
          $scope.formdata_gen = {
            ferme : null,
            secteur : null,
            parcelle : null,
            nbrparcelle : null,
            increment : null
          }
          $scope.allformxls = [];


          $scope.getPhysiqueVariete = function () {
            $scope.formdata_gen.parcelle = null;
            $scope.formdata_gen.secteur = null;
          }

          $scope.canva_ajouter = function(){
            if(!$scope.formdata_gen.ferme){
              toastr.clear();
              toastr.warning("Veuillez choisir une ferme", {
                closeButton: true
              });
            }else if(!$scope.formdata_gen.parcelle){
              toastr.clear();
              toastr.warning("Veuillez choisir une parcelle", {
                closeButton: true
              });
            }else if(!$scope.formdata_gen.secteur){
              toastr.clear();
              toastr.warning("Veuillez choisir un secteur", {
                closeButton: true
              });
            }else if ($scope.formdata_gen.nbrparcelle <= 0) {
              toastr.clear();
              toastr.warning("Veuillez saisir le nombre de sousparcelle", {
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
            "Parcelle",
            "Secteur",
            "Sous Parcelle",
            "Superficie",
            "Vane",
            "Nbr de goutteur",
            "Debit Gouteur",
            "Debit SP"
            ];
          excelData.push(headers);
          let totalParcelles = 0; // Track total parcels
          $scope.allformxls.forEach(item => {
              let fermeName = item.ferme.Nom;
              let Parcellename = item.parcelle.Ref;
              let Secteurname = item.secteur.Secteur;
              let sousparcelleName = null;
                  for (let i = 1; i <= item.nbrparcelle; i++) {
                      if (item.increment === 1) {
                         sousparcelleName = `${Parcellename}-SP${i.toString().padStart(item.nbrparcelle.toString().length, '0')}`;
                      }
                      excelData.push([fermeName,
                      Parcellename,Secteurname,
                      sousparcelleName,null,
                      null,null,null,null]);
                       totalParcelles++;
                  }


          });
          toastr.clear();
          toastr.success(`Génération réussie : ${totalParcelles} sousparcelle(s) ajouté(s) au fichier excel`, { closeButton: true });

          return excelData;
      };

        $scope.downloadExcel = async function() {

          if($scope.allformxls.length>0){

            NProgress.start()
            let excelData = await $scope.generateExcelData();

            // Create a new workbook and a worksheet
            let ws = XLSX.utils.aoa_to_sheet(excelData);
            let wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "sousparcelle");

            // Generate a binary string from the workbook
            let wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

            // Convert the binary string to a Blob
            let blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });

            // Create a link element and trigger the download
            let link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "Canvas Sousparcelle.xlsx";
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

    vm.reset = function () {
      vm.formData =  {
        IDFermes : null,
        parcelle : null,
        Secteur : null,
        Ref : null,
        Nbre_Gouteur: null,
        Sup : null,
        Vane : null,
        Debit_Gouteur : null,
        Debit_SP : null
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
          ferme.get_all(),
          sousparcelle.get_all(),
          parcelleCultural.get_all(),
          SecteurService.get_all()
        ]).then((values) => {
            NProgress.done();
          vm.data_ferme = values[0].data;
          vm.data_sousparcelle = values[1].data;
          vm.data_parcelle = values[2].data;
          vm.data_secteur = values[3].data;
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
      "Parcelle",
      "Secteur",
      "Sous Parcelle",
      "Superficie",
      "Vane",
      "Nbr de goutteur",
      "Debit Gouteur",
      "Debit SP"
     ];

      vm.exportToExcel = function () {
         let headers=  vm.headers
          var ws_data = [headers]
          var ws = XLSX.utils.aoa_to_sheet(ws_data);

          // Create workbook
          var wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "sousparcelle");

          // Write the file and trigger download
          var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
          var blob = new Blob([wbout], { type: "application/octet-stream" });

          saveAs(blob, "Canvas Sous parcelle.xlsx");
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
        FermeName: item["Ferme"] || null,
        ParcelleName: item["Parcelle"] || null,
        SecteurName: item["Secteur"] || null,
        Ref: item["Sous Parcelle"] || null,
        Sup: item["Superficie"] || null,
        Vane: item["Vane"] || null,
        Nbre_Gouteur: item["Nbr de goutteur"] || null,
        Debit_Gouteur: item["Debit Gouteur"] || null,
        Debit_SP: item["Debit SP"] || null
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

    $scope.getReealName = function(field) {
      const fieldNames = {
          'Peut_etre_achete': 'Transité par module achat',
          'DA_obligatoire': 'Demande d\'achat obligatoire',
          'BC_obligatoire': 'Bon de commande obligatoire',
          'Amortissable': 'Article amortissable'
      };
      return fieldNames[field] || null;
  };



    $scope.validateData = async function() {
        let errors = [];
        let seenPairs = new Set();
        vm.jsonData.forEach((item, index) => {
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
                errors.push(`Row ${rowNum}: Missing Sous Parcelle as required field`);
            }

            if (!item.ParcelleName) {
                errors.push(`Row ${rowNum}: Missing Parcelle as required field`);
            }

            if (item.ParcelleName ) {
              let newparcelle = vm.data_parcelle.find(parcelle => String(parcelle.Ref).toUpperCase() === String(item.ParcelleName).toUpperCase() && parcelle.IDFermes === item.IDFermes);

               if(!newparcelle){
                 errors.push(`Row ${rowNum}: Parcelle '${item.ParcelleName}' does not exist`);
               }else {
                 vm.jsonData[index].parcelle = newparcelle.ID;
               }
            }

            if (!item.SecteurName) {
                errors.push(`Row ${rowNum}: Missing Secteur as required field`);
            }

            if (item.SecteurName ) {
              let newsecteur = vm.data_secteur.find(secteur => String(secteur.Secteur).toUpperCase() === String(item.SecteurName).toUpperCase() && secteur.IDFermes === item.IDFermes);

               if(!newsecteur){
                 errors.push(`Row ${rowNum}: Secteur '${item.SecteurName}' does not exist`);
               }else {
                 vm.jsonData[index].Secteur = newsecteur.ID;
               }
            }


            if (typeof item.Sup !== 'number' || item.Sup <= 0) {
                errors.push(`Row ${rowNum}: Superficie must be a number greater than 0`);
            }

            if (item.Nbre_Gouteur !== undefined && item.Nbre_Gouteur !== null && item.Nbre_Gouteur !== '') {
                  if (isNaN(item.Nbre_Gouteur)) {
                      errors.push(`Row ${rowNum}: Nbre Gouteur should be a number`);
                  }
            }

            if (item.Debit_Gouteur !== undefined && item.Debit_Gouteur !== null && item.Debit_Gouteur !== '') {
                  if (isNaN(item.Debit_Gouteur)) {
                      errors.push(`Row ${rowNum}: Debit Gouteur should be a number`);
                  }
            }

            if (item.Debit_SP !== undefined && item.Debit_SP !== null && item.Debit_SP !== '') {
                  if (isNaN(item.Debit_SP)) {
                      errors.push(`Row ${rowNum}: Debit SP should be a number`);
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



                    sousparcelle.multiadd({
                      entries :vm.jsonData
                    }).then(async e => {
                        toastr.clear();
                        toastr.success(e.data.message, {
                          closeButton: true
                        });
                        await $scope.undoSelect()
                        NProgress.done();

                        vm.data_sousparcelle.unshift(...e.data.inserted_data);

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
