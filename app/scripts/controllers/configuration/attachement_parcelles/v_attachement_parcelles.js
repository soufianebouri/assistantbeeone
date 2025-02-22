'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ConfigurationAttachementParcellesVAttachementParcellesCtrl
 * @description
 * # ConfigurationAttachementParcellesVAttachementParcellesCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ConfigurationAttachementParcellesVAttachementParcellesCtrl', function (
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
    vm.stepUrl = "views/configuration/attachement_parcelles/v_attachement_parcelles_phisique.html";
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
        vm.stepUrl = "views/configuration/referentiel/v_attachement_parcelles_phisique.html";
      }else if(index == 2){
        vm.stepUrl = "views/configuration/referentiel/2.html";
      }else{
        vm.stepUrl = "views/configuration/referentiel/3.html";
      }
    }

  

    /***transcription */
    $scope.transcriptionEnabled = true;

    // Transcript JSON
    $scope.transcript = [
      {
        start: 4.482,
        end: 10.125,
        text: "So I've been an AI researcher for over a decade, and a couple of months ago, I got the weirdest"
      },
      {
        start: 10.225,
        end: 16.428,
        text: "email of my career. A random stranger wrote to me saying that my work in AI is gonna end"
      },
      {
        start: 16.488,
        end: 25.673,
        text: "humanity. Now, I get it, AI is so hot right now. It's in the headlines pretty much every"
      },
      {
        start: 25.693,
        end: 29.996,
        text: "day, sometimes because of really cool things like discovering new molecules for medicine"
      },
      {
        start: 30.416,
        end: 35.110,
        text: "or that dope pope in the white puffer coat. But other times, the headlines have been really"
      },
      {
        start: 35.150,
        end: 41.212,
        text: "dark, like that chatbot telling that guy that he should divorce his wife, or that AI meal"
      },
      {
        start: 41.252,
        end: 47.914,
        text: "planner app proposing a crowd-pleasing recipe featuring chlorine gas. And in the background,"
      },
      {
        start: 47.934,
        end: 52.515,
        text: "we've heard a lot of talk about doomsday scenarios, existential risk, and the singularity, with"
      },
      {
        start: 52.555,
        end: 58.557,
        text: "letters being written and events being organized to make sure that doesn't happen. Now, I'm"
      },
      {
        start: 58.577,
        end: 63.710,
        text: "a researcher who studies AI's impacts on society. and I don't know what's going to happen in"
      },
      {
        start: 63.830,
        end: 69.994,
        text: "10 or 20 years, and nobody really does. But what I do know is that there's some pretty"
      },
      {
        start: 70.054,
        end: 76.697,
        text: "nasty things going on right now, because AI doesn't exist in a vacuum. It is part of society,"
      },
      {
        start: 76.797,
        end: 82.420,
        text: "and it has impacts on people and the planet. AI models can contribute to climate change."
      },
      {
        start: 82.821,
        end: 87.723,
        text: "Their training data uses art and books created by artists and authors without their consent,"
      },
      {
        start: 88.164,
        end: 94.374,
        text: "and its deployment can discriminate against entire communities. But we need to start tracking"
      },
      {
        start: 94.414,
        end: 98.876,
        text: "its impacts. We need to start being transparent and disclosing them and creating tools so that"
      },
      {
        start: 98.896,
        end: 103.878,
        text: "people understand AI better, so that hopefully future generations of AI model are gonna be"
      },
      {
        start: 103.938,
        end: 110.341,
        text: "more trustworthy, sustainable, maybe less likely to kill us if that's what you're into. But"
      },
      {
        start: 110.361,
        end: 115.783,
        text: "let's start with sustainability, because that cloud that AI models live on is actually made"
      },
      {
        start: 115.843,
        end: 121.962,
        text: "out of metal, plastic, and powered by vast amounts of energy. And each time you... If you want"
      },
      {
        start: 121.982,
        end: 127.865,
        text: "to query an AI model, it comes with a cost to the planet. Last year, I was part of the Big"
      },
      {
        start: 127.925,
        end: 131.967,
        text: "Science Initiative, which brought together a thousand researchers from all over the world"
      },
      {
        start: 132.027,
        end: 139.151,
        text: "to create Bloom, the first open, large-language model, like JAT-CVT, but with an emphasis on"
      },
      {
        start: 139.331,
        end: 144.614,
        text: "ethics, transparency and consent. And the study I led that looked at Bloom's environmental"
      },
      {
        start: 144.654,
        end: 150.810,
        text: "impacts found that just training it used as much energy as 30 homes in a whole year. and"
      },
      {
        start: 150.830,
        end: 155.652,
        text: "emitted 25 tons of carbon dioxide, which is like driving your car five times around the"
      },
      {
        start: 155.692,
        end: 160.454,
        text: "planet, just so somebody can use this model to tell a knock-knock joke. And this might"
      },
      {
        start: 160.894,
        end: 167.518,
        text: "not seem like a lot, but other similar large-language models like GPT-3 emit 20 times more carbon."
      },
      {
        start: 168.058,
        end: 172.280,
        text: "But the thing is, tech companies aren't measuring this stuff. They're not disclosing it. And"
      },
      {
        start: 172.300,
        end: 177.470,
        text: "so this is probably only the tip of the iceberg, even if it is a melting one. And in recent"
      },
      {
        start: 177.490,
        end: 183.472,
        text: "years, we've seen AI models balloon in size, because the current trend in AI is bigger is"
      },
      {
        start: 183.552,
        end: 188.774,
        text: "better. But please don't get me started on why that's the case. In any case, we've seen large"
      },
      {
        start: 188.814,
        end: 193.917,
        text: "language models in particular grow 2,000 times in size over the last five years. And of course,"
      },
      {
        start: 193.937,
        end: 199.419,
        text: "their environmental costs are rising as well. The most recent work I led found that switching"
      },
      {
        start: 199.499,
        end: 206.386,
        text: "out a smaller, more efficient model for a larger language model emits 14 times more carbon for"
      },
      {
        start: 206.426,
        end: 210.790,
        text: "the same task, like telling that knock-knock joke. And as we're putting in these models"
      },
      {
        start: 210.830,
        end: 216.735,
        text: "into cell phones and search engines and smart fridges and speakers, the environmental costs"
      },
      {
        start: 216.775,
        end: 222.701,
        text: "are really piling up quickly. So instead of focusing on some future existential risks,"
      },
      {
        start: 222.821,
        end: 228.166,
        text: "let's talk about current tangible impacts and tools we can create to measure and mitigate"
      },
      {
        start: 228.206,
        end: 234.082,
        text: "these impacts. I helped create Code Carbon. a tool that runs in parallel to AI training"
      },
      {
        start: 234.102,
        end: 237.984,
        text: "code that estimates the amount of energy it consumes and the amount of carbon it emits."
      },
      {
        start: 238.504,
        end: 242.585,
        text: "And using a tool like this can help us make informed choices, like choosing one model over"
      },
      {
        start: 242.605,
        end: 247.967,
        text: "the other because it's more sustainable, or deploying AI models on renewable energy, which"
      },
      {
        start: 248.007,
        end: 252.829,
        text: "can drastically reduce their emissions. But let's talk about other things, because there's"
      },
      {
        start: 252.889,
        end: 258.391,
        text: "other impacts of AI apart from sustainability. For example, it's been really hard for artists"
      },
      {
        start: 258.431,
        end: 263.435,
        text: "and authors to prove that their life's work has been used for training AI models without"
      },
      {
        start: 263.455,
        end: 269.078,
        text: "their consent. If you want to sue someone, you tend to need proof, right? So Spawning AI,"
      },
      {
        start: 269.339,
        end: 274.082,
        text: "an organization that was founded by artists, created this really cool tool called Have I"
      },
      {
        start: 274.122,
        end: 280.006,
        text: "Been Trained? And it lets you search these massive data sets to see what they have on you. Now"
      },
      {
        start: 280.066,
        end: 285.329,
        text: "I admit it, I was curious. I searched Lion 5B, which is this huge data set of images and text."
      },
      {
        start: 285.750,
        end: 291.873,
        text: "to see if any images of me were in there. Now, those two first images, that's me from events"
      },
      {
        start: 291.913,
        end: 296.876,
        text: "I've spoken at, but the rest of the images, none of those are me. They're probably of other"
      },
      {
        start: 296.896,
        end: 302.459,
        text: "women named Sasha who put photographs of themselves up on the internet. And this can probably explain"
      },
      {
        start: 302.499,
        end: 306.542,
        text: "why, when I query an image generation model to generate a photograph of a woman named Sasha,"
      },
      {
        start: 306.622,
        end: 311.965,
        text: "more often than not, I get images of bikini models. Sometimes they have two arms, sometimes"
      },
      {
        start: 311.985,
        end: 318.375,
        text: "they have three arms. but they rarely have any clothes on. And why it can be interesting for"
      },
      {
        start: 318.675,
        end: 324.357,
        text: "people like you and me to search these data sets. For artists like Carla Ortiz, this provides"
      },
      {
        start: 324.417,
        end: 329.699,
        text: "crucial evidence that her life's work, her artwork, was used for training AI models without her"
      },
      {
        start: 329.739,
        end: 334.580,
        text: "consent. And she and two artists used this as evidence to file a class action lawsuit against"
      },
      {
        start: 334.660,
        end: 338.521,
        text: "AI companies for copyright infringement. And most recently."
      },
      {
        start: 342.426,
        end: 346.272,
        text: "And most recently, Spawning AI partnered up with Hugging Face, the company where I work"
      },
      {
        start: 346.312,
        end: 353.503,
        text: "at, to create opt-in and opt-out mechanisms for creating these datasets. Because artwork"
      },
      {
        start: 353.523,
        end: 357.229,
        text: "created by humans shouldn't be an all-you-can-eat buffet for training AI language models."
      },
      {
        start: 362.710,
        end: 367.632,
        text: "The very last thing I want to talk about is bias. You probably hear about this a lot. Formally"
      },
      {
        start: 367.652,
        end: 372.655,
        text: "speaking, it's when AI models encode patterns and beliefs that can represent stereotypes,"
      },
      {
        start: 372.695,
        end: 377.478,
        text: "or racism and sexism. One of my heroes, Dr. Joy Boulangwini, experienced this firsthand"
      },
      {
        start: 377.778,
        end: 382.221,
        text: "when she realized that AI systems wouldn't even detect her face unless she was wearing a white-colored"
      },
      {
        start: 382.261,
        end: 387.824,
        text: "mask. Digging deeper, she found that common facial recognition systems were vastly worse"
      },
      {
        start: 387.844,
        end: 394.363,
        text: "for women of color compared to white men. And when biased models like this are deployed in"
      },
      {
        start: 394.563,
        end: 400.206,
        text: "law enforcement settings, this can result in false accusations, even wrongful imprisonment,"
      },
      {
        start: 400.246,
        end: 405.369,
        text: "which we've seen happen to multiple people in recent months. For example, Portia Woodruff"
      },
      {
        start: 405.449,
        end: 410.271,
        text: "was wrongfully accused of carjacking at eight months pregnant because an AI system wrongfully"
      },
      {
        start: 410.311,
        end: 416.306,
        text: "identified her. But sadly, these systems are black boxes. Even their creators can't say"
      },
      {
        start: 416.346,
        end: 423.688,
        text: "exactly why they work the way they do. And, for example, for image generation systems,"
      },
      {
        start: 424.568,
        end: 430.650,
        text: "if you're using contexts like generating a forensic sketch based on a description of a perpetrator,"
      },
      {
        start: 431.530,
        end: 436.651,
        text: "they take all those biases and they spit them back out for terms like dangerous criminal,"
      },
      {
        start: 436.751,
        end: 443.053,
        text: "terrorist, or gang member, which, of course, is super dangerous when these tools are deployed"
      },
      {
        start: 443.733,
        end: 449.520,
        text: "in society. And so in order to understand these tools better, I created this tool called the"
      },
      {
        start: 449.560,
        end: 454.803,
        text: "Stable Bias Explorer, which lets you explore the bias of image generation models through"
      },
      {
        start: 454.823,
        end: 461.947,
        text: "the lens of professions. So try to picture a scientist in your mind. Don't look at me. What"
      },
      {
        start: 461.967,
        end: 468.431,
        text: "do you see? A lot of the same thing, right? Men in glasses and lab coats, and none of them"
      },
      {
        start: 468.451,
        end: 474.999,
        text: "look like me. And the thing is, is that We looked at all these different image generation models"
      },
      {
        start: 475.119,
        end: 478.902,
        text: "and found a lot of the same thing, significant representation of whiteness and masculinity"
      },
      {
        start: 478.942,
        end: 483.765,
        text: "across all 150 professions that we looked at. Even if compared to the real world, the US"
      },
      {
        start: 483.805,
        end: 490.950,
        text: "Labor Bureau of Statistics, these models show lawyers as men and CEOs as men almost 100 percent"
      },
      {
        start: 490.990,
        end: 496.654,
        text: "of the time, even though we all know not all of them are white and male. And sadly, my tool"
      },
      {
        start: 496.694,
        end: 502.510,
        text: "hasn't been used to write legislation yet, but I recently presented it at a UN event. about"
      },
      {
        start: 502.550,
        end: 507.471,
        text: "gender bias as an example of how we can make tools for people from all walks of life, even"
      },
      {
        start: 507.511,
        end: 512.212,
        text: "those who don't know how to code, to engage with and better understand AI, because we use"
      },
      {
        start: 512.252,
        end: 517.974,
        text: "professions, but you can use any terms that are of interest to you. And as these models"
      },
      {
        start: 518.054,
        end: 523.415,
        text: "are being deployed, are being woven into the very fabric of our societies, our cell phones,"
      },
      {
        start: 523,
        end: 528,
        text: "our social media feeds, even our justice systems and our economies have AI in them. And it's"
      },
      {
        start: 528,
        end: 535,
        text: "really important that AI stays accessible so that we know both how it works and when it"
      },
      {
        start: 535,
        end: 542,
        text: "doesn't work. And there's no single solution for really complex things like bias or copyright"
      },
      {
        start: 542,
        end: 547,
        text: "or climate change, but by creating tools to measure AI's impact, we can start getting an"
      },
      {
        start: 547,
        end: 553,
        text: "idea of how bad they are and start addressing them as we go, start creating guardrails to"
      },
      {
        start: 553,
        end: 559,
        text: "protect society and the planet. And once we have this information, Companies can use it"
      },
      {
        start: 559,
        end: 563,
        text: "in order to say, okay, we're gonna choose this model because it's more sustainable, this model"
      },
      {
        start: 563,
        end: 569,
        text: "because it respects copyright. Legislators who really need information to write laws can use"
      },
      {
        start: 569,
        end: 575,
        text: "these tools to develop new regulation mechanisms or governance for AI as it gets deployed into"
      },
      {
        start: 575,
        end: 581,
        text: "society. And users like you and me can use this information to choose AI models that we can"
      },
      {
        start: 581,
        end: 587,
        text: "trust, not to misrepresent us and not to misuse our data. But what did I reply to that email?"
      },
      {
        start: 587,
        end: 594,
        text: "that said that my work is going to destroy humanity. I said that focusing on AI's future existential"
      },
      {
        start: 594,
        end: 599,
        text: "risks is a distraction from its current very tangible impacts and the work we should be"
      },
      {
        start: 599,
        end: 606,
        text: "doing right now, or even yesterday, for reducing these impacts. Because yes, AI is moving quickly,"
      },
      {
        start: 607,
        end: 612,
        text: "but it's not a done deal. We're building the road as we walk it, and we can collectively"
      },
      {
        start: 612,
        end: 615,
        text: "decide what direction we want to go in together. Thank you."
      }
    ]

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
