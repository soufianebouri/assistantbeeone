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
      $scope,
      $state,
      $timeout,
      _url,
      $window,
      $translatePartialLoader,
      $translate,
      _version,
      $cookies
    ) {
      var vm = this;
      vm._version = _version;

      vm.User = $cookies.getObject('beeoneAssistant').assistUser.Nom + " " + $cookies.getObject('beeoneAssistant').assistUser.Prenom;
      vm.IDUser = $cookies.getObject('beeoneAssistant').assistUser.ID;

      $translatePartialLoader.addPart("conduitetechnique");
      $translate.use($window.localStorage.getItem("lang").toLowerCase());
      $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

      /**** all steps **/

      $scope.go_back = function () {
        $state.go("main_configuration");
      };

      $scope.rightPanelCollapsed = true;

            $scope.toggleRightPanel = function() {
              $scope.rightPanelCollapsed = !$scope.rightPanelCollapsed;
            };

            
      vm.currect_step = 1;
      vm.stepUrl = "views/configuration/comptes/v_societe.html";
      vm.step = async function (params, stepUrl) {
        vm.currect_step = params;
        vm.stepUrl = stepUrl
      };

      vm.nextStep = function(){
        //max = 3
        vm.currect_step ++ ;
        vm.gostep(vm.currect_step)
      }

      vm.preveusStep = function(){
        //max = 3
        vm.currect_step -- ;
        vm.gostep(vm.currect_step)
      }

      vm.gostep = function(index){
        if(index == 1){
          vm.stepUrl = "views/configuration/comptes/v_societe.html";
        }else if(index == 2){
          vm.stepUrl = "views/configuration/comptes/v_ferme.html";
        }else{
          vm.stepUrl = "views/configuration/comptes/v_campagnes_agricoles.html";
        }
      }



      /***transcription */
      $scope.transcriptionEnabled = true;

      // Transcript JSON
      $scope.transcript = [
    {
      "start": 0.334,
      "end": 6.334,
      "text": "Et comme chaque lundi, c'est l'heure de la chronique politique en compagnie de Fahd al-Hiraki conjoint. A Rabat, bonsoir Fahd."
    },
    {
      "start": 8,
      "end": 11,
      "text": "Bonsoir Manal."
    },
    {
      "start": 11,
      "end": 22.326,
      "text": "Alors retour ce soir sur le lancement jeudi dernier par le Roi Mohamed 6 de la nouvelle stratégie de développement du secteur agricole, des générations green 2020-2030 et de celles"
    },
    {
      "start": 22.326,
      "end": 29.086,
      "text": "relatives au développement du secteur des eaux et forêts du non-forêts du Maroc. Dans quel contexte sont lancées ces deux stratégies?"
    },
    {
      "start": 33.326,
      "end": 43.906,
      "text": "Alors ce qui est intéressant à relever maintenant c'est qu'en Haute-Hill, il y a deux stratégies. Il y a une concernant le secteur agricole, génération green 2020-2030, et qui est une continuité,"
    },
    {
      "start": 43.906,
      "end": 54.846,
      "text": "une deuxième étape, si on n'ose dire, du plan maroc vert, d'une stratégie qui a été lancée en 2008 déjà. Et puis il y a cette deuxième stratégie qui touche cette fois-ci un secteur nouveau,"
    },
    {
      "start": 54.846,
      "end": 59.766,
      "text": "un secteur qui jusque-là malheureusement a été laissé quasiment à l'abandon,"
    },
    {
      "start": 63.280,
      "end": 74.000,
      "text": "forêt du Maroc. C'est une vision qui va être très bénéfique à ce domaine, tout comme l'a été le plan Maroc vert pour l'agriculture. Si on se rappelle de l'agriculture marocaine"
    },
    {
      "start": 74.000,
      "end": 87.920,
      "text": "avant 2008, c'est qu'on naviguait quelque part à vue. On avait une culture vivrière, une agriculture très peu moderne, avec quelques exploitations qui étaient tournées vers"
    },
    {
      "start": 87.920,
      "end": 98.136,
      "text": "l'exportation et qui étaient assez modernes. Et grâce justement à une vision stratégique, plan stratégique, l'agriculture a changé complètement de visage."
    },
    {
      "start": 98.376,
      "end": 108.096,
      "text": "Donc, c'est un petit peu maintenant à quoi on peut s'attendre, par exemple, dans le domaine forestier. Et puis, pour cette deuxième phase, cette deuxième étape du plan"
    },
    {
      "start": 108.096,
      "end": 118.518,
      "text": "stratégique pour l'agriculture, cette fois-ci, elle est plus tournée vers l'élément humain. Donc on va avoir une nouvelle génération d'agriculteurs"
    },
    {
      "start": 118.518,
      "end": 125.838,
      "text": "durant la prochaine décennie, d'où cette appellation choisie par le souverain qui est Génération Green 2020-2030."
    },
    {
      "start": 125.838,
      "end": 132.638,
      "text": "Et le fait qu'elle soit justement tournée vers l'élément humain est quelque chose qui est cohérent et qui colle parfaitement"
    },
    {
      "start": 132.638,
      "end": 139.478,
      "text": "à cette réflexion sur un nouveau modèle stratégique, un nouveau modèle de développement global pour le pays."
    },
    {
      "start": 139.478,
      "end": 147.862,
      "text": "Donc c'est quelque chose de très important à relever et c'est dans ce contexte-là... qui a été élaboré puis adopté ces deux visions stratégiques."
    },
    {
      "start": 147.862,
      "end": 158.542,
      "text": "Alors FAHD, vous venez de parler d'une nouvelle génération d'agriculteurs. À quoi ressemble-t-elle et quels sont concrètement les objectifs de Génération Green 2020-2030?"
    },
    {
      "start": 162.062,
      "end": 177.062,
      "text": "Dans son discours devant le Roi Mohammed VI, Aziz Akhnouch, le ministre de l'Agriculture, a exposé un petit peu les objectifs. Mais la finalité, comme on a dit, est justement le développement d'une classe agricole moyenne,"
    },
    {
      "start": 177.062,
      "end": 189.302,
      "text": "d'améliorer davantage les conditions de vie de ces agriculteurs. On parle de la création d'une classe moyenne qui comprendrait entre 350 000 à 400 000 ménages."
    },
    {
      "start": 189.550,
      "end": 199.790,
      "text": "ils vont accéder à ce statut, ils vont venir s'ajouter à quelque chose comme 700 000 ménages qui sont déjà considérés comme une classe agricole moyenne,"
    },
    {
      "start": 199.790,
      "end": 212.430,
      "text": "mais une classe qu'il va falloir stabiliser et justement améliorer ces conditions de vie. Donc, cet objectif pour rester toujours sur les objectifs en termes d'éléments humains,"
    },
    {
      "start": 212.430,
      "end": 223.198,
      "text": "ça passera par la création de quelque chose comme 350 000 postes de travail. et dont près de la moitié qui vont être portés soit par des jeunes, soit par des entrepreneurs"
    },
    {
      "start": 223.198,
      "end": 236.798,
      "text": "qui vont investir ce secteur agricole. Il y a aussi l'élargissement de la couverture et de la protection sociale pour les agriculteurs. Il y aura un statut d'exploitant agricole qui va être créé et qui va permettre..."
    },
    {
      "start": 237.134,
      "end": 249.774,
      "text": "on va dire d'intégrer dans le régime de sécurité sociale et de la protection sociale quelque chose comme un million de nouveaux agriculteurs. Il faut savoir qu'aujourd'hui il y a à peine 1,8 million d'agriculteurs qui sont on va dire"
    },
    {
      "start": 250.294,
      "end": 265.734,
      "text": "couverts ou bénéficient d'une protection sociale et l'objectif est de faire passer ce chiffre à quelque chose comme 3,25 millions de personnes d'inscrits. Ça justement grâce à ce nouveau statut qui va être créé d'exploitants agricoles."
    },
    {
      "start": 266.126,
      "end": 276.766,
      "text": "mais aussi en mobilisant les entreprises agricoles à déclarer davantage leurs ouvriers rentables sur quelque chose comme 500 000 déclarations additionnelles."
    },
    {
      "start": 276.766,
      "end": 290.406,
      "text": "Donc pour résumer, si vous voulez, pour faire le profil type de cette génération agricole 2020-2030. Déjà, il y en aura de plus en plus d'agriculteurs"
    },
    {
      "start": 290.406,
      "end": 300.206,
      "text": "parce qu'avec ce qui va être lancé, les agriculteurs les FLA marocains n'auront plus à aller en ville une mauvaise année de sécheresse"
    },
    {
      "start": 300.206,
      "end": 307.406,
      "text": "pour aller voir justement s'il y a du travail, abandonner leur terre, aller en ville. Donc ils se seront stabilisés, fixés dans le milieu rural"
    },
    {
      "start": 307.406,
      "end": 317.046,
      "text": "parce qu'il y aura les moyens justement de faire de l'agriculture même, on va dire, les mauvais années. agricole avec la notion qu'on a jusque là, c'est à dire les années de sécheresse."
    },
    {
      "start": 317.046,
      "end": 327.046,
      "text": "Ça sera également une génération qui va bénéficier de cette protection sociale, comme on en a parlé. Ça sera une génération aussi qui va travailler dans de meilleures conditions parce qu'il"
    },
    {
      "start": 327.046,
      "end": 334.750,
      "text": "y a tout un créal de mesures qui va être lancé, qui va permettre... une meilleure valorisation et une meilleure productivité."
    },
    {
      "start": 334.910,
      "end": 343.390,
      "text": "Donc voilà quelque part un peu à quoi va ressembler cette génération green 2020-2030."
    },
    {
      "start": 343.390,
      "end": 350.190,
      "text": "Voilà donc la génération green 2020-2030, une nouvelle génération d'agriculteurs. Qu'en est-il maintenant de la stratégie relative au développement du secteur des eaux et forêts?"
    },
    {
      "start": 350.350,
      "end": 351.870,
      "text": "Que prévoit-elle exactement?"
    },
    {
      "start": 355.694,
      "end": 368.822,
      "text": "Alors justement pour les forêts, là aussi il y a encore pas mal d'objectifs, mais c'est un secteur comme on a dit où il y a... quasiment tout à faire. Il y a d'abord cet aspect réglementaire, il y aura la création"
    },
    {
      "start": 368.822,
      "end": 378.742,
      "text": "de nouvelles agences pour piloter un peu ce secteur, pour l'encadrer avec l'implication et la coordination évidemment des acteurs locaux qui seront impliqués dans la gestion"
    },
    {
      "start": 378.742,
      "end": 391.462,
      "text": "des affaires forestières. On peut parler aussi de cette superficie de 120 000 hectares qui sera valorisée et qui sera plutôt… ouvertes à l'investissement privé."
    },
    {
      "start": 391.462,
      "end": 400.262,
      "text": "On parle de la valorisation d'une dizaine de parcs nationaux. La filière de l'écotourisme a pour objectif dans ce domaine forestier"
    },
    {
      "start": 400.262,
      "end": 413.222,
      "text": "de drainer jusqu'à 5 milliards de dirhams en valeur marchande annuelle. Et il y a aussi, on peut parler de ce objectif de repeupler 133 000 hectares de forêt"
    },
    {
      "start": 413.222,
      "end": 420.614,
      "text": "et la création de quelque chose comme 27 500 postes de travail. Donc c'est tout un programme qu'on a dit et c'est une bonne chose que d'avoir cette"
    },
    {
      "start": 420.614,
      "end": 430,
      "text": "vision pour ce domaine-là qui est comme vous le savez vital, la forêt est vitale, que ça soit d'un point de vue environnemental ou que ça soit d'un point de vue, on va dire, économique et social."
    },
    {
      "start": 430,
      "end": 436.114,
      "text": "Merci beaucoup Fadlal pour cet éclairage en direct depuis notre studio de Rabat. Merci."
    }
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
