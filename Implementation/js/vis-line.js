var margin = {top: 50, right: 300, bottom: 50, left: 50},

    width = 1000 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom,
    padding = 10;

var svg = d3.select("#bubble-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Declare tool-tip
var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0]);

// Define scales
// I will find a better way to find the min and the max for the domain
// of the x scale
var x = d3.scale.linear()
    .range([0, width])
    .domain([0,200000000000]);
var y = d3.scale.linear()
    .range([height, 0])
    .domain([0,100]);

// Create axes
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

// Label the x-axis
svg.append("text")
    .attr("transform","translate(" + (width - padding) + "," + (height + margin.bottom - padding) + ")")
    .text("Year");

// Append axes
svg.append("g")
    .attr("class", "x-axis axis")
    .transition().duration(800)
    .call(xAxis)
    .attr("transform", "translate(0," + height + ")");
svg.append("g")
    .attr("class", "y-axis axis")
    .transition().duration(800)
    .call(yAxis);

// Define line function
var line = d3.svg.line()
    .x(function(d) { return 5; })
    .y(function(d) { return 7; })
    .interpolate("linear");

// Declare line groups
var lineGroupGDP = svg.append("g")
    .append("path")
    .attr("class", "line");
var lineGroupCO2 = svg.append("g")
    .append("path")
    .attr("class", "line");

queue()
    .defer(d3.csv, "data/CO2emissions.csv")
    .defer(d3.csv, "data/GDP.csv")
    .defer(d3.csv, "data/energyuse.csv")
    .await(function(error, C02DataCsv, GDPDataCsv, energyDataCsv) {

        // --> PROCESS DATA
        // Convert to Numbers
        C02DataCsv.forEach(function (data) {
            for (var j = 1960; j < 2016; j++) {
                var jnum = j.toString();
                if (data[jnum] == "") {
                    data[jnum] = "N/A";
                }
                else {
                    data[jnum] = +data[jnum];
                }
            }
        });
        GDPDataCsv.forEach(function (data) {
            for (var j = 1960; j < 2016; j++) {
                var jnum = j.toString();
                if (data[jnum] == "") {
                    data[jnum] = "N/A";
                }
                else {
                    data[jnum] = +data[jnum];
                }
            }
        });
        energyDataCsv.forEach(function (data) {
            for (var j = 1960; j < 2016; j++) {
                var jnum = j.toString();
                if (data[jnum] == "") {
                    data[jnum] = "N/A";
                }
                else {
                    data[jnum] = +data[jnum];
                }
            }
        });

        // console showing your data so you can build your stuff
        //console.log(C02DataCsv);
        //console.log(GDPDataCsv);
        //console.log(energyDataCsv);

        // IMPLEMENT YOUR VISUALIZATIONS HERE
        // Append path to line groups
        lineGroupGDP.transition().duration(800)
            .attr("d", line(GDPDataCsv));
        lineGroupCO2.transition().duration(800)
            .attr("d", line(C02DataCsv));

        /*
        // Data-bind
        var circleGDP = svg.selectAll("circle")
            .data(GDPDataCsv);

        // Enter/Append circles
        circleGDP.enter()
            .append("circle")
            .attr("class", "circles")
            .attr("r", 4);

        // Update
        circleGDP
            .transition().duration(800)
            .attr("cx", function(d){
                return x(d.YEAR);
            })
            .attr("cy", function(d){
                return y(d[selectedValue]);
            });

        // Call on events
        circleGDP
            .on("mouseover", tip.show)
            .on("mouseout", tip.hide);
*/
        /*
        var circles = svg.selectAll("circle");

        circles
            .data(GDPDataCsv)
            .enter()
            .attr("cx", function(d) {
                if (d[1990] == "N/A"){
                    return 1003;
                }
                return d[1990];
            });

        circles
            .data(C02DataCsv)
            .attr("cy", function (d) {
                if (d[1990] == "N/A"){
                    return 1003;
                }
                return d[1990];
            });
            
        circles
            .attr("r", 10)
            .style("fill", "red");
        
        circles
            .exit().remove();
*/

    });