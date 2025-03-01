'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RecolteSuivirecolteCtrl
 * @description
 * # RecolteSuivirecolteCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RecolteSuivirecolteCtrl', function ($rootScope,$scope,$cookies,DTOptionsBuilder,DTDefaultOptions,DTColumnBuilder) {
    var pc = this;
    pc.NomFerme = $cookies.getObject('beeoneAssistant').ferme.NomFerme;


    $scope.generatePdf= function(){
      //alert(expeditionByID);
     var type = "";
     var dateFeri = "";

     var w = 1000;
     var h = 1000;
     var left = Number((screen.width / 2) - (w / 2));
     var tops = Number((screen.height / 2) - (h / 2));

     var mywindow = window.open('_self', 'PRINT', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + tops + ', left=' + left, '');

     //window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
     mywindow.document.write('<html><head><title></title>');
     mywindow.document.write('</head><body >');

     mywindow.document.write('<br/>');
     mywindow.document.write(document.getElementById("printThis").innerHTML);



     //mywindow.document.write(document.getElementById("sss").innerHTML);
     mywindow.document.write('</body></html>');

     mywindow.document.close(); // necessary for IE >= 10
     mywindow.focus(); // necessary for IE >= 10*/

     mywindow.print();
     mywindow.close();

     return true;
   }
    
  });
