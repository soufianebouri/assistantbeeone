'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ConfigurationComptesVComptesCtrl
 * @description
 * # ConfigurationComptesVComptesCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ConfigurationComptesVComptesCtrl', function($scope, $state,toastr, _url, $window, $translatePartialLoader, $translate,_version) {
    var vm = this;
    vm._version = _version;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
      
    $scope.fileName = 'Aucun fichier choisi';
    $scope.uploadFile = function (element) {
      var file = element.files[0];
      if (file) {
        $scope.fileName = file.name;
        $scope.$apply();
      }
    };

    /**** all steps **/

    $scope.go_back = function(){
      $state.go("main_configuration");
    }

    vm.currect_step = 1;
    vm.step = async function (params) {
      vm.currect_step = params;
    }

    $scope.uploadFile = function (event) {
      var file = event.target.files[0];
      if (file) {
        $scope.fileName = file.name;
        $scope.$apply();
      }
    };

    $scope.isDragging = false;

    // Trigger file input when clicking on the card
    $scope.triggerFileInput = function() {
        document.getElementById('fileInput').click();
    };

    let allowedExtensions = ["xls", "xlsx"];
    // Handle file selection (when clicked)
    $scope.onFileSelected = function(file) {
      if (file) {
          // Get file extension (convert to lowercase for case-insensitive check)
          let fileExtension = file.name.split('.').pop().toLowerCase();
          
          // Allowed extensions
         
  
          if (allowedExtensions.includes(fileExtension)) {
              vm.isFileSelected = true;
              vm.fileName = file.name;
  
              if (file.size >= 1024 * 1024) {
                  vm.fileSize = (file.size / (1024 * 1024)).toFixed(2) + " MB";
              } else {
                  vm.fileSize = (file.size / 1024).toFixed(2) + " KB";
              }
          } else {
              vm.isFileSelected = false;
              toastr.clear();
              toastr.warning("Only XLS and XLSX files are allowed.", {
                  closeButton: true,
                }
              );
          }
      } else {
          vm.isFileSelected = false;
      }
  };
  

    vm.delete_file = function() {      
        vm.isFileSelected = false;  
    };

    // Handle drag events
    $scope.onDragOver = function(event) {
        event.preventDefault();
        event.stopPropagation();
        $scope.isDragging = true;
        $scope.$apply();
    };

    $scope.onDragLeave = function(event) {
        $scope.isDragging = false;
        $scope.$apply();
    };

    // Handle file drop
    $scope.onDrop = function(file) {
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
        }else{
          vm.isFileSelected = false;
        }
        
    };

    

    /**** Step 1 *****/

    /**** Step 2 *****/

    /**** Step 3 *****/



  });