//Select your menu ID
let selectedMenu1 = "submenu22";

// create getJson function to retrieve response
function getJson(url){
    return d3.json(url);
}

//Event Listener to your main function
document.addEventListener('DOMContentLoaded', function() {
    const submenu1 = document.getElementById(selectedMenu1); //Change Menu Here..

    submenu1.addEventListener('click', function(event) {
        event.preventDefault();
        //hide the Menu
        document.querySelector('.side-menu').style.display = 'none';
        //Call Function
        //console.log("clicked") test
        startGraph();
    });
});

//Initial Graph Function
function startGraph(){

    //Select D3 Area and clear Content
    let graphicArea = d3.select("#graphics-output");
    graphicArea.html("");

    //Create Divs:
    graphicArea.append("div").attr("id", "leftColumn").style("width", "20%");
    graphicArea.append("div").attr("id", "rightColumn").style("width", "80%");
    graphicArea.style("display", "flex");

    //Select Divs
    let leftColumn = d3.select("#leftColumn");
    let rightColumn = d3.select("#rightColumn");

    //Add DropDown for what (Rev-Exp)
    let menuRevExp = leftColumn.append("select").attr("id", "ddRevExp")
    .style("width", "90%")
    .style("font-size", "16px")
    .style("margin-top", "15px");

    menuRevExp.append("option").attr("value", "Revenue").text("Revenue");
    menuRevExp.append("option").attr("value", "Expense").text("Expense");

    //Add DropDown for Program Selection
    let menuProgram = leftColumn.append("select").attr("id", "ddProg")
    .style("width", "90%")
    .style("font-size", "16px")
    .style("margin-top", "15px");
    
    menuProgram.append("option").attr("value", "").text("Select a Program");

    //URL
    url_api_base = "/api/program_analysis/2023";
    //Get API info to Populate DropDown
    getJson(url_api_base).then(function(data){
        
        for (let looper1 = 0; looper1 < data.length; looper1++){
            menuProgram.append("option").attr("value", data[looper1].Program).text(data[looper1].Program);
        }
        //Call Listeners 
        handleRevExpSelection();
        handleProgramSelection();
    });

    //start bar graph info with Default options
    let revList = [0, 0, 0, 0, 0];
    let yearList = ["2019","2020","2021","2022","2023"];
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
        Plotly.newPlot("rightColumn", traceBar, layoutBar);
      
}

// Function to handle the dropdown menu selection for RevExp
function handleRevExpSelection() {
    const ddRevExp = document.getElementById("ddRevExp");
    ddRevExp.addEventListener('change', function() {
        const selectedOption = ddRevExp.value;
        generateGraphics();
    });
}

// Function to handle the dropdown menu selection for Program
function handleProgramSelection() {
    const ddProg = document.getElementById("ddProg");
    ddProg.addEventListener('change', function() {
        const selectedOption = ddProg.value;
        generateGraphics();
    });
}

function generateGraphics(){
    let menuRevExp = d3.select("#ddRevExp");
    let menuProg = d3.select("#ddProg");

    let revexp = menuRevExp.property("value");
    let prog = menuProg.property("value");

    //console.log(revexp);
    //console.log(prog);

    let revList = [];
    let expList = [];
    let yearList = ["2019","2020","2021","2022","2023"];

    url_api_base = "/api/program_analysis/";

    for (let yearloop = 0; yearloop < yearList.length; yearloop++){
        url = url_api_base + yearList[yearloop];
        getJson(url).then(function(data){
        
            for (let plooper = 0; plooper < data.length; plooper++){
                if(data[plooper].Program == prog){
                    revList[yearloop] = data[plooper].rev
                    expList[yearloop] = data[plooper].exp
                }
            }

            if(yearList[yearloop] == "2023"){
                
                let yValues = []

                console.log(prog);
                console.log(yearList[yearloop]);
                console.log(revList);
                console.log(expList);

                if(revexp == "Revenue"){
                    yValues = revList;
                }else{
                    yValues = revList;
                }

                let traceBar = [{
                    x : yearList,
                    y : yValues,
                    text : yValues,
                    type : "bar",
                    hoverinfo : "text"
                    }];
                    //start bargraph layout
                    let layoutBar = {
                    yaxis: {
                        //tickvals: yValues, 
                        //ticktext: yValues
                        }
                    };
                    //plot bargraph into bar id.
                    Plotly.newPlot("rightColumn", traceBar, layoutBar);    
            }
        });
    }
}