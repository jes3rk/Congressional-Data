var cleanData = [];
var rejectData = [];
var testID = "K000384";
var missMinMax = [];
var partyMinMax = [];
var statsParty = {};
var statsMiss = {};
var statsR = {
  house: {
    missed: {},
    party: {}
  },
  senate: {
    missed: {},
    party: {}
  }
};
var statsD = {
  house: {
    missed: {},
    party: {}
  },
  senate: {
    missed: {},
    party: {}
  }
};


function dataCleaner() {
  // ... for the house
  for (var i = 0; i < houseData.length; i++) {
    var obj = {
      id: houseData[i].id,
      name: "Rep. " + houseData[i].first_name + " " + houseData[i].last_name,
      state: houseData[i].state,
      chamber: "house",
      party: houseData[i].party,
      partyVote: houseData[i].votes_with_party_pct,
      missVote: houseData[i].missed_votes_pct
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
      partyVote: senateData[i].votes_with_party_pct,
      missVote: senateData[i].missed_votes_pct
    };
    if (senateData[i].votes_with_party_pct !== undefined || senateData[i].missed_votes_pct === undefined) {
      cleanData.push(obj);
    } else {
      rejectData.push(obj);
    };
  };
}

function stats() {
  var missArr = [];
  var voteArr = [];
  var houseMissR =[];
  var houseMissD = [];
  var senateMissR = [];
  var senateMissD =[];
  var houseVoteR = [];
  var houseVoteD = [];
  var senateVoteR = [];
  var senateVoteD = [];


  for (var i = 0; i < cleanData.length; i++) {
    // vote
    if (cleanData[i].partyVote >= 60) {
      voteArr.push(cleanData[i].partyVote);
      switch (cleanData[i].chamber) {

        case "senate":
          switch (cleanData[i].party) {
            case "R":
              senateVoteR.push(cleanData[i].partyVote);
            break;

            case "D":
              senateVoteD.push(cleanData[i].partyVote);
            break;
          };
        break;

        case "house":
          switch (cleanData[i].party) {

            case "R":
              houseVoteR.push(cleanData[i].partyVote);
            break;

            case "D":
              houseVoteD.push(cleanData[i].partyVote);
            break;
          };
        break;
      };
    };

    if (cleanData[i].missVote <= 45) {
      // missed votes
      missArr.push(cleanData[i].missVote);
      switch (cleanData[i].chamber) {
        case "senate":
          switch (cleanData[i].party) {
            case "R":
              senateMissR.push(cleanData[i].missVote);
            break;

            case "D":
              senateMissD.push(cleanData[i].missVote);
            break;

            default:
          }
        break;

        case "house":
          switch (cleanData[i].party) {
            case "R":
              houseMissR.push(cleanData[i].missVote);
            break;

            case "D":
              houseMissD.push(cleanData[i].missVote);
            break;

            default:
          }
        break;
        default:

      }
    };
  };
  var missMin = d3.min(missArr);
  var missMax = d3.max(missArr);
  var partyMin = d3.min(voteArr);
  var partyMax = d3.max(voteArr);
  missMinMax.push(missMin, missMax);
  partyMinMax.push(partyMin, partyMax);

  //stats
    // total stats across both chambers and parties
      // for pct vote with party
  statsParty.mean = d3.mean(voteArr);
  statsParty.sd = d3.deviation(voteArr);
  statsParty.firstSD = [statsParty.mean - statsParty.sd, statsParty.mean + statsParty.sd];
  statsParty.median = d3.median(voteArr);
  statsParty.quartiles = [d3.min(voteArr), d3.quantile(voteArr.sort(), 0.25), d3.quantile(voteArr.sort(), 0.5), d3.quantile(voteArr.sort(), 0.75), d3.max(voteArr)];

      // for pct missed votes
  statsMiss.mean = d3.mean(missArr);
  statsMiss.sd = d3.deviation(missArr);
  statsMiss.firstSD = [statsMiss.mean - statsMiss.sd, statsMiss.mean + statsMiss.sd];
  statsMiss.median = d3.median(missArr);
  statsMiss.quartiles = [d3.min(missArr), d3.quantile(missArr.sort(), 0.25), d3.quantile(missArr.sort(), 0.5), d3.quantile(missArr.sort(), 0.75), d3.max(missArr)];

  var statsList = [statsD.house.missed, statsD.house.party, statsD.senate.missed, statsD.senate.party, statsR.house.missed, statsR.house.party, statsR.senate.missed, statsR.senate.party];

  var arrList = [houseMissD, houseVoteD, senateMissD, senateVoteD, houseMissR, houseVoteR, senateMissR, senateVoteR];

  for (var i = 0; i < statsList.length; i++) {
    statsList[i].mean = d3.mean(arrList[i]);
    statsList[i].sd = d3.deviation(arrList[i]);
    statsList[i].firstSD = [statsList[i].mean - statsList[i].sd, statsList[i].mean + statsList[i].sd];
    statsList[i].median = d3.median(arrList[i]);
    statsList[i].quartiles = [d3.min(arrList[i]), d3.quantile(arrList[i].sort(), 0.25), d3.quantile(arrList[i].sort(), 0.5), d3.quantile(arrList[i].sort(), 0.75), d3.max(arrList[i])];
  };
  console.log(statsD);
  console.log(statsR);
};

