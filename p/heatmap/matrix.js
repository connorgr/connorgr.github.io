var allAnimals = ['BLEE',
                  'CLAB',
                  'GORF',
                  'JUSK',
                  'KWIM',
                  'LERD',
                  'MALB',
                  'NEEK',
                  'PRAH',
                  'RALT',
                  'SLAH',
                  'SLUB',
                  'SPAG',
                  'TASP',
                  'VRAY',
                  'WERF'];


// Generate indecies
var is = [];
for(var i = 0; i < 16; i++) {
  var index = parseInt(Math.random() * allAnimals.length);
  while(is.indexOf(index) > -1) {
    index = parseInt(Math.random() * allAnimals.length);
  }
  is.push(index);
}
console.log(is);

var animals = Array.apply(null, Array(16)).map(function(_,i) {return allAnimals[is[i]];});
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

// Create the sighting values using a Guassian function
function sightings(center, maximum) {
  var widthOptions = [2,3,4],
      widthScalar = Math.random();
  while (widthScalar <= .5) {
    widthScalar = Math.random();
  }
  var base = 0,
      curveWidth = widthScalar*widthOptions[parseInt(Math.random()*widthOptions.length)]; // for noiser patterns might parameterize this
  var gaussianFn = function(x){return maximum*Math.exp(-(Math.pow(x-center,2)/(2*Math.pow(curveWidth,2))))+base};
  return gaussianFn;
}
var data = [];
for (a in animals) {
  // center variables are the large magnitude sighting times
  // littleCenter variables are noise on the non-large side of the heatmap
  var sideOfMostSightings = Math.random() > .5 ? -1 : 1,
      centerScalar = Math.random()*2 * sideOfMostSightings,
      center = centerScalar + (Math.random() > .5 ? times.length/4 : 3*(times.length/4)),
      sightingFn = sightings(center, 1),
      littleCenterScalar = Math.random()*2*sideOfMostSightings,
      littleCenterSide = center < times.length/2 ? 3*(times.length/4) : times.length/4,
      littleCenter = littleCenterScalar + littleCenterSide,
      littleSightingFn = sightings(littleCenter, Math.random() * (.6 - 0) + 0);

  for (t in times) {
    var s = sightingFn(t),
        sPrime = littleSightingFn(t);
    data.push({animal:a, sightings:s+sPrime, time:t});
  }
}

function addMatrix(colors, container, bgColor) {

  var color = d3.scale.linear()
      .domain([0, .5, 1])
      .range(colors);

  var svg = container.append('svg')
    .attr('height', 300)
    .attr('width', 300)
    .style('background-color', bgColor)
    .style('padding-top', '20px')
    .style('padding-left', '20px')
    .append('g')
      .attr('transform',('translate(30,0)'));

  var CELL_HEIGHT = 15,
      CELL_WIDTH = 15,
      VIZ_HEIGHT = CELL_HEIGHT*animals.length,
      VIZ_WIDTH = CELL_WIDTH*times.length;

  // HEATMAP

  var heatmap = svg.append('g');
  heatmap.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
      .attr('x', function(d){return d.time*CELL_WIDTH})
      .attr('y', function(d){return d.animal*CELL_HEIGHT})
      .attr('height', CELL_HEIGHT)
      .attr('width', CELL_WIDTH)
      .style('fill', function(d){return color(d.sightings)})
      .on('click', function(d) {
        var i = d.animal,
            a = animals[parseInt(i)],
            t = d.time;
        d3.select('#indexLoc')
          .text(i + ' ('+a+'), '+t);
      });

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
            .attr('stroke-width', 1)
            .attr('stroke', bgColor == '#000' ? '#fff' : '#000'),
      xText = xTextG.selectAll('text')
          .data(times)
          .enter()
            .append('text')
              .attr('x', function(d,i){return i*CELL_WIDTH + CELL_WIDTH/2})
              .attr('y', VIZ_HEIGHT+20)
              .attr('fill', bgColor == '#000' ? '#fff' : '#000')
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
      .attr('stroke-width', 1)
      .attr('stroke', bgColor == '#000' ? '#fff' : '#000');

  xTextG.append('line')
      .attr('x1', VIZ_WIDTH/2 + CELL_WIDTH/2)
      .attr('y1', VIZ_HEIGHT + 2)
      .attr('x2', VIZ_WIDTH - CELL_WIDTH/2)
      .attr('y2', VIZ_HEIGHT + 2)
      .attr('stroke-width', 1)
      .attr('stroke', bgColor == '#000' ? '#fff' : '#000');

  var yTextG = svg.append('g'),
      yText = yTextG.selectAll('text')
          .data(animals)
          .enter()
            .append('text')
              .attr('x', -2)
              .attr('y', function(d,i) { return i*CELL_WIDTH + 3*(CELL_HEIGHT/4) })
              .attr('fill', bgColor == '#000' ? '#fff' : '#000')
              .attr('text-anchor', 'end')
              .style('font-family', 'sans-serif')
              .style('font-size', '.75em')
              .text(function(d){return d;});
}

// Color configs
d3.select('#blackBg').on('click', function(e){
  d3.select('body').style('background-color','black');
  xText.style('fill','gray');
  xTextName.style('fill', 'gray');
  yText.style('fill','gray');
  xTicks.style('stroke','gray');
  xTextG.selectAll('line').style('stroke','gray');
});
d3.select('#grayBg').on('click', function(e){
  d3.select('body').style('background-color','gray');
  xText.style('fill','black');
  xTextName.style('fill', 'black');
  yText.style('fill','black');
  xTicks.style('stroke','black');
  xTextG.selectAll('line').style('stroke','black');
});
d3.select('#whiteBg').on('click', function(e){
  d3.select('body').style('background-color','white');
  xText.style('fill','black');
  xTextName.style('fill', 'black');
  yText.style('fill','black');
  xTicks.style('stroke','black');
  xTextG.selectAll('line').style('stroke','black');
});

d3.select('#hideToggle')
  .on('click', function(e) {
    var panel = d3.select('#configPanel');
    if (panel.style('display') == 'none') {
      panel.style('display', 'block');
    } else {
      panel.style('display', 'none');
    }
  });

function addMatrices(colors) {
    var wrapper = d3.select('#container').append('div'),
      colorInfo = wrapper.append('p').text(colors);
  wrapper.style('border-bottom', '1px solid #ccc')
      .style('display', 'inline-block');
  addMatrix(colors, wrapper, '#fff');
  addMatrix(colors.reverse(), wrapper, '#fff');
  wrapper.append('br');
  addMatrix(colors.reverse(), wrapper, '#000');
  addMatrix(colors.reverse(), wrapper, '#000');
}

d3.select('#changeColors')
  .on('click', function(e) {
    var bot = d3.select('#inputBottom').property('value'),
        mid = d3.select('#inputMiddle').property('value'),
        top = d3.select('#inputTop').property('value');

    bot = bot == '' ? 'black' : bot;
    top = top == '' ? 'black' : top;
    var colors = mid == '' ? [bot,top] : [bot, mid, top];

    // color.range(colors);
    //heatmap.selectAll('rect').style('fill', function(d){return color(d.sightings)});
    addMatrices(colors);
  });

addMatrices(['#458eff', '#dcf3ff']);
addMatrices(['#458eff', '#042d3f']);