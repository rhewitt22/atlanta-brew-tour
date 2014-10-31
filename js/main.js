(function() {
  var map, 
    breweries,
    markers,
    source = $("#template").html(),
    template = Handlebars.compile(source),
    $listing = $("#listing"),
    now = new Date(),
    weekday = ["sunday", "monday", "tuesday", "wednesday",  "thursday", "friday", "saturday"],
    today = weekday[now.getDay()];

  function getData() {
    $.getJSON("breweries.geojson", function (data) {
      breweries = data;
      sortBreweries(breweries.features);

      markers = L.geoJson(breweries, {
        // pointToLayer: function (feature, latlng) {
        //   return L.circleMarker(latlng, geojsonMarkerOptions);
        // },
        onEachFeature: function (feature, layer) {
          layer.bindPopup(feature.properties.name);
        }
      });

      createMap();
      $listing.append(template(breweries));
    });
  }

  function createMap() {
    map = L.map('map');
    map.scrollWheelZoom.disable();
    map.fitBounds(markers.getBounds());
    addLayers();
  }

  function addLayers() {
    var toner = L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
      subdomains: 'abcd',
      minZoom: 0,
      maxZoom: 20
    }).addTo(map);

    map.addLayer(markers);
  }
  
  function sortBreweries(breweries){
    // Test to see if the brewery is open today
    $.each(breweries, function(index, value){
      var isOpen = false;
      $.each(value.properties.schedule, function(index,value){
        if (today === value.day) isOpen = true;
      });
  
      value.properties.open = isOpen;
    });
  
    // Show Open breweries at the top of the list
    function sort(prop, arr) {
      prop = prop.split('.');
      var len = prop.length;

      arr.sort(function (a, b) {
          var i = 0;
          while( i < len ) {
              a = a[prop[i]];
              b = b[prop[i]];
              i++;
          }
          if (a < b) {
              return -1;
          } else if (a > b) {
              return 1;
          } else {
              return 0;
          }
      });
      return arr;
    }

    sort('properties.open', breweries).reverse();
  }

  Handlebars.registerHelper('capitalize', function(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  Handlebars.registerHelper('twelve-hour', function(word) {
    words = word.split(":");
    words[0] = (parseInt(words[0]) > 12) ? words[0] - 12 : words[0];
    return words.join(":");
    // return word.charAt(0).toUpperCase() + word.slice(1);
  });

  getData();
})();
