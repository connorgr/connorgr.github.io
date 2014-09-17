//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

var container = d3.select('#container'),
    presvg = container.append('div'),
    svg = container.append('svg');

svg.attr('width', $(document).width());
svg.attr('height', 1000);

var colors = {
  names: ['blue', 'green', 'red', 'yellow', 'purple'],
  hex: ['#00649b', '#10562b', '#ef4b4b', '#efcd3d', '#ae6ab5']
}

var square = {
  length: 50,
  margin: 5,
  init: function() {
    this.footprint = this.length + this.margin;
    return this;
  }
}.init();

var gridObj = {
  six: [],
  init: function () {
    this.six = new Array(36);
    for (var i = 0; i < this.six.length; i++) this.six[i] = colors.hex[i % 4];
    this.six = shuffle(this.six);

    return this;
  }
}.init();

var grids = data.grids;


var rectG = svg.append('g');
var rects = rectG.selectAll('rect')
      .data(grids[0].grid)
      .enter()
      .append('rect')
        .attr('height', square.length)
        .attr('width', square.length)
        .attr('x', function(d,i) {
          var moveX = (i % 6) * (square.length + square.margin);
          return moveX;
        })
        .attr('y', function(d, i) {
          var moveY = (parseInt(i/6)) * (square.length + square.margin);
          return moveY;
        })
        .style('fill', '#fff');

var centerGrid = svg.attr('width')/2 - square.footprint*3;
rectG.attr('transform', 'translate('+ centerGrid +',20)');

function fade() {
  function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
  }
  function pickTgtIndex(){
    var quadrant = Math.floor(Math.random() * 4),
        index;
    quadrant = 0;
    if (quadrant == 0) {
      index = randomIntFromInterval(1,6/2 - 2)
    }
    return index;
  }
  this.six = shuffle(gridObj.six);
  var tgtIndex = pickTgtIndex();
  rects.each(function(d,i) {
    var thisEl = d3.select(this),
        startColor = thisEl.style('fill');
    if (i == tgtIndex) {
      thisEl.transition().duration(Math.random()*2000)
        .styleTween('fill', function(d) {
          return d3.interpolate(startColor, gridObj.six[4]);
        });
    }
    thisEl.transition().duration(Math.random()*2000)
      .styleTween('fill', function(d) {
        return d3.interpolate(startColor, gridObj.six[i]);
      });
  });
}

fade();

presvg.append('h1').text('The relation between visualization size, grouping, and user performance');
presvg.append('h3').text('Connor C. Gramazio, Karen B. Schloss, David H. Laidlaw');

setInterval(fade, 3000);
