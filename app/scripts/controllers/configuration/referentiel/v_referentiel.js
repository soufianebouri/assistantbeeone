'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ConfigurationReferentielVReferentielCtrl
 * @description
 * # ConfigurationReferentielVReferentielCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ConfigurationReferentielVReferentielCtrl', function (
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

    vm.User = $cookies.getObject('globals').currentUser.Nom + " " + $cookies.getObject('globals').currentUser.Prenom;
    vm.IDUser = $cookies.getObject('globals').currentUser.ID;

    $translatePartialLoader.addPart("conduitetechnique");
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    /**** all steps **/

    $scope.go_back = function () {
      $state.go("main_configuration");
    };

    vm.currect_step = 1;
    vm.stepUrl = "views/configuration/referentiel/v_famille_culture.html";
    vm.step = async function (params, stepUrl) {
      vm.currect_step = params;
      vm.stepUrl = stepUrl
    };

    vm.nextStep = function(){
      //max = 15
      if(vm.currect_step != 15){
        vm.currect_step ++ ;
        vm.gostep(vm.currect_step)

        $timeout(function () {
          let selectedStep = document.getElementById("step-" + vm.currect_step);
          if (selectedStep) {
              selectedStep.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 100);
      }

    }


    vm.preveusStep_scroll = function(){
      //max = 15
      if(vm.currect_step != 1){
        vm.currect_step -- ;

        $timeout(function () {
          let selectedStep = document.getElementById("step-" + vm.currect_step);
          if (selectedStep) {
              selectedStep.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 100);
      }
      }

    vm.preveusStep = function(){
      //max = 15
      if(vm.currect_step != 1){
        vm.currect_step -- ;
        vm.gostep(vm.currect_step)

        $timeout(function () {
          let selectedStep = document.getElementById("step-" + vm.currect_step);
          if (selectedStep) {
              selectedStep.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 100);
      }
      }


    vm.gostep = function(index){
      if(index == 1){
        vm.stepUrl = "views/configuration/referentiel/v_famille_culture.html";
      }else if(index == 2){
        vm.stepUrl = "views/configuration/referentiel/v_culture.html";
      }else{
        vm.stepUrl = "views/configuration/referentiel/3.html";
      }
    }



    /***transcription */
    $scope.transcriptionEnabled = true;

    // Transcript JSON
    $scope.transcript = [
  {
    "start": 4.91,
    "end": 10.83,
    "text": "Monsieur le Président de la Banque centrale européenne, cher Mario Draghi. Monsieur le Président de la République, cher Sergio,"
  },
  {
    "start": 11.03,
    "end": 19.91,
    "text": "madame la chancelière, cher Angela, monsieur le ministre président du Land de Hesse, madame la présidente élue de la Commission européenne,"
  },
  {
    "start": 20.11,
    "end": 29.19,
    "text": "cher Ursula, madame la présidente désignée de la Banque centrale européenne, chère Christine, mesdames et messieurs les commissaires,"
  },
  {
    "start": 29.39,
    "end": 37.798,
    "text": "les ministres et les gouverneurs, mesdames et messieurs, chers amis. Si nous sommes si nombreux aujourd'hui à Francfort,"
  },
  {
    "start": 38.158,
    "end": 46.918,
    "text": "autour de vous, cher Mario, ce n'est pas seulement pour saluer un mandat bien mené à la présidence de la Banque centrale européenne."
  },
  {
    "start": 48.518,
    "end": 58.918,
    "text": "Ce qui nous réunit aujourd'hui dépasse largement le cadre de la politique monétaire. Je laisserai d'ailleurs à d'autres plus qualifiés que moi"
  },
  {
    "start": 59.718,
    "end": 68.142,
    "text": "le soin d'analyser et de prolonger l'immense héritage que vous laissez en la matière. Ce que nous célébrons par-dessus tout aujourd'hui,"
  },
  {
    "start": 68.342,
    "end": 77.582,
    "text": "c'est l'action d'un homme qui a porté très haut le rêve européen et qui l'a porté dans cette institution qui a montré durant la crise financière,"
  },
  {
    "start": 77.782,
    "end": 89.662,
    "text": "et je parle là devant votre prédécesseur et votre successeur, toute sa solidité et sa robustesse. Un homme qui aura été, dans ses discours et ses décisions,"
  },
  {
    "start": 89.862,
    "end": 97.718,
    "text": "un digne héritier des pères fondateurs de l'Europe. chers Mario, vous placez dans les pas de Jean Monnet,"
  },
  {
    "start": 97.718,
    "end": 110.35,
    "text": "de Robert Schumann, de Conrad Adenauer et de vos illustres compatriotes Alcide de Gasperi et Althiore Spinelli. A Milan, il y a quelques semaines, vous avez prononcé un de ces discours"
  },
  {
    "start": 110.55,
    "end": 121.51,
    "text": "qui auront jalonné votre mandat et qui sont désormais gravés dans la pierre qui bâtit l'Europe. Aux étudiants de l'université catholique qui vous remettaient un prix,"
  },
  {
    "start": 121.71,
    "end": 135.23,
    "text": "vous avez évoqué 3 qualités qui font un bon décideur public. Le savoir, le courage et l'humilité. Ces qualités, cher Mario,"
  },
  {
    "start": 135.43,
    "end": 144.766,
    "text": "vous les honorez. et les avez ici incarnés. Le savoir, vous l'avez acquis, conquis par une formation académique,"
  },
  {
    "start": 144.966,
    "end": 149.966,
    "text": "une expérience professionnelle exceptionnelle. Vous l'avez sans cesse nourri de vos échanges"
  },
  {
    "start": 150.166,
    "end": 157.126,
    "text": "avec les plus brillants chercheurs en économie et vous l'avez transmis par vos enseignements et vos conférences."
  },
  {
    "start": 157.326,
    "end": 164.686,
    "text": "Cette expertise reconnue de tous a été décisive pour asseoir votre autorité intellectuelle"
  },
  {
    "start": 164.886,
    "end": 176.614,
    "text": "auprès de vos pères. des observateurs du marché, comme on dit, est bien au-delà. du courage et même de l'audace, il vous en a tant fallu"
  },
  {
    "start": 176.974,
    "end": 187.094,
    "text": "au cours de ces 8 dernières années. Plongé dans la crise des dettes souveraines de la zone euro, à peine installé dans vos fonctions, vous avez mené une action."
  },
  {
    "start": 188.014,
    "end": 196.974,
    "text": "Appuyé par vos équipes de la BCE, venus en nombre aujourd'hui, vous témoignez leur estime qui a été décisive"
  },
  {
    "start": 197.654,
    "end": 205.246,
    "text": "pour sauver l'Europe du naufrage. L'histoire retiendra évidemment, et madame la chancelière faisait référence à cette phrase"
  },
  {
    "start": 205.446,
    "end": 217.446,
    "text": "il y a quelques instants, ce 26 juillet 2012 où vous avez affirmé la détermination de la BCE à faire tout ce qui était en son pouvoir pour sauver l'euro."
  },
  {
    "start": 217.646,
    "end": 230.446,
    "text": "Whatever it takes. Trois mots. Trois mots qui décrétaient avec autant de force que de simplicité les réversibilités de l'euro face à des marchés que l'on croyait incontrôlables."
  },
  {
    "start": 232.334,
    "end": 241.454,
    "text": "Puis, tout au long de votre mandat, vous avez pris des décisions non moins audacieuses pour stimuler la reprise du crédit ou prévenir le risque de déflation en zone euro."
  },
  {
    "start": 244.238,
    "end": 254.078,
    "text": "courage, se mesure aussi à l'immense ambition européenne que vous n'avez jamais cessé de porter contre les vents de reflux et les voies du repli."
  },
  {
    "start": 254.078,
    "end": 263.638,
    "text": "Face aux insuffisances de l'union économique et monétaire, vous avez appelé à la mise en place d'une véritable union bancaire et à l'établissement"
  },
  {
    "start": 263.638,
    "end": 271.698,
    "text": "d'une capacité budgétaire de la zone euro d'une taille importante dotée d'une fonction de stabilisation. Tout comme madame la chancelière, je me félicite."
  },
  {
    "start": 272.366,
    "end": 278.686,
    "text": "D'abord de l'accord franco-allemand trouvé à Meseberg sur ce sujet, puis de l'accord européen trouvé en décembre dernier,"
  },
  {
    "start": 278.886,
    "end": 292.206,
    "text": "qu'il nous faudra poursuivre dans des temps qui demeureront chahutés et où ces instruments, cette stratégie, demeurent plus indispensables que jamais."
  },
  {
    "start": 292.406,
    "end": 300.366,
    "text": "Ce courage, cher Mario, a pu, paraît-il parfois, vous valoir des critiques. Cela l'a rendu..."
  },
  {
    "start": 300.942,
    "end": 312.222,
    "text": "encore plus indispensables. Récemment, vous avez, avec le soutien unanime du Conseil des gouverneurs de la BCE, appelé la politique budgétaire à jouer pleinement son rôle"
  },
  {
    "start": 312.422,
    "end": 317.102,
    "text": "face au ralentissement actuel, en invitant les Etats membres disposant des marges de manoeuvre budgétaires"
  },
  {
    "start": 317.302,
    "end": 324.262,
    "text": "à agir de manière résolue, efficace et rapide. Nous savons tous ici combien cela est nécessaire,"
  },
  {
    "start": 324.462,
    "end": 332.758,
    "text": "et je ne peux que saluer le courage du responsable public qui a su, dans le respect de son mandat, appelé les Etats membres à faire preuve d'ambition"
  },
  {
    "start": 332.958,
    "end": 344.398,
    "text": "et à dépasser parfois nos dogmes. C'est désormais à nous, chefs d'Etat et de gouvernement, de porter ce fameux whatever it takes. Pour être à la hauteur de votre courage"
  },
  {
    "start": 344.598,
    "end": 354.438,
    "text": "et de votre clairvoyance, nous devons être les dépositaires de cet héritage, le vôtre, cette certitude de la pérennité de l'euro"
  },
  {
    "start": 354.638,
    "end": 365.742,
    "text": "et la nécessité de son renforcement, qui fera la force... de notre Europe entière. Quant à l'humilité qui vous caractérise,"
  },
  {
    "start": 365.942,
    "end": 373.702,
    "text": "elle n'a, je crois, rien d'étranger à la formation jésuite que vous avez reçue. Fondée sur une réflexion sans cesse critique"
  },
  {
    "start": 373.902,
    "end": 383.862,
    "text": "sur votre propre action, cette humilité vous a conduit à constamment reconnaître la présérence du politique pour protéger votre institution."
  },
  {
    "start": 384.062,
    "end": 393.246,
    "text": "Vous avez toujours veillé à inscrire vos décisions dans le strict cadre de votre mandat. N'oublions pas que le fameux « whatever it takes »"
  },
  {
    "start": 393.446,
    "end": 403.846,
    "text": "était précédé d'un « within our mandate » à l'intérieur de notre mandat. C'est aussi cette humilité, cette éthique qui vous ont animé lorsque vous avez eu le souci"
  },
  {
    "start": 404.046,
    "end": 417.166,
    "text": "de rendre compte de vos actes devant les parlementaires nationaux et européens. Enfin, cher Mario, vous me permettrez d'ajouter à ces qualités rares."
  },
  {
    "start": 417.366,
    "end": 426.87,
    "text": "Une quatrième qui vous caractérise, il me semble. peut-être plus encore que les trois précédentes, l'humanité."
  },
  {
    "start": 428.23,
    "end": 433.03,
    "text": "Dans le monde de la finance et des banques centrales, qui peut paraître d'une froideur distante,"
  },
  {
    "start": 433.71,
    "end": 442.23,
    "text": "cette qualité a peut-être parfois été moins perceptible. Et pourtant, pétri de cet humanisme européen qui est né,"
  },
  {
    "start": 442.23,
    "end": 450.15,
    "text": "comme vous, en Italie, vous avez toujours gardé conscience que ce qui importait le plus, au-delà des mots et des chiffres,"
  },
  {
    "start": 450.87,
    "end": 466.934,
    "text": "c'est la vie des gens. Cela a toujours été votre boussole et vous ne vous êtes pas égaré sur le chemin. Vous avez agi pour eux. ce qu'on appelle dans mon pays, et cela a un sens,"
  },
  {
    "start": 467.134,
    "end": 478.814,
    "text": "l'intérêt général. Cet humanisme européen vous place résolument dans la lignée de ces grands fondateurs et de ces grands esprits."
  },
  {
    "start": 479.014,
    "end": 485.254,
    "text": "C'est pourquoi je le disais, c'est bien plus qu'un mandat réussi à la tête de cette institution que vous nous laissez aujourd'hui."
  },
  {
    "start": 485.454,
    "end": 494.102,
    "text": "Ce que vous nous léguer, cher Mario, c'est le flambeau de l'humanisme européen. Car en sauvant l'euro, c'est la protection de l'Europe et de ses peuples"
  },
  {
    "start": 494.302,
    "end": 505.902,
    "text": "que vous avez assurés et fortifiés. Désormais, cette voie que vous avez tracée, cet humanisme, qui, pendant 8 ans, s'est traduit dans le concret de vos actions,"
  },
  {
    "start": 506.102,
    "end": 515.062,
    "text": "nous incontre à tous. Et je sais combien la présidente Lagarde, qui maintenant aura la charge dans quelques jours"
  },
  {
    "start": 515.262,
    "end": 524.726,
    "text": "de vous succéder, c'est la place et l'importance de cet héritage. Je sais aussi toute l'importance qu'elle accorde à l'indépendance"
  },
  {
    "start": 524.926,
    "end": 531.606,
    "text": "et la responsabilité qui va avec. Et je sais combien elle aura à coeur de laisser dans cette belle institution sa marque."
  },
  {
    "start": 533.87,
    "end": 541.19,
    "text": "Pour répondre aux aspirations des peuples face à un monde de fractures et de turbulences, vous avez mené ce combat."
  },
  {
    "start": 542.75,
    "end": 550.19,
    "text": "Ce combat, vous l'avez au fond mené tout au long de votre carrière. Alors, au moment où vous vous apprêtez à quitter ces lieux,"
  },
  {
    "start": 550.19,
    "end": 559.23,
    "text": "cher Mario, nous sommes là pour vous promettre que nous serons nombreux à poursuivre votre engagement et nous essaierons"
  },
  {
    "start": 559.23,
    "end": 572.702,
    "text": "d'être à la hauteur. Je sais combien Cette institution que vous avez présidée pendant 8 années se tiendra à la hauteur, car elle a montré sa solidité durant ces années."
  },
  {
    "start": 572.902,
    "end": 585.422,
    "text": "Elle a montré la force des institutions quand l'Europe a le courage de s'en doter et de l'esprit européen qu'elle porte, et cela continuera."
  },
  {
    "start": 585.622,
    "end": 594.238,
    "text": "Nous vous le devons, comme nous le devons aux Européens. Et je sais aussi... que vous y prendrez encore votre part,"
  },
  {
    "start": 594.438,
    "end": 609.798,
    "text": "au-delà d'un repos amplement mérité, car cet humanisme vit en vous. Où que vous soyez, quoi que vous fassiez, vous continuerez à faire vivre en Europe"
  },
  {
    "start": 609.998,
    "end": 615.158,
    "text": "cet esprit pour l'Europe. Je vous en remercie. Nous vous en remercions."
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
