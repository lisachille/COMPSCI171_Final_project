
// initial title, create for first time
title = "Please Click on a Country";
bioval = 10;
nucval = 10;
fuelval = 10;
otherval = 10;
createpie();
function createpie(){
    pie = new d3pie("pieChart", {
        "header": {
            "title": {
                "text": title + " " + year,
                "fontSize": 24,
                "font": "Lato"
            },
            "subtitle": {
<<<<<<< HEAD
                "text": "Breakdown by Source: Fossil fuel energy consumption, Renewable energy consumption, and Alternative and nuclear energy.",
=======
                "text": "Fossil Fuel, Renewable Energy, and Alternative & Nuclear Energy Consumption.",
>>>>>>> f7fb7760163f241ccc7015f8e05b3924ad7db63f
                "color": "#999999",
                "fontSize": 12,
                "font": "Lato"
            },
            "titleSubtitlePadding": 9
        },
        "footer": {
            "color": "#999999",
            "fontSize": 10,
            "font": "Lato",
            "location": "bottom-left"
        },
        "size": {
<<<<<<< HEAD
            "canvasWidth": 750,
            "pieOuterRadius": "86%"
=======
            "canvasWidth": 485,
            "pieOuterRadius": "50%"
>>>>>>> f7fb7760163f241ccc7015f8e05b3924ad7db63f
        },
        "data": {
            "sortOrder": "value-desc",
            "content": [
                {
                    "label": "Alternative/Nuclear energy",
                    "value": nucval,
                    "color": "#5c97d4"
                },
                {
                    "label": "Fossil Fuels",
                    "value": fuelval,
                    "color": "#a05c56"
                },
                {
                    "label": "Biomass",
                    "value": bioval,
                    "color": "#95cd5a"
                },
                {
                    "label": "Other",
                    "value": otherval,
                    "color": "#e98125"
                }
            ]
        },
        "labels": {
            "outer": {
                "pieDistance": 32
            },
            "inner": {
                "hideWhenLessThanPercentage": 3
            },
            "mainLabel": {
                "fontSize": 11
            },
            "percentage": {
                "color": "#ffffff",
                "decimalPlaces": 0
            },
            "value": {
                "color": "#adadad",
                "fontSize": 11
            },
            "lines": {
                "enabled": true
            },
            "truncation": {
                "enabled": true
            }
        },
        "effects": {
            "pullOutSegmentOnClick": {
                "effect": "linear",
                "speed": 300,
                "size": 8
            }
        },
        "misc": {
            "gradient": {
                "enabled": true,
                "percentage": 100
            }
        }
    });
    return pie;
}