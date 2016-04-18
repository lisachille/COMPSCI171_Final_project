var margin = {top: 50, right: 500, bottom: 50, left: 200},
    width = 1000 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom;

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
    });