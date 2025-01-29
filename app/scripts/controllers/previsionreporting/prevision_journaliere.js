'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:PrevisionJournaliereCtrl
 * @description
 * # PrevisionJournaliereCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('PrevisionJournaliereCtrl', function(PrevisionJournaliere, $scope, translatedwords, $compile, $q, $translatePartialLoader, $translate, $window) {
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    var w = 1000;
    var h = 1000;
    var left = Number((screen.width / 2) - (w / 2));
    var tops = Number((screen.height / 2) - (h / 2));
    var reportTable = "";
    var recapeTable = "";
    var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta charset="UTF-8"></head><body>{table}</body></html>';

    NProgress.start();

    var base64 = function(s) {
      return window.btoa(unescape(encodeURIComponent(s)));
    };
    var format = function(s, c) {
      return s.replace(/{(\w+)}/g, function(m, p) {
        return c[p];
      })
    };

    function checkValue(v) {
      if (isNaN(v))
        return 0;
      else
        return v;
    }

    function getTotalQt(data, index) {
      var qt = 0;
      data.forEach(element => {
        element[1].forEach(e => {
          switch (index) {
            case 0:
              qt += parseFloat(parseFloat(e.QTE).toFixed(2));
              break;
            case 1:
              qt += parseFloat(parseFloat(e.superficier_PC).toFixed(2));
              break;
            case 2:
              qt += checkValue(parseFloat(parseFloat(e.TnJ_ha).toFixed(2)));
              break;
            case 3:
              qt += checkValue(parseFloat(parseFloat(e.EntreeQte).toFixed(2)));
              break;
            case 4:
              qt += checkValue(parseFloat(parseFloat(e.MoyenneQte).toFixed(2)));

          }

        });
      });
      return parseFloat(qt).toFixed(2);
    }

    function getValueColumn(obj, index) {
      var qt = 0;
      switch (index) {
        case 0:
          qt += parseFloat(parseFloat(obj.QTE).toFixed(2));
          break;
        case 1:
          qt += parseFloat(parseFloat(obj.superficier_PC).toFixed(2));
          break;
        case 2:
          qt += checkValue(parseFloat(parseFloat(obj.TnJ_ha).toFixed(2)));
          break;
        case 3:
          qt += checkValue(parseFloat(parseFloat(obj.EntreeQte).toFixed(2)));
          break;
        case 4:
          qt += checkValue(parseFloat(parseFloat(obj.MoyenneQte).toFixed(2)));

      }
      return qt;
    }

    //BEGIN getPrevisionJournaliere FUNCTIONS
    function getQtVariete(culture, variete, array) {
      var qtObj = {
        qtShow: "",
        qtval: 0
      };
      var canGo = true;
      array.forEach(elem => {
        if (canGo && elem.Culture == culture && elem.Variete == variete) {
          qtObj.qtShow = parseInt(elem.QTE);
          qtObj.qtval = qtObj.qtShow;
          canGo = false;
        }
      });
      return qtObj;
    }

    function getQtTotalVariete(variete, array) {
      var qtObj = {
        qtShow: "",
        qtval: 0
      };
      var canGo = true;
      array.forEach(elem => {
        if (canGo && elem.variete == variete) {
          qtObj.qtShow = parseInt(elem.total);
          qtObj.qtval = qtObj.qtShow;
          canGo = false;
        }
      });
      return qtObj;
    }
    //END getPrevisionJournaliere FUNCTIONS
    $scope.exportData = (type) => {
      if ('pdf' == type) {
        var mywindow = window.open('_self', 'PRINT', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + tops + ', left=' + left, '');

        mywindow.document.write(`<!DOCTYPE html><html><head>
        <style type="text/css" media="print">
        @page { size: landscape; }
        .reporting_header_cells
        {
          background-color:#009688;
          color:white;
          text-align: center;
        }
        table{border-collapse: collapse;}
        td,th,table{width:100%;border:1px solid #C0C0C0;}
      </style><title>${document.title}</title></head><body>${reportTable}</body></html>`);
        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10*/
        mywindow.document.title = `Rapport des prévisions journalières`;
        mywindow.print();
        mywindow.close();
      } else {
        var ctx = {
          worksheet: `Rapport des prévisions`,
          table: reportTable
        }
        var a = document.createElement('a');
        var data_type = 'data:application/vnd.ms-excel;base64,';
        a.href = data_type + base64(format(template, ctx));
        a.download = `rapport_previsions_journalieres_${moment().format('DD_MM_YYYY')}.xls`;
        a.click();
      }
    }

    $scope.printRecap = (type) => {
      if ('pdf' == type) {
        var mywindow = window.open('_self', 'PRINT', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + tops + ', left=' + left, '');
        mywindow.document.write(`<!DOCTYPE html><html><head>
        <style type="text/css" media="print">
        @page { size: landscape; }
        .reporting_header_cells
        {
          background-color:#009688;
          color:white;
          text-align: center;
        }
        .reporting_header_cells_left
        {
          background-color:#009688;
          color:white;
          text-align: left;
        }
        table{border-collapse: collapse;}
        td,th,table{width:100%;border:1px solid #C0C0C0;}
      </style><title>${document.title}</title></head><body>${recapeTable}</body></html>`);
        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10*/
        mywindow.document.title = `Récapitulatif des prévisions journalières`;
        mywindow.print();
        mywindow.close();
      } else {
        var ctx = {
          worksheet: `Récapitulatif des prévisions`,
          table: recapeTable
        }
        var a = document.createElement('a');
        var data_type = 'data:application/vnd.ms-excel;base64,';
        a.href = data_type + base64(format(template, ctx));
        a.download = `recapitulatif_previsions_journalieres_${moment().format('DD_MM_YYYY')}.xls`;
        a.click();
      }
    }

    function getRecapTable(cultureTable, cultureDataTable) {
      var returnedTable = [];
      cultureTable.forEach(element => {
        var culture = [element[0]];
        var variete = [];
        element[1].forEach(varieteElm1 => {

          cultureDataTable.forEach(cultureData => {
            if (cultureData[0] == element[0]) {
              cultureData[1].forEach(varieteElm2 => {
                if (varieteElm1 == varieteElm2.Variete) {
                  variete.push(varieteElm2);
                }
              });
            }

          });
        });
        culture.push(variete);
        returnedTable.push(culture);
      });
      return returnedTable;
    }

    $q.all([PrevisionJournaliere.getPrevisionJournaliere(), PrevisionJournaliere.recapJournaliere()]).then((values) => {
      NProgress.done();
      NProgress.remove();
      var reporting_header_cells = `background-color:#009688;color:white;text-align: center;`;
      var table_td_th = `border:1px solid #DCDCDC;`;
      var secondHeaderStart = ["Cycle", "Producteur", "Ferme"];
      var data = values[0].data[0].cultureTable;
      var cycleData = values[0].data[0].cycleTable;
      var labelLeftSide = ["Total général", "Superficies productive", "Total / j / ha (T)", "Entrée de j-7 à j-1 (T)", "Moyenne de j-7 à j-1 (T/jour)"];
      var subTotals = 0;

      var table = `<table class="table table-bordered tableFixHead" style="${table_td_th}border-collapse: collapse;width:100%;"><thead><tr>`;
      table += `<th colspan="3" style="${reporting_header_cells}">Culture</th>`;
      data.forEach(element => {
        table += `<th colspan="${element[1].length+1}" style="${reporting_header_cells}">${element[0]}</th>`;
      });
      table += `</tr><tr><td style="${reporting_header_cells}">${secondHeaderStart[0]}</td>
                <td style="${reporting_header_cells}">${secondHeaderStart[1]}</td>
                <td style="${reporting_header_cells}">${secondHeaderStart[2]}</td>`;
      data.forEach(element => {
        element[1].forEach(e => {
          table += `<td style="text-align: center;${table_td_th};background: #eee;">${e}</td>`;
        });
        table += `<td style="text-align: center;${table_td_th};background: #eee;">Total</td>`;
      });
      table += `</tr></thead><tbody>`;
      //BEGIN FILL DATA TABLE
      cycleData.forEach(cycleElm => {
        var countFarm = 0;
        cycleElm[1].forEach(producteurElm => {
          producteurElm[1].forEach(farmEelem => {
            //BEGIN CONTENT
            table += `<tr>`;
            table += `<td style="${table_td_th}">${cycleElm[0]}</td>
                          <td style="${table_td_th}">${producteurElm[0]}</td>
                          <td style="${table_td_th}">${farmEelem[0]}</td>`;
            data.forEach(element => {
              var qtObjTemp = {
                totalShow: "",
                total: 0
              };
              element[1].forEach(varieteElm => {
                var qtObj = {};
                qtObj = getQtVariete(element[0], varieteElm, farmEelem[1]);
                qtObjTemp.total += qtObj.qtval;
                qtObjTemp.totalShow += qtObj.qtShow;
                table += `<td style="text-align: right;${table_td_th}">${qtObj.qtShow}</td>`;
              });
              table += `<td style="text-align: right;background:#fff3cc;${table_td_th}">${(qtObjTemp.totalShow=='')?'-':parseInt(qtObjTemp.total)}</td>`;
            });
            table += `</tr>`;
            ++countFarm;
            //END CONTENT
            //BEGIN TOTALE

            if (countFarm == cycleElm[2].counFarm) {
              table += `<tr>`;
              table += `<td colspan="3" style="text-align: center;background:#FFE699;${table_td_th}">TOTAL ${cycleElm[0]}</td>`;
              data.forEach(element => {
                var qtObjTemp = {
                  totalShow: "",
                  total: 0
                };
                element[1].forEach(varieteElm => {
                  var qtObj = {};
                  qtObj = getQtTotalVariete(varieteElm, cycleElm[2].totalVarieteCycle);
                  qtObjTemp.total += qtObj.qtval;
                  qtObjTemp.totalShow += qtObj.qtShow;
                  table += `<td style="text-align: right;background:#FFE699;${table_td_th}">${qtObj.qtShow}</td>`;
                });
                table += `<td style="text-align: right;background:#FFE699;${table_td_th}">${(qtObjTemp.totalShow=='')?'-':parseInt(qtObjTemp.total)}</td>`;
              });
              table += `</tr>`;
            }
            //END TOTALE
          });
        });
      });
      table += `</tbody><tfoot>`;
      //END FILL DATA TABLE

      //BEGIN RECAP ATTACHEMENT
      //TOTALE GENERALE
      var recapTable = getRecapTable(values[0].data[0].cultureTable, values[1].data);
      var styleFirstLineRecap = `border-top:2px solid silver;`;
      for (let index = 0; index < 5; index++) {
        table += `<tr><td colspan="3" style="text-align: center;background:#FFE699;${table_td_th}${styleFirstLineRecap}">${labelLeftSide[index]}</td>`;
        recapTable.forEach(element => {
          element[1].forEach(e => {
            table += `<td style="text-align: right;${table_td_th}background:#fff3cc;${styleFirstLineRecap}">${parseFloat(getValueColumn(e,index)).toFixed(2).replace(".", ",")}</td>`;
            subTotals += getValueColumn(e, index);
          });
          table += `<td style="text-align: right;${table_td_th}background:#fff3cc;${styleFirstLineRecap}">${parseFloat(subTotals).toFixed(2).replace(".", ",")}</td>`;
          subTotals = 0;
        });
        table += `</tr>`;
        styleFirstLineRecap = "";
      }
      //END RECAP ATTACHEMENT
      table += `</tfoot></table>`;
      reportTable = table;
      angular.element(document.getElementById('wdr-component')).append($compile(table)($scope));



      // //RECAP
      //         var reporting_header_cells=`background-color:#009688;color:white;text-align: center;`;
      //         var reporting_header_cells_left=`background-color:#009688;color:white;text-align: left;`;
      //         var table_td_th=`border:1px solid #DCDCDC;`;
      //         var labelLeftSide = ["Total général", "Superficies productive", "Total / j / ha (T)", "Entrée de j-7 à j-1 (T)", "Moyenne de j-7 à j-1 (T/jour)"];
      //         var data = values[1].data;
      //         var table = `<table class="table table-bordered" style="${table_td_th}border-collapse: collapse;width:100%;"><thead><tr>`;
      //         var subTotals = 0;
      //         table += `<th colspan="2" style="${reporting_header_cells}${table_td_th}"></th>`;
      //         data.forEach(element => {
      //           table += `<th colspan="${element[1].length+1}" style="${reporting_header_cells}${table_td_th}">${element[0]}</th>`;
      //         });
      //         table += `</tr></thead><tbody><tr>`;
      //         table += `<td style="${reporting_header_cells_left}${table_td_th}"></td><td style="text-align: center;${table_td_th}">Grand Total</td>`;
      //         data.forEach(element => {
      //           element[1].forEach(e => {
      //             table += `<td style="text-align: center;${table_td_th}">${e.Variete}</td>`;
      //           });
      //           table += `<td style="text-align: center;${table_td_th}">Total</td>`;
      //         });
      //         table += `</tr>`;

      //         //TOTALE GENERALE
      //         for (let index = 0; index < 5; index++) {
      //           table += `<tr><td style="${reporting_header_cells_left}${table_td_th}">${labelLeftSide[index]}</td>
      //           <td style="text-align: right;${table_td_th}">${getTotalQt(data,index).replace(".", ",")}</td>`;
      //           data.forEach(element => {
      //             element[1].forEach(e => {
      //               table += `<td style="text-align: right;${table_td_th}">${parseFloat(getValueColumn(e,index)).toFixed(2).replace(".", ",")}</td>`;
      //               subTotals += getValueColumn(e, index);
      //             });
      //             table += `<td style="text-align: right;${table_td_th}">${parseFloat(subTotals).toFixed(2).replace(".", ",")}</td>`;
      //             subTotals = 0;
      //           });
      //           table += `</tr>`;
      //         }
      //         table += `</tbody></table>`;
      //         recapeTable = table;
      //         angular.element(document.getElementById('recap')).append($compile(table)($scope));

    });

  });