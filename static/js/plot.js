// Create function to calculate frequency of attacks and number of fatalities
var country_list=[];

function barFoo(arr){

    // Create function to sort array alphabetically by Country key
    function compare( a, b ) {
        if ( a.Country[0] < b.Country[0] ){
          return -1;
        }
        if ( a.Country[0] > b.Country[0] ){
          return 1;
        }
        return 0;
    };
      
    // Run function 'compare' to sort arr
    arr.sort(compare);   

    // Create empty array 'countries_unique' and empty object 'object to use in loop
    countries_unique = [];
    object = {};

    // Begin loop
    for ( var i = 0; i < arr.length; i++ ) {

        // if country name IS in array 'countries_unique'
        if (countries_unique.includes(arr[i].Country[0])) {

            // if current object is a fatal attack
            if (arr[i]["Fatal_(Y/N)"][0] == "Y") {

                // increase frequency value by 1
                object.frequency = (object.frequency++ || 0) + 1
                // increase fatalities value by 1
                object.fatalities = (object.fatalities++ || 0) + 1
            }

            // if not fatal, only increase frequency value by 1
            else {
                object.frequency = (object.frequency++ || 0) + 1
            };
        }

        // if country name is NOT in array 'countries_unique'
        else {

            // push 'object' to 'country_list'
            country_list.push(object);
            // reset 'object' to empty
            var object = {};

            // add country name to array 'countries_unique'
            countries_unique.push(arr[i].Country[0]);

            // if current object is a fatal attack
            if (arr[i]["Fatal_(Y/N)"][0] == "Y") {
                // add country name to 'country' key, set frequency key = 1, set fatality key = 1
                object.country = arr[i].Country[0]
                object.frequency = 1
                object.fatalities = 1
            }

            // if not fatal, add country name to 'country' key, set frequency key = 1, set fatality key = 0
            else {
                object.country = arr[i].Country[0]
                object.frequency = 1
                object.fatalities = 0
            };
        }; 
    }; 

    // add 'object' to 'country_list'
    country_list.push(object);

    // Remove first element from array -- it was an empty array
    country_list.shift();

    // Sort country list by frequency value
    country_list.sort(function(a, b) {
        return parseFloat(b.frequency) - parseFloat(a.frequency);
    });
    console.log(country_list)
    return (country_list);      
};

// Create barChart function
function barChart() {

    // Retrieve all countries from API
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


        // Run function with all countries to create list of top ten with their frequencies 
        barFoo(filteredData);
        var country_list_topten = country_list.slice(0,10);

        // Create arrays of x_countries (countries), y_values_all (total attacks), y_values_fatal (fatalites)
        var x_countries = [];
        var y_values_all = [];
        var y_values_fatal = [];

        // for each element in array 'country_list_topten'
        country_list_topten.forEach(function(data) {
            // add country, frequency, and fatalities values to associated arrays
            x_countries.push(data.country);
            y_values_all.push(data.frequency);
            y_values_fatal.push(data.fatalities);
        });

        // Create trace1
        var trace1={
            x:x_countries,
            y:y_values_all,
            name: "Total Attacks",
            type:"bar"
        };

        // Create trace2
        var trace2={
            x:x_countries,
            y:y_values_fatal,
            name: "Fatalities",
            type:"bar"
        };
        
        var data = [trace1, trace2];

        var layout = {
            title: "Attacks by Country (top ten)",
            yaxis: { title: "Total # of Attacks" },
            barmode: 'group'          
            };

            // Generate Bar plot
            Plotly.newPlot("plot", data, layout);
        });
};