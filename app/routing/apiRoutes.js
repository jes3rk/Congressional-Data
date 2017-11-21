var apiKey = require("../data/keys.js");
var baseUrl = "https://api.propublica.org/congress/v1"
var congressNum = "115";

var path = require("path");
var request = require("request");
var Congress = require( 'propublica-congress-node' );
var client = new Congress(apiKey.proPublica);


module.exports = function(app) {

  app.post("/api/getMem", function(req, res) {
    var params = req.body.object;
    var output;
    var houseData = [];
    var senateData = [];
    // console.log(params);

    // node api caller
    client.memberLists({
      congressNumber: congressNum,
      // grab the house data
      chamber: 'house'
    }).then(function(res) {
      // houseData.push(res);
      houseData = res;
      console.log(houseData);
      // console.log(res);
    });

    client.memberLists({
      congressNumber: congressNum,
      // grab the senate data
      chamber: 'senate'
    }).then(function(res) {
      // senateData.push(res);
      senateData = res;
      console.log(senateData)
      // console.log(res);
    });

    // console.log(houseData, senateData);

    res.json(output);
  });
};
