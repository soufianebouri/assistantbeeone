'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('LoginCtrl', function(toastr,$document, $scope, auth, _url, $window, $state, $translatePartialLoader, $translate, _version, $timeout) {
    var vm = this;
    vm._version = _version;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());


    $scope.loading = false;
    vm.auth = async function (){

      NProgress.start();
      toastr.clear();

      if(!vm.loginormail || !vm.password ){
        toastr.clear();
        toastr.warning("Login and password required", {
            closeButton: true,
          }
        );
        NProgress.done();
        NProgress.remove();

        return;
      }

        if(vm.acceskey === 'nb74dih8'){

          auth.Login({
            loginOrMail :vm.loginormail,
            password : vm.password
          }).then(async e  =>  {
            NProgress.done();
            NProgress.remove();
            $scope.loading = true;


            let authToken = e.headers('Authorization');


           await auth.SetCredentials(vm.loginOrMail, vm.password, e.data.nom, e.data.prenom, e.data.Superviseur, e.data.id, [], [], authToken, 1, 1);


           $timeout(function () {
             $scope.loading = false;
             $state.go('onboarding');
           }, 2000);




          }).catch(err => {
              console.log(err);
              toastr.clear();
              toastr.warning(err.data.message, {
                closeButton: true,
              });
              NProgress.done();
              NProgress.remove();
            });









          return;
        }else{
          toastr.clear();
          toastr.warning("Wrong Acces key!", {
            closeButton: true,
          }
        );
        NProgress.done();
        NProgress.remove();
        return;
        }


   /*   }else{
        toastr.clear();
        toastr.warning("Wrong login or password!", {
            closeButton: true,
          }
        );
        return;
      }*/





    /*  auth.Login(vm.usernamelogin, vm.mdp, _url, function(response) {
        if (response.data && response.data.length > 0) {
          ModuleManager.getRoles({
            ID: response.data[0].ID
          }).then(roles => {
            ModuleManager.getPermissionArray(response.data[0].ID).then(e => {
              var latest_release = false;
              try {
                latest_release = (response.data[0].latest_release) ? true : false;
              } catch (e) {
                latest_release = false;
              }

              NProgress.done();
              NProgress.remove();
            }).catch(e => {
              show_error(response);
            });
          }).catch(e => {
            show_error(response);
          });

        } else {
          show_error(response);
        }
      });*/
    };


    // Add keypress listener
       var keyListener = function(event) {
           if (event.keyCode === 13) { // 13 is the Enter key
                $scope.$apply(vm.auth());
           }
       };

       $document.on("keypress", keyListener);

       // Cleanup the listener when scope is destroyed
       $scope.$on("$destroy", function() {
           $document.off("keypress", keyListener);
       });

  });
