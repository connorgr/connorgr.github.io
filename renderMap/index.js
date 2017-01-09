var d3 = require("d3"),
    d3Geo = require("d3-geo-projection"),
    fs = require("fs"),
    jsdom = require("jsdom"),
    topojson = require("topojson"),
    world = require("./worldmap.json");

var width = 960,
    height = 500;

var html = [
  '<html><style>',
  ".boundary { fill: none; stroke: #fff; stroke-width: .5px; }",
  ".country { fill: #666; stroke: rgba(51,51,51,0.25); stroke-width: .5px; }",
  ".fill { fill: none; }",
  ".stroke { fill: none; stroke: #000; stroke-width: 1px; }",
  ".graticule { fill:none; stroke: #111; stroke-width: .5px; stroke-opacity: .5; }",
  ".visited { fill: rgb(242, 196, 50); stroke: rgba(0,0,0,0.1); }",
  '</style>',
  '<meta charset="utf-8"><body><svg width="',
  width,
  '" height="',
  height,
  '"/></body></html>'
].join('');

var visited = [
  29, // belize
  38, // canada
  50, // costa rica
  66, // spain
  72, // france
  77, // united kingdom
  80, // ghana
  88, // guatemala
  103, // ireland
  106, // iceland
  108, // italy
  163, // netherlands
  172, // peru
  179, // portugal
  228, // usa
];

var projection = d3Geo.geoNaturalEarth()
    .scale((width - 3) / (2 * Math.PI))
    .translate([width / 2, height / 2]);

var path = d3.geoPath()
    .projection(projection);

var graticule = d3.geoGraticule();

jsdom.env({
  html: html,
  done:function(errors, window) {
    window.d3 = d3.select(window.document);

    var svg = window.d3.select("svg");

    svg.attr("baseProfile", "full")
        .attr("version", "1.1")
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .attr("xmlns:xlink","http://www.w3.org/1999/xlink");

    svg.append("defs").append("path")
        .datum({type: "Sphere"})
        .attr("id", "sphere")
        .attr("d", path);

    svg.append("use")
        .attr("class", "stroke")
        .attr("xlink:href", "#sphere");

    svg.append("use")
        .attr("class", "fill")
        .attr("xlink:href", "#sphere");

    svg.append("path")
        .datum(graticule)
        .attr("class", "graticule")
        .attr("d", path);

    var countryData = topojson.feature(world, world.objects.countries).features,
        countriesGroup = svg.append("g");

    var countries = countriesGroup.selectAll(".country")
            .data(countryData)
            .enter()
            .insert("path")
            .classed("country", true)
            .classed('visited', function(d,i) { return visited.indexOf(i) > -1; })
            .attr("d", path);

    var htmlText = window.d3.select("html").html();

    // Remove classes and add inlined style for illustrator
    svg.selectAll("use").remove();

    svg.selectAll(".boundary")
        .style("fill", "none")
        .style("stroke", "#fff")
        .style("stroke-width", "0.5px");
    svg.selectAll(".country")
        .style("fill", "#666")
        .style("stroke", "rgba(51,51,51,0.25)")
        .style("stroke-width", "0.5px");
    svg.selectAll(".fill")
        .style("fill", "none");
    svg.selectAll(".stroke")
        .style("fill", "none")
        .style("stroke", "#000")
        .style("stroke-width", "1px");
    svg.selectAll(".graticule")
        .style("fill", "none")
        .style("stroke", "#111")
        .style("stroke-width", "0.5px")
        .style("stroke-opacity", "0.5");
    svg.selectAll(".visited")
        .style("fill", "rgb(242, 196, 50)")
        .style("stroke", "rgba(0,0,0,0.1)");

    var svgText = [
      '<?xml version="1.0" encoding="utf-8"?>',
      '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">',
      window.d3.select("body").html()
    ].join('');

    fs.writeFileSync("./map.html", htmlText);
    fs.writeFileSync("./map.svg", svgText);
  }
});
