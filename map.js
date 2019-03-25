function formatCSV(data) {
    // Get two first meta data rows
    let info = data.slice(0, 2);
    // Remove two first rows from sheet 
    data = data.slice(2, data.length);
    // Get time (given by SMHI as header for value column)
    window.csvTime = data[0][5];
    // Set header on value column
    data[0][5] = "Value";
    // Trim data sheet
    let dataTrimmed = data.map(function(val) {
        return val.slice(0, 6);
    });
    // Remove all stations with no value
    for (var i = 0; i < dataTrimmed.length; i++) {
        if (dataTrimmed[i][5] == "") {
            dataTrimmed.splice(i, 1)
            i--;
        }
    }
    window.csvInfo = info.map(e => e.join(",")).join("\n");
    window.csvData = dataTrimmed.map(e => e.join(",")).join("\n");
}

// Parse csv file to 2D array
function parseData(url, callBack) {
    Papa.parse(url, {
        download: true,
        skipEmptyLines: true,
        complete: function(results) {
            callBack(results.data);
        }
    });
}

// Data source URL
var csvUrl = "https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/1/station-set/all/period/latest-hour/data.csv";

// Parse and format CSV data from url
parseData(csvUrl, formatCSV);

window.csvData = null
// Wait for data processing to finish
var intvl = setInterval(function() {
    // Proceed when data processing is finished
    if (window.csvData) {
        clearInterval(intvl);
        console.log(csvData);

        // Check if browsing on Mac
        var isMac = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? true : false;

        if (!isMac) {
            var BOM = "\ufeff";
            csvData = BOM + csvData;
        }

        // Create CSV blob and url
        var csvBlob = new Blob([csvData], {
            encoding: "UTF-8",
            type: "text/csv;charset=UTF-8"
        });
        var csvBlobUrl = window.URL.createObjectURL(csvBlob);

        require([
            "esri/Map",
            "esri/Color",
            "esri/views/MapView",
            "esri/layers/CSVLayer",
            "esri/widgets/Legend"
        ], function(Map, Color, SceneView, CSVLayer, Legend) {

            // Configuration for pop up template
            var template = {
                title: "Temperature latest hour",
                content: "Temperature is {Value}°C at {Stationsnamn}"
            };

            // Create the CSVLayer
            var csvLayer = new CSVLayer({
                title: "Air temperature in Sweden at " + csvTime,
                url: csvBlobUrl,
                delimiter: ",",
                popupTemplate: template,
                opacity: "0.8"
            });

            // Create the CSV layer renderer 
            csvLayer.renderer = {
                type: "simple",
                label: "SMHI Weather Station",
                symbol: {
                    type: "simple-marker", 
                    size: 10,
                    outline: {
                        width: 0
                    }
                }
            };

            // Set color visualization settings
            const colorVisVar = {
                type: "color",
                field: "Value",
                legendOptions: {
                    title: "Degrees Celsius (°C)",
                },
                stops: [{
                        value: -20,
                        color: "darkblue",
                        label: "-20"
                    },
                    {
                        value: -10,
                        color: "darkturquoise",
                        label: "-10"
                    }, ,
                    {
                        value: 0,
                        color: "green",
                        label: "0"
                    },
                    {
                        value: 10,
                        color: "gold",
                        label: "10"
                    },
                    {
                        value: 20,
                        color: "darkorange",
                        label: "20"
                    },
                    {
                        value: 30,
                        color: "red",
                        label: "30"
                    }
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
                container: "mapDiv", // Reference to the scene div
                map: map, // Reference to the map object 
                zoom: 4, // Sets zoom level based on level of detail (LOD)
                center: [20, 63] // Sets center point of view using longitude,latitude
            });

            var legend = new Legend({
                view: view
            });
            view.ui.add(legend, "bottom-right");
        });

    }
}, 10);