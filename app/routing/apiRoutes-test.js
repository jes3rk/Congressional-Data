var apiKey = require("../data/keys.js");
var baseUrl = "https://api.propublica.org/congress/v1/"
var congressNum = "115";
var chambers = ["house", "senate"];
var path = require("path");
var request = require("request");

var house = {
    url: baseUrl + congressNum + '/' + chambers[0] + '/members.json',
    headers: {'X-API-Key': apiKey.proPublica}
  };

var  senate = {
    url: baseUrl + congressNum + '/' + chambers[1] + '/members.json',
    headers: {'X-API-Key': apiKey.proPublica}
  };

var houseFin = false;
var senateFin = false;

var senateData = [];
var houseData = [];

// useful variables
var cleanData = [];
var rejectData = [];
var initialRes = [];

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
      console.log(obj.name + "'s data is corrupted. Sorry");
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
  console.log(cleanData);
};

// get initial data
  //... for the house
request.get(house, function(error, response, body) {
  if (!error && response.statusCode === 200) {
    var initData = JSON.parse(body);
    houseData = initData.results[0].members
    // console.log(houseData.results[0].members);
    houseFin = true;
  };
  if (senateFin === true) {
    dataCleaner();
  };
});
  // ... for the senate
request.get(house, function(error, response, body) {
  if (!error && response.statusCode === 200) {
    var initData = JSON.parse(body);
    senateData = initData.results[0].members
    senateFin = true;
    // console.log(senateData.results[0].members);
  };
  if (houseFin === true) {
    dataCleaner();
  };
});


module.exports = function(app) {


  // user triggered search
  app.post("/api/search", function(req, res) {
    var searchQ = req.body;
    var results = [];

    for (var i = 0; i < cleanData.length; i++) {
      if (cleanData[i].first_name === req.body[0] || cleanData[i].last_name === req.body[0] || cleanData[i].first_name === req.body[1] || cleanData[i].last_name === req.body[1]) {
        initialRes.push(cleanData[i]);
      };
    };
    res.json(initialRes);
  });
};
