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
    .attr("x", (d, i) => Math.floor(i / 8) * 100)
    .attr("y", (d, i) => (i % 8) * 100)
    .attr("width", 100)
    .attr("height", 100)
    .attr("fill", d => d.fill ? "lightblue" : "white")
    .attr("stroke", d => d.stroke ? "black" : "white")
    .attr("stroke-width", 2);

squares.filter(d => d.fill)
    .append("text")
    .attr("x", (d, i) => Math.floor(i / 8) * 100 + 50)
    .attr("y", (d, i) => (i % 8) * 100 + 50)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .text((d, i) => labels[i]);