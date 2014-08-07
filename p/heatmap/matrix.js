function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

var numAnimals = 8;

var allAnimals = ['BLEE',
                  'KWIM',
                  'NEEK',
                  'RALT',
                  'SLUB',
                  'TASP',
                  'VRAY',
                  'WERF'];


// Generate indecies
var is = [];
for(var i = 0; i < numAnimals; i++) {
  var index = parseInt(Math.random() * allAnimals.length);
  while(is.indexOf(index) > -1) {
    index = parseInt(Math.random() * allAnimals.length);
  }
  is.push(index);
}
console.log(is);

var animals = Array.apply(null, Array(numAnimals)).map(function(_,i) {return allAnimals[is[i]];});
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

times = Array.apply(null, Array(numAnimals)).map(function (_, i) {return (i+4)+':00';});

var data = [];

var majoritySideNum = Math.floor(8*(animals.length/10)),
    minoritySideNum = animals.length - majoritySideNum;
    console.log(majoritySideNum, minoritySideNum);

var majoritySide = -1,
    minoritySide = 1;

// Create a list of side flags that are paired with animals
var sideInfo = []
for (var i = 0; i < majoritySideNum; i++) {
  sideInfo.push(majoritySide);
}
for (var i = 0; i < minoritySideNum; i++) {
  sideInfo.push(minoritySide);
}
sideInfo = shuffle(sideInfo);


// Generate sighting numbers for all animals with Gaussian function
function generateSightings() {
  // Returns a function to generate the sighting values using a Guassian
  function sightings(center, maximum) {
    var widthOptions = [2,3],
        widthScalar = Math.random();
    while (widthScalar <= .5) {
      widthScalar = Math.random();
    }
    var base = 0,
        curveWidth = widthScalar*widthOptions[parseInt(Math.random()*widthOptions.length)]; // for noiser patterns might parameterize this
    var gaussianFn = function(x){return maximum*Math.exp(-(Math.pow(x-center,2)/(2*Math.pow(curveWidth,2))))+base};
    return gaussianFn;
  }

  var animalSightings = {};
  for (a in animals) {
    var sideOfMostSightings = sideInfo[a];

    var center = sideOfMostSightings < 0 ? times.length/4 : 3*(times.length/4),
        noiseCenter = sideOfMostSightings > 0 ? times.length/4 : 3*(times.length/4);

    // perturb center
    center = center + (Math.random() > .5 ? 1 : -1)*1.25*Math.random();

    var sightingFn = sightings(center,1),
        noiseSightingFn = sightings(noiseCenter, .2);

    var sightingsList = [];
    for (t in times) {
      var s = sightingFn(t),
          sPrime = noiseSightingFn(t),
          sFinal = s+sPrime > 1 ? 1 : s+sPrime;
      sightingsList.push(sFinal);
    }

    var half_length = Math.ceil(sightingsList.length / 2),
        sightingsListLeft = sightingsList.splice(0,half_length),
        sightingsListRight = sightingsList;

    sightingsListLeft = shuffle(sightingsListLeft);
    sightingsListRight = shuffle(sightingsListRight);

    sightingsList = sightingsListLeft.concat(sightingsListRight);
    animalSightings[a] = sightingsList;
  }

  return animalSightings;
} // end generateSightings()

function enoughSightings(animalSightings) {
  var left = 0,
      right = 0;
  for(var key in animalSightings) {
    var s_right = animalSightings[key].slice(0),// clone the array
        half_length = Math.ceil(s_right.length /2),
        s_left = s_right.splice(0,half_length),
        leftTotal = s_left.reduce(function(a,b){return a+b;}),
        rightTotal = s_right.reduce(function(a,b){return a+b;});
    if(leftTotal<rightTotal) {
      left = left+leftTotal;
    } else {
      right = right+rightTotal;
    }
  }

  console.log('left/right', left/right);
  return left/right < .4 && left/right > .1;
}

var animalSightings = generateSightings();
while(enoughSightings(animalSightings) == false) {
  animalSightings = generateSightings();
}
for (a in animalSightings) {
  for (t in times) {
    data.push({animal:a, sightings:animalSightings[a][t], time:t});
  }
}


var sightingVals = data.map(function(d) { return d.sightings;}),
    maxValue = Math.max.apply(null, sightingVals);

// Norm the values ot make sure the max is 1
for (d in data) {
  var oldVal = data[d].sightings,
      newVal = oldVal/maxValue;

  data[d].sightings = newVal;
}

var sightingValsNew = data.map(function(d) {return d.sightings;}),
    maxValueNew = Math.max.apply(null, sightingValsNew);

// Make sure that the maximum value is what it should be.
if (maxValueNew > 1) {
  console.log(maxValueNew,maxValue, maxValue*c);
  throw('Something went wrong when normalizing sightings values');
}


