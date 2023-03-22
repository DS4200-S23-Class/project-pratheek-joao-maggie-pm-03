const svg = d3.select("#vis1")
    .append("svg")
    .attr("width", 1100)
    .attr("height", 800)

const data = []
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
        || (i >= 73 && i <= 76)
        || (i >= 80 && i <= 81)
        || (i == 83)) {
        data.push({ id: i, fill: true });
    } else {
        data.push({ id: i, fill: false });
    }
}

const data_text = []
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
        || (i >= 73 && i <= 76)
        || (i >= 80 && i <= 81)
        || (i == 83)) {
        data.push({ id: i, fill: true });
    } else {
        data.push({ id: i, fill: true });
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
    "", "", "NY", "NJ", "MD", "DC", "", "FL",
    "", "VT", "MA", "CT", "DE", "", "", "",
    "ME", "NH", "", "RI", "", "", "", ""];

// selects the vis2 element and adds a class tooltip
const TOOLTIP = d3.select("#vis1")
                    .append("div")
                      .attr("class", "tooltip"); 

// defines event handler function for a mouse moving
function handleMousemove(event, d) {
  TOOLTIP.html("Average In-State Tuition: " + "<br>Average Out-of-State Tuition: ")
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
  .data(data)
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

squares.selectAll(".lightblue")
        .on("mousemove", handleMousemove)
        .on("mouseleave", handleMouseleave)
        .on("mouseover", function(d) {
          d3.select(this).attr("fill", "orange");
        })
        .on("mouseout", function(d) {
          d3.select(this).attr("fill", "lightblue");
        });

squares.filter(d => d.fill)
        .append("text")
        .attr("x", (d, i) => Math.floor(i / 8) * 100 + 50)
        .attr("y", (d, i) => (i % 8) * 100 + 50)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .text((d, i) => labels[i]);

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

    d3.csv("adamsstate.csv").then((data) => {

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
            .attr("font-size", "10px");

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
      
    });

}

const FRAME2 = d3.select("#vis3")
    .append("svg")
    .attr("height", FRAME_HEIGHT)
    .attr("width", FRAME_WIDTH)
    .attr("class", "frame");

function bar_chart_2() {

d3.csv("agnesscott.csv").then((data) => {

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
        .attr("font-size", "10px");

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

});

}


//Calling the graphs
bar_chart_1();
bar_chart_2();
