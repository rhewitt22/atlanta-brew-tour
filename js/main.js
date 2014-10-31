(function() {
  var map, 
    breweries,
    markers,
    templateScript = $("#template").html(),
    template = Handlebars.compile(templateScript);  
     $listing = $("#listing");

  function getData() {
    $.getJSON("breweries.geojson", function (data) {
      breweries = data;
      markers = L.geoJson(breweries);
      console.log(breweries);

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

  Handlebars.registerHelper('capitalize', function(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  
  getData();
})();
