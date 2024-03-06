//Template for Event Listener Buttons

//Select your menu ID
let selectedMenu1 = "submenu22";

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
    graphicArea.append("h1").text("Grph Here"); 
}

//ID LIST ****
/*id="submenu11">Revenues
<id="submenu12">Expenses
<id="submenu13">EDA Analysis
<id="submenu13">Outliers
<id="submenu21">Programs by Year
<id="submenu22">Program's History
<id="subMenu3">Demographics Data */

    
    