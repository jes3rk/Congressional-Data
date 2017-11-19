var apiKey = "NpjePSNP3ovrBFufOHvGfsX43BDQrce4HkWHoTyi";
var baseUrl = "https://api.propublica.org/congress/v1"
var congressNum = "/115";
var chambers = ["house", "senate"];

var searchOut = [];

// using name1 and name2 in case the user reverses the first and last in the search box
function getMem(cham, name1, name2) {
  // Ajax call to get the data
  $.ajax({
     url: baseUrl + congressNum + "/" + cham + "/members.json",
     type: "GET",
     dataType: 'json',
     headers: {'X-API-Key': apiKey}
  }).done(function(data) {
    var res = data.results[0].members;
    // Search parameters
    for (var i = 0; i < res.length; i++) {
      if (res[i].first_name === name1 || res[i].last_name === name1 || res[i].first_name === name2 || res[i].last_name === name2) {
        // Display search results
        var row = $('<tr/>');
        var name = $('<td/>');
        var state = $('<td/>');
        var chamber = $('<td/>');

        name.text(res[i].first_name + " " + res[i].last_name);
        name.attr({
          class: "name",
          "data-id": res[i].id
        });
        state.text(res[i].state);
        chamber.text(cham[0].toUpperCase() + cham.slice(1));

        row.append(name);
        row.append(state);
        row.append(chamber);

        $('table').append(row);
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

// Get a list of members
$(document).ready(function() {
  $('#searchQuery').on('click', function(event) {
    event.preventDefaults;

    var query = $('#searchText').val().split(" ");
    var fixQ = [];
    // format the search function for proPublica
    query.forEach(function(element) {
      fixQ.push(element[0].toUpperCase() + element.slice(1));
    });

    getMem(chambers[0], fixQ[0], fixQ[1]);
    getMem(chambers[1], fixQ[0], fixQ[1]);
  });
})
