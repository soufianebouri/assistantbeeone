'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RecolteExpeditionpararbreCtrl
 * @description
 * # RecolteExpeditionpararbreCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RecolteExpeditionpararbreCtrl',
    function(
      $scope,
      DTOptionsBuilder,
      translatedwords,
      _url,
      Ouviers,
      NiveauColorationService,
      $translatePartialLoader,
      $window,
      $filter,
      toastr,
      GroupeOperationnel,
      campagneagricole,
      DTColumnBuilder,
      $mdDialog,
      $translate,
      $q,
      $compile,
      expeditions,
      $state,
      DTDefaultOptions,
      $cookies,
      $templateCache,
      expeditionpararbre
    ) {
      var pc = this;
      pc.dtInstance = {};
      $translatePartialLoader.addPart("conduitetechnique");
      $translate.use($window.localStorage.getItem("lang").toLowerCase());
      $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
      var titleHtml =
        '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
      pc.selected = {};
      $scope._ = _;
      pc.selectAll = false;
      pc.toggleAll = toggleAll;
      pc.toggleOne = toggleOne;
      pc.showtable = true;
      pc.IDFERME = $cookies.getObject("globals").ferme.IDFerme;
      pc.IDSociete = $cookies.getObject("globals").ferme.IDSociete;
      pc.NomFerme = $cookies.getObject("globals").ferme.NomFerme;
      pc.YearNow = moment().format("YYYY");
      pc.DateNow = moment().format("DD/MM/YYYY");
      pc.TimeNow = moment().format("HH:mm");
      pc.date1 = "";
      pc.date2 = "";
      pc.hj_total = 0;
      pc.quantite_total = 0;
      pc.cout_total = 0;
      pc.montant_total = 0;
      pc.cout_total_parcelle = 0;
      pc.cout_total_centre = 0;

      var permission_data = JSON.parse(
        $window.localStorage.getItem("permission")
      );
      var permission = {
        modules_array: permission_data[0],
        rubriques_array: permission_data[1],
        sous_modules_array: permission_data[2],
      };

      pc.isAdmin = $cookies.getObject("globals").currentUser.isAdmin;

      var opsemisAccess = _.filter(permission.sous_modules_array, {
        ss_module: "expedition_arbre",
      });

      $scope.canIAction = () => {
        if (pc.isAdmin)
          return {
            add: true,
            update: true,
            delete: true,
          };
        return {
          add: opsemisAccess[0].a,
          update: opsemisAccess[0].u,
          delete: opsemisAccess[0].d,
        };
      };

      setTimeout(function() {
        $(".selectpicker").selectpicker("refresh");
      }, 1000);

      $scope.ReverseDisplay = function(d) {
        if (document.getElementById(d).style.display === "none") {
          document.getElementById(d).style.display = "block";
        } else {
          document.getElementById(d).style.display = "none";
        }
      };

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
              pc.selectAll = false;
              return;
            }
          }
        }
        pc.selectAll = true;
      }

      //set date input
      $scope.date_fin = moment(
        moment().format("YYYY-MM-DD"),
        "YYYY-MM-DD"
      ).toDate();
      $scope.current_date = moment(
        moment().format("YYYY-MM-DD"),
        "YYYY-MM-DD"
      ).toDate();

      pc.obj = {
        DOMAINE: pc.IDFERME,
        DATE_DEBUT: 0,
        DATE_FIN: moment($scope.date_fin).format("YYYYMMDD"),
      };

      $scope.date_debut_sel = 0;
      $scope.date_fin_sel = moment($scope.date_fin).format("YYYYMMDD");

      //by date_debutl
      $scope.date_debut_change = function() {
        NProgress.start();
        if (
          $scope.date_debut === null ||
          $scope.date_debut === "" ||
          $scope.date_debut === undefined ||
          $scope.date_debut === 0 ||
          $scope.date_debut === "0" ||
          !$scope.date_debut ||
          $scope.date_debut.length === 0
        ) {
          $scope.date_debut_sel = 0;
        } else {
          $scope.date_debut_sel = $scope.date_debut;
        }

        pc.obj.DATE_DEBUT = moment($scope.date_debut_sel).format("YYYYMMDD");
        pc.dtInstance.reloadData();
        NProgress.done();
        NProgress.remove();
      };

      //by date_fin
      $scope.date_fin_change = function() {
        NProgress.start();
        if (
          $scope.date_fin === null ||
          $scope.date_fin === "" ||
          $scope.date_fin === undefined ||
          $scope.date_fin === 0 ||
          $scope.date_fin === "0" ||
          !$scope.date_fin ||
          $scope.date_fin.length === 0
        ) {
          $scope.date_fin_sel = 0;
        } else {
          $scope.date_fin_sel = $scope.date_fin;
        }

        pc.obj.DATE_FIN = moment($scope.date_fin_sel).format("YYYYMMDD");
        pc.dtInstance.reloadData();
        NProgress.done();
        NProgress.remove();
      };

      $scope.type = "Type";

      //get data and refresh datatable
      $scope.updateExpedition = function(data) {
        return expeditionpararbre.getbyfiltre(data);
      };

      pc.showtable_toggle = function() {
        pc.showtable = true;
      };
      pc.Fax = "";
      //détails pointage
      pc.detailsexpedition = function(data) {
        setTimeout(function() {
          $(".selectpicker").selectpicker("refresh");
        }, 1000);
        pc.expeditionByID = data;
        pc.caisses = [];
        pc.parcelles = [];
        pc.parcellesRef = [];
        pc.parcellesGO = [];
        pc.parcellesCodeExterne = [];
        pc.parcellesPhysique = [];
        pc.showtable = false;
        if (document.getElementById("filter_form").style.display === "block") {
          document.getElementById("filter_form").style.display = "none";
        }
        $scope.datanow = moment().format('DD/MM/YYYY');

        function removeDiacritics(str) {

          var defaultDiacriticsRemovalMap = [{
              'base': 'A',
              'letters': /[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g
            },
            {
              'base': 'AA',
              'letters': /[\uA732]/g
            },
            {
              'base': 'AE',
              'letters': /[\u00C6\u01FC\u01E2]/g
            },
            {
              'base': 'AO',
              'letters': /[\uA734]/g
            },
            {
              'base': 'AU',
              'letters': /[\uA736]/g
            },
            {
              'base': 'AV',
              'letters': /[\uA738\uA73A]/g
            },
            {
              'base': 'AY',
              'letters': /[\uA73C]/g
            },
            {
              'base': 'B',
              'letters': /[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g
            },
            {
              'base': 'C',
              'letters': /[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g
            },
            {
              'base': 'D',
              'letters': /[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g
            },
            {
              'base': 'DZ',
              'letters': /[\u01F1\u01C4]/g
            },
            {
              'base': 'Dz',
              'letters': /[\u01F2\u01C5]/g
            },
            {
              'base': 'E',
              'letters': /[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g
            },
            {
              'base': 'F',
              'letters': /[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g
            },
            {
              'base': 'G',
              'letters': /[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g
            },
            {
              'base': 'H',
              'letters': /[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g
            },
            {
              'base': 'I',
              'letters': /[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g
            },
            {
              'base': 'J',
              'letters': /[\u004A\u24BF\uFF2A\u0134\u0248]/g
            },
            {
              'base': 'K',
              'letters': /[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g
            },
            {
              'base': 'L',
              'letters': /[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g
            },
            {
              'base': 'LJ',
              'letters': /[\u01C7]/g
            },
            {
              'base': 'Lj',
              'letters': /[\u01C8]/g
            },
            {
              'base': 'M',
              'letters': /[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g
            },
            {
              'base': 'N',
              'letters': /[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g
            },
            {
              'base': 'NJ',
              'letters': /[\u01CA]/g
            },
            {
              'base': 'Nj',
              'letters': /[\u01CB]/g
            },
            {
              'base': 'O',
              'letters': /[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g
            },
            {
              'base': 'OI',
              'letters': /[\u01A2]/g
            },
            {
              'base': 'OO',
              'letters': /[\uA74E]/g
            },
            {
              'base': 'OU',
              'letters': /[\u0222]/g
            },
            {
              'base': 'P',
              'letters': /[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g
            },
            {
              'base': 'Q',
              'letters': /[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g
            },
            {
              'base': 'R',
              'letters': /[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g
            },
            {
              'base': 'S',
              'letters': /[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g
            },
            {
              'base': 'T',
              'letters': /[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g
            },
            {
              'base': 'TZ',
              'letters': /[\uA728]/g
            },
            {
              'base': 'U',
              'letters': /[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g
            },
            {
              'base': 'V',
              'letters': /[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g
            },
            {
              'base': 'VY',
              'letters': /[\uA760]/g
            },
            {
              'base': 'W',
              'letters': /[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g
            },
            {
              'base': 'X',
              'letters': /[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g
            },
            {
              'base': 'Y',
              'letters': /[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g
            },
            {
              'base': 'Z',
              'letters': /[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g
            },
            {
              'base': 'a',
              'letters': /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g
            },
            {
              'base': 'aa',
              'letters': /[\uA733]/g
            },
            {
              'base': 'ae',
              'letters': /[\u00E6\u01FD\u01E3]/g
            },
            {
              'base': 'ao',
              'letters': /[\uA735]/g
            },
            {
              'base': 'au',
              'letters': /[\uA737]/g
            },
            {
              'base': 'av',
              'letters': /[\uA739\uA73B]/g
            },
            {
              'base': 'ay',
              'letters': /[\uA73D]/g
            },
            {
              'base': 'b',
              'letters': /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g
            },
            {
              'base': 'c',
              'letters': /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g
            },
            {
              'base': 'd',
              'letters': /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g
            },
            {
              'base': 'dz',
              'letters': /[\u01F3\u01C6]/g
            },
            {
              'base': 'e',
              'letters': /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g
            },
            {
              'base': 'f',
              'letters': /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g
            },
            {
              'base': 'g',
              'letters': /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g
            },
            {
              'base': 'h',
              'letters': /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g
            },
            {
              'base': 'hv',
              'letters': /[\u0195]/g
            },
            {
              'base': 'i',
              'letters': /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g
            },
            {
              'base': 'j',
              'letters': /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g
            },
            {
              'base': 'k',
              'letters': /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g
            },
            {
              'base': 'l',
              'letters': /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g
            },
            {
              'base': 'lj',
              'letters': /[\u01C9]/g
            },
            {
              'base': 'm',
              'letters': /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g
            },
            {
              'base': 'n',
              'letters': /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g
            },
            {
              'base': 'nj',
              'letters': /[\u01CC]/g
            },
            {
              'base': 'o',
              'letters': /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g
            },
            {
              'base': 'oi',
              'letters': /[\u01A3]/g
            },
            {
              'base': 'ou',
              'letters': /[\u0223]/g
            },
            {
              'base': 'oo',
              'letters': /[\uA74F]/g
            },
            {
              'base': 'p',
              'letters': /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g
            },
            {
              'base': 'q',
              'letters': /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g
            },
            {
              'base': 'r',
              'letters': /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g
            },
            {
              'base': 's',
              'letters': /[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g
            },
            {
              'base': 't',
              'letters': /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g
            },
            {
              'base': 'tz',
              'letters': /[\uA729]/g
            },
            {
              'base': 'u',
              'letters': /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g
            },
            {
              'base': 'v',
              'letters': /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g
            },
            {
              'base': 'vy',
              'letters': /[\uA761]/g
            },
            {
              'base': 'w',
              'letters': /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g
            },
            {
              'base': 'x',
              'letters': /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g
            },
            {
              'base': 'y',
              'letters': /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g
            },
            {
              'base': 'z',
              'letters': /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g
            }
          ];

          for (var i = 0; i < defaultDiacriticsRemovalMap.length; i++) {
            str = str.replace(defaultDiacriticsRemovalMap[i].letters, defaultDiacriticsRemovalMap[i].base);
          }

          return str;

        }



        expeditionpararbre
          .getvarietesbyid({
            ID: pc.expeditionByID.ID
          })
          .then(function(res) {
            pc.allvarietes = res.data;
            NProgress.done();
          });

        expeditionpararbre
          .getparcellebyid({
            ID: pc.expeditionByID.ID
          })
          .then(function(res) {
            pc.allparcelle = res.data;
            NProgress.done();
          });

        expeditionpararbre
          .getlasttraitementbyid({
            ID: pc.expeditionByID.ID
          })
          .then(function(res) {
            pc.lasttraitement = res.data;
            NProgress.done();
          });

      };

      pc.typegroup_change = function() {
        if (!$scope.typegroup) $scope.typegroup = 0;
      };

      if ($scope.canIAction().add) {
        $scope.btnadd = {
          text: "<i class='fa fa-plus'></i>",
          key: "1",
          className: "pull-left",
          action: function(e, dt, node, config) {
            $scope.AddExpedition();
          },
          titleAttr: "Ajouter",
        };
      } else {
        $scope.btnadd = undefined;
      }
      pc.Expeaction = {};
      pc.ExpeactionBL = {};
      pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
          var defer = $q.defer();
          $scope.updateExpedition(pc.obj).then(function(res) {
            defer.resolve(res.data);
            NProgress.done();
          });

          return defer.promise;
        })
        .withOption("deferRender", true)
        .withDOM("<lf<t>ip>")
        .withPaginationType("simple_numbers")
        .withDisplayLength(10)
        .withOption('responsive', true)
        .withOption("createdRow", createdRow)
        .withOption("headerCallback", headerCallback)
        .withOption(
          "fnRowCallback",
          function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $("td", nRow).bind("click", function() {
              $scope.$apply(function() {
                $("td").css("background-color", "");
                $("td", nRow).css("background-color", "#fff6b5");
              });
            });
            return nRow;
          }
        )
        .withOption("initComplete", function() {
          // do what evrithing
        })
        .withOption("order", [0, "asc"])

        .withScroller()
        .withLanguage(
          $.getJSON(
            `/scripts/i18n/datatable/${$window.localStorage
            .getItem("lang")
            .toLowerCase()}.json`,
            function(data) {
              return data;
            }
          )
        )

        .withButtons(
          [{
              extend: "colvis",
              text: "<i class='fa fa-eye'></i>",
              className: "pull-left",
              titleAttr: translatedwords.getTranslatedWord(
                $translate("Visibilité")
              ),
            },
            {
              text: "<i class='fa fa-search'></i>",
              action: function(e, dt, node, config) {
                $scope.ReverseDisplay("filter_form");
              },
              titleAttr: translatedwords.getTranslatedWord(
                $translate("Rechercher")
              ),
            },
            {
              extend: "copy",
              text: "<i class='fa fa-copy'></i>",
              titleAttr: translatedwords.getTranslatedWord($translate("Copie")),
            },
            {
              extend: "print",
              text: "<i class='fa fa-print'></i>",
              titleAttr: translatedwords.getTranslatedWord(
                $translate("Imprimer")
              ),
            },
            {
              extend: "excel",
              text: "<i class='fa fa-file-excel-o'></i>",
              titleAttr: "EXCEL",
            },
          ]
        );


      pc.dtColumns = [
        DTColumnBuilder.newColumn("date").withTitle(translatedwords.getTranslatedWord($translate("Date d'expédition"))).renderWith(function(data, type, full, meta) {
          return moment(full.date).format("DD/MM/YYYY");
        }),
        DTColumnBuilder.newColumn("time").withTitle(translatedwords.getTranslatedWord($translate("Heure d'expédition"))).renderWith(function(data, type, full, meta) {
          return (full.time.substring(0, 5) == '00:00') ? '- - : - -' : full.time.substring(0, 5);
        }),
        DTColumnBuilder.newColumn("bon_expedition").withTitle(
          translatedwords.getTranslatedWord($translate("Bon d'expédition"))
        ),
        DTColumnBuilder.newColumn("nbr_caisse").withTitle(
          translatedwords.getTranslatedWord($translate("Nbr caisse"))
        ),
        DTColumnBuilder.newColumn(null)
        .withTitle(translatedwords.getTranslatedWord($translate("Actions")))
        .notSortable()
        .renderWith(function(data, type, full, meta) {
          pc.Expeaction[data.ID] = data;
          var editbtn = $scope.canIAction().update ?
            '<button class="btn btn-success btn-xs" title="Modifier" ng-click="pc.edit(pc.Expeaction[' +
            data.ID +
            '])" )"=""><i class="fa fa-edit"></i></button>' :
            "";

          var deletebtn = $scope.canIAction().delete ?
            '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.Expeaction[' +
            data.ID +
            '])" )"=""><i class="fa fa-trash-o"></i></button>' :
            "";
          var dtailsBtn =
            '<button class="btn btn-warning btn-xs" title="Détails" ng-click="pc.detailsorder(pc.Expeaction[' +
            data.ID +
            '])" )"=""><i class="fa fa-eye"></i></button>';
          return dtailsBtn + editbtn + deletebtn;
        })
        .withClass("td-small nowraptd all").withOption("width", "12%"),
      ];

      DTDefaultOptions.setLoadingTemplate(
        '<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>'
      );

      pc.delete = async function(c) {
        toastr.clear();
        toastr.info(
          "<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" +
          (await translatedwords.getTranslatedWord(
            $translate("Je confirme")
          )) +
          "</button>",
          await translatedwords.getTranslatedWord(
            $translate("Veuillez confirmer !")
          ), {
            closeButton: true,
            allowHtml: true,
            onShown: function(toast) {
              $("#confirmationRevertYes").click(function() {
                expeditionpararbre
                  .deleteexpedition({
                    ID: c.ID,
                  })
                  .then(async function(result) {
                    if (result.data[0].message == "ajout reussi") {
                      //validate success
                      toastr.clear();
                      toastr.info(
                        await translatedwords.getTranslatedWord(
                          $translate("Suppression réussie")
                        ), {
                          closeButton: true,
                        }
                      );
                      NProgress.done();
                      pc.dtInstance.reloadData();
                    } else {
                      toastr.clear();
                      toastr.error(
                        (await translatedwords.getTranslatedWord(
                          $translate("an error occured ")
                        )) + result.data[0].description, {
                          closeButton: true,
                        }
                      );
                    }
                  });
              });
            },
          }
        );
      };



      //Add AddOrdreTraitement
      pc.edit = function(data) {
        $mdDialog.show({
            controller: DialogControllerEdit,
            templateUrl: '././views/templates/expeditionpararbre/Editexpeditionpararbre.html',
            parent: angular.element(document.body),
            targetEvent: "ev",
            clickOutsideToClose: false,
            hasBackdrop: true,
            escapeToClose: false,
            locals: {
              data: data
            }
          })
          .then(function(answer) {}, function() {});
      }

      //Add AddAnalyse
      function DialogControllerEdit($scope, $mdDialog, data) {

        $scope.data = data;


        $scope.Annuler = function() {
          $mdDialog.cancel();
          document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
        };


        //Modifier click
        $scope.Modifier = async function() {



          $scope.progress = true;
          toastr.clear();

          if ($scope.data.bon_expedition) {

            pc.objEdit = {
              "ID": $scope.data.ID,
              "bon_expedition": $scope.data.bon_expedition
            }

            expeditionpararbre.editRefbon_expedition(pc.objEdit).then(async e => {
              if (e.data[0].message == "ajout reussi") {
                //validate success
                toastr.clear();
                toastr.info(await translatedwords.getTranslatedWord($translate("Modification réussie")), {
                  closeButton: true
                });
                NProgress.done();
                $mdDialog.hide();
                document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
                pc.dtInstance.reloadData();
              } else {
                $scope.progress = false;
                toastr.clear();
                toastr.error(e.data, {
                  closeButton: true
                });
                NProgress.done();
              }
            }).catch(async e => {
              $scope.progress = false;
              toastr.clear();
              if (e.data.description == "Veuillez renseigner les cibles choisie") {
                toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner les cibles choisie")), {
                  closeButton: true
                });
              } else {
                toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement : ")) + e.data, {
                  closeButton: true
                });
              }
            });

          } else {
            $scope.progress = false;
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner les cibles choisie")), {
              closeButton: true
            });
          }


        };


        $scope.hideAvancer = function() {
          $mdDialog.hide();
          document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
        };

        $scope.Annuler = function() {
          $mdDialog.cancel();
          document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
        };


      }


      pc.detailsorder = function(data) {
        pc.allvarietes = [];
        pc.allparcelle = [];
        pc.lasttraitement = [];
        pc.detailsexpedition(data);
      };


      $scope.searchByType = function(type_text) {
        pc.dtInstance.DataTable.search(type_text).draw();
      };

      pc.printdetails = function(expeditionByID) {
        //alert(expeditionByID);
        pc.Code_compagne_exp = "";
        campagneagricole
          .CheckCodeCompagnebyTwoDates({
            date_debut: moment(expeditionByID.DATE).format("YYYYMMDD"),
            IDSOCIETE: pc.IDSociete,
          })
          .then((e) => {
            if (e.data.length > 0) {
              try {
                pc.Code_compagne_exp = e.data[0].Code_compagne;
              } catch (e) {
                pc.Code_compagne_exp = "";
              }
            }
            NProgress.done();
            var type = "";
            var dateFeri = "";

            if (expeditionByID.type == 1) {
              type = "Réception";
            } else if (expeditionByID.type == 2) {
              type = "Expédition";
            } else if (expeditionByID.type == 3) {
              type = "Sortie caisse vide";
            }

            if (expeditionByID.DATE) {
              dateFeri = moment(expeditionByID.DATE).format("DD/MM/YYYY");
            }

            var w = 1000;
            var h = 1000;
            var left = Number(screen.width / 2 - w / 2);
            var tops = Number(screen.height / 2 - h / 2);

            var mywindow = window.open(
              "_self",
              "PRINT",
              "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" +
              w +
              ", height=" +
              h +
              ", top=" +
              tops +
              ", left=" +
              left,
              ""
            );

            //window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
            mywindow.document.write("<html><head><title></title>");
            mywindow.document.write("</head><body >");

            mywindow.document.write('<table border="1" style="width:100%; background:#e0efda" >' +
              '<tr>' +
              '<th rowspan="3" style="width:30%;"></th>' +
              '<th rowspan="3" style="width:30%;">BON DE LIVRAISON RECOLTE</th>' +
              '<th style="width:40%;">Verion : V01</th>' +
              '</tr>' +
              '<tr>' +
              '<th style="width:40%;">Ref : F02-REC</th>' +
              '</tr>' +
              '<tr>' +
              '<th style="width:40%;">Date de création : ' + moment().format('DD/MM/YYYY') + '</th>' +
              '</tr>' +
              '</table>');


            mywindow.document.write(
              '<br/><center><b>N° BL : ' + pc.expeditionByID.bon_expedition + '</b></center><br/>'
            );

            mywindow.document.write('<table border="1" class="pull-right" style="width:50%;" >' +
              '<tr>' +
              '<td style="background:#e0e0e0;">VARIETE</td>' +
              '<td>' + pc.allvarietes[0].Variete + '</td>' +
              '</tr>' +
              '<tr>' +
              '<td style="background:#e0e0e0;">DESTINATION</td>' +
              '<td width="50%"></td>' +
              '</tr>' +
              '</table><br/>');

            $("table").attr("border", "1");
            $("table").width("100%");
            $("td").width("100%");
            $("th").width("100%");
            mywindow.document.write(
              document.getElementById("tab_2").innerHTML
            );
            mywindow.document.write("<br/>");
            $("table").attr("border", "1");
            $("table").width("100%");
            $("td").width("100%");
            $("th").width("100%");
            mywindow.document.write(
              document.getElementById("tab_66").innerHTML
            );
            $("table").attr("border", "0");


            mywindow.document.write("</body></html>");

            mywindow.document.close(); // necessary for IE >= 10
            mywindow.focus(); // necessary for IE >= 10*/

            mywindow.print();
            mywindow.close();

            return true;
          });
      };

      function edit(c) {}

      function deleteRow(c) {}

      function createdRow(row, data, dataIndex) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);
      }

      function headerCallback(header) {
        if (!pc.headerCompiled) {
          // Use this headerCompiled field to only compile header once
          pc.headerCompiled = true;
          $compile(angular.element(header).contents())($scope);
        }
      }
    }
  );