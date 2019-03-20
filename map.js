function formatCSV(data) {
  // Get two first meta data rows
  let info = data.slice(0,2);
  // Remove two first rows from sheet 
  data = data.slice(2,data.length);
  // Get time (given by SMHI as name for value column)
  window.dataTime = data[0][5];
  // Set name on column with values
  data[0][5] = "Value";
  // Trim data sheet
  let dataTrimmed = data.map(function(val){
    return val.slice(0, 6);
  });
  // Remove all stations with no value
  for (var i = 0; i < dataTrimmed.length; i++) {
    if (dataTrimmed[i][5] == "") {
      dataTrimmed.splice(i,1)
      i--;
    }
  }

  window.dataInfo = info.map(e=>e.join(",")).join("\n");
  window.dataCsv = dataTrimmed.map(e=>e.join(",")).join("\n");
}

// Parse csv file to 2D array
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

var csvUrl = "https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/1/station-set/all/period/latest-hour/data.csv";

// Parse and format CSV data from url
parseData(csvUrl, formatCSV);

window.dataCsv = null

// Wait for data processing to finish
var intvl = setInterval(function() {
  // Proceed when data processing is finished
    if (window.dataCsv) { 
        clearInterval(intvl);
        console.log(dataCsv);

var isMac = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? true : false;

        if (!isMac) {
  var BOM = "\ufeff";
  csvData = BOM + csv;
}

var blob = new Blob([dataCsv], {
  encoding: "UTF-8",
  type: "text/csv;charset=UTF-8"
});
var blobUrl = window.URL.createObjectURL(blob);

    require([
    "esri/Map",
    "esri/Color",
    "esri/views/MapView",
    "esri/layers/CSVLayer"
  ], function(Map, Color, SceneView, CSVLayer){


        var template = {
          title: "Temperature latest hour",
          content: "Temperature is {Value}°C at {Stationsnamn}"
    };

    // Create the CSVLayer
    var csvLayer = new CSVLayer({
      //url: "https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/1/station-set/all/period/latest-hour/data.csv"
      //url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.csv",
      //copyright: "USGS Earthquakes"
      url: blobUrl,
      delimiter: ",",
      popupTemplate: template,
      opacity: "0.8"
    });

    // all features in the layer will be visualized with
    // a 6pt black marker symbol and a thin, white outline
    csvLayer.renderer = {
    type: "simple",  // autocasts as new SimpleRenderer()
    symbol: {
      type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
      size: 10,
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
      { value: -20, color: "darkblue" },
      { value: -10, color: "blue" },
      //{ value: -10, color: "cornflowerblue"},
      //{ value: -5, color: "aquamarine" },
      { value: 0, color: "green" },
      //{ value: 5, color: "mediumspringgreen" },
      { value: 10, color: "gold" },
      //{ value: 15, color: "orange" },
      { value: 20, color: "darkorange" },
      { value: 30, color: "red" }
    ]
    };
    csvLayer.renderer.visualVariables = [colorVisVar];

    // Create the Map
    var map = new Map({
      basemap: "osm",
      layers: [csvLayer]
    });

    // Create the SceneView
    var view = new SceneView({
      container: "mapDiv",  // Reference to the scene div created in step 5
      map: map,  // Reference to the map object created before the scene
      zoom: 4,  // Sets zoom level based on level of detail (LOD)
      center: [15, 60]  // Sets center point of view using longitude,latitude
    });

  });

    }
}, 10);






