
//var margin = {top: 50, right: 500, bottom: 50, left: 200},
//    width = 1000 - margin.right - margin.left,
//    height = 500 - margin.top - margin.bottom;
var data, C02, energy;
var myBar;
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


            BIGC02DATA = C02DataCsv;
            BIGENERGYDATA = energyDataCsv;

            //SC02= C02DATA.sort (function(d){ return d3.ascending(d[2011])});
            //console.log(SC02);
            //Senergy= ENERGYDATA.sort;

            var C02DATA= BIGC02DATA.sort(function(a, b){return a-b});
            var ENERGYDATA= BIGENERGYDATA.sort(function(a, b){return a-b});

            //console.log(C02);
            //console.log(energy);

            C02 = C02DATA.slice(0, 20);
            energy = ENERGYDATA.slice(0, 20);
            data = C02;
            myBar = new BarChart("#barChart", data);
            changeVisualization();



            //console.log(selected);

        //
        });



function changeVisualization() {


    var selected = document.getElementById("selecttype").value;

    if (selected == "energy"){
        data = energy;
        //console.log(data);
        //changeVisualization(data);
    }
    else {
        data = C02;
        //console.log(data);
        //changeVisualization(data);
    }
    //console.log(d);
    myBar.wrangleData(data);
    //myBar.UpdateVis();

}
        //derived from Mike Bostock's https://bl.ocks.org/mbostock/3943967 Tutorial

//function changevisualization(){

