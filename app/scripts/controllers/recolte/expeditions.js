"use strict";

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RecolteExpeditionsCtrl
 * @description
 * # RecolteExpeditionsCtrl
 * Controller of the beeOneWebFrontApp
 */
angular
  .module("beeOneWebFrontApp")
  .controller(
    "RecolteExpeditionsCtrl",
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
      expeditions, _appFor,
      $state,
      DTDefaultOptions, logo,
      $cookies,
      $templateCache
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
      $scope.isAdministrator = pc.isAdmin;


      var opsemisAccess = _.filter(permission.sous_modules_array, {
        ss_module: "expedition",
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
        return expeditions.showExpedition(data);
      };

      pc.showtable_toggle = function() {
        pc.showtable = true;
      };
      pc.Fax = "";
      pc.reference_producteur = "";
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


        async function removeDiacritics(str) {

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

        expeditions
          .getTracabilite({
            ID: pc.expeditionByID.id,
          })
          .then(async function(res) {
            $("#expeditionQr").html("");

            $scope.tracabilites = res.data.csv;
            new QRCode("expeditionQr", {
              text: await removeDiacritics($scope.tracabilites),
              width: 250,
              height: 250,
              colorDark: "#000000",
              colorLight: "#ffffff",
              correctLevel: QRCode.CorrectLevel.L,
            });
            NProgress.done();
          });

        expeditions
          .getTraitement({
            ID: pc.expeditionByID.id,
          })
          .then(async function(res) {
            $("#traitementQr").html("");
            $scope.traitement = res.data.csv;
            new QRCode("traitementQr", {
              text: await removeDiacritics($scope.traitement),
              width: 250,
              height: 250,
              colorDark: "#000000",
              colorLight: "#ffffff",
              correctLevel: QRCode.CorrectLevel.L,
            });
            NProgress.done();
          });

        expeditions
          .showCaisse({
            IDEXPEDITION: pc.expeditionByID.id,
            Client: pc.expeditionByID.IDClient,
            DOMAINE: pc.IDFERME,
            Date: moment(pc.expeditionByID.DATE).format("YYYYMMDD"),
          })
          .then(function(res) {
            pc.caisses = res.data;
            NProgress.done();
          });

        expeditions
          .showParcelleCulturale({
            IDEXPEDITION: pc.expeditionByID.id,
            DOMAINE: pc.IDFERME,
          })
          .then(function(res) {
            pc.parcellesRef = _.groupBy(res.data, "Ref");
            pc.parcellesRefArr = res.data;
            NProgress.done();
          });

        expeditions
          .showByGroupeOperationnel({
            IDEXPEDITION: pc.expeditionByID.id,
            DOMAINE: pc.IDFERME,
          })
          .then(function(res) {
            pc.parcellesGO = _.groupBy(res.data, "Groupeoperationnel");
            pc.parcellesGOArr = res.data;
            NProgress.done();
          });

        expeditions
          .showCodeExterne({
            IDEXPEDITION: pc.expeditionByID.id,
            DOMAINE: pc.IDFERME,
          })
          .then(function(res) {
            pc.parcellesCodeExterne = _.groupBy(res.data, "Code_externe");
            pc.parcellesCodeExterneArr = res.data;
            NProgress.done();
          });

        expeditions
          .showParcelle({
            IDEXPEDITION: pc.expeditionByID.id,
            DOMAINE: pc.IDFERME,
          })
          .then(function(res) {
            pc.parcellesPhysique = _.groupBy(res.data, "RefParcellePhysique");
            pc.parcellesPhysiqueArr = res.data;
            NProgress.done();
          });

        expeditions
          .showFax({
            DOMAINE: pc.IDFERME,
          })
          .then(function(res) {
            pc.faxFerme = res.data;
            try {
              pc.Fax = pc.faxFerme[0].Fax;
              pc.reference_producteur = (pc.faxFerme[0].reference_producteur) ? "( " + pc.faxFerme[0].reference_producteur + " )" : " "
            } catch (e) {
              pc.Fax = "";
              pc.reference_producteur = "";
            }
            NProgress.done();
          });

        expeditions
          .gettraitementbyexp({
            IDEXPEDITION: pc.expeditionByID.id,
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
              extend: "collection",
              text: "TYPE <i class='fa fa-chevron-down'></i>",
              buttons: [{
                  text: "Tous",
                  action: function(e, dt, node, config) {
                    $scope.searchByType("");
                  },
                  className: "SetSize",
                },
                {
                  text: translatedwords.getTranslatedWord(
                    $translate("Réception")
                  ),
                  action: function(e, dt, node, config) {
                    $scope.searchByType("Réception");
                  },
                  className: "SetSize",
                },
                {
                  text: translatedwords.getTranslatedWord(
                    $translate("Expédition")
                  ),
                  action: function(e, dt, node, config) {
                    $scope.searchByType("Expédition");
                  },
                  className: "SetSize",
                },
                {
                  text: translatedwords.getTranslatedWord(
                    $translate("Sortie caisse vide")
                  ),
                  action: function(e, dt, node, config) {
                    $scope.searchByType("Sortie caisse vide");
                  },
                  className: "SetSize",
                },
              ],
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
            {
              text: "<i class='fa fa-table'></i>",
              action: function(e, dt, node, config) {
                $state.go("expeditionssynthese");
              },
              titleAttr: translatedwords.getTranslatedWord(
                $translate("Fiche de suivi des quantités récoltés")
              ),
            },
          ].concat($scope.btnadd)
        );

      pc.dtColumns = [
        DTColumnBuilder.newColumn("type")
        .withTitle(translatedwords.getTranslatedWord($translate("Type")))
        .renderWith(function(data, type, full, meta) {
          if (full.type == 1) {
            return "<span class='badge-green'>Réception</span>";
          } else if (full.type == 2) {
            return "<span class='badge-orange'>Expédition</span>";
          } else if (full.type == 3) {
            return "Sortie caisse vide";
          } else {
            return "";
          }
        })
        .withOption("width", "12%"),
        DTColumnBuilder.newColumn("DATE")
        .withTitle(translatedwords.getTranslatedWord($translate("Date")))
        .renderWith(function(data, type, full, meta) {
          return moment(full.DATE).format("DD/MM/YYYY");
        }),
        DTColumnBuilder.newColumn("Num_bon").withTitle(
          translatedwords.getTranslatedWord($translate("N° de bon"))
        ),
        DTColumnBuilder.newColumn("Vehicule").withTitle(
          translatedwords.getTranslatedWord($translate("Véhicule"))
        ),
        DTColumnBuilder.newColumn("Chauffeur").withTitle(
          translatedwords.getTranslatedWord($translate("Chauffeur"))
        ),
        DTColumnBuilder.newColumn("ClientSociete")
        .withTitle(translatedwords.getTranslatedWord($translate("Client")))
        .renderWith(function(data, type, full, meta) {
          return full.ClientSociete;
        }),
        DTColumnBuilder.newColumn("Drencher")
        .withTitle(translatedwords.getTranslatedWord($translate("Drencher")))
        .renderWith(function(data, type, full, meta) {
          return full.Derencher ? "oui" : "non";
        }),
        DTColumnBuilder.newColumn("DateCueillette")
        .withTitle(
          translatedwords.getTranslatedWord($translate("Date de cueillette"))
        )
        .renderWith(function(data, type, full, meta) {
          return full.DateCueillette ?
            moment(full.DateCueillette).format("DD/MM/YYYY") :
            "";
        }),
        DTColumnBuilder.newColumn("HeureCueillette")
        .withTitle(
          translatedwords.getTranslatedWord($translate("Heure de cueillette"))
        )
        .renderWith(function(data, type, full, meta) {
          return full.HeureCueillette ?
            moment(full.HeureCueillette).format("HH:mm") :
            "";
        }),
        DTColumnBuilder.newColumn("ProgrammeSpecial")
        .withTitle(
          translatedwords.getTranslatedWord($translate("Programme spécial"))
        )
        .renderWith(function(data, type, full, meta) {
          return full.ProgrammeSpecial ? "oui" : "non";
        }),
        DTColumnBuilder.newColumn("coloration_pepins").withTitle(
          translatedwords.getTranslatedWord($translate("Coloration pépin"))
        ),
        DTColumnBuilder.newColumn("Temperature").withTitle(
          translatedwords.getTranslatedWord($translate("Température"))
        ),
        DTColumnBuilder.newColumn("PersonnelPrenom")
        .withTitle(
          translatedwords.getTranslatedWord($translate("Chef de cueillette"))
        )
        .renderWith(function(data, type, full, meta) {
          if (full.PersonnelPrenom == null && full.PersonnelNom == null)
            return "";
          return full.PersonnelPrenom + " " + full.PersonnelNom;
        }),
        DTColumnBuilder.newColumn("nbre_contenant").withTitle(
          translatedwords.getTranslatedWord($translate("Nombre Contenant"))
        ),

        DTColumnBuilder.newColumn("observations").withTitle(
          translatedwords.getTranslatedWord($translate("Observation"))
        ),

        DTColumnBuilder.newColumn(null)
        .withTitle(translatedwords.getTranslatedWord($translate("Actions")))
        .notSortable()
        .renderWith(function(data, type, full, meta) {
          pc.Expeaction[data.id] = data;
          var editbtn = $scope.canIAction().update ?
            '<button class="btn btn-success btn-xs" title="Modifier" ng-click="pc.edit(pc.Expeaction[' +
            data.id +
            '])" )"=""><i class="fa fa-edit"></i></button>' :
            "";
          var deletebtn = $scope.canIAction().delete ?
            '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.Expeaction[' +
            data.id +
            '])" )"=""><i class="fa fa-trash-o"></i></button>' :
            "";
          var dtailsBtn =
            '<button class="btn btn-warning btn-xs" title="Détails" ng-click="pc.detailsorder(pc.Expeaction[' +
            data.id +
            '])" )"=""><i class="fa fa-eye"></i></button>';
          return editbtn + dtailsBtn + deletebtn;
        })
        .withClass("td-small nowraptd all"),
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
                expeditions
                  .deleteexpedition({
                    ID: c.id,
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

      pc.detailsorder = function(data) {
        $scope.typegroup = 3;
        pc.parcelles = [];
        pc.parcellesRef = [];
        pc.parcellesCodeExterne = [];
        pc.parcellesPhysique = [];
        pc.parcellesGO = [];
        pc.detailsexpedition(data);
      };

      $scope.AddExpedition = function() {
        $mdDialog
          .show({
            controller: DialogControllerAddExpedition,
            templateUrl: "././views/templates/expedition/AddExpedition.html",
            parent: angular.element(document.body),
            targetEvent: "ev",
            clickOutsideToClose: false,
            hasBackdrop: true,
            escapeToClose: false,
          })
          .then(
            function(answer) {},
            function() {}
          );
      };

      //Add AddAnalyse
      function DialogControllerAddExpedition($scope, $mdDialog) {



        function pad(num, size) {
          var s = num + "";
          while (s.length < size) s = "0" + s;
          return s;
        }
        $q.all([
          expeditions.getAllParcelle({
            DOMAINE: pc.IDFERME,
            GroupeOp: 0,
          }),
          GroupeOperationnel.getGroupeOperationnelByFerme({
            idferme: pc.IDFERME,
          }),
          expeditions.getallClient(),
          expeditions.getMaxRef(pc.obj),
          expeditions.getAllMarque(),
          NiveauColorationService.getColoration(_url),
          Ouviers.getChefCueilletteByFerme(_url, {
            IDFerme: pc.IDFERME,
          }),
        ]).then((values) => {
          NProgress.done();
          $scope.parcelleculturals = values[0].data;
          $scope.GroupeOperationnels = values[1].data;
          $scope.AllClients = values[2].data;
          $scope.lastRef = values[3].data;
          if ($scope.lastRef.length > 0) {
            $scope.Reference = pad(parseInt($scope.lastRef[0].NbrExp) + 1, 4);
          } else {
            $scope.Reference = pad(1, 4);
          }
          $scope.AllMarque = values[4].data;
          $scope.chefs_cueillette = values[6].data;
          $scope.letmeclick = true;
        });

        $scope.colorations = ["Rouge", "Orange", "Vert"]

        $scope.parcelleculturals = [];

        $scope.Drencher = 0;

        $scope.getParcellesByGO = () => {
          expeditions
            .getAllParcelle({
              DOMAINE: pc.IDFERME,
              GroupeOp: $scope.GroupeOperationnelsel,
            })
            .then((e) => {
              NProgress.done();
              $scope.parcelleculturals = e.data;
            })
            .catch(async (e) => {
              toastr.clear();
              toastr.error(
                (await translatedwords.getTranslatedWord(
                  $translate(
                    "Connexion au serveur perdu, réessayer ultérieurement "
                  )
                )) + e.data, {
                  closeButton: true,
                }
              );
            });
        };

        $scope.iadd = false;

        $scope.addItem = function() {
          if ($scope.iadd) {
            $scope.iadd = false;
          } else {
            $scope.iadd = true;
          }
        };

        $scope.GetOtherReference = function() {
          expeditions
            .getMaxRef(pc.obj)
            .then((e) => {
              NProgress.done();
              if (e.data.length > 0) {
                $scope.Reference = pad(parseInt(e.data[0].NbrExp) + 1, 4);
              } else {
                $scope.Reference = pad(1, 4);
              }
            })
            .catch(async (e) => {
              toastr.clear();
              toastr.error(
                (await translatedwords.getTranslatedWord(
                  $translate(
                    "Connexion au serveur perdu, réessayer ultérieurement "
                  )
                )) + e.data, {
                  closeButton: true,
                }
              );
            });
        };

        document.getElementById("filter_form").style.display = "none";
        $scope.progress = false;
        $scope.specialProgram = false;
        $scope.DateExp = moment(
          moment().format("YYYY-MM-DD"),
          "YYYY-MM-DD"
        ).toDate();
        $scope.DateCeuil = $scope.DateExp;
        $scope.Ifullscreen = false;
        $scope.VarieteProduit = [];
        $scope.setDateCeuil = function() {
          $scope.DateCeuil = $scope.DateExp;
        };

        $scope.filterTemp = function() {
          $scope.temperature = parseFloat($scope.temperature.toFixed(2));
        };

        $scope.filterContenant = function() {
          $scope.nbrContenant = parseInt($scope.nbrContenant);
        };

        $scope.setHeureCeuil = function() {
          $scope.HeureCeuil = $scope.Heuredepart;
        };
        $scope.Fullscreen = function() {
          if (!$scope.Ifullscreen) {
            $("#model").addClass("fullscreen-dialog");
            document.getElementsByClassName('left_col')[0].style.zIndex = 0;
            $scope.Ifullscreen = true;
          } else {
            $("#model").removeClass("fullscreen-dialog");
            document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
            $scope.Ifullscreen = false;
          }
        };

        $scope.ClientChange = function() {
          NProgress.start();
          vente
            .getallExpedition({
              Client: $scope.Client.ID,
              DOMAINE: pc.IDferme,
            })
            .then((e) => {
              NProgress.done();
              $scope.AllExpeditions = e.data;
              $scope.VarieteProduit = [];
            })
            .catch(async (e) => {
              toastr.clear();
              toastr.error(
                (await translatedwords.getTranslatedWord(
                  $translate(
                    "Connexion au serveur perdu, réessayer ultérieurement "
                  )
                )) + e.data, {
                  closeButton: true,
                }
              );
            });
        };

        $scope.ExpeditionChange = function() {
          NProgress.start();
          vente
            .getAllVarieteProduit({
              IDExp: $scope.AllExpedition,
              DOMAINE: pc.IDferme,
            })
            .then((e) => {
              NProgress.done();
              $scope.VarieteProduit = e.data;
            })
            .catch(async (e) => {
              toastr.clear();
              toastr.error(
                (await translatedwords.getTranslatedWord(
                  $translate(
                    "Connexion au serveur perdu, réessayer ultérieurement "
                  )
                )) + e.data, {
                  closeButton: true,
                }
              );
            });
        };

        $scope.setTotal = function(food) {
          food.Total = food.Quantiteunite * food.Poidsmoyen;
          return food.Total;
        };

        $scope.setAllTotalTotal = function() {
          $scope.AllTotal = 0;
          if ($scope.parcelleculturals.length > 0)
            $scope.AllTotal = parseFloat(
              _.sumBy($scope.parcelleculturals, "Total").toFixed(2)
            );
          return $scope.AllTotal;
        };

        async function asyncForEach(array, callback) {
          for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
          }
        }

        $scope.checkProduitData = function() {
          var ifoundIt = true;
          angular.forEach($scope.parcelleculturals, function(value, key) {
            if (value.checkedChoise) {
              if (
                (!value.Nbrdecontenants ||
                  value.Nbrdecontenants === null ||
                  Number.isNaN(value.Nbrdecontenants) ||
                  !value.Quantiteunite ||
                  value.Quantiteunite === null ||
                  Number.isNaN(value.Quantiteunite) ||
                  !value.Poidsmoyen ||
                  value.Poidsmoyen === null ||
                  Number.isNaN(value.Poidsmoyen)) &&
                ifoundIt
              ) {
                ifoundIt = false;
              }
            }
          });
          return ifoundIt;
        };

        $scope.checkProduitLenght = function() {
          var ifoundIt = 0;
          angular.forEach($scope.parcelleculturals, function(value, key) {
            if (value.checkedChoise) {
              ifoundIt++;
            }
          });
          return ifoundIt;
        };

        //add click
        $scope.Ajouter = async function() {
          $scope.progress = true;
          toastr.clear();

          if (
            $scope.Reference &&
            $scope.DateExp &&
            $scope.parcelleculturals.length > 0 &&
            $scope.Client &&
            $scope.Heuredepart &&
            $scope.DateCeuil &&
            $scope.HeureCeuil &&
            $scope.Coloration &&
            $scope.temperature >= 0 && $scope.temperature !== null &&
            $scope.Chef_cueillette &&
            $scope.nbrContenant >= 0 && $scope.nbrContenant !== null

          ) {
            if ($scope.checkProduitLenght() > 0) {
              if ($scope.checkProduitData()) {
                pc.objAdd = {
                  Reference: $scope.Reference,
                  Client: $scope.Client,
                  Marque: $scope.Marque,
                  DateVente: moment($scope.DateVente).format("YYYYMMDD"),
                  parcelleculturals: $scope.parcelleculturals.filter(function(
                    parc
                  ) {
                    return parc.checkedChoise == true;
                  }),
                  AllTotal: $scope.AllTotal,
                  Utilisateur: pc.User,
                  IDFermes: pc.IDFERME,
                  IDUser: pc.IDUser,
                  Code_compagne: "",
                  Vehicule: $scope.Vehicule,
                  Chauffeur: $scope.Chauffeur,
                  Heuredepart: ($scope.Heuredepart) ? moment($scope.Heuredepart).format('HH:mm') : undefined,
                  Drencher: $scope.Drencher,
                  Observation: $scope.Observation,
                  DateCueillette: moment($scope.DateCeuil).format("YYYYMMDD"),
                  HeureCueillette: ($scope.HeureCeuil) ? moment($scope.HeureCeuil).format('HH:mm') : undefined,
                  ProgrammeSpecial: $scope.specialProgram,
                  coloration_pepins: $scope.Coloration,
                  Temperature: $scope.temperature,
                  IDPersonnel: $scope.Chef_cueillette.ID,
                  nbre_contenant: $scope.nbrContenant,
                };


                campagneagricole
                  .getCodeCampagneByIDSocieteDate({
                    IDSOCIETE: pc.IDSociete,
                    DATE: moment($scope.DateVente).format("YYYYMMDD"),
                  })
                  .then(async function(result) {
                    NProgress.done();
                    if (result.data.length > 0) {
                      pc.objAdd.Code_compagne = result.data[0].Code_compagne;
                      expeditions
                        .createexpedition(pc.objAdd)
                        .then(async (e) => {
                          if (e.data[0].message == "ajout reussi") {
                            //validate success
                            toastr.clear();
                            toastr.info(
                              await translatedwords.getTranslatedWord(
                                $translate("Ajout reussi")
                              ), {
                                closeButton: true,
                              }
                            );
                            NProgress.done();
                            $mdDialog.hide();
                            document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
                            pc.dtInstance.reloadData();
                          } else {
                            $scope.progress = false;
                            toastr.clear();
                            if (e.data.includes("duplicate key")) {
                              toastr.error(
                                await translatedwords.getTranslatedWord(
                                  $translate(
                                    "Veuillez noter que ce bon exist déjà !"
                                  )
                                ), {
                                  closeButton: true,
                                }
                              );
                            } else {
                              toastr.error(
                                (await translatedwords.getTranslatedWord(
                                  $translate("an error occured ")
                                )) + e.data[0], {
                                  closeButton: true,
                                }
                              );
                            }
                            NProgress.done();
                          }
                        })
                        .catch(async (e) => {
                          $scope.progress = false;
                          toastr.clear();
                          toastr.error(
                            (await translatedwords.getTranslatedWord(
                              $translate(
                                "Connexion au serveur perdu, réessayer ultérieurement : "
                              )
                            )) + e.data, {
                              closeButton: true,
                            }
                          );
                        });
                    } else {
                      toastr.clear();
                      toastr.error(
                        await translatedwords.getTranslatedWord(
                          $translate(
                            "La date n'appartient a aucune campagne agricole !"
                          )
                        ), {
                          closeButton: true,
                        }
                      );
                      $scope.progress = false;
                    }
                  });
              } else {
                $scope.progress = false;
                toastr.clear();
                toastr.error(
                  "Veuillez renseigner les Nbr de contenants, les Quantités unités	et les Poids moyen (Kg)", {
                    closeButton: true,
                  }
                );
              }
            } else {
              $scope.progress = false;
              toastr.clear();
              toastr.error(
                await translatedwords.getTranslatedWord(
                  $translate("Veuillez renseigner au moins un produit")
                ), {
                  closeButton: true,
                }
              );
            }
          } else {
            $scope.progress = false;
            toastr.clear();
            toastr.error(
              await translatedwords.getTranslatedWord(
                $translate("Veuillez renseigner tous les champs obligatoires")
              ), {
                closeButton: true,
              }
            );
          }
        };

        //add code
        $scope.addMarque = function() {
          $mdDialog
            .show({
              controller: DialogControllerAddMarque,
              templateUrl: "././views/templates/expedition/AddMarque.html",
              parent: angular.element(document.body),
              targetEvent: "ev",
              clickOutsideToClose: false,
            })
            .then(
              function(answer) {
                $scope.AllMarque = answer;
              },
              function() {
                $scope.status = "You cancelled the dialog.";
              }
            );
        };

        //add code
        function DialogControllerAddMarque($scope, $mdDialog) {
          $scope.AjouterMarque = async function() {
            toastr.clear();
            if ($scope.Marque) {
              pc.objNewCode = {
                Marque: $filter("textforsqlserver")($scope.Marque),
                Code: $scope.Code ?
                  $filter("textforsqlserver")($scope.Code) : "",
              };
              expeditions
                .createmarque(pc.objNewCode)
                .then(async (e) => {
                  if (e.data[0].message == "ajout reussi") {
                    //validate success
                    toastr.clear();
                    toastr.info(
                      await translatedwords.getTranslatedWord(
                        $translate("Ajout reussi")
                      ), {
                        closeButton: true,
                      }
                    );
                    NProgress.done();
                    $scope.AllMarque = expeditions
                      .getAllMarque()
                      .then((result) => {
                        NProgress.done();
                        $mdDialog.hide(result.data);
                      });
                  } else {
                    toastr.clear();
                    if (e.data[0].description.includes("duplicate key")) {
                      toastr.error(
                        await translatedwords.getTranslatedWord(
                          $translate(
                            "Veuillez noter que cette Marque existe déjà !"
                          )
                        ), {
                          closeButton: true,
                        }
                      );
                    } else {
                      toastr.error(
                        (await translatedwords.getTranslatedWord(
                          $translate("an error occured ")
                        )) + e.data[0].description, {
                          closeButton: true,
                        }
                      );
                    }
                    NProgress.done();
                  }
                })
                .catch(async (e) => {
                  toastr.clear();
                  toastr.error(e.data, {
                    closeButton: true,
                  });
                });
            } else {
              toastr.clear();
              toastr.error(
                await translatedwords.getTranslatedWord(
                  $translate("Veuillez renseigner tous les champs obligatoires")
                ), {
                  closeButton: true,
                }
              );
            }
          };

          $scope.AnnulerMarque = function() {
            $mdDialog.cancel();
            document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
          };
        }

        $scope.hideAvancer = function() {
          $mdDialog.hide();
          document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
        };

        $scope.Annuler = function() {
          $mdDialog.cancel();
          document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
        };
      }

      pc.edit = function(data) {
        $mdDialog
          .show({
            controller: DialogControllerEditExpedition,
            templateUrl: "././views/templates/expedition/EditExpedition.html",
            parent: angular.element(document.body),
            targetEvent: "ev",
            clickOutsideToClose: false,
            hasBackdrop: true,
            escapeToClose: false,
            locals: {
              data: data,
            },
          })
          .then(
            function(answer) {},
            function() {}
          );
      };

      //Add AddAnalyse
      function DialogControllerEditExpedition($scope, $mdDialog, data) {



        $scope.administrator = pc.isAdmin;

        $scope.data = data;
        $scope.DateExp = $scope.data.DATE ?
          new Date(moment($scope.data.DATE).format("YYYY-MM-DD")) :
          null;
        $scope.Heuredepart = moment($scope.data.Heuredepart)
          .second(0)
          .milliseconds(0)
          .toDate();
        $scope.data.Drencher =
          $scope.data.Drencher == true ||
          $scope.data.Drencher == 1 ||
          $scope.data.Drencher == "1" ?
          1 :
          0;
        $scope.DateCueillette = $scope.data.DateCueillette ?
          new Date(moment($scope.data.DateCueillette).format("YYYY-MM-DD")) :
          null;
        $scope.HeureCueillette = moment($scope.data.HeureCueillette)
          .second(0)
          .milliseconds(0)
          .toDate();
        $scope.data.ProgrammeSpecial =
          $scope.data.ProgrammeSpecial == true ||
          $scope.data.ProgrammeSpecial == 1 ||
          $scope.data.ProgrammeSpecial == "1" ?
          1 :
          0;

        function pad(num, size) {
          var s = num + "";
          while (s.length < size) s = "0" + s;
          return s;
        }

        $scope.foodTraitement = [];
        $q.all([
          expeditions.getallClient(),
          expeditions.gettraitementbyexp({
            IDEXPEDITION: $scope.data.id,
          }),
          NiveauColorationService.getColoration(_url),
          Ouviers.getChefCueilletteByFerme(_url, {
            IDFerme: pc.IDFERME,
          }),
        ]).then((values) => {
          NProgress.done();
          $scope.AllClients = values[0].data;

          angular.forEach(values[1].data, function(value, key) {
            $scope.foodTraitement.push({
              DAR: value.DAR,
              DATE_Ordre: value.DATE_Ordre ?
                new Date(moment(value.DATE_Ordre).format("YYYY-MM-DD")) : null,
              Dose: value.Dose,
              IDTraitement: value.IDTraitement,
              Matiere_active: value.Matiere_active,
              Nom_commercial: value.Nom_commercial,
              Ref_traitement: value.Ref_traitement,
              IDProduit: value.IDProduit,
              uniteDose: value.uniteDose,
            });
          });
          //$scope.colorations = values[2].data;
          $scope.chefs_cueillette = values[3].data;

          $scope.letmeclick = true;
        });
        $scope.colorations = ["Rouge", "Orange", "Vert"]

        $scope.nbrjour = 30;

        $scope.nodata = async function(index) {
          var confirm = $mdDialog
            .confirm()
            .title(
              "Aucun traitement realisé n'a été trouvé  avant le " +
              moment($scope.DateExp).format("DD/MM/YYYY")
            )
            .textContent("")
            .ariaLabel("Lucky day")
            .ok(await translatedwords.getTranslatedWord($translate("Ok")));

          $mdDialog.show(confirm.multiple(true)).then(
            function() {
              //ok
            },
            function() {
              //cancel
            }
          );
        };
        $scope.ifoundNew = false;
        $scope.chargelasttraitement = () => {
          if ($scope.nbrjour > 0) {
            expeditions
              .getlasttraitement({
                IDEXPEDITION: $scope.data.id,
                DOMAINE: pc.IDFERME,
                DATE: moment($scope.DateExp).format("YYYYMMDD"),
                NBRJOUR: $scope.nbrjour * -1,
              })
              .then((e) => {
                NProgress.done();
                $scope.lasttraitement = e.data;
                if ($scope.lasttraitement.length == 0) {
                  $scope.nodata();
                } else {
                  $scope.ifoundNew = true;
                }
                angular.forEach($scope.lasttraitement, function(value, key) {
                  $scope.foodTraitement.push({
                    cases: false,
                    DAR: value.DAR,
                    DATE_Ordre: value.DATE_Ordre ?
                      new Date(moment(value.DATE_Ordre).format("YYYY-MM-DD")) : null,
                    Dose: value.Dose,
                    IDTraitement: value.IDTraitement,
                    Matiere_active: value.Matiere_active,
                    Nom_commercial: value.Nom_commercial,
                    Ref_traitement: value.Ref_traitement,
                    IDProduit: value.IDProduit,
                    uniteDose: value.uniteDose,
                    newRow: true
                  });
                });
              })
              .catch(async (e) => {
                toastr.clear();
                toastr.error(
                  (await translatedwords.getTranslatedWord(
                    $translate(
                      "Connexion au serveur perdu, réessayer ultérieurement "
                    )
                  )) + e.data, {
                    closeButton: true,
                  }
                );
              });
          } else {
            toastr.clear();
            toastr.error("Veuillez saisir un nombre entier positif", {
              closeButton: true,
            });
          }
        };

        $scope.Retirer = async function(index) {
          var confirm = $mdDialog
            .confirm()
            .title(
              await translatedwords.getTranslatedWord(
                $translate("Veuillez confirmer la suppression")
              )
            )
            .textContent("")
            .ariaLabel("Lucky day")
            .ok(await translatedwords.getTranslatedWord($translate("Ok")))
            .cancel(
              await translatedwords.getTranslatedWord($translate("Annuler"))
            );

          $mdDialog.show(confirm.multiple(true)).then(
            function() {
              //ok
              $scope.foodTraitement.splice(index, 1);
            },
            function() {
              //cancel
            }
          );
        };

        $scope.checkall = false;

        $scope.toggleAll = function() {
          $scope.checkall = $scope.checkall ? false : true;
          angular.forEach($scope.foodTraitement, function(value, key) {
            if ($scope.checkall) {
              value.cases = true;
            } else {
              value.cases = false;
            }
          });
        };

        $scope.checkifonlypnetrue = function() {
          var ifoundone = 0;
          for (var foodTraitement of $scope.foodTraitement) {
            if (foodTraitement.cases) {
              ifoundone++;
            }
          }
          return ifoundone;
        };

        $scope.Supprimer = async function() {
          var confirm = $mdDialog
            .confirm()
            .title(
              await translatedwords.getTranslatedWord(
                $translate("Veuillez confirmer la suppression")
              )
            )
            .textContent("")
            .ariaLabel("Lucky day")
            .ok(await translatedwords.getTranslatedWord($translate("Ok")))
            .cancel(
              await translatedwords.getTranslatedWord($translate("Annuler"))
            );

          $mdDialog.show(confirm.multiple(true)).then(
            function() {
              //ok
              $scope.foodTraitement = $scope.foodTraitement.filter(function(
                el
              ) {
                return el.cases != true;
              });
            },
            function() {
              //cancel
            }
          );
        };

        $scope.addquiktraitement = () => {
          $scope.foodTraitement.push({
            DAR: null,
            DATE_Ordre: new Date(moment().format("YYYY-MM-DD")),
            Dose: null,
            IDTraitement: null,
            Matiere_active: null,
            Nom_commercial: null,
            Ref_traitement: null,
            IDProduit: null,
            uniteDose: null,
          });
        };

        document.getElementById("filter_form").style.display = "none";
        $scope.progress = false;
        $scope.Ifullscreen = false;

        $scope.Fullscreen = function() {
          if (!$scope.Ifullscreen) {
            $("#model").addClass("fullscreen-dialog");
            document.getElementsByClassName('left_col')[0].style.zIndex = 0;
            $scope.Ifullscreen = true;
          } else {
            $("#model").removeClass("fullscreen-dialog");
            document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
            $scope.Ifullscreen = false;
          }
        };

        async function asyncForEach(array, callback) {
          for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
          }
        }

        $scope.checkTraitementData = function() {
          var ifoundIt = true;
          angular.forEach($scope.foodTraitement, function(value, key) {
            if ((!value.Ref_traitement || !value.DATE_Ordre) && ifoundIt) {
              ifoundIt = false;
            }
          });
          return ifoundIt;
        };

        $scope.Modifier = async function() {
          $scope.progress = true;
          toastr.clear();



          if ($scope.data.Num_bon &&
            $scope.DateExp &&
            $scope.Client &&
            $scope.Heuredepart &&
            $scope.DateCueillette &&
            $scope.HeureCueillette &&
            $scope.Coloration &&
            $scope.data.Temperature >= 0 && $scope.data.Temperature !== null &&
            $scope.Chef_cueillette &&
            $scope.data.nbre_contenant >= 0 && $scope.data.nbre_contenant !== null
          ) {
            if ($scope.checkTraitementData()) {
              pc.objEdit = {
                ID: $scope.data.id,
                Reference: $scope.data.Num_bon,
                Client: $scope.Client,
                DateExp: moment($scope.DateExp).format("YYYYMMDD"),
                Utilisateur: pc.User,
                IDFermes: pc.IDFERME,
                IDUser: pc.IDUser,
                Vehicule: $scope.data.Vehicule,
                Chauffeur: $scope.data.Chauffeur,
                Heuredepart: ($scope.Heuredepart) ? moment($scope.Heuredepart).format('HH:mm') : undefined,
                Drencher: $scope.data.Drencher,
                Observation: $scope.data.observations,
                DateCueillette: $scope.DateCueillette ?
                  moment($scope.DateCueillette).format("YYYYMMDD") : undefined,
                HeureCueillette: ($scope.HeureCueillette) ? moment($scope.HeureCueillette).format('HH:mm') : null,
                ProgrammeSpecial: $scope.data.ProgrammeSpecial,
                IDPersonnel: $scope.Chef_cueillette ?
                  $scope.Chef_cueillette.ID : undefined,
                coloration_pepins: $scope.Coloration,
                //IDNiveau_Coloration: $scope.data.IDNiveau_Coloration,
                Temperature: $scope.data.Temperature,
                nbre_contenant: $scope.data.nbre_contenant,
                Code_compagne: "",
                foodTraitement: $scope.foodTraitement,
              };

              campagneagricole
                .getCodeCampagneByIDSocieteDate({
                  IDSOCIETE: pc.IDSociete,
                  DATE: moment($scope.DateVente).format("YYYYMMDD"),
                })
                .then(async function(result) {
                  NProgress.done();
                  if (result.data.length > 0) {
                    pc.objEdit.Code_compagne = result.data[0].Code_compagne;
                    expeditions
                      .updateexpedition(pc.objEdit)
                      .then(async (e) => {
                        if (e.data[0].message == "ajout reussi") {
                          //validate success
                          toastr.clear();
                          toastr.info(
                            await translatedwords.getTranslatedWord(
                              $translate("Modification réussie")
                            ), {
                              closeButton: true,
                            }
                          );
                          NProgress.done();
                          $mdDialog.hide();
                          document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
                          pc.dtInstance.reloadData();
                        } else {
                          $scope.progress = false;
                          toastr.clear();
                          if (e.data.includes("duplicate key")) {
                            toastr.error(
                              await translatedwords.getTranslatedWord(
                                $translate(
                                  "Veuillez noter que ce bon exist déjà !"
                                )
                              ), {
                                closeButton: true,
                              }
                            );
                          } else {
                            toastr.error(
                              (await translatedwords.getTranslatedWord(
                                $translate("an error occured ")
                              )) + e.data[0], {
                                closeButton: true,
                              }
                            );
                          }
                          NProgress.done();
                        }
                      })
                      .catch(async (e) => {
                        $scope.progress = false;
                        toastr.clear();
                        toastr.error(
                          (await translatedwords.getTranslatedWord(
                            $translate(
                              "Connexion au serveur perdu, réessayer ultérieurement : "
                            )
                          )) + e.data, {
                            closeButton: true,
                          }
                        );
                      });
                  } else {
                    toastr.clear();
                    toastr.error(
                      await translatedwords.getTranslatedWord(
                        $translate(
                          "La date n'appartient a aucune campagne agricole !"
                        )
                      ), {
                        closeButton: true,
                      }
                    );
                    $scope.progress = false;
                  }
                });
            } else {
              $scope.progress = false;
              toastr.clear();
              toastr.error("Veuillez renseigner tous les champs obligatoires", {
                closeButton: true,
              });
            }
          } else {
            $scope.progress = false;
            toastr.clear();
            toastr.error(
              await translatedwords.getTranslatedWord(
                $translate("Veuillez renseigner tous les champs obligatoires")
              ), {
                closeButton: true,
              }
            );
          }
        };

        //add code
        $scope.addMarque = function() {
          $mdDialog
            .show({
              controller: DialogControllerAddMarque,
              templateUrl: "././views/templates/expedition/AddMarque.html",
              parent: angular.element(document.body),
              targetEvent: "ev",
              clickOutsideToClose: false,
            })
            .then(
              function(answer) {
                $scope.AllMarque = answer;
              },
              function() {
                $scope.status = "You cancelled the dialog.";
              }
            );
        };

        //add code
        function DialogControllerAddMarque($scope, $mdDialog) {
          $scope.AjouterMarque = async function() {
            toastr.clear();
            if ($scope.Marque) {
              pc.objNewCode = {
                Marque: $filter("textforsqlserver")($scope.Marque),
                Code: $scope.Code ?
                  $filter("textforsqlserver")($scope.Code) : "",
              };
              expeditions
                .createmarque(pc.objNewCode)
                .then(async (e) => {
                  if (e.data[0].message == "ajout reussi") {
                    //validate success
                    toastr.clear();
                    toastr.info(
                      await translatedwords.getTranslatedWord(
                        $translate("Ajout reussi")
                      ), {
                        closeButton: true,
                      }
                    );
                    NProgress.done();
                    $scope.AllMarque = expeditions
                      .getAllMarque()
                      .then((result) => {
                        NProgress.done();
                        $mdDialog.hide(result.data);
                      });
                  } else {
                    toastr.clear();
                    if (e.data[0].description.includes("duplicate key")) {
                      toastr.error(
                        await translatedwords.getTranslatedWord(
                          $translate(
                            "Veuillez noter que cette Marque existe déjà !"
                          )
                        ), {
                          closeButton: true,
                        }
                      );
                    } else {
                      toastr.error(
                        (await translatedwords.getTranslatedWord(
                          $translate("an error occured ")
                        )) + e.data[0].description, {
                          closeButton: true,
                        }
                      );
                    }
                    NProgress.done();
                  }
                })
                .catch(async (e) => {
                  toastr.clear();
                  toastr.error(e.data, {
                    closeButton: true,
                  });
                });
            } else {
              toastr.clear();
              toastr.error(
                await translatedwords.getTranslatedWord(
                  $translate("Veuillez renseigner tous les champs obligatoires")
                ), {
                  closeButton: true,
                }
              );
            }
          };

          $scope.AnnulerMarque = function() {
            $mdDialog.cancel();
            document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
          };
        }

        $scope.hideAvancer = function() {
          $mdDialog.hide();
          document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
        };

        $scope.Annuler = function() {
          $mdDialog.cancel();
          document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
        };
      }

      $scope.searchByType = function(type_text) {
        pc.dtInstance.DataTable.search(type_text).draw();
      };


      pc.printdetails = async function(expeditionByID) {
        //alert(expeditionByID);
        pc.Code_compagne_exp = "";
        campagneagricole
          .CheckCodeCompagnebyTwoDates({
            date_debut: moment(expeditionByID.DATE).format("YYYYMMDD"),
            IDSOCIETE: pc.IDSociete,
          })
          .then(async (e) => {
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
            //header


            mywindow.document.write(
              `<center>${await logo.getlogobyclient(_appFor)}</center>`
            );

            mywindow.document.write(
              "<center>BON DE LIVRAISON VERGER - STATION</center>" +
              "<center>N° : .......... / " +
              pc.Code_compagne_exp +
              "</center>" +
              "<bn>" +
              '<span style="float: left">Domaine : ' +
              pc.NomFerme + " " + pc.reference_producteur +
              "<br/></span>" +
              '<span style="float: right">GGN : ' +
              (pc.Fax ? pc.Fax : "") +
              "<br/>CCPB : ..................</span>" +
              "</bn>"
            );

            mywindow.document.write("<br/>");
            mywindow.document.write("<br/>");
            mywindow.document.write("<br/>");

            mywindow.document.write(
              '<table border="0" style="background:#e0efda;right: 0;width:100%" ><tr><td><center>Client : ' +
              expeditionByID.ClientSociete +
              "</center></td></tr></table>"
            );
            mywindow.document.write("<br/>");


            mywindow.document.write(
              '<table border="1"  style="width:100%;" >' +
              "<tr>" +
              "<td>N° de bon</td>" +
              "<td>Date</td>" +
              "<td>Véhicule</td>" +
              "<td>Chauffeur</td>" +
              "<td>Date de sortie </td>" +
              "</tr>" +
              "<tr>" +
              "<td>" + expeditionByID.Num_bon + "</td>" +
              "<td>" + dateFeri + "</td>" +
              "<td>  " + (expeditionByID.Vehicule ? expeditionByID.Vehicule : "") + "</td>" +
              "<td>" + (expeditionByID.Chauffeur ? expeditionByID.Chauffeur : "") + "</td>" +
              "<td>" + dateFeri + "</td>" +
              "</tr>" +
              "</table>"
            );


            mywindow.document.write("<br/>");
            $("table").attr("border", "1");
            $("table").width("100%");
            $("td").width("100%");
            $("th").width("100%");
            mywindow.document.write(
              document.getElementById("tab_1111").innerHTML
            );

            if (pc.expeditionByID.type == 2) {
              mywindow.document.write("<br/>");
              $("table").attr("border", "1");
              $("table").width("100%");
              $("td").width("100%");
              $("th").width("100%");
              if ($scope.typegroup == 0) {
                mywindow.document.write(
                  document.getElementById("tab_5").innerHTML
                );
              } else if ($scope.typegroup == 1) {
                mywindow.document.write(
                  document.getElementById("tab_2").innerHTML
                );
              } else if ($scope.typegroup == 2) {
                mywindow.document.write(
                  document.getElementById("tab_3").innerHTML
                );
              } else if ($scope.typegroup == 3) {
                mywindow.document.write(
                  document.getElementById("tab_4").innerHTML
                );
              }

              $("table").attr("border", "0");
            }

            $("table").attr("border", "1");
            $("table").width("100%");
            $("td").width("100%");
            $("th").width("100%");

            mywindow.document.write("<br/>");
            mywindow.document.write(
              document.getElementById("tab_66").innerHTML
            );
            mywindow.document.write("<br/>");
            mywindow.document.write(
              document.getElementById("tab_77").innerHTML
            );

            $("table").attr("border", "1");
            $("table").width("100%");
            $("td").width("100%");
            $("th").width("100%");

            mywindow.document.write("<br/>");
            //fert infos
            /*var observation = expeditionByID.observations ?
              expeditionByID.observations :
              "";
            mywindow.document.write(
              '<table border="0" style="width:100%;" >' +
              "<tr>" +
              '<td style="width:100%%;">Observation<br/><textarea rows="5" style="width: 100%">' +
              observation +
              "</textarea></td>" +
              "</tr>" +
              "</table>"
            );*/

            mywindow.document.write(
              '<div style="display:inline-block; text-align:left; float: left; margin-right: auto; margin-left: 0;">' +
              document.getElementById("expeditionQr").innerHTML +
              "<p>Traçabilité Qr Code<p></div>"
            );

            mywindow.document.write(
              '<div style="display:inline-block; text-align:right; float: right; margin-left: auto; margin-right: 0;">' +
              document.getElementById("traitementQr").innerHTML +
              "<p>Traitement Qr Code</p></div>"
            );

            //mywindow.document.write(document.getElementById("sss").innerHTML);
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