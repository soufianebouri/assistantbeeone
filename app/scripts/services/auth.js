'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.auth
 * @description
 * # auth
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('auth', function($http, $cookies, $rootScope, $base64, $window, _url) {

    return {
      latest_release: function(data) {
        NProgress.start();
        return $http.post(_url + "/authentification/latest_release", data);
      },
      getlatest_releasebyid: function(data) {
        NProgress.start();
        return $http.post(_url + "/authentification/getlatest_releasebyid", data);
      },
      Login: function(data) {
        return $http.post(_url + "/auth", data);
      },
      saveFarm: function(IDFerme, NomFerme, IDSociete) {
        var ObjectUser = $cookies.getObject('globals');
        ObjectUser.ferme.IDFerme = IDFerme;
        ObjectUser.ferme.NomFerme = NomFerme;
        ObjectUser.ferme.IDSociete = IDSociete;
        $cookies.putObject('globals', ObjectUser);
      },
      savelatest_release: function(latest_release) {
        var ObjectUser = $cookies.getObject('globals');
        ObjectUser.latest_release = true;
        $cookies.putObject('globals', ObjectUser);
      },
      SetCredentials: function(username, password, Nom, Prenom, isAdmin, id, permission_data, modulePermission, token, latest_release, role) {
        //  var authdata = $base64.encode(username + ':' + password);
        //var authdata = window.btoa(unescape(encodeURIComponent(username + ':' + password)))
        $rootScope.globals = {
          currentUser: {
            username: username,
            Nom: Nom,
            Prenom: Prenom,
            isAdmin: isAdmin,
            role: role,
            authdata: null,
            ID: null,
            token: token
          },
          ferme: {
            IDFerme: 0,
            IDSociete: 0,
            NomFerme: ""
          },
          latest_release: latest_release
        };


        $window.localStorage.setItem('permission', JSON.stringify(permission_data));

        $window.sessionStorage.setItem(3, JSON.stringify(modulePermission));

        // set default auth header for http requests
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + token;

        // store user details in globals cookie that keeps user logged in for 1 week (or until they logout)
        var cookieExp = new Date();
        var plustwohr = cookieExp.getHours() + 2;
        cookieExp.setHours(plustwohr);
        //cookieExp.setDate(cookieExp.getDate() + 7);
        $cookies.putObject('globals', $rootScope.globals, {
            secure: false
          }
          /*, {
                    expires: cookieExp
                  }*/
        );
      },
      ClearCredentials: function() {
        $rootScope.globals = {};
        $cookies.remove('globals');
        $http.defaults.headers.common.Authorization = '';
        $window.sessionStorage.removeItem(3)
        $window.location.reload();
      }
    };

  });
