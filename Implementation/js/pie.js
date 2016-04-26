
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
                "text":"Energy Breakdown",
                "fontSize": 24,
                "font": "Lato"
            },
            "subtitle": {
                "text": "Fossil Fuel, Renewable Energy, and Alternative & Nuclear Energy Consumption.",
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
            "canvasWidth": 430,
            "pieOuterRadius": "50%"
        },
        "data": {
            "sortOrder": "value-desc",
            "content": [
                {
                    "label": "Alternative/Nuclear",
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