'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ConfigurationComptesVCampagnesAgricolesCtrl
 * @description
 * # ConfigurationComptesVCampagnesAgricolesCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ConfigurationComptesVCampagnesAgricolesCtrl', function (
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
    ferme, compagne
  ) {
    var vm = this;
    vm._version = _version;

    vm.User = $cookies.getObject('globals').assistUser.Nom + " " + $cookies.getObject('globals').assistUser.Prenom;
    vm.IDUser = $cookies.getObject('globals').assistUser.ID;

    $translatePartialLoader.addPart("conduitetechnique");
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

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


    vm.jsonData = [];



    vm.selected = {};
    vm.selectAll = false;
    vm.societes = {};

    //get data and refresh datatable
    vm.data_societe = [];
NProgress.start();
    $q.all([
      compagne.get_all(),
      societe.get_all()
    ]).then((values) => {
      vm.data_societe = values[0].data;
      vm.data_societe_all = values[1].data;
      vm.old_items = vm.data_societe.length;
      NProgress.done();
    }).catch((error) => {
      if (error && error.message) {
        NProgress.done();
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


    vm.edit = async function(data){
      console.log(data);

      vm.formData = angular.copy(data);;

      vm.formData.Date_debut = (vm.formData.Date_debut) ? new Date(moment(vm.formData.Date_debut).format("YYYY-MM-DD")) : null;
      vm.formData.Date_Fin = (vm.formData.Date_Fin) ? new Date(moment(vm.formData.Date_Fin).format("YYYY-MM-DD")) : null;



      const matches = data.societe.map(ferme => { // from previous example
        const data_ferme = vm.data_societe_all.find(df => df.ID === ferme.IDsociete);
        return data_ferme ? { data_ferme, ferme } : null;
      }).filter(match => match !== null);

      vm.formData.societe = matches.map(match => match.data_ferme);


/*
        vm.formData.societe =  vm.data_societe_all.filter(societe =>
          vm.formData.societe.some(selected => selected.IDsociete === societe.ID)
         );*/



      toastr.clear();
            toastr.success(`The form for editing has been filled out and is ready for modification: ${vm.formData.Code}. 👆`, {
            closeButton: true
          });
    }

    vm.modifier = async function  () {


     if(await vm.validateFormData()){

          NProgress.start();

          compagne.edit(vm.formData).then(async e => {
              //validate success


              /*let index = vm.data_societe.findIndex(item => item.ID_compagne === e.data.inserted_data.ID_compagne);

              console.log('index',index);
              console.log('e.data.inserted_data' ,e.data.inserted_data);


             // vm.data_societe = vm.data_societe.filter(item => item.ID_compagne !== data.ID_compagne);
              if (index !== -1) {
                // Update the existing object
                vm.data_societe[index] = e.data.inserted_data;

                console.log("vm.data_societe[index]" ,vm.data_societe[index]);

              } else {
                // If not found, add it to the list (optional)
                //vm.data_societe.unshift(e.data.inserted_data);
              }*/

              toastr.clear();
              toastr.success("Campagne Agricole bien modifiée.", {
                closeButton: true
              });
              NProgress.done();

              $q.all([
                compagne.get_all_edit(vm.formData)
              ]).then((values) => {
                vm.data_societe = values[0].data;
              }).catch((error) => {
                console.error("Error message:", error);

              });

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


    vm.validateFormData = async function() {

          let rules = {
              Code: "Titre De La Campagne Agricole is required.",
              societe: "Société is required.",
              Date_debut: "Date de debut is required.",
              Date_Fin: "Date de fin is required."
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


          compagne.add(vm.formData).then(async e => {
              //validate success

            /*  vm.data_societe.unshift(e.data.inserted_data);
              console.log("e.data.inserted_data", e.data.inserted_data);

              console.log("vm.data_societe", vm.data_societe);*/

              toastr.clear();
              toastr.success(e.data.message, {
                closeButton: true
              });
              NProgress.done();



              $q.all([
                compagne.get_all_edit({
                  ID_compagne : e.data.inserted_data.ID_compagne
                })
              ]).then((values) => {
                vm.data_societe = values[0].data;
                vm.formData.ID_compagne = null
                vm.reset();
              }).catch((error) => {
                console.error("Error message:", error);

              });


          }).catch(async e => {
            NProgress.done();
            toastr.clear();
            toastr.error(e.data.message, {
              closeButton: true
            });
          });

        }


    };



    vm.delete = async function(data) {

      toastr.clear();
      toastr.error("<button type='button' id='confirmationRevertYes' class='btn btn-danger' style='float : right;'>Je confirme </button>", "Veuillez confirmer !", {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            NProgress.start()
            compagne.delete(data).then(async function(result) {

              vm.data_societe = vm.data_societe.filter(item => item.ID_compagne !== data.ID_compagne);

              toastr.clear();
              toastr.success("Suppression réussie", {
                closeButton: true
              });
              NProgress.done();

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

    vm.downloadExcel = function () {
      if (!vm.data_societe || vm.data_societe.length === 0) {
          alert("Aucune donnée à exporter !");
          return;
      }

      // Transformer les données en un tableau plat
      let excelData = [];
      vm.data_societe.forEach(compagne => {
          compagne.societe.forEach(societe => {
              excelData.push({
                  "Titre De La Campagne Agricole": compagne.Code_compagne,
                  "Société": societe.Rais_Social,
                  "Date De Début": new Date(compagne.Date_debut).toLocaleDateString(),
                  "Date De Fin": new Date(compagne.Date_Fin).toLocaleDateString()
              });
          });
      });

      // Convertir en worksheet
      let ws = XLSX.utils.json_to_sheet(excelData);

      // Créer un workbook
      let wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Campagnes Agricoles");

      // Générer et télécharger le fichier
      let wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      let blob = new Blob([wbout], { type: "application/octet-stream" });

      saveAs(blob, "Campagnes Agricoles.xlsx");
  };



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








   vm.reset = function () {

    vm.formData =  {
      ID_compagne : null,
      Code : null,
      societe: null,
      Date_debut: null,
      Date_Fin: null,
      newItem : true
    }
   }
   vm.reset()




    vm.howto = true;





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
