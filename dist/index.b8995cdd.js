const svgBarChart = ()=>{
    // Some data that's to be shown on the bar chart. To show a stacked or grouped chart
    // each number should be an array of more numbers instead (as shown below).
    data = [
        [
            1478233
        ],
        [
            1345329
        ],
        [
            1324190
        ],
        [
            1137381
        ],
        [
            1001697
        ],
        [
            770409
        ],
        [
            582175
        ],
        [
            497883
        ],
        [
            474075
        ],
        [
            472294
        ]
    ];
    labels = [
        "FFXIV",
        "OSR",
        "LA",
        "WoW",
        "PoE",
        "D2",
        "War",
        "WoWC",
        "SC",
        "RS"
    ];
    new RGraph.SVG.Bar({
        id: "chart-container",
        data: data,
        options: {
            marginLeft: 80,
            marginRight: 5,
            marginBottom: 45,
            marginTop: 45,
            backgroundGridVlines: false,
            backgroundGridBorder: false,
            textSize: 10,
            yaxis: false,
            yaxisScaleUnitsPre: "",
            yaxisScaleUnitsPost: "k",
            yaxisScalePoint: ".",
            yaxisScaleThousand: ",",
            yaxisScaleDecimals: 0,
            yaxisLabelsCount: 10,
            xaxisLinewidth: 3,
            xaxisTickmarks: false,
            xaxisLabels: "%{global:labels[%{index}]}",
            colors: [
                "#fcba03",
                "#131314"
            ],
            marginInner: 9,
            marginInnerGrouped: 2,
            title: "NOMBRE DE JOUEURS ACTIFS EN 2022",
            titleColor: "#5ecde6",
            titleBold: true,
            titleSize: 16,
            textColor: "#ebebeb",
            tooltips: "%{key}",
            tooltipsCss: {
                backgroundColor: "#333",
                fontWeight: "bold",
                fontSize: "14pt",
                opacity: 0.85
            }
        }
    }).wave().responsive([
        {
            maxWidth: null,
            width: 700,
            height: 300,
            options: {
                marginBottom: 60,
                marginLeft: 75,
                marginInner: 5,
                textSize: 10,
                titleSize: 18
            }
        },
        {
            maxWidth: 1260,
            width: 500,
            height: 300,
            options: {
                marginBottom: 60,
                marginLeft: 75,
                marginInner: 5,
                textSize: 9,
                titleSize: 16
            }
        },
        {
            maxWidth: 769,
            width: 280,
            height: 300,
            options: {
                marginBottom: 60,
                marginLeft: 55,
                marginInner: 5,
                textSize: 7,
                titleSize: 9
            }
        }
    ]);
};
svgBarChart();

//# sourceMappingURL=index.b8995cdd.js.map
