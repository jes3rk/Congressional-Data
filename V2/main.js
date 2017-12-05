function detailedInfo() {
  var memID;
  var detailInfo;

  $.get("/api/member", function(data) {
    console.log(data);
    detailInfo = data;
    memID = data.congressNum;
    console.log(memID);
  });
  displayBasic();
};

function displayBasic() {

};

$(document).ready(function() {
  $('select').material_select();

  $('#searchGo').on('click touch', function() {
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
          // Meaning only one reuslt is returned
          memID = data[0].id;
          // Make the second API call using the id generated from the search engine
          // $.post("/api/id", {
          //     object: memID
          //   })
          //   .done(function(data) {
          //     // console.log(data);
          //     // Auto redirect into the reuslts page
          //     $(location).attr('href', '/results');
          //   });
          $(location).attr('href', '/member/' + memID);
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
      }
    });
  });
});
