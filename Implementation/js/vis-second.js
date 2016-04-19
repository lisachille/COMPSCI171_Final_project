//var margin = {top: 50, right: 500, bottom: 50, left: 200},
//    width = 1000 - margin.right - margin.left,
//    height = 500 - margin.top - margin.bottom;
//
//queue()
//    .defer(d3.csv, "data/CO2emissions.csv")
//    .defer(d3.csv, "data/GDP.csv")
//    .defer(d3.csv, "data/energyuse.csv")
//    .await(function(error, C02DataCsv, GDPDataCsv, energyDataCsv) {
//
//        // --> PROCESS DATA
//        // Convert to Numbers
//        C02DataCsv.forEach(function (data) {
//            for (var j = 1960; j < 2016; j++) {
//                var jnum = j.toString();
//                if (data[jnum] == "") {
//                    data[jnum] = "N/A";
//                }
//                else {
//                    data[jnum] = +data[jnum];
//                }
//            }
//        });
//        GDPDataCsv.forEach(function (data) {
//            for (var j = 1960; j < 2016; j++) {
//                var jnum = j.toString();
//                if (data[jnum] == "") {
//                    data[jnum] = "N/A";
//                }
//                else {
//                    data[jnum] = +data[jnum];
//                }
//            }
//        });
//        energyDataCsv.forEach(function (data) {
//            for (var j = 1960; j < 2016; j++) {
//                var jnum = j.toString();
//                if (data[jnum] == "") {
//                    data[jnum] = "N/A";
//                }
//                else {
//                    data[jnum] = +data[jnum];
//                }
//            }
//        });
//
//        // console showing your data so you can build your stuff
//        console.log(C02DataCsv);
//        //console.log(GDPDataCsv);
//        //console.log(energyDataCsv);
//
//        console.log(C02DataCsv[1][2011]);
//
//    var C02= [];
//    var j;
//    var i;
//  for (j=0; j< C02DataCsv.length; j++) {
//      for (i = 0; i < j; i++) {
//          C02 = C02DataCsv[i][2011]
//      }
//  }
//
//    console.log(C02);
//
//
//        //creating parameters
//        var margin = {top: 20, right: 20, bottom: 30, left: 40},
//            width = 960 - margin.left - margin.right,
//            height = 500 - margin.top - margin.bottom;
//
//        var x = d3.scale.ordinal()
//            .rangeRoundBands([0, width], .1);
//
//        var y = d3.scale.linear()
//            .range([height, 0]);
//
//        var xAxis = d3.svg.axis()
//            .scale(x)
//            .orient("bottom");
//
//        var yAxis = d3.svg.axis()
//            .scale(y)
//            .orient("left")
//            .ticks(10, "%");
//
//        var svg = d3.select("body").append("svg")
//            .attr("width", width + margin.left + margin.right)
//            .attr("height", height + margin.top + margin.bottom)
//            .append("g")
//            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
//        console.log(C02DataCsv[0].Code);
//
//
//            x.domain(data.map(function(d) { return C02DataCsv[0].Code; }));
//            y.domain([0, d3.max(data, function(d) { return C02DataCsv[0][2013]; })]);
//
//            svg.append("g")
//                .attr("class", "x axis")
//                .attr("transform", "translate(0," + height + ")")
//                .call(xAxis);
//
//            svg.append("g")
//                .attr("class", "y axis")
//                .call(yAxis)
//                .append("text")
//                .attr("transform", "rotate(-90)")
//                .attr("y", 6)
//                .attr("dy", ".71em")
//                .style("text-anchor", "end")
//                .text("Frequency");
//
//            svg.selectAll(".bar")
//                .data(data)
//                .enter().append("rect")
//                .attr("class", "bar")
//                .attr("x", function(d) { return x(C02DataCsv[0].Code); })
//                .attr("width", x.rangeBand())
//                .attr("y", function(d) { return y(C02DataCsv[0][2013]); })
//                .attr("height", function(d) { return height - y(C02DataCsv[0][2013]); });
//
//
//
//
//        //derived from Mike Bostock's https://bl.ocks.org/mbostock/3943967 Tutorial
//
//
//
//    });