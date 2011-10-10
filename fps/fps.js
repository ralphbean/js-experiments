// Code for the window.requestAnimFrame developed by Paul Irish <paul.irish at gmail dot com>
// Based on this W3C spec (still a draft) http://webstuff.nfshost.com/anim-timing/Overview.html
// shim layer with setTimeout fallback
window.requestAnimFrame = (function() {
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(/* function */ callback, /* DOMElement */ element) {
            window.setTimeout(callback, 1000 / 60);
          };
})();

$(document).ready(function() {

  var interpolation = 'basis';  // The coolest method

  var w = 20;
  var h = 95;

  var total_width = window.innerWidth / 3;
  var n = Math.floor(total_width / w);

  function zeroes() { return 0; }
  data = d3.range(n).map(zeroes);

  var x = d3.scale.linear()
        .domain([0, 1])
        .range([0, w]);
  var y = d3.scale.linear()
        .domain([0, h])
        .range([0, h]);  // TODO --consider removing.

  var container = d3.select('body').append('div')
  .attr("width", w * data.length - 1).attr("height", h)
  .attr("style", "position:absolute;top:0px;left:" +
          (window.innerWidth - total_width) + "px"
  );

  var chart = container.append("svg:svg").attr("class", "chart")
  .attr("width", w * data.length - 1).attr("height", h);

  chart.selectAll("path").data(data)
  .enter().append("svg:path")
  .attr("d", getLine()(data))
  .attr("stroke", "steelblue")
  .attr("stroke-width", 1)
  .attr("fill", "none");

  // Add a x-axis line:
  chart.append("svg:line")
      .attr("x1", 0)
      .attr("x2", w * (data.length-1))
      .attr("y1", h - 0.5)
      .attr("y2", h - 0.5)
      .attr("stroke", "#000")

  // Add a y-axis line:
  chart.append("svg:line")
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", 0)
      .attr("y2", h)
      .attr("stroke", "#000")

  // Add some y-axis ticks:
  ticks = chart.selectAll('.tick')
  .data(y.ticks(7).slice(1, 6))

  ticks.enter().append('svg:line')
  .attr('x1', 0)
  .attr('x2', 5)
  .attr('y1', function (d) { return h - y(d) })
  .attr('y2', function (d) { return h - y(d) })
  .attr("stroke", "#000")
  .attr("stroke-width", 3);

  ticks.enter().append("svg:text")
  .text(function(d) { return d })
  .attr('text-anchor', 'end')
  .attr('x', 25)
  .attr('y', function (d) { return h - y(d) + 5  })

  var lastDate = new Date();

  function getLine() {
    return d3.svg.line().x(function(d, i) {
        return x(i);
      }).y(function(d) {
        return h - y(d);
    }).interpolate(interpolation);
  }

  function draw() {
    var date = new Date();
    // Delta is in milliseconds
    var delta = date - lastDate;
    // Convert from ms/frame to frames/s
    var fps = 1.0/(delta/1000.0);
    // Save the date!
    lastDate = date;

    data.push(fps);
    data.shift();

    var points = chart.selectAll("path")
    .data(data).transition().duration(1)
    .attr("d", getLine()(data));

    // Repeat as soon as we can
    requestAnimFrame(draw);
  }

  requestAnimFrame(draw);
});
