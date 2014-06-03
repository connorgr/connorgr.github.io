var allAnimals = ['BLEE',
                  'CLAB',
                  'DROH',
                  'FILK',
                  'FRIM',
                  'GORF',
                  'GREE',
                  'GURK',
                  'HIFT',
                  'JARB',
                  'JUSK',
                  'KERN',
                  'KICE',
                  'KWIM',
                  'KWOH',
                  'LERD',
                  'MALB',
                  'NEEK',
                  'NORT',
                  'PLOO',
                  'PRAH',
                  'PROV',
                  'RALT',
                  'RILM',
                  'SLAH',
                  'SLUB',
                  'SPAG',
                  'SWIV',
                  'TASP',
                  'VRAY',
                  'WERF',
                  'ZIRL'];

// Generate indecies
var is = [];
for(var i = 0; i < 16; i++) {
  var index = parseInt(Math.random() * allAnimals.length);
  while(is.indexOf(index) > -1) {
    index = parseInt(Math.random() * allAnimals.length);
  }
  is.push(index);
}

var animals = Array.apply(null, Array(16)).map(function(_,i) {return allAnimals[i];});
console.log(animals);
console.log('animals.length:', animals.length);

var multipleTest = {}
for (a in animals) {
  if (a in multipleTest) {
    multipleTest[a] += 1;
    console.log('duplicate detected'+a);
  } else {
    multipleTest[a] = 0;
  }
}

times = Array.apply(null, Array(16)).map(function (_, i) {return (i+4)+':00';});

function sightings(center, maximum) {
  var base = 0,
      curveWidth = 4; // for noiser patterns might parameterize this
  var gaussianFn = function(x){return maximum*Math.exp(-(Math.pow(x-center,2)/(2*Math.pow(curveWidth,2))))+base};
  //var max = -Math.pow(center,2) + center*2*center;
  //return function(x) {return maximum*((-Math.pow(x,2) + center*2*x)/max)};
  return gaussianFn;
}
var data = [];
for (a in animals) {
  var center = Math.random() > .5 ? times.length/4 : 3*(times.length/4),
    sightingFn = sightings(center, 1);
  for (t in times) {
    var s = sightingFn(t);//Math.random();
    data.push({animal:a, sightings:s, time:t});
  }
}

var svg = d3.select('body')
  .append('svg')
  .attr('height', 800)
  .attr('width', 800)
  .append('g')
    .attr('transform',('translate(100,0)'));

var CELL_HEIGHT = 15,
    CELL_WIDTH = 15,
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
    .style('fill', function(d){return color(d.sightings)});


// Axis lines
var xTextG = svg.append('g'),
    xTicks = xTextG.selectAll('line')
        .data(times)
        .enter()
        .append('line')
          .attr('x1', function(d,i) {return i*CELL_WIDTH + CELL_WIDTH/2})
          .attr('y1', function(d,i) {return VIZ_HEIGHT + 2})
          .attr('x2', function(d,i) {return i*CELL_WIDTH + CELL_WIDTH/2})
          .attr('y2', function(d,i) {
            if (i%4 == 0) {
              return VIZ_HEIGHT + 8;
            }
            return VIZ_HEIGHT + 5;
          })
          .attr("stroke-width", 1)
          .attr("stroke", "black"),
    xText = xTextG.selectAll('text')
        .data(times)
        .enter()
          .append('text')
            .attr('x', function(d,i){return i*CELL_WIDTH + CELL_WIDTH/2})
            .attr('y', VIZ_HEIGHT+20)
            .attr('fill', '#000')
            .attr('text-anchor', 'middle')
            .style('font-family','sans-serif')
            .style('font-size', '.75em')
            .text(function(d,i){
              if (i%4 != 0) {
                return '';
              }
              return d;
            }),
    xTextName = xTextG.append('text')
        .attr('x', VIZ_WIDTH/2)
        .attr('y', VIZ_HEIGHT+35)
        .attr('text-anchor', 'middle')
        .style('font-family', 'sans-serif')
        .style('font-weight', 'bold')
        .text('Time');

xTextG.append('line')
    .attr('x1', CELL_WIDTH/2)
    .attr('y1', VIZ_HEIGHT + 2)
    .attr('x2', VIZ_WIDTH/2 - CELL_WIDTH/2)
    .attr('y2', VIZ_HEIGHT + 2)
    .attr("stroke-width", 1)
    .attr("stroke", "black");

xTextG.append('line')
    .attr('x1', VIZ_WIDTH/2 + CELL_WIDTH/2)
    .attr('y1', VIZ_HEIGHT + 2)
    .attr('x2', VIZ_WIDTH - CELL_WIDTH/2)
    .attr('y2', VIZ_HEIGHT + 2)
    .attr("stroke-width", 1)
    .attr("stroke", "black");

var yTextG = svg.append('g'),
    yText = yTextG.selectAll('text')
        .data(animals)
        .enter()
          .append('text')
            .attr('x', -2)
            .attr('y', function(d,i) { return i*CELL_WIDTH + 3*(CELL_HEIGHT/4) })
            .attr('fill', '#000')
            .attr('text-anchor', 'end')
            .style('font-family', 'sans-serif')
            .style('font-size', '.75em')
            .text(function(d){return d;});

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