function addMatrix(colors, container, bgColor) {
  // This domain means that the domain [0,1] is the center 90%,
  // meaning that there is 10% contrast to either end of the legend
  // and actdual values
  var color = d3.scale.linear()
      .domain([-(1/18), 1+(1/18)])
      .range(colors)
      .interpolate(d3.interpolateLab);

  var svg = container.append('svg')
    .attr('height', 300)
    .attr('width', 300)
    .style('background-color', bgColor)
    .style('display', 'inline-block')
    .style('padding-top', '20px')
    .style('padding-left', '20px')
    .append('g')
      .attr('transform',('translate(30,0)'));

  // Add legend
  var legend = container.append('svg')
          .attr('height', 50)
          .attr('width', 330),
      legendData = [-.125, 0, .125, .25, .375, .5, .625, .75, .875, 1, 1.25];

  legend.selectAll('rect')
      .data(legendData)
      .enter()
        .append('rect')
            .attr('x', function(d,i) { return i*30; })
            .attr('y', 0)
            .attr('width', 30)
            .attr('height', 30)
            .attr('fill', function(d){return color(d);})
            .style('display', 'inline-block');
  legend.append('svg:path')
      .attr('d', d3.svg.symbol().type("triangle-up"))
      .attr('transform', 'translate(165,40)')
      .style('fill', 'black');
  legend.append('text')
      .attr('fill', 'black')
      .attr('x', 0)
      .attr('y', 45)
      .style('font-family', 'sans-serif')
      .text('0%');
  legend.append('text')
      .attr('fill', 'black')
      .attr('x', 300)
      .attr('y', 45)
      .style('font-family', 'sans-serif')
      .style('text-align', 'right')
      .text('100%');


  var CELL_HEIGHT = 30,
      CELL_WIDTH = 30,
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
      // xText = xTextG.selectAll('text')
      //     .data(times)
      //     .enter()
      //       .append('text')
      //         .attr('x', function(d,i){return i*CELL_WIDTH + CELL_WIDTH/2})
      //         .attr('y', VIZ_HEIGHT+20)
      //         .attr('fill', bgColor == '#000' ? '#fff' : '#000')
      //         .attr('text-anchor', 'middle')
      //         .style('font-family','sans-serif')
      //         .style('font-size', '.75em')
      //         .text(function(d,i){
      //           if (i%4 != 0) {
      //             return '';
      //           }
      //           return d;
      //         }),
      xTextEarly = xTextG.append('text')
          .attr('x', VIZ_WIDTH/4)
          .attr('y', VIZ_HEIGHT+20)
          .attr('text-anchor', 'middle')
          .style('font-family', 'sans-serif')
          .style('font-size', '1em')
          .style('fill', bgColor == '#000' ? '#fff' : '#000')
          .text('Early'),
      xTextLate = xTextG.append('text')
          .attr('x', 3*(VIZ_WIDTH/4))
          .attr('y', VIZ_HEIGHT+20)
          .attr('text-anchor', 'middle')
          .style('font-family', 'sans-serif')
          .style('font-size', '1em')
          .style('fill', bgColor == '#000' ? '#fff' : '#000')
          .text('Late'),
      xTextName = xTextG.append('text')
          .attr('x', VIZ_WIDTH/2)
          .attr('y', VIZ_HEIGHT+35)
          .attr('text-anchor', 'middle')
          .style('font-family', 'sans-serif')
          .style('font-weight', 'bold')
          .style('fill', bgColor == '#000' ? '#fff' : '#000')
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
              .style('font-size', '1em')
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
      .style('display', 'inline-block')
      .style('width', '500px');
  addMatrix(colors, wrapper, '#fff');
  addMatrix(colors.reverse(), wrapper, '#fff');
  wrapper.append('br');
  addMatrix(colors.reverse(), wrapper, '#000');
  addMatrix(colors.reverse(), wrapper, '#000');
  addMatrix(colors.reverse(), wrapper, colors[0]);
  addMatrix(colors.reverse(), wrapper, colors[colors.length-1]);
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



// addMatrices(['rgb(214,39,30)', 'rgb(0,0,0)']);
// addMatrices(['rgb(214,39,30)', 'rgb(255,255,255)']);
// addMatrices(['rgb(31,119,180)', 'rgb(0,0,0)']);
// addMatrices(['rgb(31,119,180)', 'rgb(255,255,255)']);
// addMatrices(['rgb(44,160,44)', 'rgb(0,0,0)']);
// addMatrices(['rgb(44,160,44)', 'rgb(255,255,255)']);

addMatrices(['rgb(31,119,180)','rgb(158,218,229)']);
addMatrices(['rgb(214,39,40)','rgb(255,187,120)']);