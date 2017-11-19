var apiKey = "NpjePSNP3ovrBFufOHvGfsX43BDQrce4HkWHoTyi";
var baseUrl = "https://api.propublica.org/congress/v1"
var congressNum = "/115";
var chamber = ["/house", "/senate"];

// GET https://api.propublica.org/congress/v1/members/{member-id}.json

// using name1 and name2 in case the user reverses the first and last in the search box
function getMem(cham, name1, name2) {
  // Ajax call to get the data
  $.ajax({
     url: baseUrl + congressNum + cham + "/members.json",
     type: "GET",
     dataType: 'json',
     headers: {'X-API-Key': apiKey}
  }).done(function(data) {
    var res = data.results[0].members;
    // Search parameters
    for (var i = 0; i < res.length; i++) {
      if (res[i].first_name === name1 || res[i].last_name === name1 || res[i].first_name === name2 || res[i].last_name === name2) {
        console.log(res[i]);
      };
    };
  });
}

function detailMem(memNum) {
  $.ajax({
    url: baseUrl + "/members/" + memNum + ".json",
    type: "GET",
    dataType: "json",
    headers: {'X-API-Key': apiKey}
  }).done(function(data) {
    console.log(data);
  });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

var testNum = "H000338";

// Get a list of members
$(document).ready(function() {
  $('#searchQuery').on('click', function(event) {
    event.preventDefaults;

    var query = $('#searchText').val().split(" ");
    var fixQ = [];
    query.forEach(function(element) {
      fixQ.push(element[0].toUpperCase() + element.slice(1));
    });

    console.log(fixQ);
    getMem(chamber[0], fixQ[0], fixQ[1]);
    getMem(chamber[1], fixQ[0], fixQ[1]);
  });
})
