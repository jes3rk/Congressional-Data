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
console.log[cleanData];
// var initialRes = [];
var memDetail = {};

function dataCleaner() {
  // ... for the house
  for (var i = 0; i < houseData.length; i++) {
    var obj = {
      id: houseData[i].id,
      name: "Rep. " + houseData[i].first_name + " " + houseData[i].last_name,
      first_name: houseData[i].first_name,
      last_name: houseData[i].last_name,
      state: houseData[i].state,
      chamber: "house",
      party: houseData[i].party,
      partyVote: houseData[i].votes_with_party_pct,
      missVote: houseData[i].missed_votes_pct
    };
    if (houseData[i].votes_with_party_pct !== undefined || houseData[i].missed_votes_pct === undefined) {
      cleanData.push(obj);
      // console.log(obj);
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
      first_name: senateData[i].first_name,
      last_name: senateData[i].last_name,
      state: senateData[i].state,
      chamber: "senate",
      party: senateData[i].party,
      partyVote: senateData[i].votes_with_party_pct,
      missVote: senateData[i].missed_votes_pct
    };
    if (senateData[i].votes_with_party_pct !== undefined || senateData[i].missed_votes_pct === undefined) {
      cleanData.push(obj);
      // console.log(obj)
    } else {
      rejectData.push(obj);
    };
  };
  console.log("Data recieved");
  // console.log(cleanData);
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
request.get(senate, function(error, response, body) {
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
    var initialRes = [];
    var searchQ = req.body.object;
    // console.log(searchQ);

    for (var i = 0; i < cleanData.length; i++) {
      // if (cleanData[i].first_name === searchQ[0] || cleanData[i].last_name === searchQ[1] || cleanData[i].first_name === searchQ[1] || cleanData[i].last_name === searchQ[1]) {
      if (cleanData[i].last_name === searchQ[1]) {
        initialRes.push(cleanData[i]);
      };
    };
    res.json(initialRes);
  });

  // get a specific member
  app.post("/api/member", function(req, res) {
    var memId = req.body.object;
    var  memUrl = {
        url: baseUrl + "members/" + memId + ".json",
        headers: {'X-API-Key': apiKey.proPublica}
      };

    // console.log(memId);
    // console.log(memUrl);

    // make sure we have clean data on the person
    for (var i = 0; i < cleanData.length; i++) {
      if (cleanData[i].id === memId) {
        // perform the get call from proPublica
        request.get(memUrl, function(error, response, body) {
          if (!error && response.statusCode === 200) {
            var data = JSON.parse(body);
            var basic = data.results[0];
            // console.log(body);
            // Cleaning the data to make life easier and lower load times
            memDetail = {
              name: basic.first_name + " " + basic.last_name,
              first_name: basic.first_name,
              last_name: basic.last_name,
              congressNum: basic.member_id,
              photo: "https://theunitedstates.io/images/congress/225x275/" + basic.member_id + ".jpg",
              party: basic.current_party,
              gender: basic.gender,
              dob: basic.date_of_birth,
              title: basic.roles[0].short_title,
              roles: basic.roles,
              contact: {
                facebook: "https://www.facebook.com/" + basic.facebook_account,
                twitter: "https://www.twitter.com/" + basic.twitter_account,
                website: basic.url,
                phone: basic.roles[0].phone
              }
            };
            // console.log(memDetail);
            res.json(memDetail);
          } else {
            console.log(error);
          };
        });
      };
    };
  });
};
