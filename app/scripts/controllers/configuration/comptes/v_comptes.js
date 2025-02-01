'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ConfigurationComptesVComptesCtrl
 * @description
 * # ConfigurationComptesVComptesCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ConfigurationComptesVComptesCtrl', function (
    $q,
    $scope, $state, toastr, $timeout, _url, $window, $translatePartialLoader,$translate,$cookies,translatedwords , _version, DTOptionsBuilder, suivimeteo, DTColumnBuilder, DTDefaultOptions   ) {
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

    $scope.go_back = function () {
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
    $scope.triggerFileInput = function () {
      document.getElementById('fileInput').click();
    };

    let allowedExtensions = ["xls", "xlsx"];
    // Handle file selection (when clicked)
    $scope.onFileSelected = function (file) {
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


    vm.delete_file = function () {
      vm.isFileSelected = false;
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

    /***transcription */
    $scope.transcriptionEnabled = true;

    // Transcript JSON
    $scope.transcript = [
      { "start": 0, "end": 5, "text": "Some of the most successful people in the world are the ones who've had the most failures." },
      { "start": 5, "end": 8, "text": "J.K. Rawlings, who wrote Harry Potter." },
      { "start": 8, "end": 14, "text": "Her first Harry Potter book was rejected 12 times before it was finally published." },
      { "start": 14, "end": 17, "text": "Michael Jordan was cut from his high school basketball team." },
      { "start": 17, "end": 22, "text": "He lost hundreds of games and missed thousands of shots during his career." },
      { "start": 22, "end": 27, "text": "But he once said, I have failed over and over and over again in my life, and that's why." },
      { "start": 27, "end": 34, "text": "I succeed. These people succeeded because they understood that you can't let your failures define you." },
      { "start": 34, "end": 37, "text": "end You have to let your failures teach you. " },
      { "start": 37, "end": 42, "text": "You have to let them show you what to do differently the next time." },
      { "start": 42, "end": 45, "text": "So if you get into trouble, that doesn't mean you're a troublemaker." },
      { "start": 45, "end": 49, "text": "It means you need to try harder to act right." },
      { "start": 49, "end": 51, "text": "If you get a bad grade, that doesn't mean you're stupid." },
      { "start": 51, "end": 58, "text": "It just means you need to spend more time studying. No one's born being good at all things." },
      { "start": 58, "end": 63, "text": "You become good at things through hard work. You become good at all things. You become good at things through hard work." }
    ]

    vm.videoDuration = 0;  // Initialize the video duration

    // Access the video element and get the duration
    var videoElement = document.getElementById('videoPlayer');

    // Listen for the 'loadedmetadata' event to get the duration once the video metadata is loaded
    videoElement.addEventListener('loadedmetadata', function () {
      // Set the video duration in seconds
      vm.videoDuration = videoElement.duration;
      // Trigger the digest cycle to update the view
      $scope.$apply();
    });


    var description_support = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent tristique eleifend arcu, velar ipsum Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent tristique eleifend arcu, velar ipsum Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent tristique eleifend arcu, velar ipsum Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent tristique eleifend arcu, velar ipsum Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent tristique eleifend arcu, velar ipsum";

    // Shorten text for initial view
    $scope.shortText = description_support.substring(0, 100); // Show first 100 characters
    $scope.longText = description_support; // Full text

    // Set the ellipsis
    $scope.ellipsis = '...';

    // Initialize expanded state
    $scope.isExpanded = false;

    // Toggle show more/less
    $scope.toggleText = function () {
      $scope.isExpanded = !$scope.isExpanded;
    };



    vm.get_time = function (seconds) {
      const hours = Math.floor(seconds / 3600);          // Calculate hours
      const minutes = Math.floor((seconds % 3600) / 60); // Calculate minutes
      const remainingSeconds = Math.floor(seconds % 60); // Calculate remaining seconds

      // If hours are greater than zero, format as HH:MM:SS, otherwise just MM:SS
      if (hours > 0) {
        return (hours < 10 ? '0' + hours : hours) + ':' +
          (minutes < 10 ? '0' + minutes : minutes) + ':' +
          (remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds);
      } else {
        return (minutes < 10 ? '0' + minutes : minutes) + ':' +
          (remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds);
      }
    };

    const video = document.getElementById("videoPlayer");
   // video.play()
   // video.muted = true;

    // Function to check which transcript is active
    $scope.isCurrentSubtitle = function (entry) {
      if (!video || !$scope.transcriptionEnabled) return false;
      const currentTime = video.currentTime;
      return currentTime >= entry.start && currentTime <= entry.end;
    };

    // Function to auto-scroll to the active subtitle
    function scrollToActiveSubtitle() {
      $timeout(function () {
        // Find the active subtitle with the 'highlight' class
        const activeSubtitle = document.querySelector(".transcript-item.highlight");
        const transcriptContainer = document.querySelector(".transcript-container");

        // If active subtitle and container exist, scroll the container
        if (activeSubtitle && transcriptContainer) {
          transcriptContainer.scrollTop = activeSubtitle.offsetTop - transcriptContainer.offsetTop;
        }
      }, 100); // Delay to ensure DOM updates first
    }

    // Function to update transcript and auto-scroll
    function updateTranscript() {
      // If transcription is disabled, stop updates and reset scroll
      if (!$scope.transcriptionEnabled) {
        return;
      }

      $scope.$applyAsync(); // Prevents "digest already in progress" error
      scrollToActiveSubtitle(); // Scroll to active subtitle

      // Recursive update with delay
      $timeout(updateTranscript, 500);
    }

    // Start updating subtitles
    function startTranscriptUpdates() {
      if ($scope.transcriptionEnabled) {
        updateTranscript();
      }
    }

    // Watch for changes in transcriptionEnabled and start/stop transcript updates
    $scope.$watch('transcriptionEnabled', function (newVal, oldVal) {
      if (newVal && !oldVal) {
        // Start transcript updates when transcription is enabled
        startTranscriptUpdates();
      } else if (!newVal && oldVal) {
        // Stop updates when transcription is disabled
        // Optionally reset scroll position here if needed
        const transcriptContainer = document.querySelector(".transcript-container");
        if (transcriptContainer) {
          transcriptContainer.scrollTop = 0; // Reset scroll position when transcription is off
        }
      }
    });

    // Start or stop transcript updates based on the initial transcription state
    startTranscriptUpdates();


    vm.makeCall = function() {
      var phoneNumber = "+1234567890"; // Replace with the phone number you want to call
      window.location.href = "tel:" + phoneNumber;
    };

    vm.sendEmail = function() {
      var email = "support@agridata-consulting.com"; 
    
      // Open the default mail client with the 'mailto' protocol
      window.location.href = "mailto:" + email ;
    };

   /** Table */
  
   $translatePartialLoader.addPart('conduitetechnique');
   $translate.use($window.localStorage.getItem("lang").toLowerCase());
   $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

   vm.dtInstance = {};
   var titleHtml = '<input type="checkbox" ng-model="vm.selectAll" ng-click="vm.toggleAll(vm.selectAll, vm.selected)">';
   vm.selected = {};
   vm.selectAll = false;
   vm.toggleAll = toggleAll;
   vm.toggleOne = toggleOne;
   vm.metio = {};
   vm.User = $cookies.getObject('globals').currentUser.Nom + " " + $cookies.getObject('globals').currentUser.Prenom;
   vm.IDUser = $cookies.getObject('globals').currentUser.ID;
   vm.IDferme = $cookies.getObject('globals').ferme.IDFerme;
   vm.IDSociete = $cookies.getObject('globals').ferme.IDSociete;
   //set date input
   $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
   $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

   $scope.date_debut_sel = 0;
   $scope.date_fin_sel = moment($scope.date_fin).format('YYYYMMDD');

   var permission_data = JSON.parse($window.localStorage.getItem('permission'));
   var permission = {
     modules_array: permission_data[0],
     rubriques_array: permission_data[1],
     sous_modules_array: permission_data[2]
   }

   vm.isAdmin = $cookies.getObject('globals').currentUser.isAdmin;

   var opsemisAccess = _.filter(permission.sous_modules_array, {
     ss_module: 'Suivi_meteo'
   });

   $scope.canIAction = () => {
     if (vm.isAdmin)
       return {
         add: true,
         update: true,
         delete: true
       }
     return {
       add: opsemisAccess[0].a,
       update: opsemisAccess[0].u,
       delete: opsemisAccess[0].d
     }
   }

   vm.obj = {
     "DOMAINE": $cookies.getObject('globals').ferme.IDFerme,
     "DATE_DEBUT": 0,
     "DATE_FIN": moment($scope.date_fin).format('YYYYMMDD')
   };

   //get data and refresh datatable
   $scope.updateDataMeteo = function(data) {
     return suivimeteo.getByFiltre(data);
   };

   //by date_debutl
   $scope.date_debut_change = function() {
     NProgress.start();
     if ($scope.date_debut === null || $scope.date_debut === "" || $scope.date_debut === undefined || $scope.date_debut === 0 || $scope.date_debut === "0" || !$scope.date_debut || $scope.date_debut.length === 0) {
       $scope.date_debut_sel = 0;
     } else {
       $scope.date_debut_sel = $scope.date_debut;
     }

     vm.obj.DATE_DEBUT = moment($scope.date_debut_sel).format('YYYYMMDD');
     vm.dtInstance.reloadData();
     NProgress.done();
     NProgress.remove();
   };

   //by date_fin
   $scope.date_fin_change = function() {
     NProgress.start();
     if ($scope.date_fin === null || $scope.date_fin === "" || $scope.date_fin === undefined || $scope.date_fin === 0 || $scope.date_fin === "0" || !$scope.date_fin || $scope.date_fin.length === 0) {
       $scope.date_fin_sel = 0;
     } else {
       $scope.date_fin_sel = $scope.date_fin;
     }

     vm.obj.DATE_FIN = moment($scope.date_fin_sel).format('YYYYMMDD');
     vm.dtInstance.reloadData();
     NProgress.done();
     NProgress.remove();
   };

   if ($scope.canIAction().add) {
     $scope.btnadd = {
       text: "<i class='fa fa-plus'></i>",
       key: '1',
       className: 'pull-left',
       action: function(e, dt, node, config) {
         $scope.AddClimat()
       },
       titleAttr: 'Ajouter'
     }
   } else {
     $scope.btnadd = undefined;
   }

   vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
       var defer = $q.defer();
       $scope.updateDataMeteo(vm.obj).then(function(res) {
         defer.resolve(res.data);
         NProgress.done();
       });
       return defer.promise;
     })
     .withOption('createdRow', createdRow)
     .withDOM('<lf<t>ip>')
     .withPaginationType('simple_numbers')
     .withOption('responsive', true)


     .withButtons([{
         extend: 'colvis',
         text: "<i class='fa fa-eye'></i>",
         className: 'pull-left',
         titleAttr: translatedwords.getTranslatedWord($translate("Visibilité"))
       },
       {
         text: "<i class='fa fa-search'></i>",
         action: function(e, dt, node, config) {
           $scope.ReverseDisplay('filter_form');
         },
         titleAttr: translatedwords.getTranslatedWord($translate("Rechercher"))
       },
       {
         extend: 'copy',
         text: "<i class='fa fa-copy'></i>",
         titleAttr: translatedwords.getTranslatedWord($translate("Copie"))
       },
       {
         extend: 'print',
         text: "<i class='fa fa-print'></i>",
         titleAttr: translatedwords.getTranslatedWord($translate("Imprimer"))
       },
       {
         extend: 'pdf',
         text: "<i class='fa fa-file-pdf-o'></i>",
         titleAttr: 'PDF'
       },
       {
         extend: 'excel',
         text: "<i class='fa fa-file-excel-o'></i>",
         titleAttr: 'EXCEL'
       }
     ]);


   vm.dtColumns = [
     DTColumnBuilder.newColumn('Date').withTitle(translatedwords.getTranslatedWord($translate("Date"))).renderWith(function(data, type, full, meta) {
       return moment(full.Date).format('DD/MM/YYYY');
     }),
     DTColumnBuilder.newColumn('TMax').withTitle(translatedwords.getTranslatedWord($translate("Tmax (°C)"))).renderWith(function(data, type, full, meta) {
       if (full.TMax)
         return '<p align="right">' + full.TMax.toFixed(2) + '</p>';
       return '<p align="right">0</p>';
     }),
     DTColumnBuilder.newColumn('Tmin').withTitle(translatedwords.getTranslatedWord($translate("Tmin (°C)"))).renderWith(function(data, type, full, meta) {
       if (full.TMax)
         return '<p align="right">' + full.Tmin.toFixed(2) + '</p>';
       return '<p align="right">0</p>';
     }),
     DTColumnBuilder.newColumn('Tmoy').withTitle(translatedwords.getTranslatedWord($translate("Tmoy (°C)"))).renderWith(function(data, type, full, meta) {
       if (full.Tmoy)
         return '<p align="right">' + full.Tmoy.toFixed(2) + '</p>';
       return '<p align="right">0</p>';
     }),
     DTColumnBuilder.newColumn('Vent').withTitle(translatedwords.getTranslatedWord($translate("Vent (Km/h)"))).renderWith(function(data, type, full, meta) {
       if (full.Vent)
         return '<p align="right">' + full.Vent.toFixed(2) + '</p>';
       return '<p align="right">0</p>';
     }),
     DTColumnBuilder.newColumn('HR').withTitle(translatedwords.getTranslatedWord($translate("HR (%)"))).renderWith(function(data, type, full, meta) {
       if (full.HR)
         return '<p align="right">' + full.HR.toFixed(2) + '</p>';
       return '0';
     }),
     DTColumnBuilder.newColumn('Hmin').withTitle(translatedwords.getTranslatedWord($translate("Hmin (%)"))).renderWith(function(data, type, full, meta) {
       if (full.Hmin)
         return '<p align="right">' + full.Hmin.toFixed(2) + '</p>';
       return '<p align="right">0</p>';
     }),
     DTColumnBuilder.newColumn('Pluvio').withTitle(translatedwords.getTranslatedWord($translate("Pluviométrie (mm)"))).renderWith(function(data, type, full, meta) {
       if (full.Pluvio)
         return '<p align="right">' + full.Pluvio.toFixed(2) + '</p>';
       return '<p align="right">0</p>';
     }),
     DTColumnBuilder.newColumn('E0').withTitle(translatedwords.getTranslatedWord($translate("ETO (mm)"))).renderWith(function(data, type, full, meta) {
       if (full.E0)
         return '<p align="right">' + full.E0.toFixed(2) + '</p>';
       return '<p align="right">0</p>';
     }),
     DTColumnBuilder.newColumn('RG').withTitle(translatedwords.getTranslatedWord($translate("RG (W/m2)"))).renderWith(function(data, type, full, meta) {
       if (full.RG)
         return '<p align="right">' + full.RG.toFixed(2) + '</p>';
       return '<p align="right">0</p>';
     }),
     DTColumnBuilder.newColumn('BAC').withTitle(translatedwords.getTranslatedWord($translate("BAC (mm)"))).renderWith(function(data, type, full, meta) {
       if (full.BAC)
         return '<p align="right">' + full.BAC.toFixed(2) + '</p>';
       return '<p align="right">0</p>';
     }),
     DTColumnBuilder.newColumn('BAC').withTitle(translatedwords.getTranslatedWord($translate("BAC (mm)"))).renderWith(function(data, type, full, meta) {
       if (full.BAC)
         return '<p align="right">' + full.BAC.toFixed(2) + '</p>';
       return '<p align="right">0</p>';
     }),
     DTColumnBuilder.newColumn('BAR').withTitle(translatedwords.getTranslatedWord($translate("BAR (Bar)"))).renderWith(function(data, type, full, meta) {
       if (full.BAR)
         return '<p align="right">' + full.BAR.toFixed(2) + '</p>';
       return '<p align="right">0</p>';
     }),
     DTColumnBuilder.newColumn('RAJOUT').withTitle(translatedwords.getTranslatedWord($translate("Rajout (mm)"))).renderWith(function(data, type, full, meta) {
       if (full.RAJOUT)
         return '<p align="right">' + full.RAJOUT.toFixed(2) + '</p>';
       return '<p align="right">0</p>';
     }),
     DTColumnBuilder.newColumn('Observation').withTitle(translatedwords.getTranslatedWord($translate("Observation"))),
     DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).withOption('width', '10%').renderWith(actionsHtml).withClass('nowraptd all')
   ];

   DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');



   function edit(c) {}

   function deleteRow(c) {}

   function createdRow(row, data, dataIndex) {
     // Recompiling so we can bind Angular directive to the DT
     $compile(angular.element(row).contents())($scope);
   }

   function headerCallback(header) {
     if (!vm.headerCompiled) {
       // Use this headerCompiled field to only compile header once
       vm.headerCompiled = true;
       $compile(angular.element(header).contents())($scope);
     }
   }

   function actionsHtml(data, type, full, meta) {
     vm.metio[data.ID] = data;
     var editbtn = ($scope.canIAction().update) ? '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="vm.edit(vm.metio[' + data.ID + '])"><i class="fa fa-edit"></i></button>&nbsp;' : '';
     var deletebtn = ($scope.canIAction().delete) ? '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="vm.delete(vm.metio[' + data.ID + '])" )"=""><i class="fa fa-trash-o"></i></button>' : '';
     return editbtn + deletebtn;
   }

   vm.delete = async function(c) {
     vm.IDmetio = c.ID;
     toastr.clear();
     toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
       closeButton: true,
       allowHtml: true,
       onShown: function(toast) {
         $("#confirmationRevertYes").click(function() {
           suivimeteo.delete({
             ID: vm.IDmetio
           }).then(async function(result) {
             if (result.data[0].message == "ajout reussi") {
               //validate success
               toastr.clear();
               toastr.info(await translatedwords.getTranslatedWord($translate("Suppression réussie")), {
                 closeButton: true
               });
               NProgress.done();
               vm.dtInstance.reloadData();
             } else {
               toastr.clear();
               toastr.error(await translatedwords.getTranslatedWord($translate("An error occured")) + result.data[0].description, {
                 closeButton: true
               });
             }
           });
         });
       }
     });

   }

   $scope.ReverseDisplay = function(d) {
     if (document.getElementById(d).style.display === "none") {
       document.getElementById(d).style.display = "block";
     } else {
       document.getElementById(d).style.display = "none";
     }
   }

   function toggleAll(selectAll, selectedItems) {
     for (var id in selectedItems) {
       if (selectedItems.hasOwnProperty(id)) {
         selectedItems[id] = selectAll;
       }
     }
   }

   function toggleOne(selectedItems) {
     for (var id in selectedItems) {
       if (selectedItems.hasOwnProperty(id)) {
         if (!selectedItems[id]) {
           vm.selectAll = false;
           return;
         }
       }
     }
     vm.selectAll = true;
   }
    /**** Step 1 *****/

    /**** Step 2 *****/

    /**** Step 3 *****/



  });