require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/TileLayer",
  "esri/layers/CSVLayer"
], function(Map, SceneView, TileLayer, CSVLayer){

  // Create the CSVLayer
  var csvLayer = new CSVLayer({
    //url: "https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/1/station-set/all/period/latest-hour/data.csv"
    //url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.csv",
    //copyright: "USGS Earthquakes"
    url: "data.csv",
    delimiter: ";"
  });

  // all features in the layer will be visualized with
  // a 6pt black marker symbol and a thin, white outline
  csvLayer.renderer = {
  type: "simple",  // autocasts as new SimpleRenderer()
  symbol: {
    type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
    size: 6,
    color: "black",
    outline: {  // autocasts as new SimpleLineSymbol()
      width: 0.5,
      color: "white"
    }
    }
  };

  // Create the TileLayer
  var transportationLayer = new TileLayer({
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer",
    id: "streets",
    opacity: 0.7
  });

  // Create the Map
  var map = new Map({
    basemap: "satellite",
    layers: [transportationLayer, csvLayer]
  });

  // Create the SceneView
  var view = new SceneView({
    container: "mapDiv",  // Reference to the scene div created in step 5
    map: map,  // Reference to the map object created before the scene
    zoom: 4,  // Sets zoom level based on level of detail (LOD)
    center: [15, 65]  // Sets center point of view using longitude,latitude
  });


});
