url_api_base = "/api/program_analysis/"

// //Initial function to create initial elements
// function init(){
//     let dropDownYear = d3.select("#selyear");
//     //loop through Names adding all to the list in the dropdown menu
//     for(let year = 2019; year <= 2023; year++){
//         dropDownYear.append("option").text(year);
//         //console.log(year);
//     }  
// }



// function optionChanged(selectedYear){
//     let url = url_api_base + selectedYear
//     console.log(url)
//     d3.json(url).then(function (response) {
        
//         let programs = response.map( function(item) {return item["Program"]});
//         let exps = response.map( function(item) {return item["exp"]});
//         let revs = response.map( function(item) {return item["rev"]});
//         let ress = response.map( function(item) {return item[`res-${selectedYear}`]});
        
//         //start bar graph info
//         let traceBar = [{
//             x : programs,
//             y : ress,
//             text : programs,
//             type : "bar",
//             //orientation : "h",
//             hoverinfo : "text"
//           }];
//           //start bargraph layout
//           let layoutBar = {
//            yaxis: {
//              tickvals: ress, 
//              ticktext: ress
//              }
//            };
//            //plot bargraph into bar id.
//            Plotly.newPlot("graphics-output", traceBar, layoutBar);
//            //break to stop loop since id found
        
//     })
// }

// init()

document.addEventListener('DOMContentLoaded', function() {
    const submenu1 = document.getElementById('submenu21');

    submenu1.addEventListener('click', function(event) {
        event.preventDefault();
        alert("You clicked on Submenu 1!");
    });

    

});

    
    