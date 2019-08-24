// Create function to calculate frequency of object
var year_list=[];
function lineFoo(arr){
   var prev;
   arr=arr.sort();
   for ( var i = 0; i < arr.length; i++ ) {
       if ( arr[i] !== prev ) {
           var freq_count = {};
           freq_count.year = arr[i];
           freq_count.Attack_Count = 1;
       } else {
           freq_count.Attack_Count = (freq_count.Attack_Count++ || 0) + 1;
           year_list.pop();
       }
       year_list.push(freq_count);
       prev = arr[i];
   }
   return(year_list);
};

// ---------------------------------------------
// CREATE LINE CHART
// ---------------------------------------------

function lineChart() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select(".chart_area").select("svg");

    // clear svg is not empty
    if (!svgArea.empty()) {
      svgArea.remove();
    }

    var svgWidth = document.getElementById('plot').offsetWidth;
    var svgHeight = document.getElementById('plot').offsetHeight;

    var margin = {
      top: 10,
      bottom: 50,
      right: 10,
      left: 70
    };

    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;


    // Append SVG element
    var svg = d3
      .select(".chart_area")
      .append("svg")
      .attr("height", svgHeight)
      .attr("width", svgWidth);

    // Append group element
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)

    // Read API data
    d3.json("/api/v1.0/data").then(function(data) {

        // Select the input element (beginning year)
        var inputElement1 = d3.select("#byear");
    
        // Get the value property of the input element (beginning year)
        var inputValue1 = inputElement1.property("value");
    
        // Select the input element (ending year)
        var inputElement2 = d3.select("#eyear");
    
        // Get the value property of the input element (ending year)
        var inputValue2 = inputElement2.property("value");

        var filteredData = data.filter(d => (d.Year[0] >= inputValue1) &&
                                            (d.Year[0] <= inputValue2));

      var years_all = []
      filteredData.forEach((element)=> {
      years_all.push(element.Year[0])
      });  
    
      //  Run function with all countries to create list of top ten with their frequencies 
      lineFoo(years_all);
    });    
    
      // parse data
      year_list.forEach(function(data) {
        data.year = +data.year;
        data.Attack_Count = +data.Attack_Count;
      });

      // create scales 
      var xTimeScale = d3.scaleLinear()
      .domain(d3.extent(year_list, d => d.year))
      .range([0, width]);


      var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(year_list, d => d.Attack_Count)])
      .range([height, 0]);


      // create axes
      var xAxis = d3.axisBottom(xTimeScale).tickFormat(d3.format("d"));
      var yAxis = d3.axisLeft(yLinearScale).ticks(6);
      

      // append axes
      chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

      chartGroup.append("g")
      .call(yAxis);

      // line generator
      var line = d3.line()
      .x(d => xTimeScale(d.year))
      .y(d => yLinearScale(d.Attack_Count));

      // append line
      chartGroup.append("path")
      .data([year_list])
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke-width", "2")
      .attr("stroke", "black");

      // Append axes titles
        chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 40})`)
        .attr("class", "axisLabel")
        .text("Year");

        chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - height/1.3)
        .attr("dy", "1em")
        .attr("class", "axisLabel")
        .text("Number of Attacks");
  
      // append circles
      var circlesGroup = chartGroup.selectAll("circle")
        .data(year_list)
        .enter()
        .append("circle")
        .attr("cx", d => xTimeScale(d.year))
        .attr("cy", d => yLinearScale(d.Attack_Count))
        .attr("r", "6")
        .attr("fill", "cyan")
        .attr("stroke-width", "1")
        .attr("stroke", "black");

      // Step 1: Initialize Tooltip
      var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([-40, 10])
        .html(function(d) {
          return (`<strong>${d.year}<strong><br><br>${d.Attack_Count}
          attacks`);
        });
      
      // Step 2: Create the tooltip in chartGroup.
      chartGroup.call(toolTip);

      // Step 3: Create "mouseover" event listener to display tooltip
      circlesGroup.on("mouseover", function(d) {
        toolTip.show(d, this);
      })

      // Step 4: Create "mouseout" event listener to hide tooltip
      .on("mouseout", function(d) {
        toolTip.hide(d);
      });
  
  };