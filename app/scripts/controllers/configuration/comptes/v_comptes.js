"use strict";

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ConfigurationComptesVComptesCtrl
 * @description
 * # ConfigurationComptesVComptesCtrl
 * Controller of the beeOneWebFrontApp
 */
angular
  .module("beeOneWebFrontApp")
  .controller(
    "ConfigurationComptesVComptesCtrl",
    function (
      $q,
      $scope,
      $state,
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
      societe,$cookies
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

      /**** all steps **/

      $scope.go_back = function () {
        $state.go("main_configuration");
      };

      vm.currect_step = 1;
      vm.step = async function (params) {
        vm.currect_step = params;
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
      // Handle file selection (when clicked)
      $scope.onFileSelected = function (file) {
        if (file) {
          // Get file extension (convert to lowercase for case-insensitive check)
          let fileExtension = file.name.split(".").pop().toLowerCase();

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
            });
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
        {
          start: 0,
          end: 5,
          text: "Some of the most successful people in the world are the ones who've had the most failures.",
        },
        { start: 5, end: 8, text: "J.K. Rawlings, who wrote Harry Potter." },
        {
          start: 8,
          end: 14,
          text: "Her first Harry Potter book was rejected 12 times before it was finally published.",
        },
        {
          start: 14,
          end: 17,
          text: "Michael Jordan was cut from his high school basketball team.",
        },
        {
          start: 17,
          end: 22,
          text: "He lost hundreds of games and missed thousands of shots during his career.",
        },
        {
          start: 22,
          end: 27,
          text: "But he once said, I have failed over and over and over again in my life, and that's why.",
        },
        {
          start: 27,
          end: 34,
          text: "I succeed. These people succeeded because they understood that you can't let your failures define you.",
        },
        {
          start: 34,
          end: 37,
          text: "end You have to let your failures teach you. ",
        },
        {
          start: 37,
          end: 42,
          text: "You have to let them show you what to do differently the next time.",
        },
        {
          start: 42,
          end: 45,
          text: "So if you get into trouble, that doesn't mean you're a troublemaker.",
        },
        {
          start: 45,
          end: 49,
          text: "It means you need to try harder to act right.",
        },
        {
          start: 49,
          end: 51,
          text: "If you get a bad grade, that doesn't mean you're stupid.",
        },
        {
          start: 51,
          end: 58,
          text: "It just means you need to spend more time studying. No one's born being good at all things.",
        },
        {
          start: 58,
          end: 63,
          text: "You become good at things through hard work. You become good at all things. You become good at things through hard work.",
        },
      ];

      vm.videoDuration = 0; // Initialize the video duration

      // Access the video element and get the duration
      var videoElement = document.getElementById("videoPlayer");

      vm.isPlaying = false;
      videoElement.addEventListener("play", function () {
        $scope.$apply(function () {
          vm.isPlaying = true;
        });
      });

      videoElement.addEventListener("pause", function () {
        $scope.$apply(function () {
          vm.isPlaying = false;
        });
      });

      // Listen for the 'loadedmetadata' event to get the duration once the video metadata is loaded
      videoElement.addEventListener("loadedmetadata", function () {
        vm.videoDuration = videoElement.duration;

        $scope.$apply();
      });

      var description_support =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent tristique eleifend arcu txt lg txt kdkdokdo kdjdi dod idi";

      // Shorten text for initial view
      $scope.shortText = description_support.substring(0, 50); // Show first 100 characters
      $scope.longText = description_support; // Full text

      // Set the ellipsis
      $scope.ellipsis = "...";

      // Initialize expanded state
      $scope.isExpanded = false;

      // Toggle show more/less
      $scope.toggleText = function () {
        $scope.isExpanded = !$scope.isExpanded;
      };

      vm.get_time = function (seconds) {
        const hours = Math.floor(seconds / 3600); // Calculate hours
        const minutes = Math.floor((seconds % 3600) / 60); // Calculate minutes
        const remainingSeconds = Math.floor(seconds % 60); // Calculate remaining seconds

        // If hours are greater than zero, format as HH:MM:SS, otherwise just MM:SS
        if (hours > 0) {
          return (
            (hours < 10 ? "0" + hours : hours) +
            ":" +
            (minutes < 10 ? "0" + minutes : minutes) +
            ":" +
            (remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds)
          );
        } else {
          return (
            (minutes < 10 ? "0" + minutes : minutes) +
            ":" +
            (remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds)
          );
        }
      };

      const video = document.getElementById("videoPlayer");
      //video.play()
      //video.muted = true;

      video.addEventListener("timeupdate", function () {
        $scope.$applyAsync(); // Trigger Angular digest cycle
      });

      // Function to check which transcript is active
      $scope.isCurrentSubtitle = function (entry) {
        if (!video) return false;
        const currentTime = video.currentTime;
        return currentTime >= entry.start && currentTime <= entry.end;
      };

      // Function to auto-scroll to the active subtitle
      function scrollToActiveSubtitle() {
        $timeout(function () {
          // Find the active subtitle with the 'highlight' class
          const activeSubtitle = document.querySelector(
            ".transcript-item.highlight"
          );
          const transcriptContainer = document.querySelector(
            ".transcript-container"
          );

          // If active subtitle and container exist, scroll the container
          if (activeSubtitle && transcriptContainer) {
            transcriptContainer.scrollTop =
              activeSubtitle.offsetTop - transcriptContainer.offsetTop;
          }
        }, 100); // Delay to ensure DOM updates first
      }

      // Function to update transcript and auto-scroll
      function updateTranscript() {
        if (!$scope.transcriptionEnabled) return; // Only stop scrolling, not highlighting

        $scope.$applyAsync();
        scrollToActiveSubtitle();
        $timeout(updateTranscript, 500);
      }

      // Start updating subtitles
      function startTranscriptUpdates() {
        if ($scope.transcriptionEnabled) {
          updateTranscript();
        }
      }

      // Watch for changes in transcriptionEnabled and start/stop transcript updates
      $scope.$watch("transcriptionEnabled", function (newVal, oldVal) {
        if (newVal && !oldVal) {
          // Start transcript updates when transcription is enabled
          startTranscriptUpdates();
        } else if (!newVal && oldVal) {
          // Stop updates when transcription is disabled
          // Optionally reset scroll position here if needed
          const transcriptContainer = document.querySelector(
            ".transcript-container"
          );
          if (transcriptContainer) {
            transcriptContainer.scrollTop = 0; // Reset scroll position when transcription is off
          }
        }
      });

      // Start or stop transcript updates based on the initial transcription state
      startTranscriptUpdates();

      vm.makeCall = function () {
        var phoneNumber = "+1234567890"; // Replace with the phone number you want to call
        window.location.href = "tel:" + phoneNumber;
      };

      vm.sendEmail = function () {
        var email = "support@agridata-consulting.com";

        // Open the default mail client with the 'mailto' protocol
        window.location.href = "mailto:" + email;
      };

      vm.isAI = false;
      vm.ai = function () {
      vm.isAI = true;
        
      };

      vm.go_back_video = function () {
        vm.isAI = false;
        };
      

      /** Table */

      vm.dtInstance = {};
      vm.selected = {};
      vm.selectAll = false;
      vm.societes = {};

      //get data and refresh datatable
      vm.data_societe = []; 
      vm.new = 0;
      vm.old = 0;

      $q.all([
        societe.get_all()
      ]).then((values) => {
        vm.data_societe = values[0].data;
        vm.old = vm.data_societe.length;
        vm.dtInstance.reloadData();
      });

      vm.dtOptions = DTOptionsBuilder.fromFnPromise(function () {
        //var defer = $q.defer();
        return $q.resolve(vm.data_societe);
      })
        .withOption("createdRow", createdRow)
        .withDOM("<lf<t>ip>")
        .withPaginationType("simple_numbers")
        .withOption("responsive", true)
      /*  .withOption('scrollX', false) // Add this line
         .withOption('autoWidth', false)
        .withDisplayLength(5)
        .withScroller(false)*/
        .withButtons([
          {
            extend: "copy",
            className: "pull-left pointer",
            text: "COPY",
            titleAttr: "Copie",
          },
          {
            extend: "pdf",
            text: "PDF",
            titleAttr: "PDF",
          },
          {
            extend: "excel",
            text: "EXCEL",
            titleAttr: "EXCEL",
          },
        ]);


        function actionsHtml(data, type, full, meta) {
          vm.societes[data.id_sco_temp] = data;
          var editbtn =
          '<button class="btnEdit_tb" ng-click="vm.edit(vm.societes[' +
          data.id_sco_temp +
          '])"><img src="././images/main_configuration/edit.svg" alt="edit"></button>&nbsp;&nbsp;&nbsp;';
        
        var deletebtn =
          '<button class="btnEdit_tb" ng-click="vm.delete(vm.societes[' +
          data.id_sco_temp +
          '])"><img src="././images/main_configuration/delete.svg" alt="delete"></button>';
        
        return editbtn + deletebtn;
        }

        vm.edit = function (data) {
          console.log(data);          
        }

        vm.delete = function (data) {
          console.log(data);          
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


      $scope.toggleSelection = function (id) {    
        let found = false;    
        vm.data_societe = vm.data_societe.map(societe => {
            if (societe.id_sco_temp === id) {
                found = true;
                return { ...societe, selected: !societe.selected }; // Toggle selection
            }
            return societe;
        });    
        if (!found) {
            vm.data_societe.push({ id_sco_temp: id, selected: true });
        }    
    };
         
      function checkboxHtml(data, type, full, meta) {        
          return `<input type="checkbox" ng-checked="data.selected" ng-click="toggleSelection(${data.id_sco_temp})">`;
      }   
      
      
      vm.updateSelectedCount = function () {
        return vm.data_societe.filter(societe => societe.selected).length;
      };


      vm.dtColumns = [
        DTColumnBuilder.newColumn(null)
          .withTitle(
            '#'// '<input type="checkbox" ng-model="vm.allSelected" onclick="toggleAllSelection()">'
          )
          .renderWith(checkboxHtml).notSortable(), 
        DTColumnBuilder.newColumn("Rais_Social")
          .withTitle("Raison Sociale")
          .withClass("no-break"),
        DTColumnBuilder.newColumn("Statut_juridique").withTitle(
          "Statut juridique"
        ),
        DTColumnBuilder.newColumn("Capital").withTitle("Capital"),
        DTColumnBuilder.newColumn("Ville").withTitle("Ville"),
        DTColumnBuilder.newColumn("Email").withTitle("Email"),
        DTColumnBuilder.newColumn("Fax").withTitle("fax"),
        DTColumnBuilder.newColumn("Patente").withTitle("Patente"),
        DTColumnBuilder.newColumn("N_CNSS").withTitle("N° CNSS"),
        DTColumnBuilder.newColumn("N_amo").withTitle("N° AMO"),
        DTColumnBuilder.newColumn("IDFiscale").withTitle("ID Fiscal"),
        DTColumnBuilder.newColumn("ICE").withTitle("ICE"),
        DTColumnBuilder.newColumn("Prefixe_matricule").withTitle(
          "Pré Fixe Matricule Ouvrier"
        ),
        DTColumnBuilder.newColumn("Adresse").withTitle("Adresse"),
        DTColumnBuilder.newColumn(null)
          .withTitle("Actions")
          .renderWith(actionsHtml)
          .withClass("nowraptd all").notSortable(),
      ];


      DTDefaultOptions.setLoadingTemplate(
        '<center><img src="././images/loading.gif"/></center>'
      );

     vm.reset = function () {
               vm.raison_sociale = null
               vm.statut_juridique = null
               vm.capital = null
               vm.ville = null
               vm.adresse = null
               vm.email = null
               vm.fax = null
               vm.patente = null
               vm.cnss = null
               vm.amo = null
               vm.fiscal = null
               vm.ice = null
               vm.matricule = null
     }
      

      $scope.check_all_data_input = async function(){
        var isDuplicate = vm.data_societe.some(function(societe) {
          return societe.Rais_Social === vm.raison_sociale;
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

      vm.id_sco_temp = 0;
      vm.ajouter = async function  () {
        if (vm.raison_sociale) {
          if(await $scope.check_all_data_input()){
            vm.id_sco_temp += 1;
            vm.data_societe.push({
              Rais_Social: vm.raison_sociale,
              Statut_juridique: vm.statut_juridique,
              Capital: vm.capital,
              Ville: vm.ville,
              Adresse: vm.adresse,
              Email: vm.email,
              Fax: vm.fax,
              Patente: vm.patente,
              N_CNSS: vm.cnss,
              N_amo: vm.amo,
              IDFiscale: vm.fiscal,
              ICE: vm.ice,
              Prefixe_matricule: vm.matricule,
              ID_Profil : vm.IDUser,
              DateCreated : moment().format("YYYYMMDD"),
              old : 0,
              id_sco_temp: vm.id_sco_temp,
            });      
            vm.new++;    
            vm.dtInstance.reloadData();
            vm.reset();
            toastr.clear();
            toastr.success("Société bien ajoutée au tableau.", {
              closeButton: true,
            });
          }
         
        } else {
          toastr.clear();
          toastr.warning("Raison Sociale is required!", {
            closeButton: true,
          });
        }
      };

      vm.howto = true;

      function createdRow(row, data, dataIndex) {
        // Add row highlighting first
        if (data.old === 1) {
          angular.element(row).addClass('old-row');
        }
        
        // Then handle Angular compilation
        $compile(angular.element(row).contents())($scope);
      }

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
