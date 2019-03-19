function formatCSV(data) {
  data = data.slice(2,data.length);
  data[0][5] = "Value";

  var data = data.map(function(val){
    return val.slice(0, 6);
  });
  

  for (var i = 0; i < data.length; i++) {
    // If no temperature value, remove station
    if (data[i][5] == "") {
      console.log(data[i][5])
      data.splice(i,1)
      i--;
    }
  }

  console.log(data);

  let csvContent = data.map(e=>e.join(",")).join("\n");

  data = Papa.parse(csvContent);

  /*var filtered = csvContent.filter(function (el) {
  return el != null;
  });*/

  console.log(csvContent);
}

function parseData(url, callBack) {
    Papa.parse(url, {
        download: true,
        //dynamicTyping: true,
        skipEmptyLines: true,
        complete: function(results) {
            callBack(results.data);
        }
    });
}

var url = "https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/1/station-set/all/period/latest-hour/data.csv";

parseData(url, formatCSV);


require([
  "esri/Map",
  "esri/Color",
  "esri/views/MapView",
  "esri/layers/TileLayer",
  "esri/layers/CSVLayer"
], function(Map, Color, SceneView, TileLayer, CSVLayer){


      var template = {
        title: "Temperature latest hour",
        content: "Temperature is {Value}°C at {Stationsnamn}"
  };

  // Create the CSVLayer
  var csvLayer = new CSVLayer({
    //url: "https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/1/station-set/all/period/latest-hour/data.csv"
    //url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.csv",
    //copyright: "USGS Earthquakes"
    url: "data.csv",
    delimiter: ",",
    popupTemplate: template,
  });

  // all features in the layer will be visualized with
  // a 6pt black marker symbol and a thin, white outline
  csvLayer.renderer = {
  type: "simple",  // autocasts as new SimpleRenderer()
  symbol: {
    type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
    size: 12,
    color: "black",
    outline: {  // autocasts as new SimpleLineSymbol()
      width: 0,//0.5,
      color: "white"
    }
    }
  };

  const colorVisVar = {
  type: "color",
  field: "Value",
  stops: [
    //{ value: -25, color: "pink" },
    { value: -20, color: "purple" },
    { value: -15, color: "blue" },
    //{ value: -10, color: "cornflowerblue"},
    //{ value: -5, color: "aquamarine" },
    { value: 0, color: "lightgreen" },
    //{ value: 5, color: "mediumspringgreen" },
    { value: 10, color: "yellow" },
    //{ value: 15, color: "orange" },
    { value: 20, color: "darkorange" },
    { value: 25, color: "red" }
  ],
  legendOptions: {
    title: "Temperature"
  }
  };
  csvLayer.renderer.visualVariables = [ colorVisVar ];


  /*
  csvLayer.renderer = {
  type: "heatmap",
  field: "Value",
  colorStops: [
    { ratio: 0, color: "rgba(255, 255, 255, 0)" },
    { ratio: 0.02, color: "rgba(255, 255, 255, 1)" },
    { ratio: 0.05, color: "rgba(255, 140, 0, 1)" },
    { ratio: 0.08, color: "rgba(255, 140, 0, 1)" },
    { ratio: 1, color: "rgba(255, 0, 0, 1)" }
  ],
  minPixelIntensity: 0,
  maxPixelIntensity: 5000
};*/

  // Create the TileLayer
  /*var transportationLayer = new TileLayer({
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer",
    id: "streets",
    opacity: 0.7
  });*/

  // Create the Map
  var map = new Map({
    basemap: "satellite",
    layers: [csvLayer]
  });

  // Create the SceneView
  var view = new SceneView({
    container: "mapDiv",  // Reference to the scene div created in step 5
    map: map,  // Reference to the map object created before the scene
    zoom: 4,  // Sets zoom level based on level of detail (LOD)
    center: [15, 65]  // Sets center point of view using longitude,latitude
  });

});
