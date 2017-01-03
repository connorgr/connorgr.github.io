var width = 320,
    height = 160;

var projection = d3.geo.robinson().scale(50).translate([width/2, height/2]);

var path = d3.geo.path()
    .projection(projection);

var graticule = d3.geo.graticule();

var svg = d3.select("#worldmap").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("path")
    .datum(graticule)
    .attr("class", "latlonlines")
    .attr("d", path);

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

var countryData = topojson.feature(world, world.objects.countries).features;

// countryData = countryData.filter(function(d,i) { return d.properties.name != 'Antarctica'; });

var country = svg.append('g').selectAll('.country')
        .data(countryData);

country.enter().insert('path')
    .classed('country', true)
    .classed('visited', function(d,i) {
      return visited.indexOf(i) > -1 ? true : false; })
    .attr("d", path)
    .attr("id", function(d,i) { return d.id; })
    .attr("title", function(d,i) { return d.properties.name; });

svg.append("defs").append("path")
    .datum({type: "Sphere"})
    .attr("id", "sphere")
    .attr("d", path);

svg.append("use")
    .attr("class", "stroke")
    .attr("xlink:href", "#sphere");


var flagCodes = ['us','ca','ie','gh','cr','is','fr','es','pt','gb', 'pe', 'nl', 'bz', 'gt', 'it'];

var flags = d3.select('#flags').selectAll('.flag-wrapper')
        .data(flagCodes)
        .enter()
            .append('div').classed('flag-wrapper', true)
            .append('span')
                .attr('class', function(d) { return 'flag-icon flag-icon-'+d; });
