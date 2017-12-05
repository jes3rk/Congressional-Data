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
var rColors = ['red', 'blue'];
var dColors = ['blue', 'red'];

function stats() {
  // takes in cleanData
  // arranges useful stats into arrays and objects for recall
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
  // console.log(statsD);
  // console.log(statsR);
};

function votingDonut(id) {
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
  console.log(member);

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

  switch (member.party) {
    case "R":
      var color = d3.scaleOrdinal()
          .domain([dataSet[0].label, dataSet[1].label])
          .range(['red', 'blue']);
      break;
    case "D":
      var color = d3.scaleOrdinal()
          .domain([dataSet[0].label, dataSet[1].label])
          .range(['blue', 'red']);
      break;
    default:
      var color = d3.scaleOrdinal()
          .domain(dataSet)
          .range(['yellow', 'green']);
  };

  var width = 360;
  var height = 360;
  var radius = Math.min(width, height) / 2;
  var donutWidth = 75;

  var arc = d3.arc()
      .innerRadius(radius - donutWidth)
      .outerRadius(radius);

  var labelArc = d3.arc()
    	.outerRadius(radius - 40)
    	.innerRadius(radius - 40);


  var pie = d3.pie()
	  .value(function(d) { return d.count; })(dataSet);

  var svg = d3.select(".party-chart")
  	.append("svg")
  	.attr("width", width)
   	.attr("height", height)
   		.append("g")
   		.attr("transform", "translate(" + width/2 + "," + height/2 +")"); // Moving the center point. 1/2 the width and 1/2 the height

  var g = svg.selectAll("arc")
 	  .data(pie)
  	.enter().append("g")
  	.attr("class", "arc");

  g.append("path")
  	.attr("d", arc)
  	.style("fill", function(d) { return color(d.data.label);});

  g.append("text")
  	.attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
  	.text(function(d) { return d.data.count.toFixed(2) + "%";})
  	.style("fill", "#fff");

  function change() {
  	var pie = d3.pie()
  		.value(function(d) { return d.count; })(dataSet);
  	path = d3.select("#pie").selectAll("path").data(pie); // Compute the new angles
  	path.attr("d", arc); // redrawing the path
  	d3.selectAll("text").data(pie).attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; }); // recomputing the centroid and translating the text accordingly.
  };
};
