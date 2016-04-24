// inspiration from http://www.cartographicperspectives.org/index.php/journal/article/view/cp78-sack-et-al/1359
// http://bl.ocks.org/mbostock/2206340

// make slider (http://sujeetsr.github.io/d3.slider/)
// tick formatter
var formatter = d3.format(".0f");
var tickFormatter = function(d) {
    return formatter(d);
<<<<<<< HEAD
}
=======
};
>>>>>>> 564f978766f59732b3fb799dc39ddf3f7cc50aec
var slider = d3.slider().min(1960).max(2015).ticks(10).showRange(true).value(2015).tickFormat(tickFormatter);
// Render the slider in the div
d3.select('#slider').call(slider);

// --> CREATE SVG DRAWING AREA
var width = 960,
    height = 500;

var svgmap = d3.select("#map-area").append("svg")
    .attr("width", width)
    .attr("height", height);

// path and projection
var projection = d3.geo.equirectangular();
var path = d3.geo.path()
    .projection(projection);
// zoom
var zoom = d3.behavior.zoom()
    .translate(projection.translate())
    .scale(projection.scale())
    .scaleExtent([150, 8 * 500])
    .on("zoom", zoomed);

var g = svgmap.append("g")
    .call(zoom);

g.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .style("stroke", "black")
    .style("stroke-width", 1);

// used to join datasets later
var keyArray = ["2011c02", "2014gdp", "2013energy"];
// which key to show (initially 0)
var shown = keyArray[0];
// used to join datasets later

var keyArrayYears = [];
// populate array with years
for (var l = 1960; l <= 2014; l++) {
    keyArrayYears.push(l);
}

// scale for GDP
var GDPscale = d3.scale.ordinal()
    .domain(["Data N/A", "0 - 125M", "125M - 250M", "250M - 375M", "375M - 500M", "500M - 625M", "625M - 750M", "750M - 875M", "875M - 1B", "1B +"])
    .range([ "#ccc", "#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#006d2c", "#00441b" ]);
// Scale for Electricity
var Escale = d3.scale.ordinal()
    .domain(["Data N/A", "0 - 1,250", "1,250- 2,500", "2,500 - 3,750", "3,750 - 5,000", "5,000 - 6,250", "6,250 - 7,500", "7,500 - 8,750", "8,750 - 10,000", "10,000 +"])
    .range([ "#ccc", "#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#a63603", "#7f2704" ]);
// Scale for C02
var C02scale = d3.scale.ordinal()
    .domain(["Data N/A", "0 - 3.125", "3.125 - 6.25", "6.25 - 9.375", "9.375 - 12.5", "12.5 - 15.625", "15.625 - 18.75", "18.75 - 21.875", "21.875 - 25", "25 +"])
    .range([ "#ccc", "#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d" ]);
var CurrentScale = C02scale;

// tooltip
var tipmap = d3.tip().attr('class', 'd3-tip').offset([0, 0]).html(function(d) {
    var type;
    var percent = "";
    var val;
    // cases
    if (shown == "2011c02"){
        type = "CO2 Emissions";
        if(d.properties[shown] == null || isNaN(d.properties[shown])) {
            val = "Data N/A";
        }
        else{
            val = d.properties[shown].toFixed(2);
        }
    }
    else if (shown == "2013energy"){
        type = "Electric Power Consumption)";
        if(d.properties[shown] == null || isNaN(d.properties[shown])) {
            val = "Data N/A";
        }
        else{
            val = commaSeparateNumber(d.properties[shown].toFixed(0));
        }
    }
    else if (shown == "2014gdp"){
        type = "GDP";
        if(d.properties[shown] == null || isNaN(d.properties[shown])) {
            val = "Data N/A";
        }
        else{
            val = "$" + commaSeparateNumber(d.properties[shown].toFixed(0));
        }
    }
    return "<strong>" + d.properties.name +
        "</strong> <br>" + type + ": " + val + percent;
});