function hist() {

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
            .thresholds(100);

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


function donut(id, target) {
// id is the id of the congressperson you want to find
// target can be two things...
  // ... party means voting with their party
  // ... miss means missed votes vs attended votes

  // find data from id
  var member = {};
  for (var i = 0; i < cleanData.length; i++) {
    if (cleanData[i].id === id) {
      member = cleanData[i];
    };
  };
  // console.log(member);

  var dataSet = {};

  switch (target) {
    case "party":
      var dataSet = [
        {
          label: member.name + " voted with their party",
          count: member.partyVote
        },
        {
          label: member.name + " voted against their party",
          count: 100-member.partyVote
        }
      ];
    break;

    case "miss":
      var dataSet = [
        {
          label: member.name + " missed a vote",
          count: member.missVote
        },
        {
          label: member.name + " voted",
          count: 100-member.missVote
        }
      ];
    break;

    default:
      console.log(error);

  };

  var width = 360;
  var height = 360;
  var radius = Math.min(width, height) / 2;
  var donutWidth = 75;

  switch (member.party) { // Changes color based on party affiliation
    case "R":
      var color = d3.scaleOrdinal()
          .domain([0, 1])
          .range(['red', 'blue']);
      break;

    case "D":
      var color = d3.scaleOrdinal()
          .domain([0, 1])
          .range(['blue', 'red']);
      break;

    default:
      var color = d3.scaleOrdinal()
          .domain([0, 1])
          .range(['green', 'yellow']);
  };

  var svg = d3.select('.chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
        .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

  var arc = d3.arc()
      .innerRadius(radius - donutWidth)
      .outerRadius(radius);

  var pie = d3.pie()
      .value(function(d) { return d.count; })
      .sort(null);

  var path = svg.selectAll('path')
      .data(pie(dataSet))
        .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', function(d, i) {
        return color(d.data.label);
      });

  // tooltip
  var tooltip = d3.select('.chart')
      .append('div')
      .attr('class', 'tooltip');

  tooltip.append('div')
      .attr('class', 'label');

  tooltip.append('div')
      .attr('class', 'count');

  path.on('mouseover', function(d) {

    var total = d3.sum(dataSet.map(function(d) {
        return d.count;
      }));
    var percent = Math.round(1000 * d.data.count / total) / 10;

    tooltip.select('.label').html(d.data.label);
    tooltip.select('.count').html(percent + '% of the time');
    tooltip.style('display', 'block');
  });

  path.on('mouseout', function() {
    tooltip.style('display', 'none');
  });
};
