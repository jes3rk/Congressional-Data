var apiKey = "NpjePSNP3ovrBFufOHvGfsX43BDQrce4HkWHoTyi";
var baseUrl = "https://api.propublica.org/congress/v1/"
var congressNum = "115";
var chambers = ["house", "senate"];
var path = require("path");
var request = require("request");

var express = require("express");
var app = express();
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var house = {
    url: baseUrl + congressNum + '/' + chambers[0] + '/members.json',
    headers: {'X-API-Key': apiKey}
  };

var  senate = {
    url: baseUrl + congressNum + '/' + chambers[1] + '/members.json',
    headers: {'X-API-Key': apiKey}
  };

var houseRecentUrl = {
  url: "https://api.propublica.org/congress/v1/house/votes/recent.json",
  headers: {'X-API-Key': apiKey}
  };
var senateRecentUrl = {
  url: "https://api.propublica.org/congress/v1/senate/votes/recent.json",
  headers: {'X-API-Key': apiKey}
  };

var houseFin = false;
var senateFin = false;

var senateData = [];
var houseData = [];

var recentHouseVotes;
var recentSenateVotes;

// useful variables
var cleanData = [];
var rejectData = [];
var dets;

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
    if (houseData[i].votes_with_party_pct !== undefined && houseData[i].missed_votes_pct !== undefined) {
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
    if (senateData[i].votes_with_party_pct !== undefined && senateData[i].missed_votes_pct !== undefined) {
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

  // ... recent vote data for the house
request.get(houseRecentUrl, function(error, response, body) {
  if (!error && response.statusCode === 200) {
    var initData = JSON.parse(body);
    recentHouseVotes = initData.results.votes;
  };
});

  // ... recent vote data for the senate
request.get(senateRecentUrl, function(error, response, body) {
  if (!error && response.statusCode === 200) {
    var initData = JSON.parse(body);
    recentSenateVotes = initData.results.votes;
  };
});

module.exports = function(app) {

  app.get("/api/recentVotes", function(req, res) {
    // create the urls for the api calls
    res.json([recentHouseVotes, recentSenateVotes])
  });

  app.engine("handlebars", exphbs({ defaultLayout: "main" }));
  app.set("view engine", "handlebars");
  // initial search based on the user entered data
  app.post("/api/search", function(req, res) {
    var initialRes = [];
    var secondRes = [];
    var searchQ = req.body.object;
    // console.log(searchQ);

    for (var i = 0; i < cleanData.length; i++) {
      // if (cleanData[i].first_name === searchQ[0] || cleanData[i].last_name === searchQ[1] || cleanData[i].first_name === searchQ[1] || cleanData[i].last_name === searchQ[1]) {
      if (cleanData[i].last_name === searchQ[1]) {
        initialRes.push(cleanData[i]);
      };
    };
    if (initialRes.length > 1) {
      for (var i = 0; i < initialRes.length; i++) {
        if (initialRes[i].first_name === searchQ[0]) {
          secondRes.push(initialRes[i]);
        };
      };
      if (secondRes.length > 0) {
        res.json(secondRes);
      } else {
        res.json(initialRes);
      };
    } else {
      res.json(initialRes);
    };
  });

  // additional call to bring down the clean data for analysis
  app.get("/api/clean", function(req, res) {
    res.json([cleanData, dets]);
  });

  function memDetail(id) {

  };

  app.get("/congress/member/:ref", function(req, res) {
    // Grab the id from the url
    var ref = req.params.ref;
    // console.log("Getting: " + ref);
    // Generate the API call URL
    var  memUrl = {
        url: baseUrl + "members/" + ref + ".json",
        headers: {'X-API-Key': apiKey}
      };
    // make sure we have clean data on the person
    for (var i = 0; i < cleanData.length; i++) {
      if (cleanData[i].id === ref) {
        // perform the get call from proPublica
        // console.log("Url: " + memUrl);
        request.get(memUrl, function(error, response, body) {
          if (!error && response.statusCode === 200) {
            var data = JSON.parse(body);
            var basic = data.results[0];
            // console.log(body);
            // Cleaning the data to make life easier and lower load times
            var roles = [];
            for (var i = 0; i < basic.roles.length; i++) {
              if (basic.roles[i].short_title === "Rep." || basic.roles[i].short_title === "Sen.") {
                roles.push(basic.roles[i]);
              };
            };
             dets = {
              name: basic.first_name + " " + basic.last_name,
              prop_name: basic.roles[0].short_title + " " + basic.first_name + " " + basic.last_name + " (" + basic.current_party + " - " + basic.roles[0].state + ")",
              first_name: basic.first_name,
              last_name: basic.last_name,
              congressNum: basic.member_id,
              photo: "https://theunitedstates.io/images/congress/225x275/" + basic.member_id + ".jpg",
              party: basic.current_party,
              gender: basic.gender,
              dob: basic.date_of_birth,
              title: basic.roles[0].short_title,
              roles: roles,
              contact: {
                facebook: "https://www.facebook.com/" + basic.facebook_account,
                twitter: "https://www.twitter.com/" + basic.twitter_account,
                website: basic.url,
                phone: basic.roles[0].phone
              }
            };
            // console.log(dets);
            // res.json(memDetail);

            // app.get("/api/congress/memberDets", function(req, res) {
            //   res.json(dets);
            // });

            res.render("results", dets);
          } else {
            console.log(error);
          };
        });
      };
    }; // End of the for loop
  });

};
