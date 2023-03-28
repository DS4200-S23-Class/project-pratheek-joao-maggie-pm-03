const svg = d3.select("#vis1")
    .append("svg")
    .attr("width", 1100)
    .attr("height", 800)


const dataArray = []
for (let i = 0; i < 88; i++) {
    if (i == 0
        || (i == 7)
        || (i >= 2 && i <= 4)
        || (i >= 10 && i <= 13)
        || (i >= 18 && i <= 21)
        || (i >= 26 && i <= 31)
        || (i >= 34 && i <= 38)
        || (i >= 41 && i <= 46)
        || (i >= 50 && i <= 54)
        || (i >= 59 && i <= 62)
        || (i >= 66 && i <= 69)
        || (i == 71)
        || (i >= 73 && i <= 75)
        || (i >= 80 && i <= 81)
        || (i == 83)) {
        dataArray.push({ id: i, fill: true });
    } else {
        dataArray.push({ id: i, fill: false });
    }
}

const labels = [
    "AK", "", "WA", "OR", "CA", "", "", "HI",
    "", "", "ID", "NV", "UT", "AZ", "", "",
    "", "", "MT", "WY", "CO", "NM", "", "",
    "", "", "ND", "SD", "NE", "KS", "OK", "TX",
    "", "", "MN", "IA", "MO", "AR", "LA", "",
    "", "WI", "IL", "IN", "KY", "TN", "MS", "",
    "", "", "MI", "OH", "WV", "NC", "AL", "",
    "", "", "", "PA", "VA", "SC", "GA", "",
    "", "", "NY", "NJ", "DE", "MD", "", "FL",
    "", "VT", "MA", "CT", "", "", "", "",
    "ME", "NH", "", "RI", "", "", "", ""];

// load data from CSV file
d3.csv("data/test.csv").then(function(collegeData) {

    // create a mapping of state codes to tuition values
    const oosTuitionMap = new Map(collegeData.map(d => [d.statecode, d.tuition_oos]));

    const isTuitionMap = new Map(collegeData.map(d => [d.statecode, d.tuition_is]));

    const earlyPayMap = new Map(collegeData.map(d => [d.statecode, d.early_pay]));

    const midPayMap = new Map(collegeData.map(d => [d.statecode, d.mid_pay]));

    // create an array of unique college names
    const collegeNames = Array.from(new Set(collegeData.map(d => d.college_name)));

    // selects the vis1 element and adds a class tooltip
    const TOOLTIP = d3.select("#vis1")
                        .append("div")
                        .attr("class", "tooltip"); 

// defines event handler function for a mouse moving
function handleMousemove(event, d) {
  // get the tuition value for the state code
  const oosTuition = oosTuitionMap.get(labels[d.id]);
  const isTuition = isTuitionMap.get(labels[d.id]);
  const earlyPay = earlyPayMap.get(labels[d.id]);
  const midPay = midPayMap.get(labels[d.id]);
  TOOLTIP.html(`State: ${labels[d.id]}
    <br><br>Tuition Costs:
    <br>Average Out-of-State Tuition: $${oosTuition}
    <br>Average In-State Tuition: $${isTuition}
    <br><br> Salary Prospects:
    <br>Average Early Career Pay: $${earlyPay}
    <br>Average Mid Career Pay: $${midPay}`)
    .style("left", (event.pageX + 10) + "px")
    .style("top", (event.pageY - 10) + "px")
    .style("opacity", 1); 
}

  // defines event handler function for a mouse removal
  function handleMouseleave(event, d) {
    d3.select(this)
      .attr("fill", "lightblue")
    TOOLTIP.style("opacity", 0);
  } 

const squares = svg.selectAll("g")
  .data(dataArray)
  .enter()
  .append("g");

squares.append("rect")
  .attr("class", d => d.fill ? "square lightblue" : "square")
  .attr("x", (d, i) => Math.floor(i / 8) * 100)
  .attr("y", (d, i) => (i % 8) * 100)
  .attr("width", 100)
  .attr("height", 100)
  .attr("fill", d => d.fill ? "lightblue" : "white")
  .attr("stroke", d => d.stroke ? "black" : "white")
  .attr("stroke-width", 2);

squares.append("text")
  .attr("class", "state-text")
  .text((d, i) => labels[i])
  .attr("x", (d, i) => Math.floor(i / 8) * 100 + 50)
  .attr("y", (d, i) => (i % 8) * 100 + 50)
  .attr("text-anchor", "middle")
  .attr("alignment-baseline", "middle")
  .attr("fill", "black");

  squares.selectAll(".lightblue")
    .on("mousemove", handleMousemove)
    .on("mouseleave", handleMouseleave)
    .on("mouseover", function(d) {
      d3.select(this).attr("fill", "orange");
    })
    .on("mouseout", function(d) {
      d3.select(this).attr("fill", "lightblue");
    });


// drop down menu
// selects the vis1 element and stores it as a constant 
const dropDown = d3.select("#vis1");

// appends the paragraph element to the right-column element
dropDown.append("p")
  .text("College Comparer")

// appends the form element to the right-column element and stores it as a constant
const form = dropDown.append("form")
  .attr("id", "college-name");

// appends the label element to the form element and stores it as a constant
const collegeOne = form.append("label")
  .attr("for", "first-college")
  .text("Select the first college you wish to compare:");

const selectOne = form.append("select")
  .attr("id", "college-one-value");

selectOne.selectAll("option")
  .data(collegeNames)
  .enter()
  .append("option")
    .attr("value", (d) => d)
    .text((d) => d);

// appends the label element to the form element and stores it as a constant
const collegeTwo = form.append("label")
  .attr("for", "second-college")
  .text("Select the second college you wish to compare:");

// appends the select element to the form element and stores it as a constant
const selectTwo = form.append("select")
  .attr("id", "college-two-value")

// appends each Y-coordinate 1-9 to one option element
// and updates the text values to reflect this
selectTwo.selectAll("option")
  .data(collegeNames)
  .enter()
  .append("option")
    .attr("value", (d) => d)
    .text((d) => d);

// appends button element to the right-column element and stores it as a constant
const button = dropDown.append("button")
  .attr("id", "button")
  .text("Compare!");

// adds event listener for a mouse click on the button
button.on("click", handleAddPoint);
    
});

