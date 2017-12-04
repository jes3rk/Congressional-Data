$(document).ready(function() {
  $('select').material_select();

  $('#searchGo').on('click touch', function() {
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
          // Make the second API call and redirect
          $.post("/api/id", {
              object: memID
            })
            .done(function(data) {
              console.log(data);
              $(location).attr('href', '/results');
            });
        } else {
          for (var i = 0; i < data.length; i++) {
            var row = $('<tr/>');

            var name = $('<td/>');
            name.text(data[i].name);
            name.attr({
              "data-id": data[i].id,
              "class": "pick nameLeft"
            });

            var state = $('<td/>');
            state.text(data[i].state);
            state.attr({
              "class": "stateRight"

            })
            row.append(name);
            row.append(state);

            $('.choose').append(row);
          };
      });
  });
});
