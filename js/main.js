// creates an svg
const svg = d3.select("#vis1")
    .append("svg")
    .attr("width", 1100)
    .attr("height", 800);

// fills in the squares in the desired positions
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

// creates an array of state codes
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
d3.csv("data/DS4200 PM-02 Dataset Final.csv").then(function(collegeData) {

    // creates a mapping of state codes to average tuition and salary values
    const oosTuitionMap = new Map(collegeData.map(d => [d.state_code, d.avg_tuition_oos]));
    const isTuitionMap = new Map(collegeData.map(d => [d.state_code, d.avg_tuition_is]));
    const earlyPayMap = new Map(collegeData.map(d => [d.state_code, d.avg_early_pay]));
    const midPayMap = new Map(collegeData.map(d => [d.state_code, d.avg_mid_pay]));

    // creates an array of unique college names
    const collegeNames = Array.from(new Set(collegeData.map(d => d.university_name)));

    // selects the vis1 element and adds a class tooltip
    const TOOLTIP = d3.select("#vis1")
                        .append("div")
                        .attr("class", "tooltip"); 

    // defines event handler function for a mouse move
    function handleMousemove(event, d) {
  
        // gets the average tuition and salary values for the state code
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

    // appends the data array to the element g
    const squares = svg.selectAll("g")
                        .data(dataArray)
                        .enter()
                        .append("g");

    // creates the grid with the squares
    squares.append("rect")
            .attr("class", d => d.fill ? "square lightblue" : "square")
            .attr("x", (d, i) => Math.floor(i / 8) * 100)
            .attr("y", (d, i) => (i % 8) * 100)
            .attr("width", 100)
            .attr("height", 100)
            .attr("fill", d => d.fill ? "lightblue" : "white")
            .attr("stroke", d => d.stroke ? "black" : "white")
            .attr("stroke-width", 2);

    // appends the state codes to each square
    squares.append("text")
            .attr("class", "state-text")
            .text((d, i) => labels[i])
            .attr("x", (d, i) => Math.floor(i / 8) * 100 + 50)
            .attr("y", (d, i) => (i % 8) * 100 + 50)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .attr("fill", "black");

    // selects all state squares and adds event handlers
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

    // appends the paragraph element to the p element
    dropDown.append("p")
                .text("College Comparer");

    // appends the form element to the dropDown constant
    const form = dropDown.append("form")
                            .attr("id", "college-name");

    // appends the label element to the form element
    // adds text for context
    const collegeOne = form.append("label")
                            .attr("for", "first-college")
                            .text("Select the first college you wish to compare:");
    
    // appends the select element to the form element
    const selectOne = form.append("select")
                            .attr("id", "college-one-value");

    // adds the college names as options of the drop down
    selectOne.selectAll("option")
                .data(collegeNames)
                .enter()
                .append("option")
                    .attr("value", (d) => d)
                    .text((d) => d);

    const collegeTwo = form.append("label")
                            .attr("for", "second-college")
                            .text("Select the second college you wish to compare:");

    const selectTwo = form.append("select")
                            .attr("id", "college-two-value");

    selectTwo.selectAll("option")
                .data(collegeNames)
                .enter()
                .append("option")
                    .attr("value", (d) => d)
                    .text((d) => d);

    // appends button element to the drop down
    const button = dropDown.append("button")
                            .attr("id", "button")
                            .text("Compare !");

    // adds event listener for a click on the button
    button.on("click", handleCompareColleges);

    // event handler for mouse click
    function handleCompareColleges() {
    
        // gets values of selected colleges
        const collegeOneValue = selectOne.property("value");
        const collegeTwoValue = selectTwo.property("value");

        // updates header of bar-graph with college's name
        const headerLeft = d3.select("#header-left");
        const headerRight = d3.select("#header-right");

        headerLeft.text(`${collegeOneValue}`);
        headerRight.text(`${collegeTwoValue}`);

        // removes the previous bar charts
        FRAME1.selectAll(".bar").remove();
        FRAME2.selectAll(".bar").remove();

        // creates bar charts for the selected colleges
        bar_chart_1(collegeOneValue);
        bar_chart_2(collegeTwoValue);
    }

    // Frame
    const FRAME_HEIGHT = 600;
    const FRAME_WIDTH = 800;
    const MARGINS = { left: 90, right: 90, top: 80, bottom: 80 };

    // Height and widths for visualizations
    const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
    const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

    // creates frame for second vis
    const FRAME1 = d3.select("#vis2")
                        .append("svg")
                        .attr("height", FRAME_HEIGHT)
                        .attr("width", FRAME_WIDTH)
                        .attr("class", "frame");

    // creates bar chart in left column
    function bar_chart_1(collegeOneValue) {

        // load data from CSV file
        d3.csv("data/cutbardata.csv").then((data) => {

            // filters data including only selected college
            const collegeData = data.filter(d => d.college === collegeOneValue);

            const AMOUNT_MAX = d3.max(data, (d) => { return parseInt(d[collegeOneValue]); })

            // defines scale functions that map data values 
            // (domain) to pixel values (range)
            const X_SCALE = d3.scaleBand()
                                .domain(data.map((d) => { return d.category }))
                                .range([0, VIS_WIDTH])
                                .padding(0.25);
    
            const Y_SCALE = d3.scaleLinear()
                                .domain([0, 160000])
                                .range([VIS_HEIGHT + 1, 0]);

            // categories to apply different style schemes
            const z3 = d3.scaleOrdinal()
                            .domain(data.map(d => d.category))
                            .range(d3.schemeCategory10);

            // removes X and Y axes
            FRAME1.select(".y-axis").remove();
            FRAME1.select(".x-axis").remove();

            // removes X and Y labels
            FRAME1.select(".y-label").remove();
            FRAME1.select(".x-label").remove();

            // adds X and Y axes
            FRAME1.append("g")
                    .attr("class", "y-axis")
                    .attr("transform", "translate(" + MARGINS.left + "," + (MARGINS.top) + ")")
                    .call(d3.axisLeft(Y_SCALE).ticks(10))
                    .attr("font-size", "14px");

            FRAME1.append("g")
                    .attr("class", "x-axis")
                    .attr("transform", "translate(" + MARGINS.left + "," + (MARGINS.top + VIS_HEIGHT) + ")")
                    .call(d3.axisBottom(X_SCALE).ticks(10))
                    .attr("font-size", "16px");

            FRAME1.append("text")
                    .attr("class", "x-label")
                    .attr("text-anchor", "middle")
                    .attr("x", MARGINS.left + (VIS_WIDTH / 2))
                    .attr("y", MARGINS.top + VIS_HEIGHT + 60)
                    .text("Categories")
                    .attr("font-size", "18px");

            FRAME1.append("text")
                    .attr("class", "y-label")
                    .attr("text-anchor", "middle")
                    .attr("x", -MARGINS.top - (VIS_HEIGHT / 2))
                    .attr("y", MARGINS.left - 70)
                    .attr("transform", "rotate(-90)")
                    .text("Amount ($)")
                    .attr("font-size", "18px");

            // builds bar chart
            bar_data = FRAME1.selectAll("barchart")
                                .data(data)
                                .enter()
                                .append("rect")
                                .attr("class", "bar")
                                .attr("x", function (d) { return X_SCALE(d.category) + MARGINS.left })
                                .attr("y", function (d) { return Y_SCALE(d[collegeOneValue]) + MARGINS.top })
                                .attr("width", 90)
                                .attr("height", d => { return VIS_HEIGHT - Y_SCALE(d[collegeOneValue]) })
                                .attr("fill", d => { return z3(d.category) });

            // selects the vis2 element and adds a class tooltip
            const TOOLTIP = d3.select("#vis2")
                                .append("div")
                                .attr("class", "tooltip"); 

            // defines event handler function for a mouse hover and mouse leave
            function handleMouse(event, d) {
                if (event.type === "mouseover") {
                    d3.select(this)
                        .attr("stroke", "black")
                        .attr("stroke-width", "3px");
                } else if (event.type === "mouseout") {
                    d3.select(this)
                        .attr("stroke", "none");
                }
            }

            // attaches the event listeners to the bar class
            d3.selectAll(".bar")
                .on("mouseover", handleMouse)
                .on("mouseout", handleMouse);

            // defines event handler function for a mouse move
            function handleMousemove(event, d) {
                TOOLTIP.html("Category: " + d.category + "<br>" + 
                    "Amount: " + d3.format(",")(d[collegeOneValue]))
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px")
                .style("opacity", 1);
                }

            // defines event handler function for a mouse removal
            function handleMouseleave(event, d) {
                TOOLTIP.style("opacity", 0);
            } 

            // adds event listeners
            FRAME1.selectAll("rect")
                    .on("mouseover", handleMouse)
                    .on("mousemove", handleMousemove)
                    .on("mouseleave", handleMouseleave);
        });
    }

    // creates frame for third vis
    const FRAME2 = d3.select("#vis3")
                        .append("svg")
                        .attr("height", FRAME_HEIGHT)
                        .attr("width", FRAME_WIDTH)
                        .attr("class", "frame");

    // creates bar chart in right column
    function bar_chart_2(collegeTwoValue) {

        // loads data from CSV file
        d3.csv("data/cutbardata.csv").then((data) => {

            // filters data including only selected college
            const collegeData = data.filter(d => d.college === collegeTwoValue);

            const AMOUNT_MAX = d3.max(data, (d) => { return parseInt(d[collegeTwoValue]); })

            // defines scale functions that map data values 
            // (domain) to pixel values (range)
            const X_SCALE = d3.scaleBand()
                                .domain(data.map((d) => { return d.category }))
                                .range([0, VIS_WIDTH])
                                .padding(0.25);  

            const Y_SCALE = d3.scaleLinear()
                                .domain([0, 160000])
                                .range([VIS_HEIGHT + 1, 0]);

            // categories to apply different style schemes
            const z3 = d3.scaleOrdinal()
                            .domain(data.map(d => d.category))
                            .range(d3.schemeCategory10);

            // removes X and Y axis
            FRAME2.select(".y-axis").remove();
            FRAME2.select(".x-axis").remove();

            // removes X and Y labels
            FRAME2.select(".y-label").remove();
            FRAME2.select(".x-label").remove();

            // adds X and Y axis
            FRAME2.append("g")
                    .attr("class", "y-axis")
                    .attr("transform", "translate(" + MARGINS.left + "," + (MARGINS.top) + ")")
                    .call(d3.axisLeft(Y_SCALE).ticks(10))
                    .attr("font-size", "14px");

            FRAME2.append("g")
                    .attr("class", "x-axis")
                    .attr("transform", "translate(" + MARGINS.left + "," + (MARGINS.top + VIS_HEIGHT) + ")")
                    .call(d3.axisBottom(X_SCALE).ticks(10))
                    .attr("font-size", "16px");

            FRAME2.append("text")
                    .attr("class", "x-label")
                    .attr("text-anchor", "middle")
                    .attr("x", MARGINS.left + (VIS_WIDTH / 2))
                    .attr("y", MARGINS.top + VIS_HEIGHT + 60)
                    .text("Categories")
                    .attr("font-size", "18px");

            FRAME2.append("text")
                    .attr("class", "y-label")
                    .attr("text-anchor", "middle")
                    .attr("x", -MARGINS.top - (VIS_HEIGHT / 2))
                    .attr("y", MARGINS.left - 70)
                    .attr("transform", "rotate(-90)")
                    .text("Amount ($)")
                    .attr("font-size", "18px");

            // builds bar chart
            bar_data = FRAME2.selectAll("barchart")
                                .data(data)
                                .enter()
                                .append("rect")
                                .attr("class", "bar")
                                .attr("x", function (d) { return X_SCALE(d.category) + MARGINS.left })
                                .attr("y", function (d) { return Y_SCALE(d[collegeTwoValue]) + MARGINS.top })
                                .attr("width", 90)
                                .attr("height", d => { return (VIS_HEIGHT - Y_SCALE(d[collegeTwoValue])) })
                                .style("fill", function (d) { return z3(d.category)});

            // selects the vis3 element and adds a class tooltip
            const TOOLTIP = d3.select("#vis3")
                                .append("div")
                                .attr("class", "tooltip"); 

            // defines event handler function for a mouse hover and mouse leave
            function handleMouse(event, d) {
                if (event.type === "mouseover") {
                    d3.select(this)
                        .attr("stroke", "black")
                        .attr("stroke-width", "5px");
                } else if (event.type === "mouseout") {
                    d3.select(this)
                        .attr("stroke", "none");
                }
            }

            // attaches the event listeners to the bar class
            d3.selectAll(".bar")
                .on("mouseover", handleMouse)
                .on("mouseout", handleMouse);

            // defines event handler function for a mouse move
            function handleMousemove(event, d) {
                TOOLTIP.html("Category: " + d.category + "<br>" + 
                    "Amount: " + d3.format(",")(d[collegeTwoValue]))
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px")
                .style("opacity", 1);
            }

            // defines event handler function for a mouse removal
            function handleMouseleave(event, d) {
                TOOLTIP.style("opacity", 0);
            }    

            // adds event listeners
            FRAME2.selectAll("rect")
                    .on("mouseover", handleMouse)
                    .on("mousemove", handleMousemove)
                    .on("mouseleave", handleMouseleave); 
        });
    }
});

// builds the graphs
bar_chart_1(collegeOneValue);
bar_chart_2(collegeTwoValue);
