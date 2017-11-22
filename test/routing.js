var apiKey = require("../data/keys.js");
var baseUrl = "https://api.propublica.org/congress/v1"
var congressNum = "115";

var path = require("path");
var request = require("request");
var Congress = require( 'propublica-congress-node' );
var client = new Congress(apiKey.proPublica);


module.exports = function(app) {
// these are out here so I can access them later
  var houseData = [];
  var senateData = [];

  app.post("/api/getMem", function(req, res) {
    var params = req.body.object;
    var output = [];
    var finishedHouse = false;
    var finishedSenate = false;
    var when = true;
    // console.log(params);
    console.log(params);

    // node api caller
    client.memberLists({
      congressNumber: congressNum,
      // grab the house data
      chamber: 'house'
    }).then(function(res) {
      houseData = res;
      var query =  res.results[0].members;
      for (var i = 0; i < query.length; i++) {
        if (query[i].first_name === params[0] || query[i].last_name === params[1]) {
          output.push(query[i]);
        };
        if (i === query.length-1) {
          finishedHouse = true;
          if (finishedSenate === true) {
            push();
          };
        };
      };
    });

    client.memberLists({
      congressNumber: congressNum,
      // grab the senate data
      chamber: 'senate'
    }).then(function(res) {
      senateData = res;
      var query =  res.results[0].members;
      for (var i = 0; i < query.length; i++) {
        if (query[i].first_name === params[0] || query[i].last_name === params[1]) {
          output.push(query[i]);
        };
        if (i === query.length-1) {
          finishedSenate = true;
          if (finishedHouse === true) {
            push();
          };
        };
      };
    });

    function push() {
      return res.json(output);
    };


  }); // End of the first api call
};
