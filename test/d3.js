var apiKey = "NpjePSNP3ovrBFufOHvGfsX43BDQrce4HkWHoTyi";
var baseUrl = "https://api.propublica.org/congress/v1"
var congressNum = "/115";
var chamber = ["/house", "/senate"];

// using name1 and name2 in case the user reverses the first and last in the search box
function getMem(index, name1, name2) {
  // Ajax call to get the data
  $.ajax({
     url: baseUrl + congressNum + chamber[index] + "/members.json",
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


// Get a list of members
$(document).ready(function() {

})
