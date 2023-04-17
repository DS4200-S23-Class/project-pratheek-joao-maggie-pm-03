// creates an svg
const svg = d3.select("#vis1")
    .append("svg")
    .attr("width", 1100)
    .attr("height", 800);

// fills in squares in desired positions
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

    // prints data in console
    console.log(oosTuitionMap);

    // creates an array of unique college names
    const collegeNames = Array.from(new Set(collegeData.map(d => d.university_name)));

    // selects vis1 element and adds a class tooltip
    const TOOLTIP = d3.select("#vis1")
                        .append("div")
                        .attr("class", "tooltip"); 

    // defines event handler function for a mouse move
    function handleMousemove(event, d) {
  
        // gets average tuition and salary values for matching state code
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

    // appends data array to element g
    const squares = svg.selectAll("g")
                        .data(dataArray)
                        .enter()
                        .append("g");

    // creates grid
    squares.append("rect")
            .attr("class", d => d.fill ? "square lightblue" : "square")
            .attr("x", (d, i) => Math.floor(i / 8) * 100)
            .attr("y", (d, i) => (i % 8) * 100)
            .attr("width", 100)
            .attr("height", 100)
            .attr("fill", d => d.fill ? "lightblue" : "white")
            .attr("stroke", d => d.stroke ? "black" : "white")
            .attr("stroke-width", 2);

    // appends state codes to each square
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
    // selects vis1 element and stores it as a constant 
    const dropDown = d3.select("#vis1");

    // appends h5 element to vis1
    dropDown.append("h5")
                .text("College Comparer");

    // appends form element to vis1
    const form = dropDown.append("form")
                            .attr("id", "college-name");

    // appends label element to form element
    // adds text for context
    const collegeOne = form.append("label")
                            .attr("for", "first-college")
                            .text("Select the first college you wish to compare:");
    
    // appends select element to form element
    const selectOne = form.append("select")
                            .attr("id", "college-one-value");

    // adds college names as options of drop down
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

    // appends button element to drop down
    const button = dropDown.append("button")
                            .attr("id", "button")
                            .text("Compare !");

    // adds event listener for a click on button
    button.on("click", handleCompareColleges);

    // defines event handler for mouse click
    function handleCompareColleges() {
    
        // gets values of selected colleges
        const collegeOneValue = selectOne.property("value");
        const collegeTwoValue = selectTwo.property("value");

        console.log(collegeOneValue);
        console.log(collegeTwoValue);

        // updates header of bar-graph with college's name
        const headerLeft = d3.select("#header-left");
        const headerRight = d3.select("#header-right");

        headerLeft.text(`${collegeOneValue}`);
        headerRight.text(`${collegeTwoValue}`);

        // removes previous bar charts
        FRAME2.selectAll(".pie").remove();
        FRAME3.selectAll(".pie").remove();
        FRAME4.selectAll(".bar").remove();
        FRAME5.selectAll(".bar").remove();

        // creates bar charts for selected colleges
        pie_chart_1(collegeOneValue);
        pie_chart_2(collegeTwoValue);
        bar_chart_1(collegeOneValue, collegeTwoValue);
        bar_chart_2(collegeOneValue, collegeTwoValue)
    }

    // Frame & margins
    const FRAME_HEIGHT = 600;
    const FRAME_WIDTH = 800;
    const MARGINS = { left: 100, right: 100, top: 50, bottom: 75 };

    // Height and widths for visualizations
    const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
    const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

    // creates frame for vis2, vis3, vis4, & vis5
    const FRAME2 = d3.select("#vis2")
                        .append("svg")
                        .attr("height", FRAME_HEIGHT + 20)
                        .attr("width", FRAME_WIDTH)
                        .attr("class", "frame");

    const FRAME3 = d3.select("#vis3")
                        .append("svg")
                        .attr("height", FRAME_HEIGHT + 20)
                        .attr("width", FRAME_WIDTH)
                        .attr("class", "frame");

    const FRAME4 = d3.select("#vis4")
                        .append("svg")
                        .attr("height", FRAME_HEIGHT)
                        .attr("width", FRAME_WIDTH)
                        .attr("class", "frame");

    const FRAME5 = d3.select("#vis5")
                        .append("svg")
                        .attr("height", FRAME_HEIGHT)
                        .attr("width", FRAME_WIDTH)
                        .attr("class", "frame");

    // selects vis2 & vis3 elements and adds a class tooltip-2
    const TOOLTIP_PIE = d3.select("#vis2")
                            .append("div")
                            .attr("class", "tooltip"); 

    const TOOLTIP_PIE2 = d3.select("#vis3")
                            .append("div")
                            .attr("class", "tooltip"); 

    const TOOLTIP_LEFT = d3.select("#vis4")
                               .append("div")
                               .attr("class", "tooltip-2"); 

    const TOOLTIP_RIGHT = d3.select("#vis5")
                                .append("div")
                                .attr("class", "tooltip-2");

    //function to create the first pie chart
    function pie_chart_1(collegeOneValue) {
    
        d3.csv("data/cutpiedata.csv").then((data) => {
            const PIE_WIDTH = 650;
            const PIE_HEIGHT = 650;
            const PIE_MARGIN = 50;
            const PIE_RADIUS = Math.min(PIE_WIDTH, PIE_HEIGHT) / 2 - PIE_MARGIN;
        
            // remove the previous pie chart
            let pieChart = d3.select("#vis2");
            FRAME2.selectAll(".arc").remove();
            FRAME2.selectAll(".slices").remove();
            FRAME2.selectAll(".pie-text").remove();

            // append a new pie chart
            pieChart = FRAME2
                .append("g")
                .attr("transform", `translate(${PIE_WIDTH / 2}, ${PIE_HEIGHT / 2})`);

            console.log(pieChart);

            let pieData = {};

            const collegeData = data.find((d) => d['university name'] === collegeOneValue);

            if (collegeData) {
                pieData = {
                    "American Indian": +collegeData["American Indian"],
                    "Black": +collegeData["Black"],
                    "Hispanic": +collegeData["Hispanic"],
                    "Pacific Islander": +collegeData["Pacific Islander"],
                    "Asian": +collegeData["Asian"],
                    "2+ races": +collegeData["2+ races"],
                    "Other": +collegeData["Other"]
                };
            }

            // Get unique races
            const raceNames = Object.keys(pieData);

            //coloring the slices
            const COLOR = d3.scaleOrdinal()
                .domain(raceNames)
                .range(["yellow", "orange", "brown", "red", "purple", "darkgreen", "dodgerblue"]);


            // call the d3 pie API to get the sizing  data
            const PIE = d3.pie().value(function (d) {
                return d[1];
            })
            .sort(null);

            //pull the necessary data into a pie element
            const dataReady = PIE(Object.entries(pieData).map(d => [d[0], (d[1]/d3.sum(Object.values(pieData)))*100]));

            //generate the arc and radius of the circles
            const arcGenerator = d3.arc().innerRadius(50).outerRadius(PIE_RADIUS);

            //build the arc, apply it to a g element
            const ARC = pieChart.selectAll(".arc")
                .data(dataReady)
                .enter().append("g")
                .attr("class", "arc");
 
            ARC.append("path")
                    .attr("d", arcGenerator)
                    .attr("fill", function (d) {
                        return COLOR(d.data[0]);
                    })
                    .attr("stroke", "black")
                    .style("stroke-width", "1px")
                    .style("opacity", 1.0)
                    .on("mouseover", function (event, d) {
                        d3.select(this)
                            .attr("fill", d3.color(COLOR(d.data[0])).copy({opacity: 0.5}))
                            .style("stroke-width", "3px");
                    })
                    .on("mouseout", function (event, d) {
                        d3.select(this)
                            .attr("fill", COLOR(d.data[0]))
                            .style("stroke-width", "1px");;
                    });
            ARC.selectAll("path")
                    .on("mouseover", function(event, d) {
                        const value = d.data[1].toFixed(2);
                        TOOLTIP_PIE
                            .style("opacity", 1.0)
                            .html(d.data[0] + ": " + value + "%")
                            .style("left", event.pageX + 10 + "px")
                            .style("top", event.pageY + 10 + "px");                          
                        d3.select(this)
                            .attr("fill", d3.color(COLOR(d.data[0])).copy({opacity: 0.5}))
                            .style("stroke-width", "3px");;
                    })
                    .on("mousemove", function(event, d) {
                        TOOLTIP_PIE
                            .style("left", event.pageX + 10 + "px")
                            .style("top", event.pageY + 10 + "px");
                    })
                    .on("mouseout", function(event, d) {
                        TOOLTIP_PIE.style("opacity", 0);
                        d3.select(this)
                            .attr("fill", COLOR(d.data[0]))
                            .style("stroke-width", "1px");;
                    });

            // Create a legend
            const LEGEND = pieChart.selectAll(".legend")
                .data(raceNames)
                .enter()
                .append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(-250," + (i * 20 - 110) + ")"; });

            LEGEND.append("rect")
                .attr("x", PIE_WIDTH)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", function(d) { return COLOR(d); })
                .style("stroke", "black")
                .style("stroke-width", "1px");

            LEGEND.append("text")
                .attr("x", PIE_WIDTH - 5)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function(d) { return d; });
        });
    }

    //function to create the second pie chart
    function pie_chart_2(collegeTwoValue) {

        d3.csv("data/cutpiedata.csv").then((data) => {
            const PIE_WIDTH2 = 650;
            const PIE_HEIGHT2 = 650;
            const PIE_MARGIN2 = 50;
            const PIE_RADIUS2 = Math.min(PIE_WIDTH2, PIE_HEIGHT2) / 2 - PIE_MARGIN2;

            // remove the previous pie chart
            let pieChart = d3.select("#vis3");
            FRAME3.selectAll(".arc").remove();
            FRAME3.selectAll(".slices").remove();
            FRAME3.selectAll(".pie-text").remove();

            // append a new pie chart
            pieChart2 = FRAME3
                .append("g")
                .attr("transform", `translate(${PIE_WIDTH2 / 2}, ${PIE_HEIGHT2 / 2})`);

            let pieData2 = {};

            const collegeData = data.find((d) => d['university name'] === collegeTwoValue);

            if (collegeData) {
                pieData2 = {
                    "American Indian": +collegeData["American Indian"],
                    "Black": +collegeData["Black"],
                    "Hispanic": +collegeData["Hispanic"],
                    "Pacific Islander": +collegeData["Pacific Islander"],
                    "Asian": +collegeData["Asian"],
                    "2+ races": +collegeData["2+ races"],
                    "Other": +collegeData["Other"]
                };
            }

            // Get unique races
            const raceNames = Object.keys(pieData2);

            //coloring the slices
            const COLOR2 = d3.scaleOrdinal()
                .domain(raceNames)
                .range(["yellow", "orange", "brown", "red", "purple", "darkgreen", "dodgerblue"]);


            // call the d3 pie API to get the sizing  data
            const PIE2 = d3.pie().value(function (d) {
                return d[1];
            })
            .sort(null);

            //pull the necessary data into a pie element
            const dataReady2 = PIE2(Object.entries(pieData2).map(d => [d[0], (d[1]/d3.sum(Object.values(pieData2)))*100]));

            //generate the arc and radius of the circles
            const arcGenerator2 = d3.arc().innerRadius(50).outerRadius(PIE_RADIUS2);

            //build the arc, apply it to a g element
            const ARC_TWO = pieChart2.selectAll(".arc")
                .data(dataReady2)
                .enter().append("g")
                .attr("class", "arc");

            //build the paths from the center
            //draw the paths from the center 
            ARC_TWO.append("path")
                    .attr("d", arcGenerator2)
                    .attr("fill", function (d) {
                        return COLOR2(d.data[0]);
                    })
                    .attr("stroke", "black")
                    .style("stroke-width", "1px")
                    .style("opacity", 1.0)
                    .on("mouseover", function (event, d) {
                        d3.select(this)
                            .attr("fill", d3.color(COLOR2(d.data[0])).copy({opacity: 0.5}))
                            .style("stroke-width", "3px");;
                    })
                    .on("mouseout", function (event, d) {
                        d3.select(this)
                            .attr("fill", COLOR2(d.data[0]))
                            .style("stroke-width", "1px");;
                    });
            ARC_TWO.selectAll("path")
                    .on("mouseover", function(event, d) {
                        const value = d.data[1].toFixed(2);
                        TOOLTIP_PIE2
                            .style("opacity", 1.0)
                            .html(d.data[0] + ": " + value + "%")
                            .style("left", event.pageX + 10 + "px")
                            .style("top", event.pageY + 10 + "px");                          
                        d3.select(this)
                            .attr("fill", d3.color(COLOR2(d.data[0])).copy({opacity: 0.5}))
                            .style("stroke-width", "3px");;
                    })
                    .on("mousemove", function(event, d) {    
                        TOOLTIP_PIE2
                            .style("left", event.pageX + 10 + "px")
                            .style("top", event.pageY + 10 + "px");
                    })
                    .on("mouseout", function(event, d) {
                        TOOLTIP_PIE2.style("opacity", 0);
                        d3.select(this)
                            .attr("fill", COLOR2(d.data[0]))
                            .style("stroke-width", "1px");;
                    });

            // Create a legend
            const LEGEND = pieChart2.selectAll(".legend")
                .data(raceNames)
                .enter()
                .append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(-250," + (i * 20 - 110) + ")"; });

            LEGEND.append("rect")
                .attr("x", PIE_WIDTH2)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", function(d) { return COLOR2(d); })
                .style("stroke", "black")
                .style("stroke-width", "1px");

            LEGEND.append("text")
                .attr("x", PIE_WIDTH2 - 5)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function(d) { return d; });
        });
    }

    // creates bar chart in left column
    function bar_chart_1(collegeOneValue, collegeTwoValue) {

        // load data from CSV file
        d3.csv("data/cutbardata.csv").then((data) => {

            // defines scale functions that map data values 
            // (domain) to pixel values (range)
            const X_SCALE = d3.scaleBand()
                                .domain(data.map((d) => { return d.category }))
                                .range([0, VIS_WIDTH])
                                .padding(0.35);
    
            const Y_SCALE = d3.scaleLinear()
                                .domain([0, 160000])
                                .range([VIS_HEIGHT + 1, 0]);

            // categories to apply different style schemes
            const z3 = d3.scaleOrdinal()
                            .domain(data.map(d => d.category))
                            .range(d3.schemeCategory10);

            // removes X and Y axes
            FRAME4.select(".y-axis").remove();
            FRAME4.select(".x-axis").remove();

            // removes X and Y labels
            FRAME4.select(".y-label").remove();
            FRAME4.select(".x-label").remove();

            // adds X and Y axes
            FRAME4.append("g")
                    .attr("class", "y-axis")
                    .attr("transform", "translate(" + MARGINS.left + "," + (MARGINS.top) + ")")
                    .call(d3.axisLeft(Y_SCALE).ticks(10))
                    .attr("font-size", "14px");

            FRAME4.append("g")
                    .attr("class", "x-axis")
                    .attr("transform", "translate(" + MARGINS.left + "," + (MARGINS.top + VIS_HEIGHT) + ")")
                    .call(d3.axisBottom(X_SCALE).ticks(10))
                    .attr("font-size", "16px");

            // adds X and Y axis labels
            FRAME4.append("text")
                    .attr("class", "x-label")
                    .attr("text-anchor", "middle")
                    .attr("x", MARGINS.left + (VIS_WIDTH / 2))
                    .attr("y", MARGINS.top + VIS_HEIGHT + 60)
                    .text("Categories")
                    .attr("font-size", "18px");

            FRAME4.append("text")
                    .attr("class", "y-label")
                    .attr("text-anchor", "middle")
                    .attr("x", -MARGINS.top - (VIS_HEIGHT / 2))
                    .attr("y", MARGINS.left - 70)
                    .attr("transform", "rotate(-90)")
                    .text("Amount ($)")
                    .attr("font-size", "18px");

            // builds bar chart
            bar_data = FRAME4.selectAll(".bar")
                                .data(data)
                                .enter()
                                .append("rect")
                                .attr("class", "bar")
                                .attr("x", function (d) { return X_SCALE(d.category) + MARGINS.left })
                                .attr("y", function (d) { return Y_SCALE(d[collegeOneValue]) + MARGINS.top })
                                .attr("width", 90)
                                .attr("height", d => { return VIS_HEIGHT - Y_SCALE(d[collegeOneValue]) })
                                .attr("fill", d => { return z3(d.category) })
                                .on("mousemove", function(event, d) {
                                    handleMousemove(event, d, collegeOneValue, collegeTwoValue);
                                })
                                .on("mouseleave", handleMouseleave);

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

            // defines event handler function for a mouse move
            function handleMousemove(event, d, collegeOneValue, collegeTwoValue) {

                // passes data to vis2 tooltip
                TOOLTIP_LEFT.html("Category: " + d.category + "<br>" +
                                    "Amount ($): " + d3.format(",")(d[collegeOneValue]))
                                                    .style("opacity", 1);
                
                // selects right bar chart and adds border to matching left bar 
                d3.select("#vis5")
                    .selectAll(".bar")
                        .filter(function(e) {
                            return e.category === d.category && e[collegeTwoValue] === d[collegeTwoValue]; })
                        .attr("stroke", "black")
                        .attr("stroke-width", "5px");

                // passes data to vis3 tooltip
                const rightData = data.find(e => e.category === d.category);
                TOOLTIP_RIGHT.html("Category: " + rightData.category + "<br>" + 
                                    "Amount ($): " + d3.format(",")(rightData[collegeTwoValue]))
                                .style("opacity", 1);              
            }

            // defines event handler function for a mouse removal
            function handleMouseleave(event, d) {

                // removes border from right bar
                FRAME5.selectAll(".bar")
                        .attr("stroke", "none");

                // hides tooltips
                TOOLTIP_LEFT.style("opacity", 0);
                TOOLTIP_RIGHT.style("opacity", 0);  
            }  

            // adds event listeners to bar class
            FRAME4.selectAll(".bar")
                    .on("mousemove", function(event, d) {
                        handleMousemove(event, d, collegeOneValue, collegeTwoValue); })
                    .on("mouseleave", handleMouseleave); 
        });
    }

    // creates bar chart in right column
    function bar_chart_2(collegeOneValue, collegeTwoValue) {

        // loads data from CSV file
        d3.csv("data/cutbardata.csv").then((data) => {

            // defines scale functions that map data values 
            // (domain) to pixel values (range)
            const X_SCALE_2 = d3.scaleBand()
                                .domain(data.map((d) => { return d.category }))
                                .range([0, VIS_WIDTH])
                                .padding(0.35);  

            const Y_SCALE_2 = d3.scaleLinear()
                                .domain([0, 160000])
                                .range([VIS_HEIGHT + 1, 0]);

            // categories to apply different style schemes
            const z3 = d3.scaleOrdinal()
                            .domain(data.map(d => d.category))
                            .range(d3.schemeCategory10);

            // removes X and Y axis
            FRAME5.select(".y-axis").remove();
            FRAME5.select(".x-axis").remove();

            // removes X and Y labels
            FRAME5.select(".y-label").remove();
            FRAME5.select(".x-label").remove();

            // adds X and Y axes
            FRAME5.append("g")
                    .attr("class", "y-axis")
                    .attr("transform", "translate(" + MARGINS.left + "," + (MARGINS.top) + ")")
                    .call(d3.axisLeft(Y_SCALE_2).ticks(10))
                    .attr("font-size", "14px");

            FRAME5.append("g")
                    .attr("class", "x-axis")
                    .attr("transform", "translate(" + MARGINS.left + "," + (MARGINS.top + VIS_HEIGHT) + ")")
                    .call(d3.axisBottom(X_SCALE_2).ticks(10))
                    .attr("font-size", "16px");

            // adds X and Y axis labels
            FRAME5.append("text")
                    .attr("class", "x-label")
                    .attr("text-anchor", "middle")
                    .attr("x", MARGINS.left + (VIS_WIDTH / 2))
                    .attr("y", MARGINS.top + VIS_HEIGHT + 60)
                    .text("Categories")
                    .attr("font-size", "18px");

            FRAME5.append("text")
                    .attr("class", "y-label")
                    .attr("text-anchor", "middle")
                    .attr("x", -MARGINS.top - (VIS_HEIGHT / 2))
                    .attr("y", MARGINS.left - 70)
                    .attr("transform", "rotate(-90)")
                    .text("Amount ($)")
                    .attr("font-size", "18px");

            // builds bar chart
            bar_data = FRAME5.selectAll(".bar")
                                .data(data)
                                .enter()
                                .append("rect")
                                .attr("class", "bar")
                                .attr("x", function (d) { return X_SCALE_2(d.category) + MARGINS.left })
                                .attr("y", function (d) { return Y_SCALE_2(d[collegeTwoValue]) + MARGINS.top })
                                .attr("width", 90)
                                .attr("height", d => { return (VIS_HEIGHT - Y_SCALE_2(d[collegeTwoValue])) })
                                .attr("fill", d => { return z3(d.category) })
                                .on("mousemove", function(event, d) {
                                    handleMousemove(event, d, collegeOneValue, collegeTwoValue); })
                                .on("mouseleave", handleMouseleave);

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

            // attaches event listeners to bar class
            d3.selectAll(".bar")
                .on("mouseover", handleMouse)
                .on("mouseout", handleMouse);

            // defines event handler function for a mouse move
            function handleMousemove(event, d, collegeOneValue, collegeTwoValue) {

                // passes data to vis3 tooltip
                TOOLTIP_RIGHT.html("Category: " + d.category + "<br>" +
                                    "Amount ($): " + d3.format(",")(d[collegeTwoValue]))
                                .style("opacity", 1);

                // selects left bar chart and adds border to matching right bar 
                d3.select("#vis4")
                    .selectAll(".bar")
                        .filter(function(e) {
                            return e.category === d.category && e[collegeOneValue] === d[collegeOneValue]; })
                        .attr("stroke", "black")
                        .attr("stroke-width", "5px");

                // passes data to vis2 tooltip
                const leftData = data.find(e => e.category === d.category);
                TOOLTIP_LEFT.html("Category: " + leftData.category + "<br>" + 
                                    "Amount ($): " + d3.format(",")(leftData[collegeOneValue]))
                                                    .style("opacity", 1);                            
            }

            // defines event handler function for a mouse removal
            function handleMouseleave(event, d) {

            // removes border from left bar
            FRAME4.selectAll(".bar")
                .attr("stroke", "none");

            // hides tooltips
            TOOLTIP_LEFT.style("opacity", 0);
            TOOLTIP_RIGHT.style("opacity", 0);
            
            }  

            // adds event listeners to bar class
            FRAME5.selectAll(".bar")
                    .on("mousemove", function(event, d) {
                        handleMousemove(event, d, collegeOneValue, collegeTwoValue); })
                    .on("mouseleave", handleMouseleave); 
        });
    }
});
