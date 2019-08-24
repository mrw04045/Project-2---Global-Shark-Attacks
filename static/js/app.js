// -----------------------------------------------------------
// Event for Start Over Button
// -----------------------------------------------------------

// Getting a reference to the button on the page with the id property set to `filter-btn`
var filterButton =d3.select("#filter-btn");

filterButton.on("click", function() {
    location.reload();
});


// -----------------------------------------------------------
// Event for Line Chart 
// -----------------------------------------------------------

var lineChartButton = d3.select("#lineChart-btn");

lineChartButton.on("click", function() {

    // prevent refresh
    d3.event.preventDefault();

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select(".chart_area").select("svg");

    // clear svg is not empty
    if (!svgArea.empty()) {
      svgArea.remove();
    }

    var svgArea2 = d3.select(".svg-container");

    // clear svg is not empty
    if (!svgArea2.empty()) {
      svgArea2.remove();
    }
    

    lineChart();
});

// -----------------------------------------------------------
// Event for Bar Chart 
// -----------------------------------------------------------

var barChartButton = d3.select("#barChart-btn");

barChartButton.on("click", function() {

  // prevent refresh
  d3.event.preventDefault();

  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  var svgArea = d3.select(".chart_area").select("svg");

  // clear svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  barChart();

});


// -----------------------------------------------------------
// Event for Word Cloud
// -----------------------------------------------------------

var cloudButton = d3.select("#cloud-btn");

cloudButton.on("click", function() {

  // prevent refresh
  d3.event.preventDefault();

  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  var svgArea = d3.select(".chart_area").select("svg");

  // clear svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  var svgArea2 = d3.select(".svg-container");

  // clear svg is not empty
  if (!svgArea2.empty()) {
    svgArea2.remove();
  }

  wordCloud();
  
});