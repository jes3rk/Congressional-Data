var apiKey = require("../data/keys.js");
var baseUrl = "https://api.propublica.org/congress/v1/"
var congressNum = "115";
var chambers = ["house", "senate"];
var path = require("path");
var request = require("request");

//GET https://api.propublica.org/congress/v1/{congress}/{chamber}/members.json




module.exports = function(app) {


  console.log('in here')
//==================================Get 1st info===========================
app.get('/api/congress', function(req,res){

//Declare variable form "HOUSE"
    var house = {
    url: baseUrl + congressNum + '/' + chambers[0] + '/members.json',
    headers: {'X-API-Key': 'NpjePSNP3ovrBFufOHvGfsX43BDQrce4HkWHoTyi'},
    };
//Declar variable for "Senate?
    var  senate = {
    url: baseUrl + congressNum + '/' + chambers[1] + '/members.json',
    headers: {'X-API-Key': 'NpjePSNP3ovrBFufOHvGfsX43BDQrce4HkWHoTyi'},
    }
//Retrive information from "HOUSE"
    request.get(house, function(error, response, body){
      if (!error && response.statusCode === 200){
        console.log(body);
      }
      else {
        console.log(error);
      }
    });
//Retrive infomration from "Senate"
    request.get(senate, function(error, response, body){
      if (!error && response.statusCode === 200){
        console.log(body);
      }
      else {
        console.log(error);
      }
    });


  //
  })

  // function getMem(cham, name1, name2) {
  //     var queryUrl = baseUrl + congressNum + "/" + cham + "/members.json";
  //     request(queryUrl, function(error, response, body) {
  //       if(!error && response.statusCode ===200){
  //         var res = data.result[0].members;
  //         for (i = 0; i < data.reasult[0].members; i++){
  //           if(res[i].first_name === name1 || res[i].last_name === name2) {
  //             console.log(res);
  //           }
  //         }
  //       }
  //     });
  //
  //     console.log(JSON.parse(body));
  // }

//==================================Function of getting Detail Memeber============================
  function detailMem(memNum) {
    $.ajax({
      url: baseUrl + "/members/" + memNum + ".json",
      type: "GET",
      dataType: "json",
      headers: {'X-API-Key': apiKey}
    }).done(function(data) {
      // console.log(data);
      var basic = data.results[0];
      // Cleaning the data to make life easier and lower load times
      memDetail = {
        name: basic.first_name + " " + basic.last_name,
        congressNum: basic.member_id,
        photo: "https://theunitedstates.io/images/congress/225x275/" + basic.member_id + ".jpg",
        party: basic.current_party,
        gender: basic.gender,
        dob: basic.date_of_birth,
        title: basic.roles[0].short_title,
        roles: basic.roles,
        contact: {
          facebook: "https://www.facebook.com/" + basic.facebook_account,
          twiiter: "https://www.twitter.com/" + basic.twitter_account,
          website: basic.url,
          phone: basic.roles[0].phone
        }
      };

      console.log(memDetail);
    });
  }
//==============================List of Memeber==============================


}//Module export
