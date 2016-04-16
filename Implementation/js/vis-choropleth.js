// inspiration from http://www.cartographicperspectives.org/index.php/journal/article/view/cp78-sack-et-al/1359

// --> CREATE SVG DRAWING AREA
var width = 1000,
    height = 600;

var svgmap = d3.select("#map-area").append("svg")
    .attr("width", width)
    .attr("height", height);

// path and projection
var projection = d3.geo.orthographic()
    .translate([width / 2, height / 2])
    .scale(450);
var path = d3.geo.path()
    .projection(projection);

// used to join datasets later
var keyArray = ["At_risk", "At_high_risk", "Suspected_malaria_cases", "Malaria_cases", "UN_population"];
// which key to show (initially 0)
var shown = keyArray[0];

// scale for Malaria cases
var MCscale = d3.scale.ordinal()
    .domain(["Data N/A", "0 - 2.2M", "2.2M - 4.4M", "4.4M - 6.6M", "6.6M - 8.8M", "11.1M - 13.3M", "13.3M - 15.6M", "15.5M - 17.8M", "17.8M - 20M", "20M +"])
    .range([ "#000000", "#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#a63603", "#7f2704" ]);
// Scale for Population
var Pscale = d3.scale.ordinal()
    .domain(["Data N/A", "0 - 6.6M", "6.6M - 13.1M", "13.1M - 19.7M", "19.7M - 26.3M", "26.3M - 32.9M", "32.9M - 46.0M", "46.0M - 52.6M", "52.6M - 59.2M", "59.2M +"])
    .range([ "#000000", "#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#006d2c", "#00441b" ]);
// Scale for At Risk
var ARscale = d3.scale.ordinal()
    .domain(["Data N/A", "0% - 11%", "11% - 22%", "22% - 33%", "33% - 44%", "44% - 56%", "56% - 67%", "67% - 78%", "78% - 89%", "89% - 100%"])
    .range([ "#000000", "#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d" ]);
var CurrentScale = ARscale;

// tooltip
var tip = d3.tip().attr('class', 'd3-tip').offset([0, 0]).html(function(d) {
    var type;
    var percent = "";
    var val;
    // cases
    if (shown == "At_risk"){
        type = "At Risk";
        if(d.properties[shown] == null || isNaN(d.properties[shown])) {
            val = "Data N/A";
        }
        else{
            percent = "%";
            val = d.properties[shown];
        }
    }
    else if (shown == "At_high_risk"){
        type = "At High Risk";
        if(d.properties[shown] == null || isNaN(d.properties[shown])) {
            val = "Data N/A";
        }
        else{
            percent = "%";
            val = d.properties[shown];
        }
    }
    else if (shown == "Suspected_malaria_cases"){
        type = "Suspected Malaria Cases";
        if(d.properties[shown] == null || isNaN(d.properties[shown])) {
            val = "Data N/A";
        }
        else{
            val = commaSeparateNumber(d.properties[shown]);
        }
    }
    else if (shown == "Malaria_cases"){
        type = "Malaria Cases";
        if(d.properties[shown] == null || isNaN(d.properties[shown])) {
            val = "Data N/A";
        }
        else{
            val = commaSeparateNumber(d.properties[shown]);
        }
    }
    else {
        type = "Population";
        if(d.properties[shown] == null || isNaN(d.properties[shown])) {
            val = "Data N/A";
        }
        else{
            val = commaSeparateNumber(d.properties[shown]);
        }
    }
    return "<strong>" + d.properties.name +
        "</strong> <br>" + type + ": " + val + percent;
});


// Use the Queue.js library to read two files
queue()
  .defer(d3.json, "data/africa.topo.json")
  .defer(d3.csv, "data/global-malaria-2015.csv")
  .await(function(error, mapTopJson, malariaDataCsv){

      // --> PROCESS DATA

      // filter only Africa
      malariaDataCsv = malariaDataCsv.filter(function(data) {return data.WHO_region == "African"});

      // convert to numbers
      malariaDataCsv.forEach(function(data){
          data.At_risk = +data.At_risk;
          data.At_high_risk = +data.At_high_risk;
          data.Malaria_cases = +data.Malaria_cases;
          data.Suspected_malaria_cases = +data.Suspected_malaria_cases;
          data.UN_population = +data.UN_population;
      });

      console.log(malariaDataCsv);

      // Convert TopoJSON to GeoJSON (target object = 'countries')
      africa = topojson.feature(mapTopJson, mapTopJson.objects.collection).features;
      console.log(africa);

      // vars to join datasets
      var jsonCountries = mapTopJson.objects.collection.geometries;

      console.log(jsonCountries);

      // loop and join
      for (var i = 0; i < malariaDataCsv.length; i++){
          // current code
          var csvCountries = malariaDataCsv[i];
          var csvCode = csvCountries.Code;

          for (var j = 0; j < jsonCountries.length; j++){
              if (jsonCountries[j].properties.adm0_a3_is == csvCode){
                  for (var key in keyArray){
                      var attr = keyArray[key];
                      var val = parseFloat(csvCountries[attr]);
                      jsonCountries[j].properties[attr] = val;
                  }
                  break;
              }
          }
      }

      // Creat Dropdown
      dropdown(malariaDataCsv);

      // Update choropleth
      updateChoropleth(malariaDataCsv);
  });
    

