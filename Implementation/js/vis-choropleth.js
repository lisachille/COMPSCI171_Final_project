// inspiration from http://www.cartographicperspectives.org/index.php/journal/article/view/cp78-sack-et-al/1359
// http://bl.ocks.org/mbostock/2206340
//https://s-media-cache-ak0.pinimg.com/736x/e2/fc/e5/e2fce5b2569ed0faa83d6577316ff2ec.jpg (world pic)

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
var keyArray = ["At_risk", "At_high_risk", "Suspected_malaria_cases", "Malaria_cases", "UN_population"];
// which key to show (initially 0)
var shown = keyArray[0];
// used to join datasets later
var keyArrayC02 = ["2011"];
var keyArrayGDP = ["2014"];
var keyArrayEnergy = ["2013"];


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
  .defer(d3.json, "data/world.geo.json")
  .defer(d3.csv, "data/global-malaria-2015.csv")
    .defer(d3.csv, "data/CO2emissions.csv")
    .defer(d3.csv, "data/GDP.csv")
    .defer(d3.csv, "data/energyuse.csv")
  .await(function(error, mapTopJson, malariaDataCsv, C02DataCsv, GDPDataCsv, energyDataCsv){

      // --> PROCESS DATA
      // convert to numbers
      malariaDataCsv.forEach(function(data){
          data.At_risk = +data.At_risk;
          data.At_high_risk = +data.At_high_risk;
          data.Malaria_cases = +data.Malaria_cases;
          data.Suspected_malaria_cases = +data.Suspected_malaria_cases;
          data.UN_population = +data.UN_population;
      });
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

      console.log(energyDataCsv);

      // Convert TopoJSON to GeoJSON (target object = 'countries')
      world = mapTopJson.features;

      // vars to join datasets
      var jsonCountries = world;

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
      for (var i = 0; i < energyDataCsv.length; i++){
          // current code
          var csvCountries = energyDataCsv[i];
          var csvCode = csvCountries.Code;

          for (var j = 0; j < jsonCountries.length; j++){
              if (jsonCountries[j].properties.adm0_a3_is == csvCode){
                  for (var key in keyArrayEnergy){
                      var attr = keyArrayEnergy[key];
                      var val = parseFloat(csvCountries[attr]);
                      jsonCountries[j].properties[attr] = val;
                  }
                  break;
              }
          }
      }

      console.log(jsonCountries);

      // Create Dropdown
      dropdown(malariaDataCsv);

      // Update choropleth
      updateChoropleth(malariaDataCsv);
  });
    

function updateChoropleth(malariaDataCsv) {

    // --> Choropleth implementation
    var recolorMap = colorscale(malariaDataCsv);

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

function zoomed() {
    projection.translate(d3.event.translate).scale(d3.event.scale);
    g.selectAll("path").attr("d", path);
}

function clicked(d) {
    var centroid = path.centroid(d),
        translate = projection.translate();

    projection.translate([
        translate[0] - centroid[0] + width / 2,
        translate[1] - centroid[1] + height / 2
    ]);

    zoom.translate(projection.translate());

    g.selectAll("path").transition()
        .duration(700)
        .attr("d", path);
}

