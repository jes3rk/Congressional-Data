var apiKey = "NpjePSNP3ovrBFufOHvGfsX43BDQrce4HkWHoTyi";
var baseUrl = "https://api.propublica.org/congress/v1"
var congressNum = "/115";
var chambers = ["house", "senate"];
var click = 0;

var memDetail = {};

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
      if (res[i].first_name === name1 || res[i].last_name === name2) {
        // Display search results
        displayRes(res[i], cham);
      };
    };
  });
}

// This pushes the search results to a table to display
function displayRes(result, house) {
  var row = $('<tr/>');
  var name = $('<td/>');
  var state = $('<td/>');
  var chamber = $('<td/>');

  name.text(result.first_name + " " + result.last_name);
  name.attr({
    class: "name",
    "data-id": result.id
  });
  state.text(result.state);
  chamber.text(house[0].toUpperCase() + house.slice(1));

  row.append(name);
  row.append(state);
  row.append(chamber);

  $('table').append(row);

  // Trigger member search
  $('.name').on('click', function() {
    event.preventDefaults;
    if (click < 1) {
      detailMem($(this).data('id'));
    };
    // using a click interval to enforce a one-search-per-page-load rule
    click++;
  });
}

// Searches detailed bio and history for the chose member
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

// Get a list of members
$(document).ready(function() {
  click = 0;
  $('#searchQuery').on('click', function(event) {
    event.preventDefaults;
    click = 0;
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
// var usioImage = $("https://theunitedstates.io/images/congress/225x275/" + basic.member_id + ".jpg"); //Equivalent: $(document.createElement('img'))
// img.attr('src', responseObject.imgurl);
// img.appendTo('#congressphoto');
