var details;
var houseRecent = [];
var senateRecent = [];

function recentProcess(obj) {
  for (var i = 0; i < obj.length; i++) {
    houseRecent = {
      number: obj[i].bill.number,
      title: obj[i].description,

    };
  };
};

function initCaption(target, id) {
  $('#results').empty();
  $('.caption-col').empty();
  for (var i = 0; i < target.length; i++) {
    if (target[i].roll_call === id) {
      $('#results').text(target[i].bill_num + " " + target[i].title);
      var col = $('.caption-col');
      col.append($('<h5/>').text(target[i].date))
      col.append($('<h6/>').text("Action: " + target[i].action));
      col.append($('<h6/>').text("Description of the bill: " + target[i].description));
      // col.append($('<svg/>').attr({
      //   "width": "50",
      //   "height": "50",
      //   "viewBox": "0 0 120 120"
      // })
      //   .append($(document.createElementNS('http://www.w3.org/2000/svg', 'rect')).attr({
      //     "x": "10",
      //     "y": "10",
      //     "width": "100",
      //     "height": "100",
      //     "fill": "#0099E8"
      //   })));
      var total = target[i].total_votes.yes + target[i].total_votes.no + target[i].total_votes.not_voting;
      col.append($('<p/>').text("Yes votes: " + target[i].total_votes.yes + " or " + ((target[i].total_votes.yes / total) * 100).toFixed(2) + "%"))
      col.append($('<p/>').text("No votes: " + target[i].total_votes.no + " or " + ((target[i].total_votes.no / total) * 100).toFixed(2) + "%"))
      col.append($('<p/>').text("Non voting members " + target[i].total_votes.not_voting + " or " + ((target[i].total_votes.not_voting / total) * 100).toFixed(2) + "%"))
    };
  };
};

function grabRecentVotes() {
  $.get("/api/recentVotes").done(function(data) {
    // Data Structure:
    //   root level: yes, no, no-show,
    //   for each root: break down Dems, Reps, and independents

    // iterate through both parts of the array data
    for (var i = 0; i < data.length; i++) {
      // iterate through the selected data[i]
      for (var j = 0; j < data[i].length; j++) {
        var arr = data[i];
        var obj = {
          roll_call: arr[j].roll_call,
          bill_num: arr[j].bill.number,
          chamber: arr[j].chamber,
          title: arr[j].description,
          description: arr[j].bill.title,
          action: arr[j].bill.latest_action,
          result: arr[j].result,
          date: arr[j].date,
          time: arr[j].time,
          total_votes: {
            yes: arr[j].total.yes,
            no: arr[j].total.no,
            not_voting: parseInt(arr[j].total.not_voting)
          },
          votes: {
            name: "Total",
            children: [
              {
                name: "YEA",
                children: [
                  { name: "Democrats", size: arr[j].democratic.yes },
                  { name: "Republicans", size: arr[j].republican.yes },
                  { name: "Independents", size: arr[j].independent.yes }
                ]
              },
              {
                name: "NAY",
                children: [
                  { name: "Democrats", size: arr[j].democratic.no },
                  { name: "Republicans", size: arr[j].republican.no },
                  { name: "Independents", size: arr[j].independent.no }
                ]
              },
              {
                name: "Not Present",
                children: [
                  { name: "Democrats", size: arr[j].democratic.not_voting },
                  { name: "Republicans", size: arr[j].republican.not_voting },
                  { name: "Independents", size: arr[j].independent.not_voting }
                ]
              }
            ]
          } // end of the votes object
        };
        switch (arr[j].chamber) {
          case "House":
            houseRecent.push(obj);
            break;
          case "Senate":
            senateRecent.push(obj);
            break;
        };
      };
    };
    // make generation call
    recentDonut(houseRecent, houseRecent[0].roll_call);
    initCaption(houseRecent, houseRecent[0].roll_call);

    repeatDonut();
    function repeatDonut() {
      var calls = [];
      for (var i = 0; i < houseRecent.length; i++) {
        calls.push(houseRecent[i].roll_call)
      };
      setTimeout(function() {
        $('.chart-div').empty();
        var num = calls[Math.floor(Math.random() * calls.length)];
        // console.log(num);
        recentDonut(houseRecent, num);
        initCaption(houseRecent, num);
        repeatDonut();
      }, 10000);
    };
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
