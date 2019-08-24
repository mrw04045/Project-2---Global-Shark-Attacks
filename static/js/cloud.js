function wordCloud() {

    var frequency_list = [];

    function cloudFoo(arr) {
        var prev;
    
        // Sort array
        arr =  arr.sort();
    
        // Begin loop through objects in array
        for ( var i = 0; i < arr.length; i++ ) {
    
            if ( arr[i] !== prev ) {
                var freq_count = {};
                freq_count.text = arr[i];
                freq_count.size = 1;
    
            } else {
                freq_count.size = (freq_count.size++ || 0) + 1;
                frequency_list.pop();
            }

            frequency_list.push(freq_count);
            prev = arr[i];
        }
        
        var textSizeOriginal = []
        for ( var i = 0; i < frequency_list.length; i++ ) {
            textSizeOriginal.push(frequency_list[i].size);
        }
    
        var myScale = d3.scaleLinear()
            .domain([Math.min.apply(null, textSizeOriginal), Math.max.apply(null, textSizeOriginal)])
            .range([10, svgWidth * .17]);
    
        var textSizeScaled = [];
        for ( var i = 0; i < textSizeOriginal.length; i++ ) {
            textSizeScaled.push(myScale(textSizeOriginal[i]));
        }
    
        for ( var i = 0; i < frequency_list.length; i++ ) {
            frequency_list[i].size = textSizeScaled[i];
        }
    
        return (frequency_list);
    };

        // if the SVG area isn't empty when the browser loads,
        // remove it and replace it with a resized version of the chart
        var svgArea = d3.select(".chart_area").select("svg");

        // clear svg is not empty
        if (!svgArea.empty()) {
            svgArea.remove();
        }

        var svgWidth = document.getElementById('plot').offsetWidth;
        var svgHeight = document.getElementById('plot').offsetHeight;    
            
        // Append SVG element
        var svg = d3
          .select(".chart_area")
          .append("svg")
          .attr("height", svgHeight)
          .attr("width", svgWidth);

        // Retrieve all activities from API
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
            
            var words_all = []

            filteredData.forEach((element)=> {
                words_all.push(element.Activity[0])
            })
            cloudFoo(words_all);

            var color = d3.scaleLinear()
                    .domain([0,1,2,3,4,5,6,10,15,20,100])
                    .range(["#4B0082", "#0000FF", "#A52A2A", "#0000FF", "#9900cc ", "#ff9900", "#ffffff", "#00ffff", "#ccff99", "#000000", "#9900cc"]);

            d3.layout.cloud().size([svgWidth, svgHeight])
                    .words(frequency_list)
                    .rotate(0)
                    .fontSize(function(d) { return d.size; })
                    .on("end", draw)
                    .start();


            function draw(words) {
                svg.attr("width", svgWidth)
                   .attr("height", svgHeight)
                   .attr("class", "wordcloud")
                   .append("g")
                    // without the transform, words words would get cutoff to the left and top, they would
                    // appear outside of the SVG area
                   .attr("transform", "translate(315,270)")
                   .selectAll("text")
                   .data(words)
                   .enter().append("text")
                   .style("font-size", function(d) { return d.size + "px"; })
                   .style("fill", function(d, i) { return color(i); })
                   .attr("transform", function(d) {
                       return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                   })
                   .text(function(d) { return d.text; });
            }
        });
};