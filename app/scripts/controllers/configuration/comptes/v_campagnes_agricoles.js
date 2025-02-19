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

    vm.User = $cookies.getObject('globals').currentUser.Nom + " " + $cookies.getObject('globals').currentUser.Prenom;
    vm.IDUser = $cookies.getObject('globals').currentUser.ID;

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
    vm.new = 0;
    vm.old_items = 0;

    $q.all([
      compagne.get_all(),
      societe.get_all()
    ]).then((values) => {
      vm.data_societe = values[0].data;
      vm.data_societe_all = values[1].data;
      vm.old_items = vm.data_societe.length;
    }).catch((error) => {
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
              toastr.success("Ferme bien modifié.", {
                closeButton: true
              });
              NProgress.done();   
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

      console.log(vm.formData);
      
      toastr.clear();
        if(await vm.validateFormData()){
       
         NProgress.start()                 
          

          compagne.add(vm.formData).then(async e => {
              //validate success

              vm.data_societe.unshift(e.data.inserted_data);
              console.log("e.data.inserted_data", e.data.inserted_data);
              
              console.log("vm.data_societe", vm.data_societe);
              
              toastr.clear();
              toastr.success(e.data.message, {
                closeButton: true
              });
              NProgress.done();            
              vm.new++;    
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
              
              if(data.newItem){
                vm.new--;
              }        
              await $scope.undoSelect()        
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

   

     
      vm.edit = function (data) {
        vm.formData = data;  
        console.log(vm.formData);
        
        vm.formData.Latitude = parseFloat(vm.formData.Latitude || 0);  // or set a default value
        vm.formData.Longitude = parseFloat(vm.formData.Longitude || 0);
        vm.formData.Date_Creatio_Ferme = (vm.formData.Date_Creatio_Ferme) ? new Date(moment(vm.formData.Date_Creatio_Ferme).format("YYYY-MM-DD")) : null;
     
        vm.formData.societe = vm.data_societe_all.find(societe => societe.ID === vm.formData.ID_societe);

        toastr.clear();
          toastr.success(`The form for editing has been filled out and is ready for modification: ${vm.formData.Nom}. 👆`, {
          closeButton: true
        });

      }

      

   vm.reset = function () {

    vm.formData =  {
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
