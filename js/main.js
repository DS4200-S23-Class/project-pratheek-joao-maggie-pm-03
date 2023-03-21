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











// const labels = [
//     "AK", "", "WA", "OR", "CA", "", "", "HI",
//     "", "", "ID", "NV", "UT", "AZ", "", "",
//     "", "", "MT", "WY", "CO", "NM", "", "",
//     "", "", "ND", "SD", "NE", "KS", "OK", "TX",
//     "", "", "MN", "IA", "MO", "AR", "LA", "",
//     "", "WI", "IL", "IN", "KY", "TN", "MS", "",
//     "", "", "MI", "OH", "WV", "NC", "AL", "",
//     "", "", "", "PA", "VA", "SC", "GA", "",
//     "", "", "NY", "NJ", "MD", "DC", "", "FL",
//     "", "VT", "MA", "CT", "DE", "", "", "",
//     "ME", "NH", "", "RI", "", "", "", ""];

// d3.csv("data/DS4200 PM-02 Dataset Final.csv", function(error, csvData) {
//   if (error) throw error;

//   // Map state codes to data
//   const dataMap = {};
//   csvData.forEach(function(d) {
//     dataMap[d.state_code] = d.average_tuition_oos;
//   });

//   // Update data array with state codes and fill colors
//   const dataArray = [];
//   for (let i = 0; i < 88; i++) {
//     const stateCode = labels[i];
//     if (stateCode) {
//       const tuition = dataMap[stateCode] || 0;
//       dataArray.push({ id: i, fill: true, stateCode: stateCode, tuition: tuition });
//     } else {
//       dataArray.push({ id: i, fill: false });
//     }
//   }

//   // Draw squares and labels
//   const squares = svg.selectAll("g")
//     .data(dataArray)
//     .enter()
//     .append("g");

//   squares.append("rect")
//     .attr("class", d => d.fill ? "square lightblue" : "square")
//     .attr("x", (d, i) => Math.floor(i / 8) * 100)
//     .attr("y", (d, i) => (i % 8) * 100)
//     .attr("width", 100)
//     .attr("height", 100)
//     .attr("fill", d => d.fill ? "lightblue" : "white")
//     .attr("stroke", d => d.stroke ? "black" : "white")
//     .attr("stroke-width", 2);

//   squares.selectAll(".lightblue")
//     .on("mouseover", function(d) {
//       const tuition = d.tuition ? `$${d.tuition}` : "N/A";
//       d3.select(this).attr("fill", "orange");
//       svg.append("text")
//         .attr("id", "tooltip")
//         .attr("x", (d3.event.pageX + 10) + "px")
//         .attr("y", (d3.event.pageY - 10) + "px")
//         .attr("text-anchor", "start")
//         .attr("dominant-baseline", "central")
//         .text(`${d.stateCode}: ${tuition}`);
//     })
//     .on("mouseout", function(d) {
//       d3.select(this).attr("fill", "lightblue");
//       svg.select("#tooltip").remove();
//     });

//   squares.filter(d => d.fill)
//     .append("text")
//     .attr("x", (d, i) => Math.floor(i / 8) * 100 + 50)
//     .attr("y", (d, i) => (i % 8) * 100 + 50)
//     .attr("text-anchor", "middle")
//     .attr("dominant-baseline", "central")
//     .text((d, i) => labels[i]);
// });









// const svg = d3.select("#vis1")
//   .append("svg")
//   .attr("width", 1100)
//   .attr("height", 800)


// const data = []
// for (let i = 0; i < 88; i++) {
//     if (i == 0
//         || (i == 7)
//         || (i >= 2 && i <= 4)
//         || (i >= 10 && i <= 13)
//         || (i >= 18 && i <= 21)
//         || (i >= 26 && i <= 31)
//         || (i >= 34 && i <= 38)
//         || (i >= 41 && i <= 46)
//         || (i >= 59 && i <= 62)
//         || (i >= 50 && i <= 54)
//         || (i >= 66 && i <= 69)
//         || (i == 71)
//         || (i >= 73 && i <= 76)
//         || (i >= 80 && i <= 81)
//         || (i == 83)) {
//         data.push({ id: i, fill: true });
//     } else {
//         data.push({ id: i, fill: false });
//     }
// }

// const data_text = []
// for (let i = 0; i < 88; i++) {
//     if (i == 0
//         || (i == 7)
//         || (i >= 2 && i <= 4)
//         || (i >= 10 && i <= 13)
//         || (i >= 18 && i <= 21)
//         || (i >= 26 && i <= 31)
//         || (i >= 34 && i <= 38)
//         || (i >= 41 && i <= 46)
//         || (i >= 50 && i <= 54)
//         || (i >= 59 && i <= 62)
//         || (i >= 66 && i <= 69)
//         || (i == 71)
//         || (i >= 73 && i <= 76)
//         || (i >= 80 && i <= 81)
//         || (i == 83)) {
//         data.push({ id: i, fill: true });
//     } else {
//         data.push({ id: i, fill: true });
//     }
// }

// const labels = [
//     "AK", "", "WA", "OR", "CA", "", "", "HI",
//     "", "", "ID", "NV", "UT", "AZ", "", "",
//     "", "", "MT", "WY", "CO", "NM", "", "",
//     "", "", "ND", "SD", "NE", "KS", "OK", "TX",
//     "", "", "MN", "IA", "MO", "AR", "LA", "",
//     "", "WI", "IL", "IN", "KY", "TN", "MS", "",
//     "", "", "MI", "OH", "WV", "NC", "AL", "",
//     "", "", "", "PA", "VA", "SC", "GA", "",
//     "", "", "NY", "NJ", "MD", "DC", "", "FL",
//     "", "VT", "MA", "CT", "DE", "", "", "",
//     "ME", "NH", "", "RI", "", "", "", ""];

// const squares = svg.selectAll("g")
//   .data(data)
//   .enter()
//   .append("g");

// squares.append("rect")
//         .attr("class", d => d.fill ? "square lightblue" : "square")
//         .attr("x", (d, i) => Math.floor(i / 8) * 100)
//         .attr("y", (d, i) => (i % 8) * 100)
//         .attr("width", 100)
//         .attr("height", 100)
//         .attr("fill", d => d.fill ? "lightblue" : "white")
//         .attr("stroke", d => d.stroke ? "black" : "white")
//         .attr("stroke-width", 2);

// squares.selectAll(".lightblue")
//         .on("mouseover", function(d) {
//           d3.select(this).attr("fill", "orange");
//         })
//         .on("mouseout", function(d) {
//           d3.select(this).attr("fill", "lightblue");
//         });

// squares.filter(d => d.fill)
//         .append("text")
//         .attr("x", (d, i) => Math.floor(i / 8) * 100 + 50)
//         .attr("y", (d, i) => (i % 8) * 100 + 50)
//         .attr("text-anchor", "middle")
//         .attr("dominant-baseline", "central")
//         .text((d, i) => labels[i]);