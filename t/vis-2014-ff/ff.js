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
  ten: [],
  init: function () {
    this.six = new Array(36);
    for (var i = 0; i < this.six.length; i++) this.six[i] = colors.hex[i % 4];
    this.six = shuffle(this.six);

    this.ten = new Array(100);
    for (var i = 0; i < this.ten.length; i++) this.ten[i] = colors.hex[i % 4];

    return this;
  }
}.init();

var grids = data.grids;

var sixGrid = grids[0].grid,
    tenGrid = grids[40].grid,
    setSize = 10,
    cycleData = tenGrid;

var activeGridObj = gridObj.ten;


var rectG = svg.append('g');
var rects = rectG.selectAll('rect')
      .data(cycleData)
      .enter()
      .append('rect')
        .attr('height', square.length)
        .attr('width', square.length)
        .attr('x', function(d,i) {
          var moveX = (i % setSize) * (square.length + square.margin);
          return moveX;
        })
        .attr('y', function(d, i) {
          var moveY = (parseInt(i/setSize)) * (square.length + square.margin);
          return moveY;
        })
        .style('fill', '#fff');

var centerGrid = svg.attr('width')/2 - square.footprint*(setSize/2);
rectG.attr('transform', 'translate('+ centerGrid +',20)');

function fade() {
  function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
  }
  function pickTgtIndex(){
    var index = 0,
        halfSetSize = Math.floor(setSize/2);
    index = Math.floor(Math.random() * setSize * setSize);
    while (
      index < setSize || index > setSize*setSize - setSize
      || Math.floor(index/setSize) == setSize - 1
      || Math.floor(index/setSize) == 0
      || index%setSize == setSize - 1 || index%setSize == 0
      || index%setSize == halfSetSize
      || index%setSize == halfSetSize - 1
      || Math.floor(index/setSize) == halfSetSize
      || Math.floor(index/setSize) == halfSetSize - 1
    ) {
      index = Math.floor(Math.random() * setSize * setSize);
    }
    return index;
  }
  this.six = shuffle(activeGridObj);

  var tgtIndex = pickTgtIndex();
  rects.each(function(d,i) {
    var thisEl = d3.select(this),
        startColor = thisEl.style('fill');
    if (i == tgtIndex) {
      thisEl.transition().duration(Math.random()*2000)
        .styleTween('fill', function(d) {
          return d3.interpolate(startColor, colors.hex[4]);
        });
    } else {
      thisEl.transition().duration(Math.random()*2000)
        .styleTween('fill', function(d) {
          return d3.interpolate(startColor, activeGridObj[i]);
        });
    }
  });
}

fade();

presvg.append('h1').text('The relation between visualization size, grouping, and user performance');
presvg.append('h3').text('Connor C. Gramazio, Karen B. Schloss, David H. Laidlaw');

setInterval(fade, 3000);