// Use the Queue.js library to read multiple files
queue()
  .defer(d3.json, "data/world.geo.json")
    .defer(d3.csv, "data/CO2emissions.csv")
    .defer(d3.csv, "data/GDP.csv")
    .defer(d3.csv, "data/energyuse.csv")
    .defer(d3.csv, "data/Population.csv")
  .await(function(error, mapTopJson, C02DataCsv, GDPDataCsv, energyDataCsv, PopulationDataCsv){

      // --> PROCESS DATA
      C02DataCsv.forEach(function(data){
          for(var j = 1960; j < 2016; j++){
              var jnum = j.toString();
              if(data[jnum] == "")
              {
                  data[jnum] = "N/A";
              }
              else{
                  data[jnum] = +data[jnum];
              }
          }
      });
      GDPDataCsv.forEach(function(data){
          for(var j = 1960; j < 2016; j++){
              var jnum = j.toString();
              if(data[jnum] == "")
              {
                  data[jnum] = "N/A";
              }
              else{
                  data[jnum] = +data[jnum];
              }
          }
      });
      energyDataCsv.forEach(function(data){
          for(var j = 1960; j < 2016; j++){
              var jnum = j.toString();
              if(data[jnum] == "")
              {
                  data[jnum] = "N/A";
              }
              else{
                  data[jnum] = +data[jnum];
              }
          }
      });
      // --> PROCESS DATA
      PopulationDataCsv.forEach(function(data){
          for(var j = 1960; j < 2016; j++){
              var jnum = j.toString();
              if(data[jnum] == "")
              {
                  data[jnum] = "N/A";
              }
              else{
                  data[jnum] = +data[jnum];
              }
          }
      });

      // world global variable
      world = mapTopJson.features;

      // vars to join datasets
      var jsonCountries = world;

      // loop and join C02 data
      for (var i = 0; i < C02DataCsv.length; i++){
          // current code
          var csvCountries = C02DataCsv[i];
          var csvCode = csvCountries.Code;

          for (var j = 0; j < jsonCountries.length; j++){
              if (jsonCountries[j].properties.adm0_a3_is == csvCode){
                  for (var key in keyArrayYears){
                      var attr = keyArrayYears[key];
                      var val = parseFloat(csvCountries[attr]);
                      jsonCountries[j].properties[attr + "c02"] = val;
                  }
                  break;
              }
          }
      }

      // loop and join GDP data
      for (var i = 0; i < GDPDataCsv.length; i++){
          // current code
          var csvCountries = GDPDataCsv[i];
          var csvCode = csvCountries.Code;

          for (var j = 0; j < jsonCountries.length; j++){
              if (jsonCountries[j].properties.adm0_a3_is == csvCode){
                  for (var key in keyArrayYears){
                      var attr = keyArrayYears[key];
                      var val = parseFloat(csvCountries[attr]);
                      jsonCountries[j].properties[attr + "gdp"] = val;
                  }
                  break;
              }
          }
      }

      // loop and join Energy data
      for (var i = 0; i < energyDataCsv.length; i++) {
          // current code
          var csvCountries = energyDataCsv[i];
          var csvCode = csvCountries.Code;

          for (var j = 0; j < jsonCountries.length; j++) {
              if (jsonCountries[j].properties.adm0_a3_is == csvCode) {
                  for (var key in keyArrayYears) {
                      var attr = keyArrayYears[key];
                      var val = parseFloat(csvCountries[attr]);
                      jsonCountries[j].properties[attr + "energy"] = val;
                  }
                  break;
              }
          }
      }
      console.log(jsonCountries);

      // Create Dropdown
      dropdown(jsonCountries);

      // Update choropleth
      updateChoropleth(jsonCountries);
  });
    

function updateChoropleth(jsonCountries) {

    // --> Choropleth implementation
    var recolorMap = colorscale(jsonCountries);

    // Render the World by using the path generator
    g.append("g")
        .selectAll("path")
        .data(world)
        .enter().append("path")
        .attr("d", path)
        .attr("class", "countries")
        .style("fill", function(d) { return choropleth(d, recolorMap)})
        .style("stroke", "#000")
        .style("stroke-width", ".5px")
        .on('mouseover', tipmap.show).on('mouseout', tipmap.hide).on("click", clicked);
    g.call(tipmap);

    // Render Legend, make it so that it has a white box over the map
    var svg = d3.select("svg");
    svg
        .append("rect")
        .attr("width", 109)
        .attr("height", 180)
        .style("stroke", "black")
        .style("fill", "white")
        .style("stroke-width", 1)
        .attr("transform", "translate(15,15)");
    svg
        .append("g")
        .attr("class", "legend")
        .attr("transform", "translate(20,20)");

    var legend = d3.legend.color()
        .scale(CurrentScale);

    svg.select(".legend")
        .call(legend);
}


function colorscale(jsonCountries) {

    if (shown == "2011c02"){
        var color = d3.scale.quantize()
            .domain([0, 25])
            .range(colorbrewer.Reds[9]);
    }
    else if (shown == "2014gdp"){
        var color = d3.scale.quantize()
            .domain([0, 1000000000000])
            .range(colorbrewer.Greens[9]);
    }
    else{
        var color = d3.scale.quantize()
            .domain([0, 10000])
            .range(colorbrewer.Oranges[9]);
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
        return "#ccc";
    }
}

function dropdown(jsonCountries) {
    // add elements
    var dropdown = d3.select("#select")
        .append("div")
        .html("<h3>Select Data</h3>")
        .append("select")
        .attr("class", "form-control")
        .on("change", function() {
            shown = this.value;
            if (shown == "2011c02"){
                CurrentScale = C02scale;
            }
            else if (shown == "2014gdp"){
                CurrentScale = GDPscale;
            }
            else{
                CurrentScale = Escale;
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
            changeAttribute(jsonCountries);
        });

    // elements
    dropdown.selectAll("options")
        .data(keyArray)
        .enter()
        .append("option")
        .attr("class", "selection")
        .attr("value", function(d) {return d})
        .text(function(d) {
            if ( d == "2011c02"){
                return "CO2 Emissions (metric ton per capita)";
            }
            if ( d == "2014gdp"){
                return "GDP (Current US$)";
            }
            if ( d == "2013energy"){
                return "Electric Power Consumption (kWh per capita)";
            }
        });
}

function changeAttribute(jsonCountries) {

    // recolor map
    d3.selectAll(".countries")
        .transition()
        .duration(1000)
        .style("fill", function(d) {
            return choropleth(d, colorscale(jsonCountries));
        });

}

// http://stackoverflow.com/questions/3883342/add-commas-to-a-number-in-jquery
function commaSeparateNumber(val){
    while (/(\d+)(\d{3})/.test(val.toString())){
        val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    }
    return val;
}

function zoomed() {
    projection.translate(d3.event.translate).scale(d3.event.scale);
    g.selectAll("path").attr("d", path);
}

function clicked(d) {
    var centroid = path.centroid(d),
        translate = projection.translate();

    projection.translate([
        translate[0] - centroid[0] + 960 / 2,
        translate[1] - centroid[1] + 500 / 2
    ]);

    zoom.translate(projection.translate());

    g.selectAll("path").transition()
        .duration(700)
        .attr("d", path);
<<<<<<< HEAD
    console.log(title);
    title = "hi";
=======

    // name of clicked country
    name = d.properties.name;
    title = name + " Energy Breakdown";

    // update pie
    pie.destroy();
    createpie();
>>>>>>> 564f978766f59732b3fb799dc39ddf3f7cc50aec
}