function updateChoropleth(malariaDataCsv) {

    // --> Choropleth implementation
    var recolorMap = colorscale(malariaDataCsv);

    // Render the U.S. by using the path generator
    svgmap.selectAll("path")
        .data(africa)
        .enter().append("path")
        .attr("d", path)
        .attr("class", "countries")
        .style("fill", function(d) { return choropleth(d, recolorMap)})
        .style("stroke", "#ccc")
        .style("stroke-width", "1px")
        .on('mouseover', tip.show).on('mouseout', tip.hide);
    svgmap.call(tip);

    // Render Legend
    var svg = d3.select("svg");

    svg
        .append("g")
        .attr("class", "legend")
        .attr("transform", "translate(20,20)");

    var legend = d3.legend.color()
        .scale(CurrentScale);

    svg.select(".legend")
        .call(legend);
}


function colorscale(malariaDataCsv) {

    if (shown == "At_risk" || shown == "At_high_risk"){
        var color = d3.scale.quantize()
            .domain([0,100])
            .range(colorbrewer.Reds[9]);
    }
    else if (shown == "Suspected_malaria_cases" || shown == "Malaria_cases"){
        var color = d3.scale.quantize()
            .domain([0, 20000000])
            .range(colorbrewer.Oranges[9]);
    }
    else{
        var color = d3.scale.quantize()
            .domain([0, d3.max( malariaDataCsv, function( d ) { return d.UN_population; } ) / 3] )
            .range(colorbrewer.Greens[9]);
    }

    return color;
}

function choropleth(d, recolorMap) {
    // value
    var value = d.properties[shown];
    if (value) {
        return recolorMap(value);
    }
    else {
        return "#000000";
    }
}

function dropdown(malariaDataCsv) {
    // add elements
    var dropdown = d3.select("#select")
        .append("div")
        .html("<h3>Select Data </h3>")
        .append("select")
        .attr("class", "form-control")
        .on("change", function() {
            shown = this.value;
            if (shown == "At_risk" || shown == "At_high_risk"){
                CurrentScale = ARscale;
            }
            else if (shown == "Suspected_malaria_cases" || shown == "Malaria_cases"){
                CurrentScale = MCscale;
            }
            else{
                CurrentScale = Pscale;
            }

            // Change Legend
            var svg = d3.select("svg");

            svg
                .append("g")
                .attr("class", "legend")
                .attr("transform", "translate(20,20)");
            var legend = d3.legend.color()
                .scale(CurrentScale);

            svg.select(".legend")
                .call(legend);
            changeAttribute(malariaDataCsv);
        });

    // elements
    dropdown.selectAll("options")
        .data(keyArray)
        .enter()
        .append("option")
        .attr("class", "selection")
        .attr("value", function(d) {return d})
        .text(function(d) {
            if ( d == "At_risk"){
                return "At Risk";
            }
            if ( d == "At_high_risk"){
                return "At High Risk";
            }
            if ( d == "Suspected_malaria_cases"){
                return "Suspected Malaria Cases";
            }
            if ( d == "Malaria_cases"){
                return "Malaria Cases";
            }
            if ( d == "UN_population"){
                return "Population";
            }
        });
}

function changeAttribute(malariaDataCsv) {

    // recolor map
    d3.selectAll(".countries")
        .transition()
        .duration(1000)
        .style("fill", function(d) {
            return choropleth(d, colorscale(malariaDataCsv));
        });

}

// http://stackoverflow.com/questions/3883342/add-commas-to-a-number-in-jquery
function commaSeparateNumber(val){
    while (/(\d+)(\d{3})/.test(val.toString())){
        val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    }
    return val;
}

