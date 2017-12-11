var details;
var houseRecent;
var senateRecent;

function grabRecentVotes() {
  var houseUrl = "https://api.propublica.org/congress/v1/house/votes/recent.json";
  var senateUrl = "https://api.propublica.org/congress/v1/senate/votes/recent.json";
  var apiKey = "NpjePSNP3ovrBFufOHvGfsX43BDQrce4HkWHoTyi";

  $.ajax({
    url: houseUrl,
    headers: {"X-API-Key": apiKey}
  }).then(function(data) {
    // console.log(data);
    houseRecent = data.results.votes;
  });

  $.ajax({
    url: senateUrl,
    headers: {"X-API-Key": apiKey}
  }).then(function(data) {
    // console.log(data);
    senateRecent = data.results.votes;
  });
};

function search() {
  var memID;
  event.preventDefault();
  // Grab the user text
  var userText = $('#search').val().split(" ");
  var congressSearch = [];
  // Format the text according to ProPublica
  userText.forEach(function(element) {
    congressSearch.push(element[0].toUpperCase() + element.slice(1));
  });
  // Log for QA
  console.log(congressSearch);
  // API call to the server
  $.post("/api/search", {object: congressSearch})
    .done(function(data) {
      // Check the length of the data returned
      if (data.length === 1) {
        // Redirect to the member results page based on the memebr
        $(location).attr('href', '/congress/member/' + data[0].id);
      } else {
        // Generates a table for users to select the correct result
        // Shouldn't be needed
        for (var i = 0; i < data.length; i++) {
          var row = $('<tr/>');

          var name = $('<td/>');
          name.text(data[i].name);
          name.attr({
            "data-id": data[i].id,
            "class": "pick"
          });

          var state = $('<td/>');
          state.text(data[i].state);

          row.append(name);
          row.append(state);

          $('.choose').append(row);
        };
        // Redirect from the table of results
        $('td').on('click touch', function() {
          $(location).attr('href', '/congress/member/' + $(this).attr("data-id"));
        });
    };
  });
};

function memberReady() {
  $('.collapsible').collapsible();

  // Get the clean data
  $.get("/api/clean")
    .done(function(data) {
      cleanData = data[0];
      details = data[1];
      console.log(details);
      stats();
    });

  $('li').on('click touch', function() {
    if ($(this).attr("class") !== "active") {
      switch ($(this).attr("id")) {
        case "party-voting":
          $('.vote-chart').empty();
          $('.party-chart').empty();
          votingDonut(details.congressNum);
          break;
        case "missed-votes":
          $('.party-chart').empty();
          $('.vote-chart').empty();
          missedDonut(details.congressNum);
          break;
      };
    };
  });
};

$(document).ready(function() {
  grabRecentVotes();

  $('select').material_select();

  $('#searchGo').on('click touch', function() {
    search();
  });

  $(document).keypress(function (e) {
    if (e.which == 13) {
      search();
    };
  });
});
