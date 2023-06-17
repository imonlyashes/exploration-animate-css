"version:2022-09-11 (6.09)";
//
// o--------------------------------------------------------------------------------o
// | This file is part of the RGraph package - you can learn more at:               |
// |                                                                                |
// |                         https://www.rgraph.net                                 |
// |                                                                                |
// | RGraph is licensed under the Open Source MIT license. That means that it's     |
// | totally free to use and there are no restrictions on what you can do with it!  |
// o--------------------------------------------------------------------------------o
RGraph = window.RGraph || {
    isrgraph: true,
    isRGraph: true,
    rgraph: true
};
RGraph.SVG = RGraph.SVG || {};
RGraph.SVG.FX = RGraph.SVG.FX || {};
// Module pattern
(function(win, doc, undefined) {
    RGraph.SVG.REG = {
        store: []
    };
    // ObjectRegistry
    RGraph.SVG.OR = {
        objects: []
    };
    // Used to categorise trigonometery functions
    RGraph.SVG.TRIG = {};
    RGraph.SVG.TRIG.HALFPI = Math.PI * .4999;
    RGraph.SVG.TRIG.PI = RGraph.SVG.TRIG.HALFPI * 2;
    RGraph.SVG.TRIG.TWOPI = RGraph.SVG.TRIG.PI * 2;
    RGraph.SVG.events = [];
    // This allows you to set globalconfiguration values that are copied to
    // all objects automatically.
    RGraph.SVG.GLOBALS = {};
    // This allows the GET import methods to be added
    RGraph.SVG.GET = {};
    RGraph.SVG.ISFF = navigator.userAgent.indexOf("Firefox") != -1;
    RGraph.SVG.ISOPERA = navigator.userAgent.indexOf("Opera") != -1;
    RGraph.SVG.ISCHROME = navigator.userAgent.indexOf("Chrome") != -1;
    RGraph.SVG.ISSAFARI = navigator.userAgent.indexOf("Safari") != -1 && !RGraph.SVG.ISCHROME;
    RGraph.SVG.ISWEBKIT = navigator.userAgent.indexOf("WebKit") != -1;
    RGraph.SVG.ISIE = navigator.userAgent.indexOf("Trident") > 0 || navigator.userAgent.indexOf("MSIE") > 0;
    RGraph.SVG.ISIE9 = navigator.userAgent.indexOf("MSIE 9") > 0;
    RGraph.SVG.ISIE10 = navigator.userAgent.indexOf("MSIE 10") > 0;
    RGraph.SVG.ISIE11UP = navigator.userAgent.indexOf("MSIE") == -1 && navigator.userAgent.indexOf("Trident") > 0;
    RGraph.SVG.ISIE10UP = RGraph.SVG.ISIE10 || RGraph.SVG.ISIE11UP;
    RGraph.SVG.ISIE9UP = RGraph.SVG.ISIE9 || RGraph.SVG.ISIE10UP;
    // Some commonly used bits of info
    RGraph.SVG.MONTHS_SHORT = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];
    RGraph.SVG.MONTHS_LONG = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    RGraph.SVG.DAYS_SHORT = [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun"
    ];
    RGraph.SVG.DAYS_LONG = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];
    //
    // Create an SVG tag
    //
    RGraph.SVG.createSVG = function(opt1) {
        var container1 = opt1.container, obj1 = opt1.object;
        if (container1.__svg__) return container1.__svg__;
        var svg1 = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
        //svg.setAttribute('style', 'top: 0; left: 0; position: absolute');
        svg1.setAttribute("width", container1.offsetWidth);
        svg1.setAttribute("height", container1.offsetHeight);
        svg1.setAttribute("version", "1.1");
        svg1.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/2000/svg");
        svg1.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
        svg1.__object__ = obj1;
        svg1.__container__ = container1;
        // Set some style
        svg1.style.top = 0;
        svg1.style.left = 0;
        svg1.style.position = "absolute";
        container1.appendChild(svg1);
        container1.__svg__ = svg1;
        container1.__object__ = obj1;
        var style1 = getComputedStyle(container1);
        if (style1.position !== "absolute" && style1.position !== "fixed" && style1.position !== "sticky") container1.style.position = "relative";
        // Add the groups that facilitate "background layers"
        var numLayers1 = 10;
        for(var i1 = 1; i1 <= numLayers1; ++i1){
            var group1 = RGraph.SVG.create({
                svg: svg1,
                type: "g",
                attr: {
                    className: "background" + i1
                }
            });
            // Store a reference to the group
            obj1.layers["background" + i1] = group1;
            svg1["background" + i1] = group1;
        }
        // Add the group tag to the SVG that contains all of the elements
        var group1 = RGraph.SVG.create({
            svg: svg1,
            type: "g",
            attr: {
                className: "all-elements"
            }
        });
        container1.__svg__.all = group1;
        return svg1;
    };
    //
    // Create a defs tag inside the SVG
    //
    RGraph.SVG.createDefs = function(obj1) {
        if (!obj1.svg.defs) {
            var defs1 = RGraph.SVG.create({
                svg: obj1.svg,
                type: "defs"
            });
            obj1.svg.defs = defs1;
        }
        return defs1;
    };
    //
    // Creates a tag depending on the args that you give
    //
    //@param opt object The options for the function
    //
    RGraph.SVG.create = function(opt1) {
        var ns1 = "http://www.w3.org/2000/svg", tag1 = doc.createElementNS(ns1, opt1.type);
        // Add the attributes
        for(var o1 in opt1.attr)if (typeof o1 === "string") {
            var name1 = o1;
            if (o1 === "className") name1 = "class";
            if ((opt1.type === "a" || opt1.type === "image") && o1 === "xlink:href") tag1.setAttributeNS("http://www.w3.org/1999/xlink", o1, String(opt1.attr[o1]));
            else {
                if (RGraph.SVG.isNull(opt1.attr[o1])) opt1.attr[o1] = "";
                tag1.setAttribute(name1, String(opt1.attr[o1]));
            }
        }
        // Add the style
        for(var o1 in opt1.style)if (typeof o1 === "string") tag1.style[o1] = String(opt1.style[o1]);
        if (opt1.parent) opt1.parent.appendChild(tag1);
        else opt1.svg.appendChild(tag1);
        return tag1;
    };
    //
    // Function that adds up all of the offsetLeft and offsetTops to get
    // X/Y coords for the mouse
    //
    //@param object e The event object
    //@return array   The X/Y coordinate pair representing the mouse
    //                location in relation to the SVG tag.
    //
    RGraph.SVG.getMouseXY = function(e1) {
        // This is necessary for IE9
        if (!e1.target) return;
        var el1 = e1.target, offsetX1 = 0, offsetY1 = 0, x1, y1;
        //if (typeof el.offsetParent !== 'undefined') { 
        //    do {
        //        offsetX += el.offsetLeft;
        //        offsetY += el.offsetTop;
        //    } while ((el = el.offsetParent));
        //}
        //x = e.pageX;
        //y = e.pageY;
        x1 = e1.offsetX;
        y1 = e1.offsetY;
        x1 -= 2 * (parseInt(document.body.style.borderLeftWidth) || 0);
        y1 -= 2 * (parseInt(document.body.style.borderTopWidth) || 0);
        // We return a javascript array with x and y defined
        return [
            x1,
            y1
        ];
    };
    //
    // Draws an X axis
    //
    //@param The chart object
    //
    RGraph.SVG.drawXAxis = function(obj1) {
        var properties1 = obj1.properties;
        // Draw the axis
        if (properties1.xaxis) {
            var y1 = obj1.type === "hbar" ? obj1.height - properties1.marginBottom : obj1.getYCoord(obj1.scale.min < 0 && obj1.scale.max < 0 ? obj1.scale.max : obj1.scale.min > 0 && obj1.scale.max > 0 ? obj1.scale.min : 0);
            var axis1 = RGraph.SVG.create({
                svg: obj1.svg,
                parent: obj1.svg.all,
                type: "path",
                attr: {
                    d: "M{1} {2} L{3} {4}".format(properties1.marginLeft, y1, obj1.width - properties1.marginRight, y1),
                    fill: properties1.xaxisColor,
                    stroke: properties1.xaxisColor,
                    "stroke-width": typeof properties1.xaxisLinewidth === "number" ? properties1.xaxisLinewidth : 1,
                    "shape-rendering": "crispEdges",
                    "stroke-linecap": "square"
                }
            });
            // HBar X axis
            if (obj1.type === "hbar") var width1 = obj1.graphWidth / obj1.data.length, x1 = properties1.marginLeft, startY1 = obj1.height - properties1.marginBottom, endY1 = obj1.height - properties1.marginBottom + properties1.xaxisTickmarksLength;
            else {
                var width1 = obj1.graphWidth / obj1.data.length, x1 = properties1.marginLeft, startY1 = obj1.getYCoord(0) - (properties1.yaxisScaleMin < 0 ? properties1.xaxisTickmarksLength : 0), endY1 = obj1.getYCoord(0) + properties1.xaxisTickmarksLength;
                if (obj1.scale.min < 0 && obj1.scale.max <= 0) {
                    startY1 = properties1.marginTop;
                    endY1 = properties1.marginTop - properties1.xaxisTickmarksLength;
                }
                if (obj1.scale.min > 0 && obj1.scale.max > 0) {
                    startY1 = obj1.getYCoord(obj1.scale.min);
                    endY1 = obj1.getYCoord(obj1.scale.min) + properties1.xaxisTickmarksLength;
                }
                if (obj1.mirrorScale) {
                    startY1 = obj1.height / 2 - properties1.xaxisTickmarksLength;
                    endY1 = obj1.height / 2 + properties1.xaxisTickmarksLength;
                }
            }
            // Draw the tickmarks
            if (properties1.xaxisTickmarks) {
                // The HBar uses a scale
                if (properties1.xaxisScale) {
                    var zeroXCoord1 = obj1.getXCoord(0);
                    var xmincoord1 = obj1.getXCoord(obj1.min);
                    for(var i1 = 0; i1 < (typeof properties1.xaxisLabelsPositionEdgeTickmarksCount === "number" ? properties1.xaxisLabelsPositionEdgeTickmarksCount : obj1.scale.numlabels + (properties1.yaxis && properties1.xaxisScaleMin === 0 ? 0 : 1)); ++i1){
                        if (obj1.type === "hbar") var dataPoints1 = obj1.data.length;
                        x1 = properties1.marginLeft + (i1 + (properties1.yaxis && properties1.xaxisScaleMin === 0 && properties1.yaxisPosition === "left" ? 1 : 0)) * (obj1.graphWidth / obj1.scale.numlabels);
                        // Allow Manual specification of number of tickmarks
                        if (typeof properties1.xaxisLabelsPositionEdgeTickmarksCount === "number") {
                            dataPoints1 = properties1.xaxisLabelsPositionEdgeTickmarksCount;
                            var gap1 = obj1.graphWidth / properties1.xaxisLabelsPositionEdgeTickmarksCount;
                            x1 = gap1 * i1 + properties1.marginLeft + gap1;
                            // Allow for the Y axis being on the right so the tickmarks
                            // have to be adjusted
                            if (properties1.yaxisPosition === "right") x1 -= gap1;
                        }
                        // Don't draw a tick at the zero position
                        if (properties1.yaxis && x1 < zeroXCoord1 + 2 && x1 > zeroXCoord1 - 2) continue;
                        // Don't draw a tick at the zero position (another case)
                        if (properties1.yaxis && obj1.min > 0 && obj1.max > obj1.min && i1 === 0) continue;
                        // Don't draw a tick at the zero position (another case)
                        if (properties1.yaxis && obj1.max < 0 && obj1.min < obj1.max && i1 === 5) continue;
                        RGraph.SVG.create({
                            svg: obj1.svg,
                            parent: obj1.svg.all,
                            type: "path",
                            attr: {
                                d: "M{1} {2} L{3} {4}".format(x1, startY1, x1, endY1),
                                stroke: properties1.xaxisColor,
                                "stroke-width": typeof properties1.xaxisLinewidth === "number" ? properties1.xaxisLinewidth : 1,
                                "shape-rendering": "crispEdges"
                            }
                        });
                    }
                    // Draw an extra tickmark in some conditions. This
                    // is a bit of a edge-case
                    if (properties1.yaxisPosition === "right" && properties1.xaxisScaleMin < 0 && properties1.xaxisScaleMax > 0) RGraph.SVG.create({
                        svg: obj1.svg,
                        parent: obj1.svg.all,
                        type: "path",
                        attr: {
                            d: "M{1} {2} L{3} {4}".format(obj1.width - properties1.marginRight, startY1, obj1.width - properties1.marginRight, endY1),
                            stroke: properties1.xaxisColor,
                            "stroke-width": typeof properties1.xaxisLinewidth === "number" ? properties1.xaxisLinewidth : 1,
                            "shape-rendering": "crispEdges"
                        }
                    });
                } else {
                    // This style is used by Bar and Scatter charts
                    if (properties1.xaxisLabelsPosition === "section") {
                        if (obj1.type === "bar" || obj1.type === "waterfall") var dataPoints1 = obj1.data.length;
                        else if (obj1.type === "line") var dataPoints1 = obj1.data[0].length;
                        else if (obj1.type === "scatter") var dataPoints1 = properties1.xaxisLabels ? properties1.xaxisLabels.length : 10;
                        // Allow Manual specification of number of tickmarks
                        if (typeof properties1.xaxisLabelsPositionSectionTickmarksCount === "number") dataPoints1 = properties1.xaxisLabelsPositionSectionTickmarksCount;
                        for(var i1 = 0; i1 < dataPoints1; ++i1){
                            // Allow for a right hand Y axis so move the tickmarks to the left
                            if (properties1.yaxisPosition === "right") x1 = properties1.marginLeft + (properties1.marginInnerLeft || 0) + i1 * ((obj1.graphWidth - (properties1.marginInnerLeft || 0) - (properties1.marginInnerRight || 0)) / dataPoints1);
                            else x1 = properties1.marginLeft + (properties1.marginInnerLeft || 0) + (i1 + 1) * ((obj1.graphWidth - (properties1.marginInnerLeft || 0) - (properties1.marginInnerRight || 0)) / dataPoints1);
                            RGraph.SVG.create({
                                svg: obj1.svg,
                                parent: obj1.svg.all,
                                type: "path",
                                attr: {
                                    d: "M{1} {2} L{3} {4}".format(x1 + 0.001, startY1, x1, endY1),
                                    stroke: properties1.xaxisColor,
                                    "stroke-width": typeof properties1.xaxisLinewidth === "number" ? properties1.xaxisLinewidth : 1,
                                    "shape-rendering": "crispEdges"
                                }
                            });
                        }
                        // Draw an extra tickmark if the X axis is on the right but not being shown
                        if (properties1.yaxisPosition === "right" && !properties1.yaxis) RGraph.SVG.create({
                            svg: obj1.svg,
                            parent: obj1.svg.all,
                            type: "path",
                            attr: {
                                d: "M{1} {2} L{3} {4}".format(obj1.width - properties1.marginRight + 0.001, startY1, obj1.width - properties1.marginRight + 0.001, endY1),
                                stroke: properties1.xaxisColor,
                                "stroke-width": typeof properties1.xaxisLinewidth === "number" ? properties1.xaxisLinewidth : 1,
                                "shape-rendering": "crispEdges"
                            }
                        });
                    // This style is used by line charts
                    } else if (properties1.xaxisLabelsPosition === "edge") {
                        if (typeof properties1.xaxisLabelsPositionEdgeTickmarksCount === "number") var len1 = properties1.xaxisLabelsPositionEdgeTickmarksCount;
                        else var len1 = obj1.data && obj1.data[0] && obj1.data[0].length ? obj1.data[0].length : 0;
                        for(var i1 = 0; i1 < len1; ++i1){
                            var gap1 = obj1.graphWidth / (len1 - 1);
                            if (properties1.yaxisPosition === "right") {
                                x1 = properties1.marginLeft + i1 * gap1;
                                // If the X position is within 3 pixels of the X position of the Y
                                // axis then skip it
                                if (properties1.yaxis && x1 > obj1.width - properties1.marginRight - 3 && x1 < obj1.width - properties1.marginRight + 3) continue;
                            } else x1 = properties1.marginLeft + (i1 + 1) * gap1;
                            // For some reason a tickmark is being drawn in the right margin
                            // so this prevents that.
                            if ((!properties1.yaxisPosition || properties1.yaxisPosition === "left") && x1 > obj1.width - properties1.marginRight) continue;
                            RGraph.SVG.create({
                                svg: obj1.svg,
                                parent: obj1.svg.all,
                                type: "path",
                                attr: {
                                    d: "M{1} {2} L{3} {4}".format(x1 + 0.001, startY1, x1, endY1),
                                    stroke: properties1.xaxisColor,
                                    "stroke-width": typeof properties1.xaxisLinewidth === "number" ? properties1.xaxisLinewidth : 1,
                                    "shape-rendering": "crispEdges"
                                }
                            });
                        }
                    }
                }
                // Draw an extra tick if the Y axis is not being shown
                if (properties1.yaxis === false || (properties1.marginInnerLeft || 0) > 0) RGraph.SVG.create({
                    svg: obj1.svg,
                    parent: obj1.svg.all,
                    type: "path",
                    attr: {
                        d: "M{1} {2} L{3} {4}".format(properties1.marginLeft + (properties1.marginInnerLeft || 0) + 0.001, startY1, properties1.marginLeft + (properties1.marginInnerLeft || 0), endY1),
                        stroke: obj1.properties.xaxisColor,
                        "stroke-width": typeof properties1.xaxisLinewidth === "number" ? properties1.xaxisLinewidth : 1,
                        "shape-rendering": "crispEdges",
                        parent: obj1.svg.all
                    }
                });
            }
        }
        // Get the text configuration
        var textConf1 = RGraph.SVG.getTextConf({
            object: obj1,
            prefix: "xaxisLabels"
        });
        //
        // Draw an X axis scale
        //
        if (properties1.xaxisScale) {
            if (obj1.type === "scatter") {
                obj1.xscale = RGraph.SVG.getScale({
                    object: obj1,
                    numlabels: properties1.xaxisLabelsCount,
                    unitsPre: properties1.xaxisScaleUnitsPre,
                    unitsPost: properties1.xaxisScaleUnitsPost,
                    max: properties1.xaxisScaleMax,
                    min: properties1.xaxisScaleMin,
                    point: properties1.xaxisScalePoint,
                    round: properties1.xaxisScaleRound,
                    thousand: properties1.xaxisScaleThousand,
                    decimals: properties1.xaxisScaleDecimals,
                    strict: typeof properties1.xaxisScaleMax === "number",
                    formatter: properties1.xaxisScaleFormatter
                });
                var segment1 = obj1.graphWidth / properties1.xaxisLabelsCount;
                for(var i1 = 0; i1 < obj1.xscale.labels.length; ++i1){
                    var x1 = properties1.marginLeft + segment1 * i1 + segment1 + properties1.xaxisLabelsOffsetx;
                    var y1 = obj1.height - properties1.marginBottom + (properties1.xaxis ? properties1.xaxisTickmarksLength + 6 : 10) + (properties1.xaxisLinewidth || 1) + properties1.xaxisLabelsOffsety;
                    RGraph.SVG.text({
                        object: obj1,
                        parent: obj1.svg.all,
                        tag: "labels.xaxis",
                        text: obj1.xscale.labels[i1],
                        x: x1,
                        y: y1,
                        halign: "center",
                        valign: "top",
                        font: textConf1.font,
                        size: textConf1.size,
                        bold: textConf1.bold,
                        italic: textConf1.italic,
                        color: textConf1.color
                    });
                }
                // Add the minimum label if labels are enabled
                if (properties1.xaxisLabelsCount > 0) {
                    var y1 = obj1.height - properties1.marginBottom + properties1.xaxisLabelsOffsety + (properties1.xaxis ? properties1.xaxisTickmarksLength + 6 : 10), str1 = RGraph.SVG.numberFormat({
                        object: obj1,
                        num: properties1.xaxisScaleMin.toFixed(properties1.xaxisScaleDecimals),
                        prepend: properties1.xaxisScaleUnitsPre,
                        append: properties1.xaxisScaleUnitsPost,
                        point: properties1.xaxisScalePoint,
                        thousand: properties1.xaxisScaleThousand,
                        formatter: properties1.xaxisScaleFormatter
                    });
                    var text1 = RGraph.SVG.text({
                        object: obj1,
                        parent: obj1.svg.all,
                        tag: "labels.xaxis",
                        text: typeof properties1.xaxisScaleFormatter === "function" ? properties1.xaxisScaleFormatter(this, properties1.xaxisScaleMin) : str1,
                        x: properties1.marginLeft + properties1.xaxisLabelsOffsetx,
                        y: y1,
                        halign: "center",
                        valign: "top",
                        font: textConf1.font,
                        size: textConf1.size,
                        bold: textConf1.bold,
                        italic: textConf1.italic,
                        color: textConf1.color
                    });
                }
            // =========================================================================
            } else {
                var segment1 = obj1.graphWidth / properties1.xaxisLabelsCount, scale1 = obj1.scale;
                for(var i1 = 0; i1 < scale1.labels.length; ++i1){
                    var x1 = properties1.marginLeft + segment1 * i1 + segment1 + properties1.xaxisLabelsOffsetx;
                    var y1 = obj1.height - properties1.marginBottom + (properties1.xaxis ? properties1.xaxisTickmarksLength + 6 : 10) + (properties1.xaxisLinewidth || 1) + properties1.xaxisLabelsOffsety;
                    // If the Y axis is positioned on the RHS then the
                    // labels should be reversed (HBar)
                    if ((obj1.type === "hbar" || obj1.type === "scatter" && properties1.xaxis) && properties1.yaxisPosition === "right") x1 = obj1.width - properties1.marginRight - segment1 * i1 - segment1 + properties1.xaxisLabelsOffsetx;
                    RGraph.SVG.text({
                        object: obj1,
                        parent: obj1.svg.all,
                        text: obj1.scale.labels[i1],
                        x: x1,
                        y: y1,
                        halign: "center",
                        valign: "top",
                        tag: "labels.xaxis",
                        font: textConf1.font,
                        size: textConf1.size,
                        bold: textConf1.bold,
                        italic: textConf1.italic,
                        color: textConf1.color
                    });
                }
                // Add the minimum label if labels are enabled
                if (properties1.xaxisLabelsCount > 0) {
                    var y1 = obj1.height - properties1.marginBottom + properties1.xaxisLabelsOffsety + (properties1.xaxis ? properties1.xaxisTickmarksLength + 6 : 10), str1 = RGraph.SVG.numberFormat({
                        object: obj1,
                        num: properties1.xaxisScaleMin.toFixed(properties1.xaxisScaleDecimals),
                        prepend: properties1.xaxisScaleUnitsPre,
                        append: properties1.xaxisScaleUnitsPost,
                        point: properties1.xaxisScalePoint,
                        thousand: properties1.xaxisScaleThousand,
                        formatter: properties1.xaxisScaleFormatter
                    });
                    var text1 = RGraph.SVG.text({
                        object: obj1,
                        parent: obj1.svg.all,
                        tag: "labels.xaxis",
                        text: typeof properties1.xaxisScaleFormatter === "function" ? properties1.xaxisScaleFormatter(this, properties1.xaxisScaleMin) : str1,
                        x: properties1.yaxisPosition === "right" ? obj1.width - properties1.marginRight + properties1.xaxisLabelsOffsetx : properties1.marginLeft + properties1.xaxisLabelsOffsetx,
                        y: y1,
                        halign: "center",
                        valign: "top",
                        font: textConf1.font,
                        size: textConf1.size,
                        bold: textConf1.bold,
                        italic: textConf1.talic,
                        color: textConf1.color
                    });
                }
            }
        } else if (typeof properties1.xaxisLabels === "object" && !RGraph.SVG.isNull(properties1.xaxisLabels)) {
            var angle1 = properties1.xaxisLabelsAngle;
            // Loop through the X labels
            if (properties1.xaxisLabelsPosition === "section") {
                var segment1 = (obj1.width - properties1.marginLeft - properties1.marginRight - (properties1.marginInnerLeft || 0) - (properties1.marginInnerRight || 0)) / properties1.xaxisLabels.length;
                for(var i1 = 0; i1 < properties1.xaxisLabels.length; ++i1){
                    var x1 = properties1.marginLeft + (properties1.marginInnerLeft || 0) + segment1 / 2 + i1 * segment1;
                    if (obj1.scale.max <= 0 && obj1.scale.min < obj1.scale.max) {
                        var y1 = properties1.marginTop - (RGraph.SVG.ISFF ? 5 : 10) - (properties1.xaxisLinewidth || 1) + properties1.xaxisLabelsOffsety;
                        var valign1 = "bottom";
                    } else {
                        var y1 = obj1.height - properties1.marginBottom + (RGraph.SVG.ISFF ? 5 : 10) + (properties1.xaxisLinewidth || 1) + properties1.xaxisLabelsOffsety;
                        var valign1 = "top";
                    }
                    RGraph.SVG.text({
                        object: obj1,
                        parent: obj1.svg.all,
                        tag: "labels.xaxis",
                        text: properties1.xaxisLabels[i1],
                        x: x1 + properties1.xaxisLabelsOffsetx,
                        y: y1,
                        valign: typeof angle1 === "number" && angle1 ? "center" : valign1,
                        halign: typeof angle1 === "number" && angle1 ? "right" : "center",
                        angle: angle1,
                        size: textConf1.size,
                        italic: textConf1.italic,
                        font: textConf1.font,
                        bold: textConf1.bold,
                        color: textConf1.color
                    });
                }
            } else if (properties1.xaxisLabelsPosition === "edge") {
                if (obj1.type === "line") var hmargin1 = properties1.marginInner;
                else var hmargin1 = 0;
                var segment1 = (obj1.graphWidth - hmargin1 - hmargin1) / (properties1.xaxisLabels.length - 1);
                for(var i1 = 0; i1 < properties1.xaxisLabels.length; ++i1){
                    var x1 = properties1.marginLeft + i1 * segment1 + hmargin1;
                    if (obj1.scale.max <= 0 && obj1.scale.min < 0) {
                        valign1 = "bottom";
                        y1 = properties1.marginTop - (RGraph.SVG.ISFF ? 5 : 10) - (properties1.xaxisTickmarksLength - 5) - (properties1.xaxisLinewidth || 1) + properties1.xaxisLabelsOffsety;
                    } else {
                        valign1 = "top";
                        y1 = obj1.height - properties1.marginBottom + (RGraph.SVG.ISFF ? 5 : 10) + (properties1.xaxisTickmarksLength - 5) + (properties1.xaxisLinewidth || 1) + properties1.xaxisLabelsOffsety;
                    }
                    RGraph.SVG.text({
                        object: obj1,
                        parent: obj1.svg.all,
                        tag: "labels.xaxis",
                        text: properties1.xaxisLabels[i1],
                        x: x1 + properties1.xaxisLabelsOffsetx,
                        y: y1,
                        valign: typeof angle1 === "number" && angle1 ? "center" : valign1,
                        halign: typeof angle1 === "number" && angle1 ? "right" : "center",
                        angle: angle1,
                        size: textConf1.size,
                        italic: textConf1.italic,
                        font: textConf1.font,
                        bold: textConf1.bold,
                        color: textConf1.color
                    });
                }
            }
        }
        // Save this so that it can be used for the title
        var labelsY1 = y1 + properties1.xaxisLabelsOffsety;
        //
        // DRAW THE TITLE
        //
        if (properties1.xaxisTitle) {
            // Get the size of the X axis labels
            var textConf_labels1 = RGraph.SVG.getTextConf({
                object: obj1,
                prefix: obj1.type === "hbar" ? "yaxisLabels" : "xaxisLabels"
            });
            var x1 = properties1.marginLeft + (obj1.width - properties1.marginLeft - properties1.marginRight) / 2 + (properties1.xaxisTitleOffsetx || 0);
            var y1 = labelsY1 + textConf_labels1.size * 1.5;
            // Get the size of the X axis title
            //if (properties.xaxisScale || (properties.xaxisLabels && properties.xaxisLabels.length) ) {
            var textConf1 = RGraph.SVG.getTextConf({
                object: obj1,
                prefix: "xaxisTitle"
            });
            //}
            // Specific X and Y coordinates for the title
            if (typeof properties1.xaxisTitleX === "number") x1 = properties1.xaxisTitleX;
            if (typeof properties1.xaxisTitleY === "number") y1 = properties1.xaxisTitleY;
            RGraph.SVG.text({
                object: obj1,
                parent: obj1.svg.all,
                tag: "xaxisTitle",
                text: String(properties1.xaxisTitle),
                x: x1 + (properties1.xaxisTitleOffsetx || 0),
                y: y1 + (properties1.xaxisTitleOffsety || 0),
                valign: typeof properties1.xaxisTitleValign === "string" ? properties1.xaxisTitleValign : "top",
                halign: typeof properties1.xaxisTitleHalign === "string" ? properties1.xaxisTitleHalign : "center",
                size: textConf1.size,
                italic: textConf1.italic,
                font: textConf1.font,
                bold: textConf1.bold,
                color: textConf1.color
            });
        }
    };
    //
    // Draws an Y axis
    //
    //@param The chart object
    //
    RGraph.SVG.drawYAxis = function(obj1) {
        var properties1 = obj1.properties;
        if (properties1.yaxis) {
            // The X coordinate that the Y axis is positioned at
            if (obj1.type === "hbar") {
                var x1 = obj1.getXCoord(properties1.xaxisScaleMin > 0 ? properties1.xaxisScaleMin : 0);
                if (properties1.xaxisScaleMin < 0 && properties1.xaxisScaleMax <= 0) x1 = obj1.getXCoord(properties1.xaxisScaleMax);
            } else if (properties1.yaxisPosition === "right") var x1 = obj1.width - properties1.marginRight;
            else var x1 = properties1.marginLeft;
            var axis1 = RGraph.SVG.create({
                svg: obj1.svg,
                parent: obj1.svg.all,
                type: "path",
                attr: {
                    d: "M{1} {2} L{3} {4}".format(x1, properties1.marginTop, x1, obj1.height - properties1.marginBottom),
                    stroke: properties1.yaxisColor,
                    fill: properties1.yaxisColor,
                    "stroke-width": typeof properties1.yaxisLinewidth === "number" ? properties1.yaxisLinewidth : 1,
                    "shape-rendering": "crispEdges",
                    "stroke-linecap": "square"
                }
            });
            if (obj1.type === "hbar") {
                var height1 = (obj1.graphHeight - properties1.marginInnerTop - properties1.marginInnerBottom) / (properties1.yaxisLabels.length || properties1.yaxisTickmarksCount), y1 = properties1.marginTop + properties1.marginInnerTop, len1 = properties1.yaxisLabels.length, startX1 = obj1.getXCoord(0) + (properties1.xaxisScaleMin < 0 ? properties1.yaxisTickmarksLength : 0), endX1 = obj1.getXCoord(0) - properties1.yaxisTickmarksLength;
                // Now change the startX/endX if the Y axisPosition is right
                if (properties1.yaxisPosition == "right") {
                    startX1 = obj1.getXCoord(0) + (properties1.xaxisScaleMax > 0 && properties1.xaxisScaleMin < 0 ? -3 : 0);
                    endX1 = obj1.getXCoord(0) + properties1.yaxisTickmarksLength;
                }
                // Edge case
                if (properties1.xaxisScaleMin < 0 && properties1.xaxisScaleMax <= 0) {
                    startX1 = obj1.getXCoord(properties1.xaxisScaleMax);
                    endX1 = obj1.getXCoord(properties1.xaxisScaleMax) + 5;
                }
                // Edge case
                if (properties1.xaxisScaleMin > 0 && properties1.xaxisScaleMax > properties1.xaxisScaleMin && properties1.yaxisPosition === "left") {
                    startX1 = obj1.getXCoord(properties1.xaxisScaleMin);
                    endX1 = obj1.getXCoord(properties1.xaxisScaleMin) - 3;
                }
                // A custom number of tickmarks
                if (typeof properties1.yaxisLabelsPositionSectionTickmarksCount === "number") {
                    len1 = properties1.yaxisLabelsPositionSectionTickmarksCount;
                    height1 = (obj1.graphHeight - properties1.marginInnerTop - properties1.marginInnerBottom) / len1;
                }
                //
                // Draw the tickmarks
                //
                if (properties1.yaxisTickmarks) {
                    for(var i1 = 0; i1 < (len1 || properties1.yaxisTickmarksCount); ++i1){
                        // Draw the Y axis tickmarks for the HBar
                        var tick1 = RGraph.SVG.create({
                            svg: obj1.svg,
                            parent: obj1.svg.all,
                            type: "path",
                            attr: {
                                d: "M{1} {2} L{3} {4}".format(startX1, y1, endX1, y1 + 0.001),
                                stroke: properties1.yaxisColor,
                                "stroke-width": typeof properties1.yaxisLinewidth === "number" ? properties1.yaxisLinewidth : 1,
                                "shape-rendering": "crispEdges"
                            }
                        });
                        y1 += height1;
                    }
                    // Draw an extra tick if the X axis position is not zero or
                    // if the xaxis is not being shown
                    if (properties1.xaxis === false) {
                        if (obj1.type === "hbar" && properties1.xaxisScaleMin <= 0 && properties1.xaxisScaleMax < 0) {
                            var startX1 = obj1.getXCoord(properties1.xaxisScaleMax);
                            var endX1 = obj1.getXCoord(properties1.xaxisScaleMax) + properties1.yaxisTickmarksLength;
                        } else {
                            var startX1 = obj1.getXCoord(0) - properties1.yaxisTickmarksLength;
                            var endX1 = obj1.getXCoord(0) + (properties1.xaxisScaleMin < 0 ? properties1.yaxisTickmarksLength : 0);
                            if (properties1.yaxisPosition === "right") {
                                var startX1 = obj1.getXCoord(0) - (obj1.scale.min === 0 && !obj1.mirrorScale ? 0 : properties1.yaxisTickmarksLength);
                                var endX1 = obj1.getXCoord(0) + properties1.yaxisTickmarksLength;
                            }
                        }
                        var axis1 = RGraph.SVG.create({
                            svg: obj1.svg,
                            parent: obj1.svg.all,
                            type: "path",
                            attr: {
                                d: "M{1} {2} L{3} {4}".format(startX1, Math.round(obj1.height - properties1.marginBottom - parseFloat(properties1.marginInnerBottom)), endX1, Math.round(obj1.height - properties1.marginBottom - parseFloat(properties1.marginInnerBottom))),
                                stroke: obj1.properties.yaxisColor,
                                "stroke-width": typeof properties1.yaxisLinewidth === "number" ? properties1.yaxisLinewidth : 1,
                                "shape-rendering": "crispEdges"
                            }
                        });
                    }
                }
            //
            // Bar, Line etc types of chart
            //
            } else {
                var height1 = obj1.graphHeight / properties1.yaxisLabelsCount, y1 = properties1.marginTop, len1 = properties1.yaxisLabelsCount, startX1 = properties1.marginLeft, endX1 = properties1.marginLeft - properties1.yaxisTickmarksLength;
                // Adjust the startX and endX positions for when the Y axis is
                // on the RHS
                if (properties1.yaxisPosition === "right") {
                    startX1 = obj1.width - properties1.marginRight;
                    endX1 = startX1 + properties1.yaxisTickmarksLength;
                }
                // A custom number of tickmarks
                if (typeof properties1.yaxisLabelsPositionEdgeTickmarksCount === "number") {
                    len1 = properties1.yaxisLabelsPositionEdgeTickmarksCount;
                    height1 = obj1.graphHeight / len1;
                }
                //
                // Draw the tickmarks
                //
                if (properties1.yaxisTickmarks) {
                    for(var i1 = 0; i1 < len1; ++i1){
                        //var zeropoint = obj.getYCoord(obj.min);
                        // Egde case
                        if (!(obj1.max <= 0 && obj1.min < obj1.max && y1 === obj1.properties.marginTop) && !(obj1.min < 0 && obj1.max > 0 && y1 <= obj1.getYCoord(0) + 1 && y1 >= obj1.getYCoord(0) - 1)) // Avoid a tickmark at zero                        
                        //if (y > (zeropoint - 2) && y < (zeropoint + 2) && i === 0) {
                        //    y += height;
                        //    continue;
                        //}
                        // Draw the axis
                        var axis1 = RGraph.SVG.create({
                            svg: obj1.svg,
                            parent: obj1.svg.all,
                            type: "path",
                            attr: {
                                d: "M{1} {2} L{3} {4}".format(startX1, y1, endX1, y1),
                                stroke: properties1.yaxisColor,
                                "stroke-width": typeof properties1.yaxisLinewidth === "number" ? properties1.yaxisLinewidth : 1,
                                "shape-rendering": "crispEdges"
                            }
                        });
                        y1 += height1;
                    }
                    // Draw an extra tick if the X axis position is not zero or
                    // if the xaxis is not being shown
                    if ((properties1.yaxisScaleMin !== 0 || properties1.xaxis === false || obj1.mirrorScale) && !(obj1.scale.min > 0 && obj1.scale.max > 0)) {
                        // Adjust the startX and endX positions for when the Y axis is
                        // on the RHS
                        if (properties1.yaxisPosition === "right") {
                            startX1 = obj1.width - properties1.marginRight;
                            endX1 = startX1 + properties1.yaxisTickmarksLength;
                        }
                        var axis1 = RGraph.SVG.create({
                            svg: obj1.svg,
                            parent: obj1.svg.all,
                            type: "path",
                            attr: {
                                d: "M{1} {2} L{3} {4}".format(startX1, obj1.height - properties1.marginBottom, endX1, obj1.height - properties1.marginBottom),
                                stroke: properties1.yaxisColor,
                                "stroke-width": typeof properties1.yaxisLinewidth === "number" ? properties1.yaxisLinewidth : 1,
                                "shape-rendering": "crispEdges"
                            }
                        });
                    }
                }
            }
        }
        // Get the text configuration
        var textConf1 = RGraph.SVG.getTextConf({
            object: obj1,
            prefix: "yaxisLabels"
        });
        //
        // Draw the Y axis labels
        //
        if (properties1.yaxisScale) {
            var segment1 = (obj1.height - properties1.marginTop - properties1.marginBottom) / properties1.yaxisLabelsCount;
            for(var i1 = 0; i1 < obj1.scale.labels.length; ++i1){
                var y1 = obj1.height - properties1.marginBottom - segment1 * i1 - segment1;
                RGraph.SVG.text({
                    object: obj1,
                    parent: obj1.svg.all,
                    tag: "labels.yaxis",
                    text: obj1.scale.labels[i1],
                    x: properties1.yaxisPosition === "right" ? obj1.width - properties1.marginRight + 7 + (properties1.yaxis ? properties1.yaxisTickmarksLength - 3 : 0) + properties1.yaxisLabelsOffsetx : properties1.marginLeft - 7 - (properties1.yaxis ? properties1.yaxisTickmarksLength - 3 : 0) + properties1.yaxisLabelsOffsetx,
                    y: y1 + properties1.yaxisLabelsOffsety,
                    halign: properties1.yaxisLabelsHalign || (properties1.yaxisPosition === "right" ? "left" : "right"),
                    valign: properties1.yaxisLabelsValign || "center",
                    font: textConf1.font,
                    size: textConf1.size,
                    bold: textConf1.bold,
                    italic: textConf1.italic,
                    color: textConf1.color
                });
            }
            //
            // Add the minimum label
            //
            var y1 = obj1.height - properties1.marginBottom, // Changed this to use obj.scale.min instead of properties.yaxisScaleMin
            // on 11/11/18 because mirrored scales had zero as the bottom
            // value when it should have been a mirror of the top value
            str1 = properties1.yaxisScaleUnitsPre + obj1.scale.min.toFixed(properties1.yaxisScaleDecimals).replace(/\./, properties1.yaxisScalePoint) + properties1.yaxisScaleUnitsPost;
            // Fix a bugettte that's showing the - sign after the unitsPre - should
            // be showing them before
            str1 = str1.replace(properties1.yaxisScaleUnitsPre + "-", "-" + properties1.yaxisScaleUnitsPre);
            var text1 = RGraph.SVG.text({
                object: obj1,
                parent: obj1.svg.all,
                tag: "labels.yaxis",
                text: typeof properties1.yaxisScaleFormatter === "function" ? properties1.yaxisScaleFormatter(this, properties1.yaxisScaleMin) : str1,
                x: properties1.yaxisPosition === "right" ? obj1.width - properties1.marginRight + 7 + (properties1.yaxis ? properties1.yaxisTickmarksLength - 3 : 0) + properties1.yaxisLabelsOffsetx : properties1.marginLeft - 7 - (properties1.yaxis ? properties1.yaxisTickmarksLength - 3 : 0) + properties1.yaxisLabelsOffsetx,
                y: y1 + properties1.yaxisLabelsOffsety,
                halign: properties1.yaxisPosition === "right" ? "left" : "right",
                valign: "center",
                font: textConf1.font,
                size: textConf1.size,
                bold: textConf1.bold,
                italic: textConf1.italic,
                color: textConf1.color
            });
        //
        // Draw Y axis labels (eg when specific labels are defined or
        // the chart is an HBar
        //
        } else if (properties1.yaxisLabels && properties1.yaxisLabels.length) for(var i1 = 0; i1 < properties1.yaxisLabels.length; ++i1){
            var segment1 = (obj1.graphHeight - (properties1.marginInnerTop || 0) - (properties1.marginInnerBottom || 0)) / properties1.yaxisLabels.length, y1 = properties1.marginTop + (properties1.marginInnerTop || 0) + segment1 * i1 + segment1 / 2 + properties1.yaxisLabelsOffsety, x1 = properties1.marginLeft - 7 - (properties1.yaxisLinewidth || 1) + properties1.yaxisLabelsOffsetx, halign1 = "right";
            if (properties1.yaxisPosition === "right") {
                halign1 = "left";
                x1 = obj1.width - properties1.marginRight + 7 + (properties1.yaxisLinewidth || 1) + properties1.yaxisLabelsOffsetx;
            }
            // HBar labels
            if (obj1.type === "hbar" && (obj1.scale.min < obj1.scale.max && obj1.scale.max <= 0 || properties1.yaxisPosition === "right")) {
                halign1 = "left";
                x1 = obj1.width - properties1.marginRight + 7 + properties1.yaxisLabelsOffsetx;
            // HBar labels (again?)
            } else if (obj1.type === "hbar" && !properties1.yaxisLabelsSpecific) {
                var segment1 = (obj1.graphHeight - (properties1.marginInnerTop || 0) - (properties1.marginInnerBottom || 0)) / properties1.yaxisLabels.length;
                y1 = properties1.marginTop + (properties1.marginInnerTop || 0) + segment1 * i1 + segment1 / 2 + properties1.yaxisLabelsOffsety;
            // Specific scale
            } else {
                var segment1 = (obj1.graphHeight - (properties1.marginInnerTop || 0) - (properties1.marginInnerBottom || 0)) / (properties1.yaxisLabels.length - 1);
                y1 = obj1.height - properties1.marginBottom - segment1 * i1 + properties1.yaxisLabelsOffsety;
            }
            var text1 = RGraph.SVG.text({
                object: obj1,
                parent: obj1.svg.all,
                tag: "labels.yaxis",
                text: properties1.yaxisLabels[i1] ? properties1.yaxisLabels[i1] : "",
                x: x1,
                y: y1,
                halign: halign1,
                valign: "center",
                font: textConf1.font,
                size: textConf1.size,
                bold: textConf1.bold,
                italic: textConf1.italic,
                color: textConf1.color
            });
        }
        //
        // Draw the title
        //
        if (properties1.yaxisTitle) {
            //
            // Get the text width of the labels so that the position of the title
            // can be adjusted
            //
            if (obj1.scale && obj1.scale.labels) {
                var textConf1 = RGraph.SVG.getTextConf({
                    object: obj1,
                    prefix: "yaxisLabels"
                });
                var maxLabelLength1 = RGraph.SVG.measureText({
                    text: obj1.scale.labels[obj1.scale.labels.length - 1],
                    bold: textConf1.bold,
                    font: textConf1.font,
                    size: textConf1.size,
                    italic: textConf1.italic
                })[0];
            }
            // If the chart is an HBar chart then the maximum length of the labels
            // needs to be calculated so that the Y axis title doesn't overlap them
            if (obj1.type === "hbar" && properties1.yaxisLabels && properties1.yaxisLabels.length) maxLabelLength1 = function(labels1) {
                var textConf1 = RGraph.SVG.getTextConf({
                    object: obj1,
                    prefix: "yaxisLabels"
                });
                for(var i1 = 0, max1 = 0; i1 < labels1.length; ++i1){
                    var dim1 = RGraph.SVG.measureText({
                        text: labels1[i1],
                        bold: textConf1.bold,
                        font: textConf1.font,
                        size: textConf1.size,
                        italic: textConf1.italic
                    });
                    max1 = Math.max(max1, dim1[0]);
                }
                return max1;
            }(properties1.yaxisLabels);
            var x1 = properties1.yaxisPosition === "right" ? obj1.width - properties1.marginRight + 5 + maxLabelLength1 + 10 : properties1.marginLeft - 5 - maxLabelLength1 - 10;
            var y1 = (obj1.height - properties1.marginTop - properties1.marginBottom) / 2 + properties1.marginTop;
            // Specific X and Y coordinates for the title
            if (typeof properties1.yaxisTitleOffsetx === "number") x1 += properties1.yaxisTitleOffsetx;
            if (typeof properties1.yaxisTitleOffsety === "number") y1 += properties1.yaxisTitleOffsety;
            // Specific X and Y coordinates for the title
            if (typeof properties1.yaxisTitleX === "number") x1 = properties1.yaxisTitleX;
            if (typeof properties1.yaxisTitleY === "number") y1 = properties1.yaxisTitleY;
            // Get the Y axis title configuration
            var textConf1 = RGraph.SVG.getTextConf({
                object: obj1,
                prefix: "yaxisTitle"
            });
            // Draw the text
            RGraph.SVG.text({
                object: obj1,
                parent: obj1.svg.all,
                tag: "yaxis.title",
                font: textConf1.font,
                size: textConf1.size,
                bold: textConf1.bold,
                italic: textConf1.italic,
                color: textConf1.color,
                x: x1,
                y: y1,
                text: properties1.yaxisTitle.toString(),
                valign: properties1.yaxisTitleValign || "bottom",
                halign: properties1.yaxisTitleHalign || "center",
                angle: properties1.yaxisPosition === "right" ? 270 : 90
            });
        }
    };
    //
    // Draws the background
    //
    //@param The chart object
    //
    RGraph.SVG.drawBackground = function(obj1) {
        var properties1 = obj1.properties;
        // Set these properties so that if it doesn't exist things don't fail
        if (typeof properties1.variant3dOffsetx !== "number") properties1.variant3dOffsetx = 0;
        if (typeof properties1.variant3dOffsety !== "number") properties1.variant3dOffsety = 0;
        if (properties1.backgroundColor) RGraph.SVG.create({
            svg: obj1.svg,
            parent: obj1.svg.all,
            type: "rect",
            attr: {
                x: -1 + properties1.variant3dOffsetx + properties1.marginLeft,
                y: -1 - properties1.variant3dOffsety + properties1.marginTop,
                width: parseFloat(obj1.svg.getAttribute("width")) + 2 - properties1.marginLeft - properties1.marginRight,
                height: parseFloat(obj1.svg.getAttribute("height")) + 2 - properties1.marginTop - properties1.marginBottom,
                fill: properties1.backgroundColor
            }
        });
        // Render a background image
        // <image xlink:href="firefox.jpg" x="0" y="0" height="50px" width="50px"/>
        if (properties1.backgroundImage) {
            var attr1 = {
                "xlink:href": properties1.backgroundImage,
                //preserveAspectRatio: 'xMidYMid slice',
                preserveAspectRatio: properties1.backgroundImageAspect || "none",
                x: properties1.marginLeft,
                y: properties1.marginTop
            };
            if (properties1.backgroundImageStretch) {
                attr1.x = properties1.marginLeft + properties1.variant3dOffsetx;
                attr1.y = properties1.marginTop + properties1.variant3dOffsety;
                attr1.width = obj1.width - properties1.marginLeft - properties1.marginRight;
                attr1.height = obj1.height - properties1.marginTop - properties1.marginBottom;
            } else {
                if (typeof properties1.backgroundImageX === "number") attr1.x = properties1.backgroundImageX + properties1.variant3dOffsetx;
                else attr1.x = properties1.marginLeft + properties1.variant3dOffsetx;
                if (typeof properties1.backgroundImageY === "number") attr1.y = properties1.backgroundImageY + properties1.variant3dOffsety;
                else attr1.y = properties1.marginTop + properties1.variant3dOffsety;
                if (typeof properties1.backgroundImageW === "number") attr1.width = properties1.backgroundImageW;
                if (typeof properties1.backgroundImageH === "number") attr1.height = properties1.backgroundImageH;
            }
            //
            // Account for the chart being 3d
            //
            if (properties1.variant === "3d") {
                attr1.x += properties1.variant3dOffsetx;
                attr1.y -= properties1.variant3dOffsety;
            }
            var img1 = RGraph.SVG.create({
                svg: obj1.svg,
                parent: obj1.svg.all,
                type: "image",
                attr: attr1,
                style: {
                    opacity: typeof properties1.backgroundImageOpacity === "number" ? properties1.backgroundImageOpacity : 1
                }
            });
            // Set the width and height if necessary
            if (!properties1.backgroundImageStretch) {
                var img21 = new Image();
                img21.src = properties1.backgroundImage;
                img21.onload = function() {
                    if (properties1.backgroundImageW === "number") img1.setAttribute("width", properties1.backgroundImageW);
                    if (properties1.backgroundImageH === "number") img1.setAttribute("height", properties1.backgroundImageH);
                };
            }
        }
        if (properties1.backgroundGrid) {
            var parts1 = [];
            // Add the horizontal lines to the path
            if (properties1.backgroundGridHlines) {
                if (typeof properties1.backgroundGridHlinesCount === "number") var count1 = properties1.backgroundGridHlinesCount;
                else if (obj1.type === "hbar" || obj1.type === "bipolar") {
                    if (typeof properties1.yaxisLabels === "object" && !RGraph.SVG.isNull(properties1.yaxisLabels) && properties1.yaxisLabels.length) var count1 = properties1.yaxisLabels.length;
                    else if (obj1.type === "hbar") var count1 = obj1.data.length;
                    else if (obj1.type === "bipolar") var count1 = obj1.left.length;
                } else var count1 = properties1.yaxisLabelsCount || 5;
                for(var i1 = 0; i1 <= count1; ++i1)parts1.push("M{1} {2} L{3} {4}".format(properties1.marginLeft + properties1.variant3dOffsetx, properties1.marginTop + obj1.graphHeight / count1 * i1 - properties1.variant3dOffsety, obj1.width - properties1.marginRight + properties1.variant3dOffsetx, properties1.marginTop + obj1.graphHeight / count1 * i1 - properties1.variant3dOffsety));
                // Add an extra background grid line to the path - this its
                // underneath the X axis and shows up if its not there.
                parts1.push("M{1} {2} L{3} {4}".format(properties1.marginLeft + properties1.variant3dOffsetx, obj1.height - properties1.marginBottom - properties1.variant3dOffsety, obj1.width - properties1.marginRight + properties1.variant3dOffsetx, obj1.height - properties1.marginBottom - properties1.variant3dOffsety));
            }
            // Add the vertical lines to the path
            if (properties1.backgroundGridVlines) {
                if (obj1.type === "line" && RGraph.SVG.isArray(obj1.data[0])) var len1 = obj1.data[0].length;
                else if (obj1.type === "hbar") var len1 = properties1.xaxisLabelsCount || 10;
                else if (obj1.type === "bipolar") var len1 = properties1.xaxisLabelsCount || 10;
                else if (obj1.type === "scatter") var len1 = properties1.xaxisLabels && properties1.xaxisLabels.length || 10;
                else if (obj1.type === "waterfall") var len1 = obj1.data.length;
                else var len1 = obj1.data.length;
                var count1 = typeof properties1.backgroundGridVlinesCount === "number" ? properties1.backgroundGridVlinesCount : len1;
                if (properties1.xaxisLabelsPosition === "edge") count1--;
                for(var i1 = 0; i1 <= count1; ++i1)parts1.push("M{1} {2} L{3} {4}".format(properties1.marginLeft + obj1.graphWidth / count1 * i1 + properties1.variant3dOffsetx, properties1.marginTop - properties1.variant3dOffsety, properties1.marginLeft + obj1.graphWidth / count1 * i1 + properties1.variant3dOffsetx, obj1.height - properties1.marginBottom - properties1.variant3dOffsety));
            }
            // Add the box around the grid
            if (properties1.backgroundGridBorder) parts1.push("M{1} {2} L{3} {4} L{5} {6} L{7} {8} z".format(properties1.marginLeft + properties1.variant3dOffsetx, properties1.marginTop - properties1.variant3dOffsety, obj1.width - properties1.marginRight + properties1.variant3dOffsetx, properties1.marginTop - properties1.variant3dOffsety, obj1.width - properties1.marginRight + properties1.variant3dOffsetx, obj1.height - properties1.marginBottom - properties1.variant3dOffsety, properties1.marginLeft + properties1.variant3dOffsetx, obj1.height - properties1.marginBottom - properties1.variant3dOffsety));
            // Get the dash array if its defined to be dotted or dashed
            var dasharray1;
            if (properties1.backgroundGridDashed) dasharray1 = [
                3,
                5
            ];
            else if (properties1.backgroundGridDotted) dasharray1 = [
                1,
                3
            ];
            else if (properties1.backgroundGridDashArray) dasharray1 = properties1.backgroundGridDashArray;
            else dasharray1 = "";
            // Now draw the path
            var grid1 = RGraph.SVG.create({
                svg: obj1.svg,
                parent: obj1.svg.all,
                type: "path",
                attr: {
                    className: "rgraph_background_grid",
                    d: parts1.join(" "),
                    stroke: properties1.backgroundGridColor,
                    fill: "rgba(0,0,0,0)",
                    "stroke-width": properties1.backgroundGridLinewidth,
                    "shape-rendering": "crispEdges",
                    "stroke-dasharray": dasharray1
                },
                style: {
                    pointerEvents: "none"
                }
            });
        }
        // Draw the title and subtitle
        if (obj1.type !== "bipolar") RGraph.SVG.drawTitle(obj1);
    };
    //
    // Returns true/false as to whether the given variable is null or not
    // 
    // @param mixed arg The argument to check
    //
    RGraph.SVG.isNull = function(arg1) {
        // must BE DOUBLE EQUALS - NOT TRIPLE
        if (arg1 == null || typeof arg1 === "object" && !arg1) return true;
        return false;
    };
    //
    // Returns an appropriate scale. The return value is actualy an object consisting of:
    //  scale.max
    //  scale.min
    //  scale.scale
    // 
    // @param  opt object Configuration properties for the function
    // @return     object An object containg scale information
    //
    RGraph.SVG.getScale = function(opt1) {
        var obj1 = opt1.object, properties1 = obj1.properties, numlabels1 = opt1.numlabels, unitsPre1 = opt1.unitsPre, unitsPost1 = opt1.unitsPost, max1 = Number(opt1.max), min1 = Number(opt1.min), strict1 = opt1.strict, decimals1 = Number(opt1.decimals), point1 = opt1.point, thousand1 = opt1.thousand, originalMax1 = max1, round1 = opt1.round, scale1 = {
            max: 1,
            labels: [],
            values: []
        }, formatter1 = opt1.formatter;
        //
        // Special case for 0
        // 
        // ** Must be first **
        //
        if (max1 === 0 && min1 === 0) {
            var max1 = 1;
            for(var i1 = 0; i1 < numlabels1; ++i1){
                var label1 = ((max1 - min1) / numlabels1 * (i1 + 1) + min1).toFixed(decimals1);
                scale1.labels.push(unitsPre1 + label1 + unitsPost1);
                scale1.values.push(parseFloat(label1));
            }
        //
        // Manually do decimals
        //
        } else if (max1 <= 1 && !strict1) {
            var arr1 = [
                1,
                0.5,
                0.10,
                0.05,
                0.010,
                0.005,
                0.0010,
                0.0005,
                0.00010,
                0.00005,
                0.000010,
                0.000005,
                0.0000010,
                0.0000005,
                0.00000010,
                0.00000005,
                0.000000010,
                0.000000005,
                0.0000000010,
                0.0000000005,
                0.00000000010,
                0.00000000005,
                0.000000000010,
                0.000000000005,
                0.0000000000010,
                0.0000000000005
            ], vals1 = [];
            for(var i1 = 0; i1 < arr1.length; ++i1)if (max1 > arr1[i1]) {
                i1--;
                break;
            }
            scale1.max = arr1[i1];
            scale1.labels = [];
            scale1.values = [];
            for(var j1 = 0; j1 < numlabels1; ++j1){
                var value1 = ((arr1[i1] - min1) / numlabels1 * (j1 + 1) + min1).toFixed(decimals1);
                scale1.values.push(value1);
                scale1.labels.push(RGraph.SVG.numberFormat({
                    object: obj1,
                    num: value1,
                    prepend: unitsPre1,
                    append: unitsPost1,
                    point: properties1.yaxisScalePoint,
                    thousand: properties1.yaxisScaleThousand,
                    formatter: formatter1
                }));
            }
        } else if (!strict1) {
            //
            // Now comes the scale handling for integer values
            //
            // This accommodates decimals by rounding the max up to the next integer
            max1 = Math.ceil(max1);
            var interval1 = Math.pow(10, Math.max(1, Number(String(Number(max1) - Number(min1)).length - 1)));
            var topValue1 = interval1;
            while(topValue1 < max1)topValue1 += interval1 / 2;
            // Handles cases where the max is (for example) 50.5
            if (Number(originalMax1) > Number(topValue1)) topValue1 += interval1 / 2;
            // Custom if the max is greater than 5 and less than 10
            if (max1 <= 10) topValue1 = Number(originalMax1) <= 5 ? 5 : 10;
            // Added 02/11/2010 to create "nicer" scales
            if (obj1 && typeof round1 == "boolean" && round1) topValue1 = 10 * interval1;
            scale1.max = topValue1;
            for(var i1 = 0; i1 < numlabels1; ++i1){
                var label1 = RGraph.SVG.numberFormat({
                    object: obj1,
                    num: ((i1 + 1) / numlabels1 * (topValue1 - min1) + min1).toFixed(decimals1),
                    prepend: unitsPre1,
                    append: unitsPost1,
                    point: point1,
                    thousand: thousand1,
                    formatter: formatter1
                });
                scale1.labels.push(label1);
                scale1.values.push(((i1 + 1) / numlabels1 * (topValue1 - min1) + min1).toFixed(decimals1));
            }
        } else if (typeof max1 === "number" && strict1) {
            //
            // ymax is set and also strict
            //
            for(var i1 = 0; i1 < numlabels1; ++i1){
                scale1.labels.push(RGraph.SVG.numberFormat({
                    object: obj1,
                    formatter: formatter1,
                    num: ((i1 + 1) / numlabels1 * (max1 - min1) + min1).toFixed(decimals1),
                    prepend: unitsPre1,
                    append: unitsPost1,
                    point: point1,
                    thousand: thousand1
                }));
                scale1.values.push(((i1 + 1) / numlabels1 * (max1 - min1) + min1).toFixed(decimals1));
            }
            // ???
            scale1.max = max1;
        }
        scale1.unitsPre = unitsPre1;
        scale1.unitsPost = unitsPost1;
        scale1.point = point1;
        scale1.decimals = decimals1;
        scale1.thousand = thousand1;
        scale1.numlabels = numlabels1;
        scale1.round = Boolean(round1);
        scale1.min = min1;
        //
        // Convert all of the scale values to numbers
        //
        for(var i1 = 0; i1 < scale1.values.length; ++i1)scale1.values[i1] = parseFloat(scale1.values[i1]);
        return scale1;
    };
    //
    // Pads/fills the array
    // 
    // @param  array arr The array
    // @param  int   len The length to pad the array to
    // @param  mixed     The value to use to pad the array (optional)
    //
    //RGraph.SVG.arrayFill = 
    //RGraph.SVG.arrayPad  = function (opt)
    //{
    //    var arr   = opt.array,
    //        len   = opt.length,
    //        value = (typeof opt.value === 'undefined' ? null : opt.value);
    //    if (arr.length < len) {            
    //        for (var i=arr.length; i<len; i+=1) {
    //            arr[i] = value;
    //        }
    //    }
    //    
    //    return arr;
    //};
    //
    // An array sum function
    // 
    // @param  array arr The  array to calculate the total of
    // @return int       The summed total of the arrays elements
    //
    RGraph.SVG.arraySum = function(arr1) {
        // Allow integers
        if (typeof arr1 === "number") return arr1;
        // Account for null
        if (RGraph.SVG.isNull(arr1)) return 0;
        var i1, sum1, len1 = arr1.length;
        for(i1 = 0, sum1 = 0; i1 < len1; sum1 += arr1[i1++]);
        return sum1;
    };
    //
    // Returns the maximum numeric value which is in an array. This function IS NOT
    // recursive
    // 
    // @param  array arr The array (can also be a number, in which case it's returned as-is)
    // @param  int       Whether to ignore signs (ie negative/positive)
    // @return int       The maximum value in the array
    //
    RGraph.SVG.arrayMax = function(arr1) {
        var max1 = null;
        if (typeof arr1 === "number") return arr1;
        if (RGraph.SVG.isNull(arr1)) return 0;
        for(var i1 = 0, len1 = arr1.length; i1 < len1; ++i1)if (typeof arr1[i1] === "number") {
            var val1 = arguments[1] ? Math.abs(arr1[i1]) : arr1[i1];
            if (typeof max1 === "number") max1 = Math.max(max1, val1);
            else max1 = val1;
        }
        return max1;
    };
    //
    // Returns the minimum numeric value which is in an array
    // 
    // @param  array arr The array (can also be a number, in which case it's returned as-is)
    // @param  int       Whether to ignore signs (ie negative/positive)
    // @return int       The minimum value in the array
    //
    RGraph.SVG.arrayMin = function(arr1) {
        var max1 = null, min1 = null, ma1 = Math;
        if (typeof arr1 === "number") return arr1;
        if (RGraph.SVG.isNull(arr1)) return 0;
        for(var i1 = 0, len1 = arr1.length; i1 < len1; ++i1)if (typeof arr1[i1] === "number") {
            var val1 = arguments[1] ? Math.abs(arr1[i1]) : arr1[i1];
            if (typeof min1 === "number") min1 = Math.min(min1, val1);
            else min1 = val1;
        }
        return min1;
    };
    //
    // Returns the maximum value which is in an array
    // 
    // @param  array arr The array
    // @param  int   len The length to pad the array to
    // @param  mixed     The value to use to pad the array (optional)
    //
    RGraph.SVG.arrayFill = RGraph.SVG.arrayPad = function(args1) {
        if (arguments.length === 1) var arr1 = args1.array, val1 = args1.value, len1 = args1.length;
        else var arr1 = arguments[0], len1 = arguments[1], val1 = arguments[2];
        if (arr1.length < len1) {
            var val1 = typeof val1 !== "undefined" ? val1 : null;
            for(var i1 = arr1.length; i1 < len1; i1 += 1)arr1[i1] = val1;
        }
        return arr1;
    };
    //
    // An array sum function
    // 
    // @param  array arr The  array to calculate the total of
    // @return int       The summed total of the arrays elements
    //
    RGraph.SVG.arraySum = function(arr1) {
        // Allow integers
        if (typeof arr1 === "number") return arr1;
        // Account for null
        if (RGraph.SVG.isNull(arr1)) return 0;
        var i1, sum1, len1 = arr1.length;
        for(i1 = 0, sum1 = 0; i1 < len1; sum1 += arr1[i1++]);
        return sum1;
    };
    //
    // Takes any number of arguments and adds them to one big linear array
    // which is then returned
    // 
    // @param ... mixed The data to linearise. You can strings, booleans, numbers or arrays
    //
    RGraph.SVG.arrayLinearize = function() {
        var arr1 = [], args1 = arguments;
        for(var i1 = 0, len1 = args1.length; i1 < len1; ++i1){
            if (typeof args1[i1] === "object" && args1[i1]) for(var j1 = 0, len21 = args1[i1].length; j1 < len21; ++j1){
                var sub1 = RGraph.SVG.arrayLinearize(args1[i1][j1]);
                for(var k1 = 0, len31 = sub1.length; k1 < len31; ++k1)arr1.push(sub1[k1]);
            }
            else arr1.push(args1[i1]);
        }
        return arr1;
    };
    //
    // Takes one off the front of the given array and returns the new array.
    // 
    // @param array arr The array from which to take one off the front of array 
    // 
    // @return array The new array
    //
    RGraph.SVG.arrayShift = function(arr1) {
        var ret1 = [];
        for(var i1 = 1, len1 = arr1.length; i1 < len1; ++i1)ret1.push(arr1[i1]);
        return ret1;
    };
    //
    // Reverses the order of an array
    // 
    // @param array arr The array to reverse
    //
    RGraph.SVG.arrayReverse = function(arr1) {
        if (!arr1) return;
        var newarr1 = [];
        for(var i1 = arr1.length - 1; i1 >= 0; i1 -= 1)newarr1.push(arr1[i1]);
        return newarr1;
    };
    //
    // Makes a clone of an object
    // 
    // @param obj val The object to clone
    //
    RGraph.SVG.clone = RGraph.SVG.arrayClone = function(obj1) {
        //if(obj === null || typeof obj !== 'object') {
        //    return obj;
        //}
        // Can't seem to stringify references to DOM nodes so this won't work. Bummer.
        //
        //return JSON.parse(JSON.stringify(obj));
        if (obj1 === null || typeof obj1 !== "object") return obj1;
        if (RGraph.SVG.isArray(obj1)) {
            var temp1 = [];
            for(var i1 = 0, len1 = obj1.length; i1 < len1; ++i1){
                if (typeof obj1[i1] === "number") temp1[i1] = function(arg1) {
                    return Number(arg1);
                }(obj1[i1]);
                else if (typeof obj1[i1] === "string") temp1[i1] = function(arg1) {
                    return String(arg1);
                }(obj1[i1]);
                else if (typeof obj1[i1] === "function") temp1[i1] = obj1[i1];
                else temp1[i1] = RGraph.SVG.arrayClone(obj1[i1]);
            }
        } else if (typeof obj1 === "object") {
            var temp1 = {};
            for(var i1 in obj1)if (typeof i1 === "string") temp1[i1] = obj1[i1];
        }
        return temp1;
    };
    //
    // Converts an the truthy values to falsey values and vice-versa
    //
    RGraph.SVG.arrayInvert = function(arr1) {
        for(var i1 = 0, len1 = arr1.length; i1 < len1; ++i1)arr1[i1] = !arr1[i1];
        return arr1;
    };
    //
    // An array_trim function that removes the empty elements off
    //both ends
    //
    RGraph.SVG.arrayTrim = function(arr1) {
        var out1 = [], content1 = false;
        // Trim the start
        for(var i1 = 0; i1 < arr1.length; i1++){
            if (arr1[i1]) content1 = true;
            if (content1) out1.push(arr1[i1]);
        }
        // Reverse the array and trim the start again
        out1 = RGraph.SVG.arrayReverse(out1);
        var out21 = [], content1 = false;
        for(var i1 = 0; i1 < out1.length; i1++){
            if (out1[i1]) content1 = true;
            if (content1) out21.push(out1[i1]);
        }
        // Now reverse the array and return it
        out21 = RGraph.SVG.arrayReverse(out21);
        return out21;
    };
    //
    // Determines if the given object is an array or not
    // 
    // @param mixed obj The variable to test
    //
    RGraph.SVG.isArray = function(obj1) {
        if (obj1 && obj1.constructor) var pos1 = obj1.constructor.toString().indexOf("Array");
        else return false;
        return obj1 != null && typeof pos1 === "number" && pos1 > 0 && pos1 < 20;
    };
    //
    // Returns the absolute value of a number. You can also pass in an
    // array and it will run the abs() function on each element. It
    // operates recursively so sub-arrays are also traversed.
    // 
    // @param array arr The number or array to work on
    //
    RGraph.SVG.abs = function(value1) {
        if (typeof value1 === "string") value1 = parseFloat(value1) || 0;
        if (typeof value1 === "number") return Math.abs(value1);
        if (typeof value1 === "object") {
            for(i in value1)if (typeof i === "string" || typeof i === "number" || typeof i === "object") value1[i] = RGraph.SVG.abs(value1[i]);
            return value1;
        }
        return 0;
    };
    //
    // Formats a number with thousand seperators so it's easier to read
    //
    // @param opt object The options to the function
    //
    RGraph.SVG.numberFormat = function(opt1) {
        var obj1 = opt1.object, prepend1 = opt1.prepend ? String(opt1.prepend) : "", append1 = opt1.append ? String(opt1.append) : "", output1 = "", decimal_seperator1 = typeof opt1.point === "string" ? opt1.point : ".", thousand_seperator1 = typeof opt1.thousand === "string" ? opt1.thousand : ",", num1 = opt1.num;
        decimals_trim = opt1.decimals_trim;
        RegExp.$1 = "";
        if (typeof opt1.formatter === "function") return opt1.formatter(obj1, num1);
        // Ignore the preformatted version of "1e-2"
        if (String(num1).indexOf("e") > 0) return String(prepend1 + String(num1) + append1);
        // We need then number as a string
        num1 = String(num1);
        // Take off the decimal part - we re-append it later
        if (num1.indexOf(".") > 0) {
            var tmp1 = num1;
            num1 = num1.replace(/\.(.*)/, ""); // The front part of the number
            decimal = tmp1.replace(/(.*)\.(.*)/, "$2"); // The decimal part of the number
        } else decimal = "";
        // Thousand seperator
        //var seperator = arguments[1] ? String(arguments[1]) : ',';
        var seperator1 = thousand_seperator1;
        //
        // Work backwards adding the thousand seperators
        //
        var foundPoint1;
        for(i = num1.length - 1, j = 0; i >= 0; j++, i--){
            var character1 = num1.charAt(i);
            if (j % 3 == 0 && j != 0) output1 += seperator1;
            //
            // Build the output
            //
            output1 += character1;
        }
        //
        // Now need to reverse the string
        //
        var rev1 = output1;
        output1 = "";
        for(i = rev1.length - 1; i >= 0; i--)output1 += rev1.charAt(i);
        // Tidy up
        //output = output.replace(/^-,/, '-');
        if (output1.indexOf("-" + thousand_seperator1) == 0) output1 = "-" + output1.substr(("-" + thousand_seperator1).length);
        // Reappend the decimal
        if (decimal.length) {
            output1 = output1 + decimal_seperator1 + decimal;
            decimal = "";
            RegExp.$1 = "";
        }
        //
        // Trim the decimals if it's all zeros
        //
        if (decimals_trim) {
            output1 = output1.replace(/0+$/, "");
            output1 = output1.replace(/\.$/, "");
        }
        // Minor bugette
        if (output1.charAt(0) == "-") {
            output1 = output1.replace(/-/, "");
            prepend1 = "-" + prepend1;
        }
        return prepend1 + output1 + append1;
    };
    //
    // A function that adds text to the chart
    //
    RGraph.SVG.text = function(opt1) {
        // Get the defaults for the text function from RGraph.SVG.text.defaults object
        for(var i1 in RGraph.SVG.text.defaults)if (typeof i1 === "string" && typeof opt1[i1] === "undefined") opt1[i1] = RGraph.SVG.text.defaults[i1];
        var obj1 = opt1.object, parent1 = opt1.parent || opt1.object.svg.all, size1 = typeof opt1.size === "number" ? opt1.size + "pt" : (typeof opt1.size === "string" ? opt1.size.replace(/pt$/, "") : 12) + "pt", bold1 = opt1.bold ? "bold" : "normal", font1 = opt1.font ? opt1.font : "sans-serif", italic1 = opt1.italic ? "italic" : "normal", halign1 = opt1.halign, valign1 = opt1.valign, str1 = opt1.text, x1 = opt1.x, y1 = opt1.y, color1 = opt1.color ? opt1.color : "black", background1 = opt1.background || null, backgroundRounded1 = opt1.backgroundRounded || 0, padding1 = opt1.padding || 0, link1 = opt1.link || "", linkTarget1 = opt1.linkTarget || "_blank", events1 = opt1.events === true ? true : false, angle1 = opt1.angle;
        //
        // Change numbers to strings
        //
        if (typeof str1 === "number") str1 = String(str1);
        //
        // Change null values to an empty string
        //
        if (RGraph.SVG.isNull(str1)) str1 = "";
        //
        // If the string starts with a carriage return add a unicode non-breaking
        // space to the start of it.
        //
        if (str1 && str1.substr(0, 2) == "\r\n" || str1.substr(0, 1) === "\n") str1 = "\xa0" + str1;
        // Horizontal alignment
        if (halign1 === "right") halign1 = "end";
        else if (halign1 === "center" || halign1 === "middle") halign1 = "middle";
        else halign1 = "start";
        // Vertical alignment
        if (valign1 === "top") valign1 = "hanging";
        else if (valign1 === "center" || valign1 === "middle") {
            valign1 = "central";
            valign1 = "middle";
        } else valign1 = "bottom";
        //
        // If a link has been specified then the text node should
        // be a child of an a node
        if (link1) var a1 = RGraph.SVG.create({
            svg: obj1.svg,
            type: "a",
            parent: parent1,
            attr: {
                "xlink:href": link1,
                target: linkTarget1
            }
        });
        //
        // Text does not include carriage returns
        //
        if (str1 && str1.indexOf && str1.indexOf("\n") === -1) {
            var text1 = RGraph.SVG.create({
                svg: obj1.svg,
                parent: link1 ? a1 : opt1.parent,
                type: "text",
                attr: {
                    tag: opt1.tag ? opt1.tag : "",
                    "data-tag": opt1.tag ? opt1.tag : "",
                    fill: color1,
                    x: x1,
                    y: y1,
                    "font-size": size1,
                    "font-weight": bold1,
                    "font-family": font1,
                    "font-style": italic1,
                    "text-anchor": halign1,
                    "dominant-baseline": valign1
                }
            });
            var textNode1 = document.createTextNode(str1);
            text1.appendChild(textNode1);
            if (!events1) text1.style.pointerEvents = "none";
        //
        // Includes carriage returns
        //
        } else if (str1 && str1.indexOf) {
            // Measure the text
            var dimensions1 = RGraph.SVG.measureText({
                text: "My",
                bold: bold1,
                font: font1,
                size: size1
            });
            var lineHeight1 = dimensions1[1];
            str1 = str1.split(/\r?\n/);
            //
            // Account for the carriage returns and move the text
            // up as required
            //
            if (valign1 === "bottom") y1 -= str1.length * lineHeight1;
            if (valign1 === "center" || valign1 === "middle") y1 -= str1.length * lineHeight1 / 2;
            var text1 = RGraph.SVG.create({
                svg: obj1.svg,
                parent: link1 ? a1 : opt1.parent,
                type: "text",
                attr: {
                    tag: opt1.tag ? opt1.tag : "",
                    fill: color1,
                    x: x1,
                    y: y1,
                    "font-size": size1,
                    "font-weight": bold1,
                    "font-family": font1,
                    "font-style": italic1,
                    "text-anchor": halign1,
                    "dominant-baseline": valign1
                }
            });
            if (!events1) text1.style.pointerEvents = "none";
            for(var i1 = 0; i1 < str1.length; ++i1){
                var tspan1 = RGraph.SVG.create({
                    svg: obj1.svg,
                    parent: text1,
                    type: "tspan",
                    attr: {
                        x: x1,
                        dy: dimensions1 ? dimensions1[1] * (i1 ? 1 : 0) + 3 : 0
                    }
                });
                var textNode1 = document.createTextNode(str1[i1]);
                tspan1.appendChild(textNode1);
                if (!events1) tspan1.style.pointerEvents = "none";
                var dimensions1 = RGraph.SVG.measureText({
                    text: str1[i1],
                    bold: bold1,
                    font: font1,
                    size: parseInt(size1)
                });
            }
        }
        // Now add the rotation if necessary
        if (typeof angle1 === "number" && angle1 && text1) {
            text1.setAttribute("x", 0);
            text1.setAttribute("y", 0);
            text1.setAttribute("transform", "translate({1} {2}) rotate({3})".format(x1, y1, -1 * angle1));
        }
        //
        // Add a background color if specified
        //
        if (typeof background1 === "string") {
            var parent1 = link1 ? a1 : parent1;
            var bbox1 = text1.getBBox(), rect1 = RGraph.SVG.create({
                svg: obj1.svg,
                parent: parent1,
                type: "rect",
                attr: {
                    x: bbox1.x - padding1,
                    y: bbox1.y - padding1,
                    width: bbox1.width + padding1 * 2,
                    height: bbox1.height + padding1 * 2,
                    fill: background1,
                    rx: backgroundRounded1,
                    ry: backgroundRounded1
                }
            });
            if (!events1) rect1.style.pointerEvents = "none";
            text1.parentNode.insertBefore(rect1, text1);
        }
        if (RGraph.SVG.ISIE && valign1 === "hanging" && text1) text1.setAttribute("y", y1 + text1.scrollHeight / 2);
        else if (RGraph.SVG.ISIE && valign1 === "middle" && text1) text1.setAttribute("y", y1 + text1.scrollHeight / 3);
        if (RGraph.SVG.ISFF && text1) Y = y1 + text1.scrollHeight / 3;
        return text1;
    };
    RGraph.SVG.text.defaults = {};
    //
    // Helps you get hold of the SPAN tag nodes that hold the text on the chart
    //
    RGraph.SVG.text.find = function(opt1) {
        // Search criteria should include:
        //  o text (literal string and regex)
        if (typeof opt1.object === "object" && opt1.object.isRGraph) var svg1 = opt1.object.svg;
        else if (typeof opt1.svg === "object" && opt1.svg.all) {
            var svg1 = opt1.svg;
            opt1.object = svg1.__object__;
        }
        // Look for text nodes based on the text
        var nodes1 = svg1.getElementsByTagName("text");
        var found1 = [];
        for(var i1 = 0, len1 = nodes1.length; i1 < len1; ++i1){
            var text1 = false, tag1 = false;
            // Exact match or regex on the text
            if (typeof opt1.text === "string" && nodes1[i1].innerHTML === opt1.text) text1 = true;
            else if (typeof opt1.text === "object" && nodes1[i1].innerHTML.match(opt1.text)) text1 = true;
            else if (typeof opt1.text === "undefined") text1 = true;
            // Exact match or regex on the tag
            if (typeof opt1.tag === "string" && nodes1[i1].getAttribute("tag") === opt1.tag) tag1 = true;
            else if (typeof opt1.tag === "object" && nodes1[i1].getAttribute("tag").match(opt1.tag)) tag1 = true;
            else if (typeof opt1.tag === "undefined") tag1 = true;
            // Did all of the conditions pass?
            if (text1 === true && tag1 === true) found1.push(nodes1[i1]);
        }
        // If a callback has been specified then call it whilst
        // passing it the text
        if (typeof opt1.callback === "function") opt1.callback({
            nodes: found1,
            object: opt1.object
        });
        return found1;
    };
    //
    // Creates a UID that is applied to the object
    //
    RGraph.SVG.createUID = function() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c1) {
            var r1 = Math.random() * 16 | 0, v1 = c1 == "x" ? r1 : r1 & 0x3 | 0x8;
            return v1.toString(16);
        });
    };
    //
    // Determines if the SVG DIV container is fixed
    //
    RGraph.SVG.isFixed = function(svg1) {
        var obj1 = svg1.parentNode, i1 = 0;
        while(obj1 && obj1.tagName.toLowerCase() != "body" && i1 < 99){
            if (obj1.style.position === "fixed") return obj1;
            obj1 = obj1.offsetParent;
        }
        return false;
    };
    //
    // Sets an object in the RGraph registry
    // 
    // @param string name The name of the value to set
    //
    RGraph.SVG.REG.set = function(name1, value1) {
        RGraph.SVG.REG.store[name1] = value1;
        return value1;
    };
    //
    // Gets an object from the RGraph registry
    // 
    // @param string name The name of the value to fetch
    //
    RGraph.SVG.REG.get = function(name1) {
        return RGraph.SVG.REG.store[name1];
    };
    //
    // Removes white-space from the start aqnd end of a string
    // 
    // @param string str The string to trim
    //
    RGraph.SVG.trim = function(str1) {
        return RGraph.SVG.ltrim(RGraph.SVG.rtrim(str1));
    };
    //
    // Trims the white-space from the start of a string
    // 
    // @param string str The string to trim
    //
    RGraph.SVG.ltrim = function(str1) {
        return str1.replace(/^(\s|\0)+/, "");
    };
    //
    // Trims the white-space off of the end of a string
    // 
    // @param string str The string to trim
    //
    RGraph.SVG.rtrim = function(str1) {
        return str1.replace(/(\s|\0)+$/, "");
    };
    //
    // Hides the currently shown tooltip
    //
    RGraph.SVG.hideTooltip = function() {
        var tooltip1 = RGraph.SVG.REG.get("tooltip");
        if (tooltip1 && tooltip1.parentNode) {
            tooltip1.parentNode.removeChild(tooltip1);
            tooltip1.style.display = "none";
            tooltip1.style.visibility = "hidden";
            RGraph.SVG.REG.set("tooltip", null);
        }
        if (tooltip1 && tooltip1.__object__) RGraph.SVG.removeHighlight(tooltip1.__object__);
    };
    //
    // Creates a shadow
    //
    RGraph.SVG.setShadow = function(options1) {
        var obj1 = options1.object, offsetx1 = options1.offsetx || 0, offsety1 = options1.offsety || 0, blur1 = options1.blur || 0, opacity1 = options1.opacity || 0, id1 = options1.id;
        var filter1 = RGraph.SVG.create({
            svg: obj1.svg,
            parent: obj1.svg.defs,
            type: "filter",
            attr: {
                id: id1,
                width: "130%",
                height: "130%"
            }
        });
        RGraph.SVG.create({
            svg: obj1.svg,
            parent: filter1,
            type: "feOffset",
            attr: {
                result: "offOut",
                "in": "SourceGraphic",
                dx: offsetx1,
                dy: offsety1
            }
        });
        RGraph.SVG.create({
            svg: obj1.svg,
            parent: filter1,
            type: "feColorMatrix",
            attr: {
                result: "matrixOut",
                "in": "offOut",
                type: "matrix",
                values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 {1} 0".format(opacity1)
            }
        });
        RGraph.SVG.create({
            svg: obj1.svg,
            parent: filter1,
            type: "feGaussianBlur",
            attr: {
                result: "blurOut",
                "in": "matrixOut",
                stdDeviation: blur1
            }
        });
        RGraph.SVG.create({
            svg: obj1.svg,
            parent: filter1,
            type: "feBlend",
            attr: {
                "in": "SourceGraphic",
                "in2": "blurOut",
                mode: "normal"
            }
        });
    };
    //
    // Takes a sequential index and returns the group/index variation of it. Eg if you have a
    // sequential index from a grouped bar chart this function can be used to convert that into
    // an appropriate group/index combination
    // 
    // @param nindex number The sequential index
    // @param data   array  The original data (which is grouped)
    // @return              The group/index information
    //
    RGraph.SVG.sequentialIndexToGrouped = function(index1, data1) {
        var group1 = 0, grouped_index1 = 0;
        while(--index1 >= 0){
            if (RGraph.SVG.isNull(data1[group1])) {
                group1++;
                grouped_index1 = 0;
                continue;
            }
            // Allow for numbers as well as arrays in the dataset
            if (typeof data1[group1] == "number") {
                group1++;
                grouped_index1 = 0;
                continue;
            }
            grouped_index1++;
            if (grouped_index1 >= data1[group1].length) {
                group1++;
                grouped_index1 = 0;
            }
        }
        return [
            group1,
            grouped_index1
        ];
    };
    //
    // This is the reverse of the above function - converting
    // group/index to a sequential index
    //
    // @return number The sequential index
    //
    RGraph.SVG.groupedIndexToSequential = function(opt1) {
        var dataset1 = opt1.dataset, index1 = opt1.index, obj1 = opt1.object;
        for(var i1 = 0, seq1 = 0; i1 <= dataset1; ++i1)for(var j1 = 0; j1 < obj1.data[dataset1].length; ++j1){
            if (i1 === dataset1 && j1 === index1) return seq1;
            seq1++;
        }
        return seq1;
    };
    //
    // Takes any number of arguments and adds them to one big linear array
    // which is then returned
    //
    // @param ... mixed The data to linearise. You can strings, booleans, numbers or arrays
    //
    RGraph.SVG.arrayLinearize = function() {
        var arr1 = [], args1 = arguments;
        for(var i1 = 0, len1 = args1.length; i1 < len1; ++i1){
            if (typeof args1[i1] === "object" && args1[i1]) for(var j1 = 0, len21 = args1[i1].length; j1 < len21; ++j1){
                var sub1 = RGraph.SVG.arrayLinearize(args1[i1][j1]);
                for(var k1 = 0, len31 = sub1.length; k1 < len31; ++k1)arr1.push(sub1[k1]);
            }
            else arr1.push(args1[i1]);
        }
        return arr1;
    };
    //
    // This function converts coordinates into the type understood by
    // SVG for drawing arcs
    //@param object options An object consisting of:
    //                       o cx:    The center X coordinate
    //                       o cy:    The center Y coordinate
    //                       o angle: The angle
    //                       o r:     The radius
    //
    RGraph.SVG.TRIG.toCartesian = function(options1) {
        return {
            x: options1.cx + options1.r * Math.cos(options1.angle),
            y: options1.cy + options1.r * Math.sin(options1.angle)
        };
    };
    //
    // This function, when given the x1,x2,y1,y2 coordinates will return
    //the diagonal length between the two using pythagorous.
    //
    RGraph.SVG.TRIG.getHypLength = function(opt1) {
        var h1 = Math.abs(opt1.x2 - opt1.x1);
        v = Math.abs(opt1.y2 - opt1.y1), r = Math.sqrt(h1 * h1 + v * v);
        return r;
    };
    // This takes centerx, centery, x and y coordinates and returns the
    // appropriate angle relative to the canvas angle system. Remember
    // that the canvas angle system starts at the EAST axis
    // 
    // @param  number cx  The centerx coordinate
    // @param  number cy  The centery coordinate
    // @param  number x   The X coordinate (eg the mouseX if coming from a click)
    // @param  number y   The Y coordinate (eg the mouseY if coming from a click)
    //
    // @return number     The relevant angle (measured in in RADIANS)
    //
    RGraph.SVG.TRIG.getAngleByXY = function(opt1) {
        var cx1 = opt1.cx, cy1 = opt1.cy, x1 = opt1.x, y1 = opt1.y;
        var angle1 = Math.atan((y1 - cy1) / (x1 - cx1));
        if (x1 >= cx1 && y1 >= cy1) angle1 += RGraph.SVG.TRIG.HALFPI;
        else if (x1 >= cx1 && y1 < cy1) angle1 = angle1 + RGraph.SVG.TRIG.HALFPI;
        else if (x1 < cx1 && y1 < cy1) angle1 = angle1 + RGraph.SVG.TRIG.PI + RGraph.SVG.TRIG.HALFPI;
        else angle1 = angle1 + RGraph.SVG.TRIG.PI + RGraph.SVG.TRIG.HALFPI;
        return angle1;
    };
    //
    // Gets a path that is usable by the SVG A path command
    //
    // @patam object options The options/arg to the function
    //
    // NB ** Still used by the Pie chart and the semi-circular Meter **
    //
    RGraph.SVG.TRIG.getArcPath = function(options1) {
        //
        // Make circles start at the top instead of the right hand side
        //
        options1.start -= 1.57;
        options1.end -= 1.57;
        var start1 = RGraph.SVG.TRIG.toCartesian({
            cx: options1.cx,
            cy: options1.cy,
            r: options1.r,
            angle: options1.start
        });
        var end1 = RGraph.SVG.TRIG.toCartesian({
            cx: options1.cx,
            cy: options1.cy,
            r: options1.r,
            angle: options1.end
        });
        var diff1 = options1.end - options1.start;
        // Initial values
        var largeArc1 = "0";
        var sweep1 = "0";
        if (options1.anticlockwise && diff1 > 3.14) {
            largeArc1 = "0";
            sweep1 = "0";
        } else if (options1.anticlockwise && diff1 <= 3.14) {
            largeArc1 = "1";
            sweep1 = "0";
        } else if (!options1.anticlockwise && diff1 > 3.14) {
            largeArc1 = "1";
            sweep1 = "1";
        } else if (!options1.anticlockwise && diff1 <= 3.14) {
            largeArc1 = "0";
            sweep1 = "1";
        }
        if (options1.start > options1.end && options1.anticlockwise && diff1 <= 3.14) {
            largeArc1 = "0";
            sweep1 = "0";
        }
        if (options1.start > options1.end && options1.anticlockwise && diff1 > 3.14) {
            largeArc1 = "1";
            sweep1 = "1";
        }
        if (typeof options1.moveto === "boolean" && options1.moveto === false) var d1 = [
            "A",
            options1.r,
            options1.r,
            0,
            largeArc1,
            sweep1,
            end1.x,
            end1.y
        ];
        else var d1 = [
            "M",
            start1.x,
            start1.y,
            "A",
            options1.r,
            options1.r,
            0,
            largeArc1,
            sweep1,
            end1.x,
            end1.y
        ];
        if (options1.array === true) return d1;
        else return d1.join(" ");
    };
    //
    // Gets a path that is usable by the SVG A path command
    //
    // @patam object options The options/arg to the function
    //
    RGraph.SVG.TRIG.getArcPath2 = function(options1) {
        //
        // Make circles start at the top instead of the right hand side
        //
        options1.start -= 1.57;
        options1.end -= 1.57;
        var start1 = RGraph.SVG.TRIG.toCartesian({
            cx: options1.cx,
            cy: options1.cy,
            r: options1.r,
            angle: options1.start
        });
        var end1 = RGraph.SVG.TRIG.toCartesian({
            cx: options1.cx,
            cy: options1.cy,
            r: options1.r,
            angle: options1.end
        });
        var diff1 = Math.abs(options1.end - options1.start);
        // Initial values
        var largeArc1 = "0";
        var sweep1 = "0";
        //TODO Put various options here for the correct combination of flags to use
        if (!options1.anticlockwise) {
            if (diff1 > RGraph.SVG.TRIG.PI) {
                largeArc1 = "1";
                sweep1 = "1";
            } else {
                largeArc1 = "0";
                sweep1 = "1";
            }
        } else if (diff1 > RGraph.SVG.TRIG.PI) {
            largeArc1 = "1";
            sweep1 = "0";
        } else {
            largeArc1 = "0";
            sweep1 = "0";
        }
        if (typeof options1.lineto === "boolean" && options1.lineto === false) var d1 = [
            "M",
            start1.x,
            start1.y,
            "A",
            options1.r,
            options1.r,
            0,
            largeArc1,
            sweep1,
            end1.x,
            end1.y
        ];
        else var d1 = [
            "M",
            options1.cx,
            options1.cy,
            "L",
            start1.x,
            start1.y,
            "A",
            options1.r,
            options1.r,
            0,
            largeArc1,
            sweep1,
            end1.x,
            end1.y
        ];
        if (options1.array === true) return d1;
        else return d1.join(" ");
    };
    //
    // Gets a path that is usable by the SVG A path command
    //
    // @param object options The options/arg to the function
    //
    RGraph.SVG.TRIG.getArcPath3 = function(options1) {
        // Make sure the args are numbers
        options1.cx = Number(options1.cx);
        options1.cy = Number(options1.cy);
        options1.start = Number(options1.start);
        options1.end = Number(options1.end);
        if (typeof options1.radius === "number") options1.r = options1.radius;
        //
        // Make circles start at the top instead of the right hand side
        //
        options1.start -= Math.PI / 2;
        options1.end -= Math.PI / 2;
        var start1 = RGraph.SVG.TRIG.toCartesian({
            cx: options1.cx,
            cy: options1.cy,
            r: options1.r,
            angle: options1.start
        });
        var end1 = RGraph.SVG.TRIG.toCartesian({
            cx: options1.cx,
            cy: options1.cy,
            r: options1.r,
            angle: options1.end
        });
        var diff1 = Math.abs(options1.end - options1.start);
        // Initial values
        var largeArc1 = "0";
        var sweep1 = "0";
        //TODO Put various options here for the correct combination of flags to use
        if (!options1.anticlockwise) {
            if (diff1 > RGraph.SVG.TRIG.PI) {
                largeArc1 = "1";
                sweep1 = "1";
            } else {
                largeArc1 = "0";
                sweep1 = "1";
            }
        } else if (diff1 > RGraph.SVG.TRIG.PI) {
            largeArc1 = "1";
            sweep1 = "0";
        } else {
            largeArc1 = "0";
            sweep1 = "0";
        }
        if (typeof options1.lineto === "boolean" && options1.lineto === false) {
            if (typeof options1.moveto === "boolean" && options1.moveto === false) var d1 = [
                "A",
                options1.r,
                options1.r,
                0,
                largeArc1,
                sweep1,
                end1.x,
                end1.y
            ];
            else var d1 = [
                "M",
                start1.x,
                start1.y,
                "A",
                options1.r,
                options1.r,
                0,
                largeArc1,
                sweep1,
                end1.x,
                end1.y
            ];
        } else var d1 = [
            "L",
            start1.x,
            start1.y,
            "A",
            options1.r,
            options1.r,
            0,
            largeArc1,
            sweep1,
            end1.x,
            end1.y
        ];
        if (options1.array === true) return d1;
        else return d1.join(" ");
    };
    //
    // This function gets the end point (X/Y coordinates) of a given radius.
    // You pass it the center X/Y and the radius and this function will return
    // the endpoint X/Y coordinates.
    // 
    // @param number r     The length of the radius
    // @param number angle The angle to use
    //
    RGraph.SVG.TRIG.getRadiusEndPoint = function(opt1) {
        // Allow for two arguments style
        if (arguments.length === 1) {
            if (typeof opt1.radius === "number") opt1.r = opt1.radius;
            var angle1 = opt1.angle, r1 = opt1.r;
        } else if (arguments.length === 4) var angle1 = arguments[0], r1 = arguments[1];
        var x1 = Math.cos(angle1) * r1, y1 = Math.sin(angle1) * r1;
        return [
            x1,
            y1
        ];
    };
    //
    // Converts the given number of degrees to radians. Angles in SVG are
    // measured in radians.
    // 
    // @param  opt object An object consisting of:
    //                      o degrees
    //
    RGraph.SVG.TRIG.toRadians = function(opt1) {
        return opt1.degrees * (Math.PI / 180);
    };
    // Usage: RGraph.SVG.TRIG.toDegrees(3.14) // 180ish
    //
    // @param  opt object An object consisting of:
    //                      o radians
    //
    RGraph.SVG.TRIG.toDegrees = function(opt1) {
        return opt1.radians * (180 / Math.PI);
    };
    //
    // This function draws the title. This function also draws the subtitle.
    //
    RGraph.SVG.drawTitle = function(obj1) {
        var properties1 = obj1.properties;
        // Work out the X cooordinate for the title and subtitle
        var x1 = (obj1.width - properties1.marginLeft - properties1.marginRight) / 2 + properties1.marginLeft, y1 = properties1.marginTop - 10, valign1 = "bottom";
        // If theres key defined then move the title up
        if (!RGraph.SVG.isNull(obj1.properties.key)) y1 -= 20;
        // If X axis is at the top then move the title up
        if (typeof obj1.properties.yaxisScaleMax === "number" && obj1.properties.yaxisScaleMax <= 0 && obj1.properties.yaxisScaleMin < obj1.properties.yaxisScaleMax) {
            valign1 = "top";
            y1 = obj1.height - obj1.properties.marginBottom + 10;
        }
        // Custom X coordinate
        if (typeof properties1.titleX === "number") x1 = properties1.titleX;
        // Custom Y coordinate
        if (typeof properties1.titleY === "number") y1 = properties1.titleY;
        // Custom X coordinate
        if (typeof properties1.titleOffsetx === "number") x1 += properties1.titleOffsetx;
        // Custom Y coordinate
        if (typeof properties1.titleOffsety === "number") y1 += properties1.titleOffsety;
        // Move the Y coord up if there's a subtitle
        if (typeof properties1.titleSubtitle === "string" || typeof properties1.titleSubtitle === "number") {
            var titleSubtitleDim1 = RGraph.SVG.measureText({
                bold: properties1.titleSubtitleBold,
                italic: properties1.titleSubtitleItalic,
                size: properties1.titleSubtitleSize,
                font: properties1.titleSubtitleFont,
                text: "Mg"
            });
            y1 -= titleSubtitleDim1[1];
        }
        // Draw the title
        if (properties1.title) RGraph.SVG.text({
            object: obj1,
            svg: obj1.svg,
            parent: obj1.svg.all,
            tag: "title",
            text: properties1.title.toString(),
            x: x1,
            y: y1,
            halign: properties1.titleHalign || "center",
            valign: valign1,
            color: properties1.titleColor || properties1.textColor,
            size: typeof properties1.titleSize === "number" ? properties1.titleSize : properties1.textSize + 4,
            bold: typeof properties1.titleBold === "boolean" ? properties1.titleBold : properties1.textBold,
            italic: typeof properties1.titleItalic === "boolean" ? properties1.titleItalic : properties1.textItalic,
            font: properties1.titleFont || properties1.textFont
        });
        // Draw the subtitle if there's one defined
        if ((typeof properties1.title === "string" || typeof properties1.title === "number") && (typeof properties1.titleSubtitle === "string" || typeof properties1.titleSubtitle === "number")) RGraph.SVG.text({
            object: obj1,
            svg: obj1.svg,
            parent: obj1.svg.all,
            tag: "subtitle",
            text: properties1.titleSubtitle,
            x: x1,
            y: y1 + 5,
            halign: properties1.titleHalign || "center",
            valign: "top",
            size: typeof properties1.titleSubtitleSize === "number" ? properties1.titleSubtitleSize : properties1.textSize - 2,
            color: properties1.titleSubtitleColor || properties1.textColor,
            bold: typeof properties1.titleSubtitleBold === "boolean" ? properties1.titleSubtitleBold : properties1.textBold,
            italic: typeof properties1.titleSubtitleItalic === "boolean" ? properties1.titleSubtitleItalic : properties1.textItalic,
            font: properties1.titleSubtitleFont || properties1.textFont
        });
    };
    //
    // Removes white-space from the start and end of a string
    // 
    // @param string str The string to trim
    //
    RGraph.SVG.trim = function(str1) {
        return RGraph.SVG.ltrim(RGraph.SVG.rtrim(str1));
    };
    //
    // Trims the white-space from the start of a string
    // 
    // @param string str The string to trim
    //
    RGraph.SVG.ltrim = function(str1) {
        return String(str1).replace(/^(\s|\0)+/, "");
    };
    //
    // Trims the white-space off of the end of a string
    // 
    // @param string str The string to trim
    //
    RGraph.SVG.rtrim = function(str1) {
        return String(str1).replace(/(\s|\0)+$/, "");
    };
    //
    // This parses a single color value
    //
    RGraph.SVG.parseColorLinear = function(opt1) {
        var obj1 = opt1.object, color1 = opt1.color;
        if (!color1 || typeof color1 !== "string") return color1;
        if (color1.match(/^gradient\((.*)\)$/i)) {
            var parts1 = RegExp.$1.split(":"), diff1 = 1 / (parts1.length - 1);
            if (opt1 && opt1.direction && opt1.direction === "horizontal") var grad1 = RGraph.SVG.create({
                type: "linearGradient",
                parent: obj1.svg.defs,
                attr: {
                    id: "RGraph-linear-gradient-" + obj1.uid + "-" + obj1.gradientCounter,
                    x1: opt1.start || 0,
                    x2: opt1.end || "100%",
                    y1: 0,
                    y2: 0,
                    gradientUnits: opt1.gradientUnits || "userSpaceOnUse"
                }
            });
            else var grad1 = RGraph.SVG.create({
                type: "linearGradient",
                parent: obj1.svg.defs,
                attr: {
                    id: "RGraph-linear-gradient-" + obj1.uid + "-" + obj1.gradientCounter,
                    x1: 0,
                    x2: 0,
                    y1: opt1.start || 0,
                    y2: opt1.end || "100%",
                    gradientUnits: opt1.gradientUnits || "userSpaceOnUse"
                }
            });
            // Add the first color stop
            var stop1 = RGraph.SVG.create({
                type: "stop",
                parent: grad1,
                attr: {
                    offset: "0%",
                    "stop-color": RGraph.SVG.trim(parts1[0])
                }
            });
            // Add the rest of the color stops
            for(var j1 = 1, len1 = parts1.length; j1 < len1; ++j1)RGraph.SVG.create({
                type: "stop",
                parent: grad1,
                attr: {
                    offset: j1 * diff1 * 100 + "%",
                    "stop-color": RGraph.SVG.trim(parts1[j1])
                }
            });
        }
        color1 = grad1 ? "url(#RGraph-linear-gradient-" + obj1.uid + "-" + obj1.gradientCounter++ + ")" : color1;
        return color1;
    };
    //
    // This parses a single color value
    //
    RGraph.SVG.parseColorRadial = function(opt1) {
        var obj1 = opt1.object, color1 = opt1.color;
        if (!color1 || typeof color1 !== "string") return color1;
        if (color1.match(/^gradient\((.*)\)$/i)) {
            var parts1 = RegExp.$1.split(":"), diff1 = 1 / (parts1.length - 1);
            var grad1 = RGraph.SVG.create({
                type: "radialGradient",
                parent: obj1.svg.defs,
                attr: {
                    id: "RGraph-radial-gradient-" + obj1.uid + "-" + obj1.gradientCounter,
                    gradientUnits: opt1.gradientUnits || "userSpaceOnUse",
                    cx: opt1.cx || obj1.centerx,
                    cy: opt1.cy || obj1.centery,
                    fx: opt1.fx || obj1.centerx,
                    fy: opt1.fy || obj1.centery,
                    r: opt1.r || obj1.radius
                }
            });
            // Add the first color stop
            var stop1 = RGraph.SVG.create({
                type: "stop",
                parent: grad1,
                attr: {
                    offset: "0%",
                    "stop-color": RGraph.SVG.trim(parts1[0])
                }
            });
            // Add the rest of the color stops
            for(var j1 = 1, len1 = parts1.length; j1 < len1; ++j1)RGraph.SVG.create({
                type: "stop",
                parent: grad1,
                attr: {
                    offset: j1 * diff1 * 100 + "%",
                    "stop-color": RGraph.SVG.trim(parts1[j1])
                }
            });
        }
        color1 = grad1 ? "url(#RGraph-radial-gradient-" + obj1.uid + "-" + obj1.gradientCounter++ + ")" : color1;
        return color1;
    };
    //
    // Reset all of the color values to their original values
    // 
    // @param object
    //
    RGraph.SVG.resetColorsToOriginalValues = function(opt1) {
        var obj1 = opt1.object;
        if (obj1.originalColors) {
            // Reset the colors to their original values
            for(var j1 in obj1.originalColors)if (typeof j1 === "string") obj1.properties[j1] = RGraph.SVG.arrayClone(obj1.originalColors[j1]);
        }
        //
        // If the function is present on the object to reset specific
        // colors - use that
        //
        if (typeof obj1.resetColorsToOriginalValues === "function") obj1.resetColorsToOriginalValues();
        // Hmmm... Should this be necessary? I don't think it will
        // do any harm to leave it in.
        obj1.originalColors = {};
        // Reset the colorsParsed flag so that they're parsed for gradients again
        obj1.colorsParsed = false;
        // Reset the gradient counter
        obj1.gradientCounter = 1;
    };
    //
    // Clear the SVG tag by deleting all of its
    // child nodes
    //
    // @param [OPTIONAL] svg The SVG tag (same as what is returned
    //                   by document.getElementById() )
    //
    RGraph.SVG.clear = function() {
        // No arguments given - so clear all of the registered
        // SVG tags.
        if (arguments.length === 0) {
            for(var i1 = 0; i1 < RGraph.SVG.OR.objects.length; i1++)RGraph.SVG.clear(RGraph.SVG.OR.objects[i1].svg);
            return;
        // An SVG tag has been given
        } else var svg1 = arguments[0];
        // Allow the svg to be a string
        if (typeof svg1 === "string") {
            var div1 = document.getElementById(svg1);
            var svg1 = div1.__svg__;
        }
        // Clear all the layer nodes
        for(var i1 = 1; i1 <= 100; ++i1){
            if (svg1 && svg1["background" + i1]) // Clear all the nodes within this group
            while(svg1["background" + i1].lastChild)svg1["background" + i1].removeChild(svg1["background" + i1].lastChild);
            else break;
        }
        if (svg1.all) {
            // Clear all the node within the "all" group
            while(svg1.all.lastChild)svg1.all.removeChild(svg1.all.lastChild);
            // Clear Line chart hotspots
            if (svg1.all.line_tooltip_hotspots) while(svg1.all.line_tooltip_hotspots.lastChild)svg1.all.line_tooltip_hotspots.removeChild(svg1.all.line_tooltip_hotspots.lastChild);
        }
    };
    //
    // The reset function is like the clear function but also clears the
    // ObjectRegistry for this canvas
    //
    RGraph.SVG.reset = function() {
        // Reset all registered SVG tags
        if (arguments.length === 0) {
            for(var i1 = 0; i1 < RGraph.SVG.OR.objects.length; i1++)RGraph.SVG.reset(RGraph.SVG.OR.objects[i1].svg);
            return;
        // Reset a single SVG tag
        } else var svg1 = arguments[0];
        // Allow the svg to be a string
        if (typeof svg1 === "string") {
            var div1 = document.getElementById(svg1);
            var svg1 = div1.__svg__;
        }
        // Get rid of this reference
        svg1.parentNode.__svg__ = null;
        RGraph.SVG.clear(svg1);
        // Make sure every element is removed from the SVG tag
        while(svg1.lastChild)svg1.removeChild(svg1.lastChild);
        // Remove the SVG tag from the ObjectRegistry
        RGraph.SVG.OR.clear(svg1);
        // Get rid of the SVG tag itself
        svg1.parentNode.removeChild(svg1);
    };
    //
    // Adds an event listener
    // 
    // @param object obj   The graph object
    // @param string event The name of the event, eg ontooltip
    // @param object func  The callback function
    //
    RGraph.SVG.addCustomEventListener = function(obj1, name1, func1) {
        // Initialise the events array if necessary
        if (typeof RGraph.SVG.events[obj1.uid] === "undefined") RGraph.SVG.events[obj1.uid] = [];
        // Prepend "on" if necessary
        if (name1.substr(0, 2) !== "on") name1 = "on" + name1;
        RGraph.SVG.events[obj1.uid].push({
            object: obj1,
            event: name1,
            func: func1
        });
        return RGraph.SVG.events[obj1.uid].length - 1;
    };
    //
    // Used to fire one of the RGraph custom events
    // 
    // @param object obj   The graph object that fires the event
    // @param string event The name of the event to fire
    //
    RGraph.SVG.fireCustomEvent = function(obj1, name1) {
        if (obj1 && obj1.isRGraph) {
            var uid1 = obj1.uid;
            if (typeof uid1 === "string" && typeof RGraph.SVG.events === "object" && typeof RGraph.SVG.events[uid1] === "object" && RGraph.SVG.events[uid1].length > 0) {
                for(var j1 = 0, len1 = RGraph.SVG.events[uid1].length; j1 < len1; ++j1)if (RGraph.SVG.events[uid1][j1] && RGraph.SVG.events[uid1][j1].event === name1) RGraph.SVG.events[uid1][j1].func(obj1);
            }
        }
    };
    //
    // Clears all the custom event listeners that have been registered
    // 
    // @param string optional Limits the clearing to this object UID
    //
    RGraph.SVG.removeAllCustomEventListeners = function() {
        var uid1 = arguments[0];
        if (uid1 && RGraph.SVG.events[uid1]) RGraph.SVG.events[uid1] = {};
        else RGraph.SVG.events = [];
    };
    //
    // Clears a particular custom event listener
    // 
    // @param object obj The graph object
    // @param number i   This is the index that is return by .addCustomEventListener()
    //
    RGraph.SVG.removeCustomEventListener = function(obj1, i1) {
        if (typeof RGraph.SVG.events === "object" && typeof RGraph.SVG.events[obj1.uid] === "object" && typeof RGraph.SVG.events[obj1.uid][i1] === "object") RGraph.SVG.events[obj1.uid][i1] = null;
    };
    //
    // Removes the highlight from the chart added by tooltips (possibly others too)
    //
    RGraph.SVG.removeHighlight = function(obj1) {
        var highlight1 = RGraph.SVG.REG.get("highlight");
        if (highlight1 && RGraph.SVG.isArray(highlight1) && highlight1.length) {
            for(var i1 = 0, len1 = highlight1.length; i1 < len1; ++i1)if (highlight1[i1].parentNode) //obj.svg.removeChild(highlight[i]);
            highlight1[i1].parentNode.removeChild(highlight1[i1]);
        } else if (highlight1 && highlight1.parentNode) {
            if (obj1.type === "scatter") {
                highlight1.setAttribute("stroke0width", "0");
                highlight1.setAttribute("stroke", "transparent");
                highlight1.setAttribute("fill", "transparent");
            } else highlight1.parentNode.removeChild(highlight1);
        }
    };
    //
    // Removes the highlight from the chart added by tooltips (possibly others too)
    //
    RGraph.SVG.redraw = function() {
        if (arguments.length === 1) {
            var svg1 = arguments[0];
            if (svg1.parentNode) {
                RGraph.SVG.clear(svg1);
                var objects1 = RGraph.SVG.OR.get("id:" + svg1.parentNode.id);
                for(var i1 = 0, len1 = objects1.length; i1 < len1; ++i1){
                    // Reset the colors to the original values
                    RGraph.SVG.resetColorsToOriginalValues({
                        object: objects1[i1]
                    });
                    objects1[i1].draw();
                }
            }
        } else {
            var tags1 = RGraph.SVG.OR.tags();
            for(var i1 in tags1)RGraph.SVG.redraw(tags1[i1]);
        }
    };
    //
    // A better, more flexible, date parsing function
    //
    //@param  string str The string to parse
    //@return number     A number, as returned by Date.parse()
    //
    RGraph.SVG.parseDate = function(str1) {
        var d1 = new Date();
        // Initialise the default values
        var defaults1 = {
            seconds: "00",
            minutes: "00",
            hours: "00",
            date: d1.getDate(),
            month: d1.getMonth() + 1,
            year: d1.getFullYear()
        };
        // Create the months array for turning textual months back to numbers
        var months1 = [
            "january",
            "february",
            "march",
            "april",
            "may",
            "june",
            "july",
            "august",
            "september",
            "october",
            "november",
            "december"
        ], months_regex1 = months1.join("|");
        for(var i1 = 0; i1 < months1.length; ++i1){
            months1[months1[i1]] = i1;
            months1[months1[i1].substring(0, 3)] = i1;
            months_regex1 = months_regex1 + "|" + months1[i1].substring(0, 3);
        }
        // These are the seperators allowable for d/m/y and y/m/d dates
        // (Its part of a regexp so the position of the square brackets
        //  is crucial)
        var sep1 = "[-./_=+~#:;,]+";
        // Tokenise the string
        var tokens1 = str1.split(/ +/);
        // Loop through each token checking what it is
        for(var i1 = 0, len1 = tokens1.length; i1 < len1; ++i1)if (tokens1[i1]) {
            // Year
            if (tokens1[i1].match(/^\d\d\d\d$/)) defaults1.year = tokens1[i1];
            // Month
            var res1 = isMonth1(tokens1[i1]);
            if (typeof res1 === "number") defaults1.month = res1 + 1; // Months are zero indexed
            // Date
            if (tokens1[i1].match(/^\d?\d(?:st|nd|rd|th)?$/)) defaults1.date = parseInt(tokens1[i1]);
            // Time
            if (tokens1[i1].match(/^(\d\d):(\d\d):?(?:(\d\d))?$/)) {
                defaults1.hours = parseInt(RegExp.$1);
                defaults1.minutes = parseInt(RegExp.$2);
                if (RegExp.$3) defaults1.seconds = parseInt(RegExp.$3);
            }
            // Dateformat: XXXX-XX-XX
            if (tokens1[i1].match(new RegExp("^(\\d\\d\\d\\d)" + sep1 + "(\\d\\d)" + sep1 + "(\\d\\d)$", "i"))) {
                defaults1.date = parseInt(RegExp.$3);
                defaults1.month = parseInt(RegExp.$2);
                defaults1.year = parseInt(RegExp.$1);
            }
            // Dateformat: XX-XX-XXXX
            if (tokens1[i1].match(new RegExp("^(\\d\\d)" + sep1 + "(\\d\\d)" + sep1 + "(\\d\\d\\d\\d)$", "i"))) {
                defaults1.date = parseInt(RegExp.$1);
                defaults1.month = parseInt(RegExp.$2);
                defaults1.year = parseInt(RegExp.$3);
            }
        }
        // Now put the defaults into a format thats recognised by Date.parse()
        str1 = "{1}/{2}/{3} {4}:{5}:{6}".format(defaults1.year, String(defaults1.month).length === 1 ? "0" + defaults1.month : defaults1.month, String(defaults1.date).length === 1 ? "0" + defaults1.date : defaults1.date, String(defaults1.hours).length === 1 ? "0" + defaults1.hours : defaults1.hours, String(defaults1.minutes).length === 1 ? "0" + defaults1.minutes : defaults1.minutes, String(defaults1.seconds).length === 1 ? "0" + defaults1.seconds : defaults1.seconds);
        return Date.parse(str1);
        //
        // Support functions
        //
        function isMonth1(str1) {
            var res1 = str1.toLowerCase().match(months_regex1);
            return res1 ? months1[res1[0]] : false;
        }
    };
    // The ObjectRegistry add function
    RGraph.SVG.OR.add = function(obj1) {
        RGraph.SVG.OR.objects.push(obj1);
        return obj1;
    };
    // The ObjectRegistry function that returns all of the objects. Th argument
    // can aither be:
    //
    // o omitted  All of the registered objects are returned
    // o id:XXX  All of the objects on that SVG tag are returned
    // o type:XXX All the objects of that type are returned
    //
    RGraph.SVG.OR.get = function() {
        // Fetch objects that are on a particular SVG tag
        if (typeof arguments[0] === "string" && arguments[0].substr(0, 3).toLowerCase() === "id:") {
            var ret1 = [];
            for(var i1 = 0; i1 < RGraph.SVG.OR.objects.length; ++i1)if (RGraph.SVG.OR.objects[i1] && RGraph.SVG.OR.objects[i1].id === arguments[0].substr(3)) ret1.push(RGraph.SVG.OR.objects[i1]);
            return ret1;
        }
        // Fetch objects that are of a particular type
        //
        // TODO Allow multiple types to be specified
        if (typeof arguments[0] === "string" && arguments[0].substr(0, 4).toLowerCase() === "type") {
            var ret1 = [];
            for(var i1 = 0; i1 < RGraph.SVG.OR.objects.length; ++i1)if (RGraph.SVG.OR.objects[i1].type === arguments[0].substr(5)) ret1.push(RGraph.SVG.OR.objects[i1]);
            return ret1;
        }
        // Fetch an object that has a specific UID
        if (typeof arguments[0] === "string" && arguments[0].substr(0, 3).toLowerCase() === "uid") {
            var ret1 = [];
            for(var i1 = 0; i1 < RGraph.SVG.OR.objects.length; ++i1)if (RGraph.SVG.OR.objects[i1].uid === arguments[0].substr(4)) ret1.push(RGraph.SVG.OR.objects[i1]);
            return ret1;
        }
        return RGraph.SVG.OR.objects;
    };
    //
    // Clear the ObjectRegistry of charts
    //
    // @param [OPTIONAL] string You can optionally give an ID so only objects
    //                          pertaining to that SVG tag are cleared.
    //
    RGraph.SVG.OR.clear = function() {
        // Clear the ObjectRegistry of objects for a particular ID
        if (typeof arguments[0] === "string") {
            for(var i1 = 0; i1 < RGraph.SVG.OR.objects.length; ++i1)if (RGraph.SVG.OR.objects[i1].id === arguments[0]) RGraph.SVG.OR.objects[i1] = null;
        // If an RGraph object is given then clear that object
        } else if (typeof arguments[0] === "object") {
            for(var i1 = 0; i1 < RGraph.SVG.OR.objects.length; ++i1)if (RGraph.SVG.OR.objects[i1].uid === arguments[0].uid) RGraph.SVG.OR.objects[i1] = null;
        // Clear the entire ObjectRegistry
        } else RGraph.SVG.OR.objects = [];
    };
    // The ObjectRegistry function that returns all of the registeredt SVG tags
    //
    RGraph.SVG.OR.tags = function() {
        var tags1 = [];
        for(var i1 = 0; i1 < RGraph.SVG.OR.objects.length; ++i1)if (RGraph.SVG.OR.objects[i1] && !tags1[RGraph.SVG.OR.objects[i1].svg.parentNode.id]) tags1[RGraph.SVG.OR.objects[i1].svg.parentNode.id] = RGraph.SVG.OR.objects[i1].svg;
        return tags1;
    };
    //
    // This function returns a two element array of the SVG x/y position in
    // relation to the page
    // 
    // @param object svg
    //
    RGraph.SVG.getSVGXY = function(svg1) {
        var x1 = 0, y1 = 0, el1 = svg1.parentNode; // !!!
        // If the getBoundingClientRect function is available - use that
        //
        if (svg1.getBoundingClientRect) {
            var rect1 = svg1.getBoundingClientRect();
            // Add the the current scrollTop and scrollLeft becuase the getBoundingClientRect()
            // method is relative to the viewport - not the document
            var scrollLeft1 = window.pageXOffset || document.documentElement.scrollLeft, scrollTop1 = window.pageYOffset || document.documentElement.scrollTop;
            return [
                rect1.x + scrollLeft1,
                rect1.y + scrollTop1
            ];
        }
    /*
        do {

            x += el.offsetLeft;
            y += el.offsetTop;

            // Account for tables in webkit
            if (el.tagName.toLowerCase() == 'table' && (RGraph.SVG.ISCHROME || RGraph.SVG.ISSAFARI)) {
                x += parseInt(el.border) || 0;
                y += parseInt(el.border) || 0;
            }

            el = el.offsetParent;

        } while (el && el.tagName && el.tagName.toLowerCase() != 'body');


        var paddingLeft = svg.style.paddingLeft ? parseInt(svg.style.paddingLeft) : 0,
            paddingTop  = svg.style.paddingTop ? parseInt(svg.style.paddingTop) : 0,
            borderLeft  = svg.style.borderLeftWidth ? parseInt(svg.style.borderLeftWidth) : 0,
            borderTop   = svg.style.borderTopWidth  ? parseInt(svg.style.borderTopWidth) : 0;

        if (navigator.userAgent.indexOf('Firefox') > 0) {
            x += parseInt(document.body.style.borderLeftWidth) || 0;
            y += parseInt(document.body.style.borderTopWidth) || 0;
        }

        return [x + paddingLeft + borderLeft, y + paddingTop + borderTop];
*/ };
    //
    // This function is a compatibility wrapper around
    // the requestAnimationFrame function.
    //
    // @param function func The function to give to the
    //                      requestAnimationFrame function
    //
    RGraph.SVG.FX.update = function(func1) {
        win.requestAnimationFrame = win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.msRequestAnimationFrame || win.mozRequestAnimationFrame || function(func1) {
            setTimeout(func1, 16.666);
        };
        win.requestAnimationFrame(func1);
    };
    //
    // This function returns an easing multiplier for effects so they eas out towards the
    // end of the effect.
    // 
    // @param number frames The total number of frames
    // @param number frame  The frame number
    //
    RGraph.SVG.FX.getEasingMultiplier = function(frames1, frame1) {
        var multiplier1 = Math.pow(Math.sin(frame1 / frames1 * RGraph.SVG.TRIG.HALFPI), 3);
        return multiplier1;
    };
    //
    // Measures text by creating a DIV in the document and adding the relevant
    // text to it, then checking the .offsetWidth and .offsetHeight.
    // 
    // @param  object opt An object containing the following:
    //                        o text( string) The text to measure
    //                        o bold (bool)   Whether the text is bold or not
    //                        o font (string) The font to use
    //                        o size (number) The size of the text (in pts)
    // 
    // @return array         A two element array of the width and height of the text
    //
    RGraph.SVG.measureText = function(opt1) {
        //text, bold, font, size
        var text1 = opt1.text || "", bold1 = opt1.bold || false, italic1 = opt1.italic || false, font1 = opt1.font || "sans-serif", size1 = opt1.size || 12, str1 = text1 + ":" + italic1 + ":" + bold1 + ":" + font1 + ":" + size1;
        // Add the sizes to the cache as adding DOM elements is costly and causes slow downs
        if (typeof RGraph.SVG.measuretext_cache === "undefined") RGraph.SVG.measuretext_cache = [];
        if (opt1.cache !== false && typeof RGraph.SVG.measuretext_cache == "object" && RGraph.SVG.measuretext_cache[str1]) return RGraph.SVG.measuretext_cache[str1];
        if (!RGraph.SVG.measuretext_cache["text-span"] || opt1.cache === false) {
            var span1 = document.createElement("SPAN");
            span1.style.position = "absolute";
            span1.style.padding = 0;
            span1.style.display = "inline";
            span1.style.top = "-200px";
            span1.style.left = "-200px";
            span1.style.lineHeight = "1em";
            document.body.appendChild(span1);
            // Now store the newly created DIV
            RGraph.SVG.measuretext_cache["text-span"] = span1;
        } else if (RGraph.SVG.measuretext_cache["text-span"]) {
            var span1 = RGraph.SVG.measuretext_cache["text-span"];
            // Clear the contents of the SPAN tag
            while(span1.firstChild)span1.removeChild(span1.firstChild);
        }
        //span.innerHTML        = text.replace(/\r?\n/g, '<br />');
        span1.insertAdjacentHTML("afterbegin", String(text1).replace(/\r?\n/g, "<br />"));
        span1.style.fontFamily = font1;
        span1.style.fontWeight = bold1 ? "bold" : "normal";
        span1.style.fontStyle = italic1 ? "italic" : "normal";
        span1.style.fontSize = String(size1).replace(/pt$/, "") + "pt";
        var sizes1 = [
            span1.offsetWidth,
            span1.offsetHeight
        ];
        //document.body.removeChild(span);
        RGraph.SVG.measuretext_cache[str1] = sizes1;
        return sizes1;
    };
    //
    // This function converts an array of strings to an array of numbers. Its used by the meter/gauge
    // style charts so that if you want you can pass in a string. It supports various formats:
    // 
    // '45.2'
    // '-45.2'
    // ['45.2']
    // ['-45.2']
    // '45.2,45.2,45.2' // A CSV style string
    // 
    // @param number frames The string or array to parse
    //
    RGraph.SVG.stringsToNumbers = function(str1) {
        // An optional seperator to use intead of a comma
        var sep1 = arguments[1] || ",";
        // Remove preceding square brackets
        if (typeof str1 === "string" && str1.trim().match(/^\[ *\d+$/)) str1 = str1.replace("[", "");
        // If it's already a number just return it
        if (typeof str1 === "number") return str1;
        if (typeof str1 === "string") {
            if (str1.indexOf(sep1) != -1) str1 = str1.split(sep1);
            else {
                str1 = parseFloat(str1);
                if (isNaN(str1)) str1 = null;
            }
        }
        if (typeof str1 === "object" && !RGraph.SVG.isNull(str1)) for(var i1 = 0, len1 = str1.length; i1 < len1; i1 += 1)str1[i1] = RGraph.SVG.stringsToNumbers(str1[i1], sep1);
        return str1;
    };
    // This function allows for numbers that are given as a +/- adjustment
    RGraph.SVG.getAdjustedNumber = function(opt1) {
        var value1 = opt1.value, prop1 = opt1.prop;
        if (typeof prop1 === "string" && match(/^(\+|-)([0-9.]+)/)) {
            if (RegExp.$1 === "+") value1 += parseFloat(RegExp.$2);
            else if (RegExp.$1 === "-") value1 -= parseFloat(RegExp.$2);
        }
        return value1;
    };
    // NOT USED ANY MORE
    RGraph.SVG.attribution = function() {
        return;
    };
    //
    // Parse a gradient and returns the various parts
    // 
    // @param string str The gradient string
    //
    RGraph.SVG.parseGradient = function(str1) {};
    //
    // Generates a random number between the minimum and maximum
    // 
    // @param number min The minimum value
    // @param number max The maximum value
    // @param number     OPTIONAL Number of decimal places
    //
    RGraph.SVG.random = function(opt1) {
        var min1 = opt1.min, max1 = opt1.max, dp1 = opt1.dp || opt1.decimals || 0, r1 = Math.random();
        return Number(((max1 - min1) * r1 + min1).toFixed(dp1));
    };
    //
    // Fill an array full of random numbers
    //
    RGraph.SVG.arrayRandom = function(opt1) {
        var num1 = opt1.num, min1 = opt1.min, max1 = opt1.max, dp1 = opt1.dp || opt1.decimals || 0;
        for(var i1 = 0, arr1 = []; i1 < num1; i1 += 1)arr1.push(RGraph.SVG.random({
            min: min1,
            max: max1,
            dp: dp1
        }));
        return arr1;
    };
    //
    // This function is called by each objects setter so that common BC
    // and adjustments are centralised. And there's less typing for me too.
    //
    // @param object opt An object of options to the function, which are:
    //                    object: The chart object
    //                    name:   The name of the config parameter
    //                    value:  The value thats being set
    //
    RGraph.SVG.commonSetter = function(opt1) {
        var obj1 = opt1.object, name1 = opt1.name, value1 = opt1.value;
        // The default event for tooltips is click
        if (name1 === "tooltipsEvent" && value1 !== "click" && value1 !== "mousemove") value1 = "click";
        return {
            name: name1,
            value: value1
        };
    };
    //
    // Generates logs for... log charts
    //
    // @param object opt The options:
    //                     o num  The number
    //                     o base The base
    //
    RGraph.SVG.log = function(opt1) {
        var num1 = opt1.num, base1 = opt1.base;
        return Math.log(num1) / (base1 ? Math.log(base1) : 1);
    };
    //
    // Creates a donut path and reurns it. This method creates a
    // <path> element and returns that element (it does add to
    // the <svg> document.
    //
    // @param opt object An object consisting of these options:
    //                    o cx
    //                    o cy
    //                    o innerRadius
    //                    o outerRadius
    //                    o stroke
    //                    o fill
    //
    RGraph.SVG.donut = function(opt1) {
        var arcPath11 = RGraph.SVG.TRIG.getArcPath3({
            cx: opt1.cx,
            cy: opt1.cy,
            r: opt1.outerRadius,
            start: 0,
            end: RGraph.SVG.TRIG.TWOPI,
            anticlockwise: false,
            lineto: false
        });
        var arcPath21 = RGraph.SVG.TRIG.getArcPath3({
            cx: opt1.cx,
            cy: opt1.cy,
            r: opt1.innerRadius,
            start: RGraph.SVG.TRIG.TWOPI,
            end: 0,
            anticlockwise: true,
            lineto: false
        });
        //
        // Create the red circle
        //
        var path1 = RGraph.SVG.create({
            svg: opt1.svg,
            type: "path",
            attr: {
                d: arcPath11 + arcPath21,
                stroke: opt1.stroke || "transparent",
                fill: opt1.fill || "transparent",
                opacity: typeof opt1.opacity === "number" ? opt1.opacity : 1
            }
        });
        return path1;
    };
    //
    // Copy the globals (if any have been set) from the global object to
    // this instances configuration
    //
    RGraph.SVG.getGlobals = function(obj1) {
        var properties1 = obj1.properties;
        for(var i1 in RGraph.SVG.GLOBALS)if (typeof i1 === "string") obj1.set(i1, RGraph.SVG.arrayClone(RGraph.SVG.GLOBALS[i1]));
    };
    //
    // This function adds a link to the SVG document
    //
    // @param object opt The various options to the function
    //
    RGraph.SVG.link = function(opt1) {
        var a1 = RGraph.SVG.create({
            svg: bar.svg,
            type: "a",
            parent: bar.svg.all,
            attr: {
                "xlink:href": href,
                target: target
            }
        });
        var text1 = RGraph.SVG.create({
            svg: bar.svg,
            type: "text",
            parent: a1,
            attr: {
                x: x,
                y: y,
                fill: fill
            }
        });
        //text.innerHTML = text;
        text1.insertAdjacentHTML("afterbegin", String(text1));
    };
    // This function is used to get the errorbar MAXIMUM value. Its in the common
    // file because it's used by multiple chart libraries
    //
    // @param object opt An object containing the arguments to the function
    //         o object: The chart object
    //         o index:  The index to fetch
    RGraph.SVG.getErrorbarsMaxValue = function(opt1) {
        var obj1 = opt1.object, properties1 = obj1.properties, index1 = opt1.index;
        if (typeof properties1.errorbars === "object" && !RGraph.SVG.isNull(properties1.errorbars) && typeof properties1.errorbars[index1] === "number") var value1 = properties1.errorbars[index1];
        else if (typeof properties1.errorbars === "object" && !RGraph.SVG.isNull(properties1.errorbars) && typeof properties1.errorbars[index1] === "object" && !RGraph.SVG.isNull(properties1.errorbars[index1]) && typeof properties1.errorbars[index1].max === "number") var value1 = properties1.errorbars[index1].max;
        else var value1 = 0;
        return value1;
    };
    // This function is used to get the errorbar MINIMUM value. Its in the common
    // file because it's used by multiple chart libraries
    //
    // @param object opt An object containing the arguments to the function
    //         o object: The chart object
    //         o index:  The index to fetch
    RGraph.SVG.getErrorbarsMinValue = function(opt1) {
        var obj1 = opt1.object, properties1 = obj1.properties, index1 = opt1.index;
        if (typeof properties1.errorbars === "object" && !RGraph.SVG.isNull(properties1.errorbars) && typeof properties1.errorbars[index1] === "object" && !RGraph.SVG.isNull(properties1.errorbars[index1]) && typeof properties1.errorbars[index1].min === "number") var value1 = properties1.errorbars[index1].min;
        else var value1 = null;
        return value1;
    };
    // This function is used to get the errorbar color. Its in the common
    // file because it's used by multiple chart libraries
    //
    // @param object opt An object containing the arguments to the function
    //         o object: The chart object
    //         o index:  The index to fetch
    RGraph.SVG.getErrorbarsColor = function(opt1) {
        var obj1 = opt1.object, properties1 = obj1.properties, index1 = opt1.index;
        var color1 = properties1.errorbarsColor || "black";
        if (typeof properties1.errorbars === "object" && !RGraph.SVG.isNull(properties1.errorbars) && typeof properties1.errorbars[index1] === "object" && !RGraph.SVG.isNull(properties1.errorbars[index1]) && typeof properties1.errorbars[index1].color === "string") color1 = properties1.errorbars[index1].color;
        return color1;
    };
    // This function is used to get the errorbar linewidth. Its in the common
    // file because it's used by multiple chart libraries
    //
    // @param object opt An object containing the arguments to the function
    //         o object: The chart object
    //         o index:  The index to fetch
    RGraph.SVG.getErrorbarsLinewidth = function(opt1) {
        var obj1 = opt1.object, properties1 = obj1.properties, index1 = opt1.index;
        var linewidth1 = properties1.errorbarsLinewidth || 1;
        if (typeof properties1.errorbars === "object" && !RGraph.SVG.isNull(properties1.errorbars) && typeof properties1.errorbars[index1] === "object" && !RGraph.SVG.isNull(properties1.errorbars[index1]) && typeof properties1.errorbars[index1].linewidth === "number") linewidth1 = properties1.errorbars[index1].linewidth;
        return linewidth1;
    };
    // This function is used to get the errorbar capWidth. Its in the common
    // file because it's used by multiple chart libraries
    //
    // @param object opt An object containing the arguments to the function
    //         o object: The chart object
    //         o index:  The index to fetch
    RGraph.SVG.getErrorbarsCapWidth = function(opt1) {
        var obj1 = opt1.object, properties1 = obj1.properties, index1 = opt1.index;
        var capwidth1 = properties1.errorbarsCapwidth || 10;
        if (typeof properties1.errorbars === "object" && !RGraph.SVG.isNull(properties1.errorbars) && typeof properties1.errorbars[index1] === "object" && !RGraph.SVG.isNull(properties1.errorbars[index1]) && typeof properties1.errorbars[index1].capwidth === "number") capwidth1 = properties1.errorbars[index1].capwidth;
        return capwidth1;
    };
    // Allows the conversion of older names and values to newer
    // ones.
    //
    // *** When adding this to a new chart library there needs to be
    // *** two changes done:
    // ***  o Add the list of aliases as a object variable (eg this.aliases = {}; )
    // ***  o The bit that goes in the setter that calls the
    // ***    RGraph.propertyNameAlias() function - copy this from the Bar chart object
    //
    RGraph.SVG.propertyNameAlias = function() {};
    //
    // This is here so that if the tooltip library has not
    // been included, this function will show an alert
    //informing the user
    //
    if (typeof RGraph.SVG.tooltip !== "function") RGraph.SVG.tooltip = function() {
        $a("The tooltip library has not been included!");
    };
    //
    // The responsive function. This installs the rules as stipulated
    // in the rules array.
    //
    // @param object conf An object map of properties/arguments for the function.
    //                    This should consist of:
    //                     o maxWidth
    //                     o width
    //                     o height
    //                     o options
    //                     o css
    //                     o parentCss
    //                     o callback
    //
    RGraph.SVG.responsive = function(conf1) {
        var obj1 = this;
        //
        // Sort the configuration so that it descends in order of biggest screen
        // to smallest
        //
        conf1.sort(function(a1, b1) {
            var aNull1 = RGraph.SVG.isNull(a1.maxWidth);
            var bNull1 = RGraph.SVG.isNull(b1.maxWidth);
            if (aNull1 && bNull1) return 0;
            if (aNull1 && !bNull1) return -1;
            if (!aNull1 && bNull1) return 1;
            return b1.maxWidth - a1.maxWidth;
        });
        //
        // Preparse the configuration adding any missing minWidth values to the configuration
        //
        for(var i1 = 0; i1 < conf1.length; ++i1){
            if (conf1[i1 + 1] && typeof conf1[i1 + 1].maxWidth === "number") conf1[i1].minWidth = conf1[i1 + 1].maxWidth;
            else if (!conf1[i1 + 1]) conf1[i1].minWidth = 0;
        }
        //
        // Loop through the configurations
        //
        for(var i1 = 0; i1 < conf1.length; ++i1){
            // Set the minimum and maximum
            conf1[i1].minWidth = RGraph.SVG.isNull(conf1[i1].minWidth) ? 0 : conf1[i1].minWidth;
            conf1[i1].maxWidth = RGraph.SVG.isNull(conf1[i1].maxWidth) ? 100000 : conf1[i1].maxWidth;
            // Create the media query string
            var str1 = "screen and (min-width: %1px) and (max-width: %2px)".format(conf1[i1].minWidth, conf1[i1].maxWidth);
            var mediaQuery1 = window.matchMedia(str1);
            (function(index1) {
                mediaQuery1.addListener(function(e1) {
                    if (e1.matches) matchFunction1(conf1[index1]);
                });
            })(i1);
            // An Initial test
            if (document.documentElement.clientWidth >= conf1[i1].minWidth && document.documentElement.clientWidth < conf1[i1].maxWidth) matchFunction1(conf1[i1]);
        }
        //
        // If a rule matches - this is the function that runs
        //
        function matchFunction1(rule1) {
            // If a width is defined for this rule set it
            if (typeof rule1.width === "number") {
                obj1.svg.setAttribute("width", rule1.width);
                obj1.container.style.width = rule1.width + "px";
            }
            //
            // If a height is defined for this rule set it
            //
            if (typeof rule1.height === "number") {
                obj1.svg.setAttribute("height", rule1.height);
                obj1.container.style.height = rule1.height + "px";
            }
            // Are there any options to be set?
            //
            if (typeof rule1.options === "object") {
                for(var j1 in rule1.options)if (typeof j1 === "string") obj1.set(j1, rule1.options[j1]);
            }
            //
            // This function simply sets a CSS property on the object.
            // It accommodates certain name changes
            //
            var setCSS1 = function(el1, name1, value1) {
                var replacements1 = [
                    [
                        "float",
                        "cssFloat"
                    ]
                ];
                // Replace the name if necessary
                for(var i1 = 0; i1 < replacements1.length; ++i1)if (name1 === replacements1[i1][0]) name1 = replacements1[i1][1];
                el1.style[name1] = value1;
            };
            //
            // Are there any CSS properties to set on the SVG tag?
            //
            if (typeof rule1.css === "object") {
                for(var j1 in rule1.css)if (typeof j1 === "string") setCSS1(obj1.svg.parentNode, j1, rule1.css[j1]);
            }
            //
            // Are there any CSS properties to set on the SVGs PARENT tag?
            //
            if (typeof rule1.parentCss === "object") {
                for(var j1 in rule1.parentCss)if (typeof j1 === "string") setCSS1(obj1.svg.parentNode.parentNode, j1, rule1.parentCss[j1]);
            }
            // Redraw the chart - with SVG this is done by the redraw() function
            RGraph.SVG.redraw();
            // Run the callback function if it's defined
            if (typeof rule1.callback === "function") rule1.callback(obj1);
        }
        // Returning the object facilitates chaining
        return obj1;
    };
    //
    // This function can be used to resize the canvas when the screen size changes. You
    // specify various rules and they're then checked.
    //
    RGraph.SVG.responsiveOld = function(conf1) {
        var opt1 = arguments[1] || {}, // This function is added to each object in their constructors so the this
        // variable is the chart object.
        obj1 = this, // The func variable becomes the function that is fired by the resize event
        func1 = null, // This is the timer reference
        timer1 = null;
        // The resizie function will run This many milliseconds after the
        // resize has "finished"
        opt1.delay = typeof opt1.delay === "number" ? opt1.delay : 200;
        // [TODO] Store defaults that are used if there's no match
        var func1 = function() {
            // This is set to true if a rule matches
            var matched1 = false;
            // Loop through all of the rules
            for(var i1 = 0; i1 < conf1.length; ++i1)//
            // If a maxWidth is stipulated test that
            //
            if (!matched1 && (document.documentElement.clientWidth <= conf1[i1].maxWidth || RGraph.SVG.isNull(conf1[i1].maxWidth))) {
                matched1 = true;
                // If a width is defined for this rule set it
                if (typeof conf1[i1].width === "number") {
                    obj1.svg.setAttribute("width", conf1[i1].width);
                    obj1.container.style.width = conf1[i1].width + "px";
                }
                //
                // If a height is defined for this rule set it
                //
                if (typeof conf1[i1].height === "number") {
                    obj1.svg.setAttribute("height", conf1[i1].height);
                    obj1.container.style.height = conf1[i1].height + "px";
                }
                //
                // Are there any options to be set?
                //
                if (typeof conf1[i1].options === "object" && typeof conf1[i1].options === "object") {
                    for(var j1 in conf1[i1].options)if (typeof j1 === "string") obj1.set(j1, conf1[i1].options[j1]);
                }
                //
                // This function simply sets a CSS property on the object.
                // It accommodates certain name changes
                //
                var setCSS1 = function(el1, name1, value1) {
                    var replacements1 = [
                        [
                            "float",
                            "cssFloat"
                        ]
                    ];
                    // Replace the name if necessary
                    for(var i1 = 0; i1 < replacements1.length; ++i1)if (name1 === replacements1[i1][0]) name1 = replacements1[i1][1];
                    el1.style[name1] = value1;
                };
                //
                // Are there any CSS properties to set on the SVG tag?
                //
                if (typeof conf1[i1].css === "object") {
                    for(var j1 in conf1[i1].css)if (typeof j1 === "string") setCSS1(obj1.svg.parentNode, j1, conf1[i1].css[j1]);
                }
                //
                // Are there any CSS properties to set on the SVGs PARENT tag?
                //
                if (typeof conf1[i1].parentCss === "object") {
                    for(var j1 in conf1[i1].parentCss)if (typeof j1 === "string") setCSS1(obj1.svg.parentNode.parentNode, j1, conf1[i1].parentCss[j1]);
                }
                // Redraw the chart with SVG this is done by the redraw() function
                RGraph.SVG.redraw();
                // Run the callback function if it's defined
                if (typeof conf1[i1].callback === "function") conf1[i1].callback(obj1);
            }
        };
        // Install the resize event listener
        window.addEventListener("resize", function() {
            // Set a new timer in order to fire the func() function
            if (opt1.delay > 0) {
                // Clear the timeout
                clearTimeout(timer1);
                // Start a new timer going
                timer1 = setTimeout(func1, opt1.delay);
            // If you don't want a delay before the resizing occurs
            // then set the delay to zero and it will be fired immediately
            } else func1();
        });
        // Call the function initially otherwise it may never run
        func1();
        // This facilitates chaining
        return obj1;
    };
    //
    // This function gets the text properties when given a relevant prefix.
    // So if you give it 'text' as the prefix you'll get the:
    //
    //  o textFont
    //  o textSize
    //  o textColor
    //  o textBold
    //  o textItalic
    //
    // ...properties. On the other hand if you give it 'yaxisScaleLabels'
    // as the prefix you'll get:
    //
    //  o yaxisScaleLabelsFont
    //  o yaxisScaleLabelsSize
    //  o yaxisScaleLabelsColor
    //  o yaxisScaleLabelsBold
    //  o yaxisScaleLabelsItalic
    // 
    // @param  args object An object consisting of:
    //                      o object
    //                      o prefix
    //
    RGraph.SVG.getTextConf = function(args1) {
        var obj1 = args1.object, properties1 = obj1.properties, prefix1 = args1.prefix;
        // Has to be a seperate var statement
        var font1 = typeof properties1[prefix1 + "Font"] === "string" ? properties1[prefix1 + "Font"] : properties1.textFont, size1 = typeof properties1[prefix1 + "Size"] === "number" ? properties1[prefix1 + "Size"] : properties1.textSize, color1 = typeof properties1[prefix1 + "Color"] === "string" ? properties1[prefix1 + "Color"] : properties1.textColor, bold1 = typeof properties1[prefix1 + "Bold"] === "boolean" ? properties1[prefix1 + "Bold"] : properties1.textBold, italic1 = typeof properties1[prefix1 + "Italic"] === "boolean" ? properties1[prefix1 + "Italic"] : properties1.textItalic;
        return {
            font: font1,
            size: size1,
            color: color1,
            bold: bold1,
            italic: italic1
        };
    };
    //
    // Label substitution. This allows you to use dynamic
    // labels if you want like this:
    //
    // ...
    // names: ['Richard','Jerry','Lucy'],
    // xaxisLabels: '%{names:[%{index}]}: %{value_formatted}'
    // ...
    //
    //@param object args This can be an object which contains the following
    //                   things:
    //                           args.text      The text on which to perform the substitution on
    //                                          (ie the original label)
    //                           args.object    The chart object
    //                           args.index     The index of the label
    //                           args.value     The value of the data point
    //                           args.decimals  The number of decimals
    //                           args.point     The decimal character
    //                           args.thousand  The thousand separator
    //                           args.unitsPre  The units that are prepended to the number
    //                           args.unitsPost The units that are appended to the number
    //                          
    //
    RGraph.SVG.labelSubstitution = function(args) {
        //////////////////////
        // Must be a string //
        //////////////////////
        var text = String(args.text);
        /////////////////////////////////////////////////////////////////
        // If there's no template tokens in the string simply reurn it //
        /////////////////////////////////////////////////////////////////
        if (!text.match(/%{.*?}/)) return text;
        //////////////////////////////////////////
        // This allows for escaping the percent //
        //////////////////////////////////////////
        var text = text.replace(/%%/g, "___--PERCENT--___");
        ////////////////////////////////////
        // Replace the index of the label //
        ////////////////////////////////////
        text = text.replace(/%{index}/g, args.index);
        ////////////////////////////////////////////////////////////////////
        // Do property substitution when there's an index to the property //
        ////////////////////////////////////////////////////////////////////
        var reg = /%{prop(?:erty)?:([_a-z0-9]+)\[([0-9]+)\]}/i;
        while(text.match(reg)){
            var property = RegExp.$1, index = parseInt(RegExp.$2);
            if (args.object.properties[property]) text = text.replace(reg, args.object.properties[property][index] || "");
            else text = text.replace(reg, "");
            RegExp.lastIndex = null;
        }
        ////////////////////////////////////
        // Replace this: %{property:xxx}% //
        ////////////////////////////////////
        while(text.match(/%{property:([_a-z0-9]+)}/i)){
            var str = "%{property:" + RegExp.$1 + "}";
            text = text.replace(str, args.object.properties[RegExp.$1]);
        }
        ////////////////////////////////
        // Replace this: %{prop:xxx}% //
        ///////////////////////////////
        while(text.match(/%{prop:([_a-z0-9]+)}/i)){
            var str = "%{prop:" + RegExp.$1 + "}";
            text = text.replace(str, args.object.properties[RegExp.$1]);
        }
        /////////////////////////////////////////////////////////
        // Replace this: %{value} and this: %{value_formatted} //
        ////////////////////////////////////////////////////////
        while(text.match(/%{value(?:_formatted)?}/i)){
            var value = args.value;
            if (text.match(/%{value_formatted}/i)) text = text.replace("%{value_formatted}", typeof value === "number" ? RGraph.SVG.numberFormat({
                object: args.object,
                num: value.toFixed(args.decimals),
                thousand: args.thousand || ",",
                point: args.point || ".",
                prepend: args.unitsPre || "",
                append: args.unitsPost || ""
            }) : null);
            else text = text.replace("%{value}", value);
        }
        ////////////////////////////////////////////////////////////////
        // Do global substitution when there's an index to the global //
        ////////////////////////////////////////////////////////////////
        var reg = /%{global:([_a-z0-9.]+)\[([0-9]+)\]}/i;
        while(text.match(reg)){
            var name = RegExp.$1, index = parseInt(RegExp.$2);
            if (eval(name)[index]) text = text.replace(reg, eval(name)[index] || "");
            else text = text.replace(reg, "");
            RegExp.lastIndex = null;
        }
        //////////////////////////////////////////////////
        // Do global substitution when there's no index //
        //////////////////////////////////////////////////
        var reg = /%{global:([_a-z0-9.]+)}/i;
        while(text.match(reg)){
            var name = RegExp.$1;
            if (eval(name)) text = text.replace(reg, eval(name) || "");
            else text = text.replace(reg, "");
            RegExp.lastIndex = null;
        }
        ///////////////////////////////////
        // And lastly - call any functions
        // MUST be last
        //////////////////////////////////
        var regexp = /%{function:([_A-Za-z0-9]+)\((.*?)\)}/;
        // Temporarily replace carriage returns and line feeds with CR and LF
        // so the the s option is not needed
        text = text.replace(/\r/, "|CR|");
        text = text.replace(/\n/, "|LF|");
        while(text.match(regexp)){
            var str = RegExp.$1 + "(" + RegExp.$2 + ")";
            for(var i = 0, len = str.length; i < len; ++i)str = str.replace(/\r?\n/, "\\n");
            RGraph.SVG.REG.set("label-templates-function-object", args.object);
            var func = new Function("return " + str);
            var ret = func();
            text = text.replace(regexp, ret);
        }
        // Replace CR and LF with a space
        text = text.replace(/\|CR\|/, " ");
        text = text.replace(/\|LF\|/, " ");
        // Replace line returns with br tags
        //text = text.replace(/\r?\n/g, '<br />'); Pretty sure this doesn't need doing here
        text = text.replace(/___--PERCENT--___/g, "%");
        return text.toString();
    };
    //
    // A shortcut for the create function that gets added to
    // each object
    //
    // @param obj The object
    //
    RGraph.SVG.addCreateFunction = function(obj1) {
        //
        // This is the function that's appended to
        // each object
        //
        // @param string type   The type of node to create
        // @param object parent The parent node
        // @param object attr   Attributes to add to the new node
        // @param object style  Style properties to add to the new
        //                      node
        //
        obj1.create = function(type1, parent1, attr1) {
            var style1 = arguments[3] ? arguments[3] : {};
            // Special case for arcPaths
            if (type1.toLowerCase() === "arcpath") return RGraph.SVG.TRIG.getArcPath(attr1);
            else if (type1.toLowerCase() === "arcpath2") return RGraph.SVG.TRIG.getArcPath2(attr1);
            else if (type1.toLowerCase() === "arcpath3") return RGraph.SVG.TRIG.getArcPath3(attr1);
            else return RGraph.SVG.create({
                svg: this.svg,
                parent: parent1,
                type: type1,
                attr: attr1,
                style: style1
            });
        };
    };
    //
    //
    // Adds custom text to the chart based on whats
    // in the objects text: property.
    //
    //@param object obj The chart object
    //
    RGraph.SVG.addCustomText = function(obj1) {
        if (RGraph.SVG.isArray(obj1.properties.text) && obj1.properties.text.length) for(var i1 = 0; i1 < obj1.properties.text.length; ++i1){
            var conf1 = obj1.properties.text[i1];
            // Add the object to the config
            conf1.object = obj1;
            // Set the color to black if it's not set
            if (typeof conf1.color !== "string" || !conf1.color.length) conf1.color = "black";
            RGraph.SVG.text(conf1);
        }
    };
    //
    // This function sets CSS styles on a DOM element
    //
    // @param element    mixed  This can either be a string or a DOM
    //                          object
    // @param properties object This should be an object map of
    //                          the CSS properties to set.
    //                          JavaScript property names should
    //                          be used.
    //
    RGraph.SVG.setCSS = function(element1, properties1) {
        if (typeof element1 === "string") element1 = document.getElementById(element1);
        for(i in properties1)if (typeof i === "string") element1.style[i] = properties1[i];
    };
    //
    // A set of functions which help you get data from the GET
    // string (the query string).
    //
    RGraph.SVG.GET.raw = function() {
        return location.search;
    };
    RGraph.SVG.GET.parse = function() {
        if (!RGraph.SVG.isNull(RGraph.SVG.GET.__parts__)) return RGraph.SVG.GET.__parts__;
        var raw1 = RGraph.SVG.GET.raw().replace(/^\?/, "");
        var parts1 = raw1.split(/\&/);
        // Loop thru each part splitting it
        for(var i1 = 0; i1 < parts1.length; ++i1){
            var tmp1 = parts1[i1].split("=");
            parts1[tmp1[0]] = decodeURI(tmp1[1]);
        }
        // Store the parsed query-string
        RGraph.SVG.GET.__parts__ = parts1;
        return parts1;
    };
    //
    // Get a string of text from the query string. No special
    // processing is done here.
    //
    // @param string key The part to get
    //
    RGraph.SVG.GET.text = RGraph.SVG.GET.string = function(key1) {
        var parts1 = RGraph.SVG.GET.parse();
        if (!parts1[key1]) return null;
        return String(parts1[key1]);
    };
    //
    //  This fetches a number from the query string. It
    // trims leading zeros and reurns a number (not a
    // string).
    //
    // @param string key The part to get 
    //
    RGraph.SVG.GET.number = function(key1) {
        var parts1 = RGraph.SVG.GET.parse();
        if (!parts1[key1]) return null;
        return Number(parts1[key1]);
    };
    //
    // Fetches a JSON object from the query string. It must be
    // valid JSON and is an easy way to pass multiple values
    //using the query string. For example:
    //
    // /foo.html?json={"data":[4,8,6],"labels":["John","Luis","Bob"]}
    // 
    // @param string key The part to get
    //
    RGraph.SVG.GET.json = RGraph.SVG.GET.object = function(key1) {
        var parts1 = RGraph.SVG.GET.parse();
        if (!parts1[key1]) return null;
        return JSON.parse(parts1[key1]);
    };
    //
    // This allows you to easily pass a  list of numbers over the
    // query string. For example:
    //
    // /test.html?data=5,8,6,3,5,4,6
    //
    // @param string key      The part to get
    // @param string OPTIONAL The seperator to use (defaults to a
    //                        comma)
    //
    RGraph.SVG.GET.list = RGraph.SVG.GET.array = function(key1) {
        var parts1 = RGraph.SVG.GET.parse();
        if (!parts1[key1]) return null;
        if (!arguments[1]) var sep1 = ",";
        else var sep1 = arguments[1];
        var arr1 = parts1[key1].split(sep1);
        // Remove any starting or trailing square brackets
        arr1[0] = arr1[0].replace(/^\[/, "");
        arr1[arr1.length - 1] = arr1[arr1.length - 1].replace(/\]$/, "");
        // Convert strings to numbers
        for(var i1 = 0; i1 < arr1.length; ++i1){
            // Get rid of surrounding quotes
            arr1[i1] = arr1[i1].replace(/^('|")/, "");
            arr1[i1] = arr1[i1].replace(/('|")$/, "");
            if (Number(arr1[i1])) arr1[i1] = Number(arr1[i1]);
        }
        return arr1;
    };
    //
    // Removes the tooltip highlight from the chart. This
    // function is called by each objects .removeHighlight()
    // function.
    //
    RGraph.SVG.removeHighlight = function() {
        var highlight1 = RGraph.SVG.REG.get("highlight");
        // The highlight is an array
        if (RGraph.SVG.isArray(highlight1)) {
            for(var i1 = 0; i1 < highlight1.length; ++i1)if (highlight1[i1] && highlight1[i1].parentNode) highlight1[i1].parentNode.removeChild(highlight1[i1]);
        } else if (highlight1) {
            if (highlight1 && highlight1.parentNode) highlight1.parentNode.removeChild(highlight1);
        }
        RGraph.SVG.REG.set("highlight", null);
    };
// End module pattern
})(window, document);
//
// Loosly mimicks the PHP function print_r();
//
window.$p = function(obj1) {
    var indent1 = arguments[2] ? arguments[2] : "    ";
    var str1 = "";
    var counter1 = typeof arguments[3] == "number" ? arguments[3] : 0;
    if (counter1 >= 5) return "";
    switch(typeof obj1){
        case "string":
            str1 += obj1 + " (" + typeof obj1 + ", " + obj1.length + ")";
            break;
        case "number":
            str1 += obj1 + " (" + typeof obj1 + ")";
            break;
        case "boolean":
            str1 += obj1 + " (" + typeof obj1 + ")";
            break;
        case "function":
            str1 += "function () {}";
            break;
        case "undefined":
            str1 += "undefined";
            break;
        case "null":
            str1 += "null";
            break;
        case "object":
            // In case of null
            if (RGraph.SVG.isNull(obj1)) str1 += indent1 + "null\n";
            else {
                str1 += indent1 + "Object {" + "\n";
                for(j in obj1)str1 += indent1 + "    " + j + " => " + window.$p(obj1[j], true, indent1 + "    ", counter1 + 1) + "\n";
                str1 += indent1 + "}";
            }
            break;
        default:
            str1 += "Unknown type: " + typeof obj1 + "";
            break;
    }
    //
    // Finished, now either return if we're in a recursed call, or alert()
    // if we're not.
    //
    if (!arguments[1]) alert(str1);
    return str1;
};
//
// A shorthand for the default alert() function
//
window.$a = function(v1) {
    alert(v1);
};
//
// Short-hand for console.log
//
// @param mixed v The variable to log to the console
//
window.$c = window.$cl = function(v1) {
    return console.log(v1);
};
//
// A basic string formatting function. Use it like this:
// 
// var str = '{1} {2} {3}'.format('a', 'b', 'c');
//
// Outputs: a b c
//
String.prototype.format = function() {
    //
    // Allow for this type of formatting: {myVar} $myVar $myVar$ %myVar% [myVar]
    //
    if (arguments.length === 0) {
        var s1 = this;
        // Allow for {myVar} style
        if (s1.match(/{[a-z0-9]+?}/i)) var s1 = this.replace(/{[a-z0-9]+?}/gi, function(str1, idx1) {
            str1 = str1.substr(1);
            str1 = str1.substr(0, str1.length - 1);
            return window[str1];
        });
        return s1;
    }
    var args1 = arguments;
    var s1 = this.replace(/{(\d+)}/g, function(str1, idx1) {
        return typeof args1[idx1 - 1] !== "undefined" ? args1[idx1 - 1] : str1;
    });
    // Save percentage signs that are escaped with either another
    // percent or a backslash
    s1 = s1.replace(/(?:%|\\)%(\d)/g, "__PPEERRCCEENNTT__$1");
    s1 = s1.replace(/%(\d+)/g, function(str1, idx1) {
        return typeof args1[idx1 - 1] !== "undefined" ? args1[idx1 - 1] : str1;
    });
    // Now replace those saved percentage signs with a percentage sign
    return s1.replace("__PPEERRCCEENNTT__", "%");
};
// Some utility functions that help identify the type of an object
//
// Note that isUndefined() should be used like this or you'll get an
// error (ie with the window. prefix):
//
//        RGraph.isUndefined(window.foo)
//
RGraph.SVG.isString = function(obj1) {
    return typeof obj1 === "string";
};
RGraph.SVG.isNumber = function(obj1) {
    return typeof obj1 === "number";
};
//RGraph.SVG.isArray Defined above
RGraph.SVG.isObject = function(obj1) {
    return typeof obj1 === "object" && obj1.constructor.toString().toLowerCase().indexOf("object") > 0;
};
//RGraph.SVG.isNull  Defined above
RGraph.SVG.isFunction = function(obj1) {
    return typeof obj1 === "function";
};
RGraph.SVG.isUndefined = function(obj1) {
    return typeof obj1 === "undefined";
};

//# sourceMappingURL=index.ff6f7292.js.map
