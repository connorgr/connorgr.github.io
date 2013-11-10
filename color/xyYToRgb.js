///////// PUT IN YOUR MONITOR-SPECIFIC VALUES IN THE FOLLOWING SECTION /////////
// the constant and slope was taken from the linear equation fit to log
//    luminance as a function of log voltage log voltage
var constantR = 1.5245,
    slopeR =  0.4792,

    constantG = 1.3179,
    slopeG = 0.4834,

    constantB = 1.7755,
    slopeB = 0.5365;

// Monitor gun chromaticities (x and y are from CIE 1931 xyY space)
var xR  = 0.696,
    yR  = 0.317,

    xG = 0.202,
    yG = 0.685,

    xB = 0.148,
    yB = 0.0515;

// List of RGBs that can be updated via a text field that contains all colors to
//   be scrolled through in the color display box
var displayRgbs = [[0,0,0]],
    currentRgb = 0; // iterator for when scrolling through list

////////////////// END MONITOR-DEPENDENT CODE & CONSTANT VALUES ////////////////
////////////////////////////////////////////////////////////////////////////////

function updateData() {
  // Tokenize xyY input. First on ';' for each entry, then on ',' for xyY values
  var rawInput = d3.select('#xyYInputList')[0][0].value,
      inputNoWS = rawInput.replace(/\s+/g, '').trim(),
      xyYs_raw = inputNoWS.split(';').filter(function(d) {
        return d === '' ? false : true;
      }),
      xyYs = xyYs_raw.map(function(d) {
            var split = d.split(',');
            if(split.length < 3) {
              console.log(d);
              console.log(split);
              throw 'Value ' + d + ' for xyY combo has less than three values';
            }
            return d.split(',');
          }),
      rgbs = xyYs.map(function(d) {return xyYToRgb(d[0], d[1], d[2]);});

  d3.select('#rgbResult')
    .selectAll('p')
    .remove();
  d3.select('#rgbResult')
    .selectAll('p')
    .data(rgbs)
    .enter()
      .append('p')
        .text(function(d) {
          console.log('1');
          return 'rgb('+d[0]+','+d[1]+','+d[2]+')';
        });

  displayRgbs = rgbs.length > 0 ? rgbs : [[0,0,0]];
  currentRgb = 0;
  d3.select('#displayRect')
    .style('fill', function(d) {
      rgb = displayRgbs[currentRgb];
      rgbStr = 'rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')';
      return rgbStr;
    });
  console.log(rgbs);
}


function xyYToRgb(x, y, Y) {
  var step1 = (x - xB) * (yR - yB) - (y - yB) * (xR - xB),
      step2 = (xG - xB) * (yR - yB) - (yG - yB) * (xR - xB),
      step3 = step1 / step2,
      step4 = ((x - xB) - step3 * (xG - xB)) / (xR - xB),
      step5 = 1.0 - step3 - step4,
      step6 = step4 * yR + step3 * yG + step5 * yB;

  var gunPercentR = (step4 * yR) / step6,
      gunPercentG = step3 * yG / step6,
      gunPercentB = 1.0 - gunPercentR - gunPercentG;

  // Make the chromaticity gray if it is outside the gammut of the monitor
  if (gunPercentR < 0.0) {
    gunPercentR = 0.0;
    console.log('gunPercentR gamut error');
  }
  if (gunPercentG < 0.0) {
    gunPercentG = 0.0;
    console.log('gunPercentG gamut error');
  }
  if (gunPercentB < 0.0) {
    gunPercentB = 0.0;
    console.log('gunPercentB gamut error');
  }

  var r = Math.pow(10.0,constantR)*Math.pow((gunPercentR * Y),slopeR),
      g = Math.pow(10.0,constantG)*Math.pow((gunPercentG * Y),slopeG),
      b = Math.pow(10.0,constantB)*Math.pow((gunPercentB * Y),slopeB);

  // Make the color appear black if it is outside the gammut of the monitor
  if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
    r = 0.;
    g = 0.;
    b = 0.;
  }

  var rInt = parseInt(r),
      gInt = parseInt(g),
      bInt = parseInt(b);

  return [rInt,gInt,bInt];
}


var input_x = 0,
    input_y = 0,
    input_Y = 0;

d3.select('body').style('background', '#000');

var svg = d3.select('#displayContainer')
    .append('svg')
      .attr('height', 1000)
      .attr('id', 'colorBox')
      .attr('width', 1000);
svg.append('rect')
  .attr('height', 1000)
  .attr('id', 'displayRect')
  .attr('width', 1000)
  .style('fill', '#f00')
  .on('mouseup', function(d) {
    currentRgb = currentRgb + 1 >= displayRgbs.length ? 0 : currentRgb + 1;
    rgb = displayRgbs[currentRgb];
    rgbStr = 'rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')';
    d3.select(this).style('fill', rgbStr);
  });

d3.select('#showText')
  .on('mouseup', function(d) {
    d3.select('#hideText').style('display', 'block');
    d3.select(this).style('display', 'none');

    d3.select('#rgbResult').style('display', 'block');
    d3.select('#xyYForm').style('display', 'block');
    d3.select('#xyYInputList').style('display', 'block');
  });
d3.select('#hideText')
  .on('mouseup', function(d) {
    d3.select('#showText').style('display', 'block');
    d3.select(this).style('display', 'none');

    d3.select('#rgbResult').style('display', 'none');
    d3.select('#xyYForm').style('display', 'none');
    d3.select('#xyYInputList').style('display', 'none');
  });