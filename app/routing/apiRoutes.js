var apiKey = require("../data/keys.js");
var baseUrl = "https://api.propublica.org/congress/v1/"
var congressNum = "115";
var chambers = ["house", "senate"];
var path = require("path");
var request = require("request");

// url: baseUrl + "/members/" + memNum + ".json",
// var memDetail = {};
var senateID = [];
var houseID = [];


module.exports = function(app) {


//==================================Get 1st info===========================
// app.get('/api/congress', function(req,res){

//Declare variable form "HOUSE"
    var house = {
    url: baseUrl + congressNum + '/' + chambers[0] + '/members.json',
    headers: {'X-API-Key': apiKey.proPublica},
    };
//Declar variable for "Senate?
    var  senate = {
    url: baseUrl + congressNum + '/' + chambers[1] + '/members.json',
    headers: {'X-API-Key': apiKey.proPublica},
    }
//Retrive information from "HOUSE"
    request.get(house, function(error, response, body){
      if (!error && response.statusCode === 200){
        var jsonHouse = JSON.parse(body);
        var arrayHouse;
        for (var i = 0; i <jsonHouse.results.length; i++ ){
          arrayHouse = jsonHouse.results[i]
          for(var j = 0; j < arrayHouse.members.length; j++){
            // houseID.push(arrayHouse.members[j].id);
            // console.log(houseID);
          }
        }
      }
      else {console.log(error);}
    });

//Retrive infomration from "Senate"
    request.get(senate, function(error, response, body){
          if (!error && response.statusCode === 200){
            var jsonobj = JSON.parse(body);
            //console.log(jsonobj);
          //  console.log(jsonobj.copyright)
            var array;
            for (var i = 0; i < jsonobj.results.length; i++) {
                array = jsonobj.results[i]
                for (var j = 0; j < array.members.length; j++){
                  // console.log(array.members[j].id);
                  //push data to senateID array
                  senateID.push(array.members[j].id);
                  // console.log(senateID);
                }
            }
          }
          else {
            console.log(error);
          }
    });
  // })//App.get



//==================================Function of getting Detail Memeber============================
// app.get('/api/congress/Detail', function(req,res){

function detailMem(memNum){

  var detailMem = {
  url: baseUrl + "/members/" + memNum + ".json",
  headers: {'X-API-Key': apiKey.proPublica},
  }
  request.get(detailMem, function(error, response, body){
    if(!error && response.statusCode === 200) {
      var detail = JSON.parse(body);
      var memDetail;
      console.log(body);

      // var basic = data.results[0];
      // Cleaning the data to make life easier and lower load times
      // memDetail = {
      //   name: basic.first_name + " " + basic.last_name,
      //   congressNum: basic.member_id,
      //   photo: "https://theunitedstates.io/images/congress/225x275/" + basic.member_id + ".jpg",
      //   party: basic.current_party,
      //   gender: basic.gender,
      //   dob: basic.date_of_birth,
      //   title: basic.roles[0].short_title,
      //   roles: basic.roles,
      //   contact: {
      //   facebook: "https://www.facebook.com/" + basic.facebook_account,
      //   twiiter: "https://www.twitter.com/" + basic.twitter_account,
      //   website: basic.url,
      //   phone: basic.roles[0].phone
      //   }
      // };
    }
    else {
      console.log(error);
    }

  })

}


//   })//App.get
//
// function detailMem(memNum) {
//     $.ajax({
//       url: baseUrl + "/members/" + memNum + ".json",
//       type: "GET",
//       dataType: "json",
//       headers: {'X-API-Key': apiKey}
//     }).done(function(data) {
//       // console.log(data);

//
//       console.log(memDetail);
//     });
//   }
//==============================List of Memeber==============================

}//Module export
