//Template for Event Listener Buttons

//Select your menu ID
let selectedMenu1 = "subMenu3";

//Event Listener to your main function
document.addEventListener('DOMContentLoaded', function() {
    const submenu1 = document.getElementById(selectedMenu1); //Change Menu Here..

    submenu1.addEventListener('click', function(event) {
        event.preventDefault();
        //hide the Menu
        document.querySelector('.side-menu').style.display = 'none';
        //Call Function
        yourFunctionName();
    });
});

//Function!
function yourFunctionName(){

    let graphicArea = d3.select("#graphics-output");
    graphicArea.html("");

    //Start of the function:
    graphicArea.append("div").attr("id", "left-column").style("width", "20%");
    graphicArea.append("div").attr("id", "right-column").style("width", "80%");

    url_api_base = "/api/program_analysis/";
    let yearList = ["2019","2020","2021","2022","2023"];
    let revList = [150000, 1851351, 138131, 813218, 215872];

    // for (i=0; i < yearList.length; i++){
    //     url = url_api_base + yearList[i];
    //     console.log(url);
    // }

    graphicArea.append("div").attr("id", "left-column").style("width", "20%");
    graphicArea.append("div").attr("id", "right-column").style("width", "80%");

    let menu = graphicArea.append("select");


    //start bar graph info
    let traceBar = [{
        x : yearList,
        y : revList,
        text : yearList,
        type : "bar",
        //orientation : "h",
        hoverinfo : "text"
        }];
        //start bargraph layout
        let layoutBar = {
        yaxis: {
            tickvals: revList, 
            ticktext: revList
            }
        };
        //plot bargraph into bar id.
        Plotly.newPlot("right-column", traceBar, layoutBar);
      
}


// // Create a dropdown menu structure
// var dropdown = d3.select("#yourDivId")
//     .append("select")
//     .attr("id", "myDropdown");

// // Add options to the dropdown menu
// var options = dropdown.selectAll("option")
//     .data(["Option 1", "Option 2", "Option 3"])
//     .enter()
//     .append("option")
//     .text(function(d) { return d; });

// // Add event listener to handle selection change
// dropdown.on("change", function() {
//     var selectedOption = d3.select(this).property("value");
//     console.log("Selected option:", selectedOption);
// });

    
    