'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:TableaudebordTechniqueTabsTbTechniqueTraitementphytosanitaireCtrl
 * @description
 * # TableaudebordTechniqueTabsTbTechniqueTraitementphytosanitaireCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('TableaudebordTechniqueTabsTbTechniqueTraitementphytosanitaireCtrl', function($scope, translatedwords, campagneagricole, $window, $http, $translatePartialLoader, $translate, $cookies, $q, $rootScope, tbTechnique, domaine) {
    moment.locale('fr');
    var pc = this;
    pc.IDferme = $cookies.getObject('globals').ferme.IDFerme;
    pc.NomFerme = $cookies.getObject('globals').ferme.NomFerme;
    pc.IDSOCIETE = $cookies.getObject('globals').ferme.IDSociete;
    pc.obj = {
      "FERME": pc.IDferme,
      "IDSOCIETE": pc.IDSOCIETE,
      "DateDebut": moment().subtract(6, "days").format("YYYYMMDD"),
      "DateFin": moment().format("YYYYMMDD")
    }
    pc.objFerme = {
      "IDFermes": pc.IDferme
    };
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.legendColor = [{
      "Couleur": "#ff0101",
      "Categorie": "Multi-catégorie"
    }]

    $rootScope.$on('broadcastDashboard', function(event, data) {
      $scope.tb_technique_traitementPhytosanitaire_CarteApplicationsPhytosanitaires = data.tb_technique_qualite_TableauSuiviQualiteCulture;
    })

    setTimeout(function() {
      $('.selectpicker').selectpicker({
        dropupAuto: false
      });
      $("#compagne").selectpicker('refresh');

    }, 1000);

    $q.all([campagneagricole.getCampagneAgricoleByIDSociete($cookies.getObject('globals').ferme.IDSociete)]).then(function(values) {
      pc.compagne_array = values[0].data;
      NProgress.done();
      setTimeout(function() {
        $('.selectpicker').selectpicker({
          dropupAuto: false
        });
        $('.selectpicker').selectpicker({
          dropupAuto: false
        });
      }, 1000);
    });

    pc.search = () => {
      $q.all([tbTechnique.getCarteDesApplicationsPhytosanitaires(pc.obj), domaine.DomaineByID(pc.objFerme)]).then(function(values) {
        pc.CarteDesApplicationsPhytosanitaires = values[0].data;
        pc.MyFerme = values[1].data;
        pc.setInitialMap(pc.CarteDesApplicationsPhytosanitaires, pc.MyFerme);
        NProgress.done();
      });
    }


    //costum map vars
    var markerGroups = {
      "parcelle": []
    };

    var infoWindow = new google.maps.InfoWindow({
      maxWidth: 500
    });

    var customIcons = {
      ferme: {
        icon: "././images/parcelle.png"
      }
    };

    var parcelletraiter = {
      url: "././images/marker-green-parcelle.png", // url
      scaledSize: new google.maps.Size(60, 50)
    };

    var parcelleencourstraiter = {
      url: "././images/marker-orange.png", // url
      scaledSize: new google.maps.Size(60, 50)
    };

    var parcellenonencoretraiter = {
      url: "././images/marker-red-danger.png", // url
      scaledSize: new google.maps.Size(60, 50)
    };

    var shapes = [];
    var IO = {
      OUT: function(arr, //array containg the stored shape-definitions
        map, //map where to draw the shapes
        color_ligne, //couleur de ligne du polygne
        color_calque, //couleur de calque du polygne
        mydata
      ) {
        var goo = google.maps,
          map = map || null,
          shape, tmp;
        if (arr) {
          for (var i = 0; i < arr.length; i++) {
            shape = arr[i];

            switch (shape.type) {
              case 'CIRCLE':
                tmp = new goo.Circle({
                  radius: Number(shape.radius),
                  center: this.pp_.apply(this, shape.geometry),
                  strokeColor: color_ligne,
                  strokeOpacity: 1,
                  strokeWeight: 1,
                  fillColor: color_calque,
                  fillOpacity: 0.50
                });
                break;
              case 'MARKER':
                tmp = new goo.Marker({
                  position: this.pp_.apply(this, shape.geometry),
                  strokeColor: color_ligne,
                  strokeOpacity: 1,
                  strokeWeight: 1,
                  fillColor: color_calque,
                  fillOpacity: 0.50
                });
                break;
              case 'RECTANGLE':
                tmp = new goo.Rectangle({
                  bounds: this.bb_.apply(this, shape.geometry),
                  strokeColor: color_ligne,
                  strokeOpacity: 1,
                  strokeWeight: 1,
                  fillColor: color_calque,
                  fillOpacity: 0.50
                });
                break;
              case 'POLYLINE':
                tmp = new goo.Polyline({
                  path: this.ll_(shape.geometry),
                  strokeColor: color_ligne,
                  strokeOpacity: 1,
                  strokeWeight: 1,
                  fillColor: color_calque,
                  fillOpacity: 0.50
                });
                break;
              case 'POLYGON':
                tmp = new goo.Polygon({
                  paths: this.mm_(shape.geometry),
                  strokeColor: color_ligne,
                  strokeOpacity: 1,
                  strokeWeight: 1,
                  fillColor: color_calque,
                  fillOpacity: 0.50,
                  data: mydata
                });
                break;
            }
            tmp.setValues({
              map: map,
              id: shape.id
            })
            shapes.push(tmp);
          }
        }
        return shapes;
      },
      l_: function(path, e) {
        path = (path.getArray) ? path.getArray() : path;
        if (e) {
          return google.maps.geometry.encoding.encodePath(path);
        } else {
          var r = [];
          for (var i = 0; i < path.length; ++i) {
            r.push(this.p_(path[i]));
          }
          return r;
        }
      },
      ll_: function(path) {
        if (typeof path === 'string') {
          return google.maps.geometry.encoding.decodePath(path);
        } else {
          var r = [];
          for (var i = 0; i < path.length; ++i) {
            r.push(this.pp_.apply(this, path[i]));
          }
          return r;
        }
      },

      m_: function(paths, e) {
        var r = [];
        paths = (paths.getArray) ? paths.getArray() : paths;
        for (var i = 0; i < paths.length; ++i) {
          r.push(this.l_(paths[i], e));
        }
        return r;
      },
      mm_: function(paths) {
        var r = [];
        for (var i = 0; i < paths.length; ++i) {
          r.push(this.ll_.call(this, paths[i]));

        }
        return r;
      },
      p_: function(latLng) {
        return ([latLng.lat(), latLng.lng()]);
      },
      pp_: function(lat, lng) {
        return new google.maps.LatLng(lat, lng);
      },
      b_: function(bounds) {
        return ([this.p_(bounds.getSouthWest()),
          this.p_(bounds.getNorthEast())
        ]);
      },
      bb_: function(sw, ne) {
        return new google.maps.LatLngBounds(this.pp_.apply(this, sw),
          this.pp_.apply(this, ne));
      },
      t_: function(s) {
        var t = ['CIRCLE', 'MARKER', 'RECTANGLE', 'POLYLINE', 'POLYGON'];
        for (var i = 0; i < t.length; ++i) {
          if (s === google.maps.drawing.OverlayType[t[i]]) {
            return t[i];
          }
        }
      }

    }

    var map,
      markers,
      byId = function(s) {
        return document.getElementById(s)
      },
      clearShapes = function() {
        for (var i = 0; i < shapes.length; ++i) {
          shapes[i].setMap(null);
        }
        shapes = [];
      },
      clearMarkers = function() {
        for (var i = 0; i < markerGroups['parcelle'].length; i++) {
          markerGroups['parcelle'][i].setMap(null);
        }
      };
    var markersArray = [];


    pc.checklatlng = function(lat, lng) {
      if (lat !== 0 && lng !== 0 && lat != null && lng != null && lat !== "0" && lng !== "0" && lat !== "" && lng !== "")
        return true;
      return false;
    }

    pc.getAllProduits = (data, parcelle) => {
      var produits = "";
      angular.forEach(data, function(value, key) {
        if (value.Ref == parcelle) {
          produits += value.Designation + ", ";
        }
      })
      return produits;
    }
    //first loading map
    pc.isettingup = false;
    pc.setInitialMap = function(dataparcelle, dataferme) {
      infoWindow.close(map);
      //clear markers
      clearMarkers();

      //clear shapes
      clearShapes();

      if (!pc.isettingup) {
        map = new google.maps.Map(document.getElementById("map"), {
          mapTypeControl: false,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          fullscreenControl: false
        });

        var filterDev = document.getElementById('filterDev');
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(filterDev);
        document.getElementById("filterDev").style.display = 'block';

        var legend = document.getElementById('legend');
        map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(legend);
        document.getElementById("legend").style.display = 'block';
      }

      pc.isettingup = true;


      new google.maps.event.addListener(map, 'zoom_changed', function() {
        var zoomm = map.getZoom();
        if (zoomm >= 8) {
          map.setMapTypeId(google.maps.MapTypeId.HYBRID);
        } else {
          var mapStyles = [{
            featureType: "administrative.country",
            stylers: [{
              visibility: "off"
            }]
          }];
          var mapType = new google.maps.StyledMapType(mapStyles, {
            name: "Maroc"
          });
          //map = new google.maps.Map(document.getElementById("map"), mapOptions);
          map.mapTypes.set('maroc', mapType);
          map.setMapTypeId('maroc');
        }
      });

      var mydata = [];
      var dataonebyone = {};


      $scope.firstLat = 0;
      $scope.firstLng = 0;
      //set center map & zoom
      if (dataferme.length > 0 && pc.checklatlng(dataferme[0].Latitude !== 0, dataferme[0].Longitude)) {
        var lllat = dataferme[0].Latitude;
        var lllng = dataferme[0].Longitude;
        var zoooom = 17;
      } else if (dataparcelle.length > 0 && pc.checklatlng(dataparcelle[0].LatPosition !== 0, dataparcelle[0].LngPosition)) {
        var lllat = dataparcelle[0].LatPosition;
        var lllng = dataparcelle[0].LngPosition;
        var zoooom = 17;
      } else {
        var lllat = 33.9691409;
        var lllng = -6.9273709;
        var zoooom = 4;
      }

      map.setCenter(new google.maps.LatLng(lllat, lllng));
      map.setZoom(zoooom);

      angular.forEach(dataparcelle, function(value, key) {

        var calque = "";

        if (value.rn == 1) {
          dataonebyone = {
            'Ref_traitement': value.Ref_traitement,
            'Designation': value.Designation,
            'Categorie': value.Categorie,
            'Date': value.Date ? moment(value.Date).format("DD/MM/YYYY") : "",
            'Bouille_realise': (value.Bouille_realise) ? value.Bouille_realise.toFixed(2) : 0,
            'Sup': (value.Sup) ? value.Sup.toFixed(2) : 0,
            'REF_Parcelle': value.Ref,
            'lat': value.LatPosition,
            'lng': value.LngPosition,
            'Variete': value.Variete,
            'type': 'parcelle',
            "nbrSousCategorie": value.nbrSousCategorie,
            "nbrSousDesignation": value.nbrSousDesignation
          }



          mydata.push(dataonebyone);

          if (value.TokenPolygone !== "") {
            if (value.nbrSousDesignation == 1) {
              //should values.calqueCategorie
              calque = (value.calqueCategorie) ? value.calqueCategorie : '#FFFFFF';
              pc.legendColor.push({
                "Couleur": (value.calqueCategorie) ? value.calqueCategorie : '#FFFFFF',
                "Categorie": value.Categorie
              })
            } else {
              if (value.nbrSousCategorie > 1) {
                calque = "#c72a2a";
              } else {
                //should values.calqueCategorie
                calque = (value.calqueCategorie) ? value.calqueCategorie : '#FFFFFF';
                pc.legendColor.push({
                  "Couleur": (value.calqueCategorie) ? value.calqueCategorie : '#FFFFFF',
                  "Categorie": value.Categorie
                })
              }
            }
            IO.OUT(JSON.parse(value.TokenPolygone), map, calque, calque, dataonebyone);
          }

        }
      });

      for (var i = 0; i < shapes.length; i++) {
        google.maps.event.addListener(shapes[i], 'click', function() {
          var contentString = "name";

          var point = new google.maps.LatLng(
            parseFloat(this.data.lat),
            parseFloat(this.data.lng));
          var type = this.data.type;
          var REF_Parcelle = this.data.REF_Parcelle;
          var Sup = this.data.Sup;
          var Variete = this.data.Variete;
          var Ref_traitement = this.data.Ref_traitement;
          var Date = this.data.Date;
          var Bouille_realise = this.data.Bouille_realise;
          var Produits = pc.getAllProduits(dataparcelle, REF_Parcelle);
          var html = "<center><b>Parcelle culturale</b></center>";
          html += "<table>";
          html += "<tr><td>Référence</td><td>&nbsp;&nbsp;&nbsp;&nbsp</td>";
          html += "<td>" + REF_Parcelle + "</td></tr>";

          html += "<tr><td>Superficie</td><td>&nbsp;&nbsp;&nbsp;&nbsp</td>";
          html += "<td>" + Sup + " Ha</td></tr>";

          html += "<tr><td>Variété</td><td>&nbsp;&nbsp;&nbsp;&nbsp</td>";
          html += "<td>" + Variete + "</td></tr>";

          html += "<tr><td>Position</td><td>&nbsp;&nbsp;&nbsp;&nbsp</td>";
          html += "<td>(" + this.data.lat + ", " + this.data.lng + ")</td></tr>";

          html += "</table>";

          html += "<br/><center> <b>Traitement</b> </center>";
          html += "<table>";
          html += "<tr><td>Référence (N°Traitement)</td><td>&nbsp;&nbsp;&nbsp;&nbsp</td>";
          html += "<td>" + Ref_traitement + "</td></tr>";

          html += "<tr><td>Date du traitement</td><td>&nbsp;&nbsp;&nbsp;&nbsp</td>";
          html += "<td>" + Date + "</td></tr>";

          html += "<tr><td>Bouillie réalisée</td><td>&nbsp;&nbsp;&nbsp;&nbsp</td>";
          html += "<td>" + Bouille_realise + "</td></tr>";

          html += "<tr><td>Produits</td><td>&nbsp;&nbsp;&nbsp;&nbsp</td>";
          html += "<td>" + Produits + "</td></tr>";
          html += "</table>";
          infoWindow.setContent(html);
          infoWindow.setPosition(point);
          infoWindow.open(map);
        });
      }

      /*for (var i = 0; i < mydata.length; i++) {

        var type = mydata[i].type;
        var REF_Parcelle = mydata[i].REF_Parcelle;
        var Sup = mydata[i].Sup;
        var Variete = mydata[i].Variete;
        var Ref_traitement = mydata[i].Ref_traitement;
        var Date = mydata[i].Date;
        var Bouille_realise = mydata[i].Bouille_realise;
        var Produits = pc.getAllProduits(dataparcelle, REF_Parcelle);
        var point = new google.maps.LatLng(
          parseFloat(mydata[i].lat),
          parseFloat(mydata[i].lng));

        var marker = new google.maps.Marker({
          map: map,
          position: point,
          icon: parcelletraiter,
          type: type,
          label: {
            text: "pourcentageSup",
            color: "green",
            fontSize: "14px",
            fontWeight: "bold"
          },
          title: "Parcelle : " + REF_Parcelle
        });

        if (!markerGroups[type])
          markerGroups[type] = [];
        markerGroups[type].push(marker);

        var html = "<center>Parcelle culturale</center>";
        html += "<br/> Référence : " + REF_Parcelle;
        html += "<br/> Superficie : " + Sup + " Ha";
        html += "<br/> Variété : " + Variete;
        html += "<br/> Position : (" + mydata[i].lat + ", " + mydata[i].lng + ")";
        html += "<br/><br/><center> Traitement </center>";
        html += "<br/> Référence (N°Traitement) : " + Ref_traitement;
        html += "<br/> Date du traitement : " + Date;
        html += "<br/> Bouillie réalisée : " + Bouille_realise;
        html += "<br/> Produits : " + Produits;
        bindInfoWindow(marker, map, infoWindow, html, mydata[i]);

      }*/

      if (map.getZoom() <= 14) {
        var mapStyles = [{
          featureType: "administrative.country",
          stylers: [{
            visibility: "off"
          }]
        }];
        var mapType = new google.maps.StyledMapType(mapStyles, {
          name: "Maroc"
        });
        //map = new google.maps.Map(document.getElementById("map"), mapOptions);
        map.mapTypes.set('maroc', mapType);
        map.setMapTypeId('maroc');
      }

      if (map.getZoom() >= 8) {
        map.setMapTypeId(google.maps.MapTypeId.HYBRID);
      }
    }


    function bindInfoWindow(marker, map, infoWindow, html, mydatasellected) {
      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
      });
    }


    //Fin load Map

    pc.search();

    pc.compagne_change = () => {
      if ($scope.compagne) {

        $("#reportrange_tb_technique span").html(moment($scope.compagne.Date_debut).format('DD/MM/YYYYY') + " - " + moment($scope.compagne.Date_Fin).format('DD/MM/YYYYY'))
        $("#reportrange_tb_technique input").val(moment($scope.compagne.Date_debut).format('DD/MM/YYYYY') + " - " + moment($scope.compagne.Date_Fin).format('DD/MM/YYYYY'))
        $("#reportrange_tb_technique input").trigger("change");

        pc.obj.DateDebut = moment($scope.compagne.Date_debut).format('YYYYMMDD');
        pc.obj.DateFin = moment($scope.compagne.Date_Fin).format('YYYYMMDD');

      }
    }


    $("#reportrange_tb_technique input").change((e) => {
      var periode = $("#reportrange_tb_technique input").val().split(" - ");
      if (periode.length == 1) {
        pc.obj.DateDebut = moment().startOf('year').format('YYYYMMDD');
        pc.obj.DateFin = moment().endOf('year').format('YYYYMMDD');
      } else {
        pc.obj.DateDebut = periode[0];
        pc.obj.DateFin = periode[1];
      }
      pc.legendColor = [{
        "Couleur": "#ff0101",
        "Categorie": "Multi-catégorie"
      }]
      pc.search();
    });

    async function daterange_tb_technique(from, to) {
      to = moment();
      from = moment().subtract(6, "days");
      var range = {
        'Semaine1': [moment().subtract(6, "days"), moment()],
        '15 jours1': [moment().subtract(14, "days"), moment()],
        '1 mois1': [moment().startOf("month"), moment().endOf("month")],
        'Trimestre1': [moment().subtract(2, 'month').startOf("month"), moment().endOf("month")]
      }

      range[await translatedwords.getTranslatedWord($translate("Semaine"))] = range['Semaine1'];
      range[await translatedwords.getTranslatedWord($translate("15 jours"))] = range['15 jours1'];
      range[await translatedwords.getTranslatedWord($translate("1 mois"))] = range['1 mois1'];
      range[await translatedwords.getTranslatedWord($translate("Trimestre"))] = range['Trimestre1'];
      delete range['Semaine1'];
      delete range['15 jours1'];
      delete range['1 mois1'];
      delete range['Trimestre1'];
      if ("undefined" != typeof $.fn.daterangepicker) {
        var a = function(a, b, c) {
            if (c == "Annuel") {
              $("#reportrange_tb_technique span").html(a.format("YYYY"))
              $("#reportrange_tb_technique input").val(a.format("YYYY"))
              $("#reportrange_tb_technique input").trigger("change");
            } else {
              $("#reportrange_tb_technique span").html(a.format("DD/MM/YYYY") + " - " + b.format("DD/MM/YYYY"))
              $("#reportrange_tb_technique input").val(a.format("YYYYMMDD") + " - " + b.format("YYYYMMDD"))
              $("#reportrange_tb_technique input").trigger("change");
            }
          },
          b = {
            startDate: moment().subtract(6, "days"),
            endDate: moment(),
            showDropdowns: !0,
            showWeekNumbers: !0,
            timePicker: !1,
            timePickerIncrement: 1,
            timePicker12Hour: !0,
            ranges: range,
            opens: "left",
            buttonClasses: ["btn btn-default"],
            applyClass: "btn-small btn-primary",
            cancelClass: "btn-small",
            format: "DD/MM/YYYY",
            separator: await translatedwords.getTranslatedWord($translate(" à ")),
            locale: {
              applyLabel: await translatedwords.getTranslatedWord($translate("Valider")),
              cancelLabel: await translatedwords.getTranslatedWord($translate("Vider")),
              fromLabel: await translatedwords.getTranslatedWord($translate("De")),
              toLabel: await translatedwords.getTranslatedWord($translate("à")),
              customRangeLabel: await translatedwords.getTranslatedWord($translate("Personnalisée")),
              daysOfWeek: [await translatedwords.getTranslatedWord($translate("Lun")),
                await translatedwords.getTranslatedWord($translate("Mar")),
                await translatedwords.getTranslatedWord($translate("Mer")),
                await translatedwords.getTranslatedWord($translate("Jeu")),
                await translatedwords.getTranslatedWord($translate("Ven")),
                await translatedwords.getTranslatedWord($translate("Sam")),
                await translatedwords.getTranslatedWord($translate("Dim"))
              ],
              monthNames: [await translatedwords.getTranslatedWord($translate("Janvier")),
                await translatedwords.getTranslatedWord($translate("février")),
                await translatedwords.getTranslatedWord($translate("mars")),
                await translatedwords.getTranslatedWord($translate("avril")),
                await translatedwords.getTranslatedWord($translate("mai")),
                await translatedwords.getTranslatedWord($translate("juin")),
                await translatedwords.getTranslatedWord($translate("juillet")),
                await translatedwords.getTranslatedWord($translate("août")),
                await translatedwords.getTranslatedWord($translate("septembre")),
                await translatedwords.getTranslatedWord($translate("octobre")),
                await translatedwords.getTranslatedWord($translate("novembre")),
                await translatedwords.getTranslatedWord($translate("décembre"))
              ],
              firstDay: 1
            }
          };
        $("#reportrange_tb_technique span").html(moment().subtract(6, "days").format("DD/MM/YYYY") + " - " + moment().format("DD/MM/YYYY")), $("#reportrange_tb_technique").daterangepicker(b, a), $("#reportrange_tb_technique").on("show.daterangepicker", function() {
          //console.log("show event fired")
        }), $("#reportrange_tb_technique").on("hide.daterangepicker", function() {
          //console.log("hide event fired")
        }), $("#reportrange_tb_technique").on("apply.daterangepicker", function(a, b) {
          //console.log("apply event fired, start/end dates are " + b.startDate.format("MMMM D, YYYY") + " to " + b.endDate.format("MMMM D, YYYY"))
        }), $("#reportrange_tb_technique").on("cancel.daterangepicker", function(a, b) {
          //console.log("cancel event fired")
        }), $("#options1").click(function() {
          $("#reportrange_tb_technique").data("daterangepicker").setOptions(b, a)
        }), $("#options2").click(function() {
          $("#reportrange_tb_technique").data("daterangepicker").setOptions(optionSet2, a)
        }), $("#destroy").click(function() {
          $("#reportrange_tb_technique").data("daterangepicker").remove()
        })
      }
    }

    setTimeout(function() {
      daterange_tb_technique(null, null)
    }, 100);







  });