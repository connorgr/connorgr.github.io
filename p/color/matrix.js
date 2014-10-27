var animals = ['panda', 'sloth', 'aye-aye'],
    times = ['1:00', '2:00', '3:00', '4:00'];

var data = [];
for (a in animals) {
  for (t in times) {
    var s = Math.random();
    data.push({animal:a, sightings:s, time:t});
  }
}

var svg = d3.select('body')
  .append('svg')
  .attr('height', 800)
  .attr('width', 800);

var CELL_HEIGHT = 50,
    CELL_WIDTH = 50,
    VIZ_HEIGHT = CELL_HEIGHT*animals.length,
    VIZ_WIDTH = CELL_WIDTH*times.length;

var colors = ['blue', 'black', 'yellow']
var color = d3.scale.linear()
    .domain([0, .5, 1])
    .range(colors);


// HEATMAP

svg.selectAll('rect')
  .data(data)
  .enter()
  .append('rect')
    .attr('x', function(d){return d.time*CELL_WIDTH})
    .attr('y', function(d){return d.animal*CELL_HEIGHT})
    .attr('height', CELL_HEIGHT)
    .attr('width', CELL_WIDTH)
    .style('fill', function(d){console.log(color(d.sightings), d.sightings);return color(d.sightings)});


// Axis lines
var xTextG = svg.append('g'),
    xText = xTextG.selectAll('text')
      .data(times)
      .enter()
        .append('text')
          .attr('x', function(d,i){return i*CELL_WIDTH + CELL_WIDTH/2})
          .attr('y', VIZ_HEIGHT+15)
          .attr('fill', '000')
          .attr('text-anchor', 'middle')
          .style('font-family','sans-serif')
          .text(function(d){return d}),
    xTextName = xTextG.append('text')
      .attr('x', VIZ_WIDTH/2)
      .attr('y', VIZ_HEIGHT+35)
      .attr('text-anchor', 'middle')
      .style('font-family', 'sans-serif')
      .style('font-weight', 'bold')
      .text('Time');


// LEGEND

var gradient = svg.append("svg:defs")
  .append("svg:linearGradient")
    .attr("id", "gradient")
    .attr("x1", "0%")
    .attr("y1", "100%")
    .attr("x2", "0%")
    .attr("y2", "0%");

gradient.append("svg:stop")
    .attr("offset", "0%")
    .attr("stop-color", colors[0])
    .attr("stop-opacity", 1);

gradient.append("svg:stop")
    .attr("offset", "50%")
    .attr("stop-color", colors[1])
    .attr("stop-opacity", 1);

gradient.append("svg:stop")
    .attr("offset", "100%")
    .attr("stop-color", colors[2])
    .attr("stop-opacity", 1);

svg.append('rect')
  .attr('x', VIZ_WIDTH+15)
  .attr('height', VIZ_HEIGHT)
  .attr('width', 20)
  .style('fill', 'url(#gradient)');