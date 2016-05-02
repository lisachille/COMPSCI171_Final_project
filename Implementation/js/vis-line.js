// SVG drawing area
var margin = {top: 20, right: 20, bottom: 40, left: 40};

var width = 500 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom,
    padding = 10;

// Form id and key initialiser
var selectedValue = "",
    key = 4;


// Declare tool-tip
var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0]);

// Declare svg
var svg = d3.select("#line-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Date parser (https://github.com/mbostock/d3/wiki/Time-Formatting)
var formatDate = d3.time.format("%Y");

// Initialise scales
var xScale = d3.time.scale()
    .range([0,width]);
var yScale = d3.scale.linear()
    .range([height, 0]);

// Initialise axes
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .tickFormat(formatDate);
var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

// Label the axes: x-axis
svg.append("text")
    .attr("transform","translate(" + (width - padding) + "," + (height + margin.bottom - padding) + ")")
    .text("Year");
// y-axis
svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("class", "y-axis-label")
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("CO2 emissions");

// Declare axes groups
var xAxisGroup = svg.append("g")
    .attr("class", "x-axis axis")
    .attr("transform", "translate(0," + height + ")");
var yAxisGroup = svg.append("g")
    .attr("class", "y-axis axis");

// Declare line group
var lineGroup = svg.append("g")
    .append("path")
    .attr("class", "line");

loadUpdateData();

function loadUpdateData(){
    d3.json("data/CO2emissions2.json", function(error, DATA) {

        // Error checking: Making sure the file loaded correctly
        if (error) throw error;

        DATA.forEach(function(d){
            // Convert string to 'date object'
            d.year = formatDate.parse(d.year);

            // Convert numeric values to 'numbers'
            for (var i = 0; i < 248; i++){
                d.values[i].emission = +d.values[i].emission
            }
        });

        var filteredData = [];

        // Initialise values for the input field
        $("#country-choice").val("Albania");

        // Get the value selected by the user
        selectedValue = d3.select("#country-choice").property("value");

        // Get the key for the relevant country
        key = DATA[0].values.findIndex(function(d){
            return (d.country == selectedValue);
        });

        /*// Plot Albania's data if one inputs a non-existent country
        if (key == -1){
            key = 4;
        }*/

        // Filter data of the relevant country
        DATA.forEach(function(d){
            filteredData.push({
                year: d.year,
                emission: d.values[key].emission
            })
        });

        // Filter out the data that is not available
        filteredData = filteredData.filter(function(d){
            return (d.emission != 0);
        });

        // Update the domain for the scales
        xScale.domain(d3.extent(filteredData,function(d){
            return d.year;
        }));
        yScale.domain(d3.extent(filteredData,function(d){
            return d.emission;
        }));

        // Define line function
        var line = d3.svg.line()
            .x(function(d) { return xScale(d.year); })
            .y(function(d) { return yScale(d.emission); })
            .interpolate("linear");

        // Append path to line group
        lineGroup.transition().duration(800)
            .attr("d", line(filteredData))
        ;

        tip.html(function(d){
            return "Year: " + d.year.getFullYear() + "</br>CO2 emissions: " + d.emission.toFixed(2) + "t/capita";
        });

        // Call the tool-tip
        svg.call(tip);

        // Data-bind
        var circle = svg.selectAll("circle")
            .data(filteredData);

        // Enter/Append circles
        circle.enter()
            .append("circle")
            .attr("class", "circles")
            .attr("r", 3.5);

        // Update
        circle
            .transition().duration(800)
            .attr("cx", function(d){
                return xScale(d.year);
            })
            .attr("cy", function(d){
                return yScale(d.emission);
            });

        // Call on events
        circle
            .on("mouseover", tip.show)
            .on("mouseout", tip.hide);

        // Call the relevant axes
        xAxisGroup.transition().duration(800).call(xAxis);
        yAxisGroup.transition().duration(800).call(yAxis);

        // Remove irrelevant selection
        circle.exit()
            .remove();
    });
}