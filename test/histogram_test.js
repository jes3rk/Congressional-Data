var cleanData = [];
var rejectData = [];
var testID = "R000570";
var missMinMax = [];
var partyMinMax = [];
var statsParty = {};


function hist() {
// clean the data

  // ... for the house
  for (var i = 0; i < houseData.length; i++) {
    var obj = {
      id: houseData[i].id,
      name: "Rep. " + houseData[i].first_name + " " + houseData[i].last_name,
      state: houseData[i].state,
      chamber: "house",
      party: houseData[i].party,
      partyVote: parseFloat(houseData[i].votes_with_party_pct),
      missVote: parseFloat(houseData[i].missed_votes_pct)
    };
    if (houseData[i].votes_with_party_pct !== undefined || houseData[i].missed_votes_pct === undefined) {
      cleanData.push(obj);
    } else {
      rejectData.push(obj);
    };
  };
  // ... for the senate
  for (var i = 0; i < senateData.length; i++) {
    var obj = {
      id: senateData[i].id,
      name: "Sen. " + senateData[i].first_name + " " + senateData[i].last_name,
      state: senateData[i].state,
      chamber: "senate",
      party: senateData[i].party,
      partyVote: parseFloat(senateData[i].votes_with_party_pct),
      missVote: parseFloat(senateData[i].missed_votes_pct)
    };
    if (senateData[i].votes_with_party_pct !== undefined || senateData[i].missed_votes_pct === undefined) {
      cleanData.push(obj);
    } else {
      rejectData.push(obj);
    };
  };

  function minMax() {
    var missArr = [];
    var voteArr = [];
    for (var i = 0; i < cleanData.length; i++) {
      if (cleanData[i].partyVote >= 60) {
        voteArr.push(cleanData[i].partyVote);
      };
      if (cleanData[i].missVote <= 45) {
        missArr.push(cleanData[i].missVote);
      };
    };
    var missMin = d3.min(missArr);
    var missMax = d3.max(missArr);
    var partyMin = d3.min(voteArr);
    var partyMax = d3.max(voteArr);
    missMinMax.push(missMin, missMax);
    partyMinMax.push(partyMin, partyMax);
    console.log(missMinMax, partyMinMax);
    // meanPartyVote = d3.mean(voteArr);

    //stats
    statsParty.mean = d3.mean(voteArr);
    statsParty.sd = d3.deviation(voteArr);
    statsParty.firstSD = [statsParty.mean - statsParty.sd, statsParty.mean + statsParty.sd]
    console.log(statsParty);
  };


  minMax();

  // set the dimensions and margins of the graph
  var margin = {top: 10, right: 30, bottom: 30, left: 40},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  // set the ranges
  var x = d3.scaleLinear()
            // .domain([missMinMax[0], 45])
            .domain([60, partyMinMax[1]])
            .rangeRound([0, width]);

  var y = d3.scaleLinear()
            .range([height, 0]);

  // set the parameters for the histogram
  var histogram = d3.histogram()
            .value(function(d) { return d.partyVote; })
            .domain(x.domain())
            .thresholds(200);

  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3.select("div.chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // have it fade into existence
  d3.select("div.chart")
      .style("opacity", 0)
      .transition()
          .duration(1000)
          .style("opacity", 1)

  // Define the div for the tooltip
  var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  // group the data for the bars
  var bins = histogram(cleanData);

  // Scale the range of the data in the y domain
  y.domain([0, d3.max(bins, function(d) { return d.length; })]);

  // append the bar rectangles to the svg element
  svg.selectAll("rect")
      .data(bins)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", 1)
      .attr("transform", function(d) {
      return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
      .attr("width", function(d) { return x(d.x1) - x(d.x0) - 0.5 ; })
      .attr("height", function(d) { return height - y(d.length); })
      // conditional formatting for a specific individual
      .style("fill", function(d) {
        for (var i = 0; i < d.length; i++) {
          if (d[i].id === testID) {
            return "red";
          };
        };
      })
      .on("mouseover", function(d) {
        div.transition()
          .duration(200)
          .style("opacity", .9);
          div.html(function() {
            var nameArr = [];
            for (var i = 0; i < d.length; i++) {
              nameArr.push(d[i].name + "(" + d[i].party + "-" + d[i].state + ")");
            };
            return nameArr;
          })
          // .style("right", (d3.event.pageX) + "px")
          // .style("top", (d3.event.pageY - height) + "px");
         })
      .on("mouseout", function(d) {
        div.transition()
          .duration(500)
          .style("opacity", 0);
  });

  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y));


}; // End of function
