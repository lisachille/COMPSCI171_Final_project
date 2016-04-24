<<<<<<< HEAD
title = "Energy Breakdown";
console.log(title);

var pie = new d3pie("pieChart", {
    "header": {
        "title": {
            "text": title,
            "fontSize": 24,
            "font": "open sans"
        },
        "subtitle": {
            "text": "Fossil fuel energy consumption, Renewable energy consumption, Alternative and nuclear energy",
            "color": "#999999",
            "fontSize": 12,
            "font": "open sans"
        },
        "titleSubtitlePadding": 9
    },
    "footer": {
        "color": "#999999",
        "fontSize": 10,
        "font": "open sans",
        "location": "bottom-left"
    },
    "size": {
        "canvasWidth": 590,
        "pieOuterRadius": "90%"
    },
    "data": {
        "sortOrder": "value-desc",
        "content": [
            {
                "label": "Carbon",
                "value": 56,
                "color": "#2484c1"
            },
            {
                "label": "Other",
                "value": 44,
                "color": "#0c6197"
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
            "speed": 400,
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
=======

// initial title, create for first time
title = "Energy Breakdown";
createpie();
function createpie(){
    pie = new d3pie("pieChart", {
        "header": {
            "title": {
                "text": title,
                "fontSize": 24,
                "font": "open sans"
            },
            "subtitle": {
                "text": "Fossil fuel energy consumption, Renewable energy consumption, Alternative and nuclear energy",
                "color": "#999999",
                "fontSize": 12,
                "font": "open sans"
            },
            "titleSubtitlePadding": 9
        },
        "footer": {
            "color": "#999999",
            "fontSize": 10,
            "font": "open sans",
            "location": "bottom-left"
        },
        "size": {
            "canvasWidth": 590,
            "pieOuterRadius": "90%"
        },
        "data": {
            "sortOrder": "value-desc",
            "content": [
                {
                    "label": "Carbon",
                    "value": 56,
                    "color": "#2484c1"
                },
                {
                    "label": "Other",
                    "value": 44,
                    "color": "#0c6197"
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
                "speed": 400,
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
>>>>>>> 564f978766f59732b3fb799dc39ddf3f7cc50aec