// Code for the bar charts below here
// Frame
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500;
const MARGINS = { left: 50, right: 50, top: 50, bottom: 50 };

// Height and widths for visualizations
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

const FRAME1 = d3.select("#vis2")
    .append("svg")
    .attr("height", FRAME_HEIGHT)
    .attr("width", FRAME_WIDTH)
    .attr("class", "frame");

function bar_chart_1() {

    d3.csv("cutbardata.csv").then((data) => {

        const AMOUNT_MAX = d3.max(data, (d) => { return parseInt(d["Adams State University"]); })
        
        // Define scale functions that maps our data values 
        // (domain) to pixel values (range)
        const X_SCALE3 = d3.scaleBand()
            .domain(data.map((d) => { return d.category }))
            .range([0, VIS_WIDTH])
            .padding(0.25); // add some padding  

        // scale function
        const Y_SCALE3 = d3.scaleLinear()
            .domain([0, AMOUNT_MAX])
            .range([VIS_HEIGHT + 1, 0]);

        //Categories to apply different style schemes
        const z3 = d3.scaleOrdinal()
            .domain(data.map(d => d.category))
            .range(d3.schemeCategory10);

        // Add Y axis
        FRAME1.append("g")
            .attr("transform", "translate(" + MARGINS.left + "," + (MARGINS.top) + ")")
            .call(d3.axisLeft(Y_SCALE3).ticks(10))
            .attr("font-size", "12px");

        // Add X axis
        FRAME1.append("g")
            .attr("transform", "translate(" + MARGINS.left + "," + (MARGINS.top + VIS_HEIGHT) + ")")
            .call(d3.axisBottom(X_SCALE3).ticks(10))
            .attr("font-size", "10px");
    
        // Use X_SCALE3 to make bar chart
        bar_points = FRAME1.selectAll("barchart")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function (d) { return X_SCALE3(d.category) + MARGINS.left })
            .attr("y", function (d) { return Y_SCALE3(d["Adams State University"]) + MARGINS.top })
            .attr("width", 90)
            .attr("height", d => { return (VIS_HEIGHT - Y_SCALE3(d["Adams State University"])) })
            .style("fill", function (d) { return z3(d.category) });



             // selects the vis2 element and adds a class tooltip
    const TOOLTIP = d3.select("#vis2")
                        .append("div")
                          .attr("class", "tooltip"); 

    // defines event handler function for a mouse hover and mouse out
    function handleMouse(event, d) {
        if (event.type === "mouseover") {
            d3.select(this)
                .attr("stroke", "yellow")
                .attr("stroke-width", "3px");
        } else if (event.type === "mouseout") {
            d3.select(this)
                .attr("stroke", "none");
        }
    }

    // attaches the mouseover and mouseout event listeners to the same function
    d3.selectAll(".bar")
        .on("mouseover", handleMouse)
        .on("mouseout", handleMouse);

    // defines event handler function for a mouse moving
    function handleMousemove(event, d) {
      TOOLTIP.html("Category: " + d.category + "<br>Amount: " + d.amount)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px")
          .style("opacity", 1); 
    }

    // defines event handler function for a mouse removal
    function handleMouseleave(event, d) {
      d3.select(this)
        .attr("fill", "dodgerblue")
        TOOLTIP.style("opacity", 0);
    } 

  // adds event listeners
  FRAME1.selectAll("rect")
        .on("mouseover", handleMouse)
        .on("mousemove", handleMousemove)
        .on("mouseleave", handleMouseleave);    
      
    });

}

