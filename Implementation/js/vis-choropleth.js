// inspiration from http://www.cartographicperspectives.org/index.php/journal/article/view/cp78-sack-et-al/1359
// http://bl.ocks.org/mbostock/2206340

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
var keyArray = ["2011", "2014", "2013"];
// which key to show (initially 0)
var shown = keyArray[0];
// used to join datasets later
var keyArrayC02 = ["2011"];
var keyArrayGDP = ["2014"];
var keyArrayEnergy = ["2013"];


// scale for GDP
var GDPscale = d3.scale.ordinal()
    .domain(["Data N/A", "0 - 125M", "125M - 250M", "250M - 375M", "375M - 500M", "500M - 625M", "625M - 750M", "750M - 875M", "875M - 1B", "1B +"])
    .range([ "#000000", "#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#006d2c", "#00441b" ]);
// Scale for Electricity
var Escale = d3.scale.ordinal()
    .domain(["Data N/A", "0 - 1,250", "1,250- 2,500", "2,500 - 3,750", "3,750 - 5,000", "5,000 - 6,250", "6,250 - 7,500", "7,500 - 8,750", "8,750 - 10,000", "10,000 +"])
    .range([ "#000000", "#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#a63603", "#7f2704" ]);
// Scale for C02
var C02scale = d3.scale.ordinal()
    .domain(["Data N/A", "0 - 3.125", "3.125 - 6.25", "6.25 - 9.375", "9.375 - 12.5", "12.5 - 15.625", "15.625 - 18.75", "18.75 - 21.875", "21.875 - 25", "25 +"])
    .range([ "#000000", "#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d" ]);
var CurrentScale = C02scale;

// tooltip
var tip = d3.tip().attr('class', 'd3-tip').offset([0, 0]).html(function(d) {
    var type;
    var percent = "";
    var val;
    // cases
    if (shown == "2011"){
        type = "CO2 Emissions";
        if(d.properties[shown] == null || isNaN(d.properties[shown])) {
            val = "Data N/A";
        }
        else{
            val = d.properties[shown].toFixed(2);
        }
    }
    else if (shown == "2013"){
        type = "Electric Power Consumption)";
        if(d.properties[shown] == null || isNaN(d.properties[shown])) {
            val = "Data N/A";
        }
        else{
            val = commaSeparateNumber(d.properties[shown].toFixed(0));
        }
    }
    else if (shown == "2014"){
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
  .await(function(error, mapTopJson, C02DataCsv, GDPDataCsv, energyDataCsv){

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
                  for (var key in keyArrayC02){
                      var attr = keyArrayC02[key];
                      var val = parseFloat(csvCountries[attr]);
                      jsonCountries[j].properties[attr] = val;
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
                  for (var key in keyArrayGDP){
                      var attr = keyArrayGDP[key];
                      var val = parseFloat(csvCountries[attr]);
                      jsonCountries[j].properties[attr] = val;
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
                  for (var key in keyArrayEnergy) {
                      var attr = keyArrayEnergy[key];
                      var val = parseFloat(csvCountries[attr]);
                      jsonCountries[j].properties[attr] = val;
                  }
                  break;
              }
          }
      }

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
        .style("stroke", "#ccc")
        .style("stroke-width", "1px")
        .on('mouseover', tip.show).on('mouseout', tip.hide).on("click", clicked);
    g.call(tip);

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

    if (shown == "2011"){
        var color = d3.scale.quantize()
            .domain([0, 25])
            .range(colorbrewer.Reds[9]);
    }
    else if (shown == "2014"){
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
        return "#000000";
    }
}

function dropdown(jsonCountries) {
    // add elements
    var dropdown = d3.select("#select")
        .append("div")
        .html("<h3>Select Data (Most Recent)</h3>")
        .append("select")
        .attr("class", "form-control")
        .on("change", function() {
            shown = this.value;
            if (shown == "2011"){
                CurrentScale = C02scale;
            }
            else if (shown == "2014"){
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
            if ( d == "2011"){
                return "2011 CO2 Emissions (metric ton per capita)";
            }
            if ( d == "2014"){
                return "2014 GDP (Current US$)";
            }
            if ( d == "2013"){
                return "2013 Electric Power Consumption (kWh per capita)";
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
}

