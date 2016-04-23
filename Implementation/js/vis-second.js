
//var margin = {top: 50, right: 500, bottom: 50, left: 200},
//    width = 1000 - margin.right - margin.left,
//    height = 500 - margin.top - margin.bottom;

    queue()
        .defer(d3.csv, "data/CO2emissions.csv")
        .defer(d3.csv, "data/GDP.csv")
        .defer(d3.csv, "data/energyuse.csv")
        .await(function (error, C02DataCsv, GDPDataCsv, energyDataCsv) {

            // --> PROCESS DATA
            // Convert to Numbers
            C02DataCsv.forEach(function (data) {
                for (var j = 1960; j < 2016; j++) {
                    var jnum = j.toString();
                    if (data[jnum] == "") {
                        data[jnum] = 0;
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
                        data[jnum] = 0;
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
                        data[jnum] = 0;
                    }
                    else {
                        data[jnum] = +data[jnum];
                    }
                }
            });



            changeVisualization();

        });


C02DATA = C02DataCsv;
ENERGYDATA = energyDataCsv;

var C02 = C02DATA.slice(0, 5);
var energy = ENERGYDATA.slice(0, 5);
//console.log(data.slice(0,10).map(function()));
console.log(C02);
console.log(energy);

var selected = document.getElementById("selecttype").value;


if (selected == "energy"){
    selected = energy;
}
else {
    selected = C02;
}

console.log(selected);


function changeVisualization(d) {


        console.log(selected[1997]);


        //creating parameters
        var margin = {top: 30, right: 20, bottom: 30, left: 40},
            width = 860 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;
        //initialize scales
        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);


        var y = d3.scale.linear()
            .range([height, 0]);

        //set axis
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");


        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10);

        var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        x.domain(selected.map(function (d) {
            return d.Code
        }));
        y.domain([0, d3.max(selected, function (d) {
            return d[1997]
        })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("C02 Emissions");


        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .style("fill", "steelblue")
            .attr("class", "bar")
            .attr("x", function (d) {
                return x(d.Code);
            })
            .attr("width", x.rangeBand())
            .attr("y", function (d) {
                return height - y(d[1997]);
            })
            .attr("height", function (d) {
                return y(d[1997]);
            });



}
        //derived from Mike Bostock's https://bl.ocks.org/mbostock/3943967 Tutorial

//function changevisualization(){