const FRAME2 = d3.select("#vis3")
    .append("svg")
    .attr("height", FRAME_HEIGHT)
    .attr("width", FRAME_WIDTH)
    .attr("class", "frame");

function bar_chart_2() {

d3.csv("cutbardata.csv").then((data) => {

    const AMOUNT_MAX = d3.max(data, (d) => { return parseInt(d["Agnes Scott College"]); })

    // Define scale functions that maps our data values 
    // (domain) to pixel values (range)
    const X_SCALE3 = d3.scaleBand()
        .domain(data.map((d) => { return d.category }))
        .range([0, VIS_WIDTH])
        .padding(0.25); // add some padding  

    // scale function
    const Y_SCALE3 = d3.scaleLinear()
        .domain([0, AMOUNT_MAX])
        .range([VIS_HEIGHT + 1, 0]);

    //Categories to apply different style schemes
    const z3 = d3.scaleOrdinal()
        .domain(data.map(d => d.category))
        .range(d3.schemeCategory10);

    // Add Y axis
    FRAME2.append("g")
        .attr("transform", "translate(" + MARGINS.left + "," + (MARGINS.top) + ")")
        .call(d3.axisLeft(Y_SCALE3).ticks(10))
        .attr("font-size", "12px");

    // Add X axis
    FRAME2.append("g")
        .attr("transform", "translate(" + MARGINS.left + "," + (MARGINS.top + VIS_HEIGHT) + ")")
        .call(d3.axisBottom(X_SCALE3).ticks(10))
        .attr("font-size", "10px");

    // Use X_SCALE3 to make bar chart
    bar_points = FRAME2.selectAll("barchart")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return X_SCALE3(d.category) + MARGINS.left })
        .attr("y", function (d) { return Y_SCALE3(d["Agnes Scott College"]) + MARGINS.top })
        .attr("width", 90)
        .attr("height", d => { return (VIS_HEIGHT - Y_SCALE3(d["Agnes Scott College"])) })
        .style("fill", function (d) { return z3(d.category) });



    // selects the vis2 element and adds a class tooltip
    const TOOLTIP = d3.select("#vis3")
                        .append("div")
                          .attr("class", "tooltip"); 



    // defines event handler function for a mouse hover and mouse out
    function handleMouse(event, d) {
        if (event.type === "mouseover") {
            d3.select(this)
                .attr("stroke", "yellow")
                .attr("stroke-width", "3px");
        } else if (event.type === "mouseout") {
            d3.select(this)
                .attr("stroke", "none");
        }
    }

    // attaches the mouseover and mouseout event listeners to the same function
    d3.selectAll(".bar")
        .on("mouseover", handleMouse)
        .on("mouseout", handleMouse);

    // defines event handler function for a mouse moving
    function handleMousemove(event, d) {
      TOOLTIP.html("Category: " + d.category + "<br>Amount: " + d.amount)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px")
          .style("opacity", 1); 
    }

    // defines event handler function for a mouse removal
    function handleMouseleave(event, d) {
      d3.select(this)
        .attr("fill", "dodgerblue")
        TOOLTIP.style("opacity", 0);
    } 

  // adds event listeners
  FRAME2.selectAll("rect")
        .on("mouseover", handleMouse)
        .on("mousemove", handleMousemove)
        .on("mouseleave", handleMouseleave); 
    });
}


//Calling the graphs
bar_chart_1();
bar_chart_2();
