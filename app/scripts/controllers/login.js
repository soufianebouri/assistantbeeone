'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('LoginCtrl', function(toastr, $scope, auth, _url, $window, $state, $translatePartialLoader, $translate, _version, $timeout) {
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
        return;
      }
      if(vm.loginormail == 'admin', vm.password == 'admin'){

        if(vm.acceskey === '123456'){
          $scope.loading = true;
       
          auth.SetCredentials(vm.usernamelogin, vm.mdp, "admin", "admin", 1, 1, [], [], 'br ddddfifjif5', 1, 1);  
          NProgress.done();
  
          
          $timeout(function () {
            $scope.loading = false;  
            $state.go('onboarding');
          }, 3000);
  
          return; 
        }else{
          toastr.clear();
        toastr.warning("Wrong Acces key!", {
            closeButton: true,
          }
        );
        NProgress.done();
        return;
        }

               
      }else{
        toastr.clear();
        toastr.warning("Wrong login or password!", {
            closeButton: true,
          }
        );
        NProgress.done();
        return;
      }

      

   
           
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

  });