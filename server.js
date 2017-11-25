var express = require("express");
var bodyParser = require("body-parser");
var path = require("path")

var app = express();




var PORT = process.env.PORT || 3000;

// Make bodyParser work
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/app/public')));
// Search for and find the routes
// require("./app/routing/apiRoutes")(app);
require("./app/routing/apiRoutes-test")(app);
require("./app/routing/htmlRoutes")(app);

// app.post("/api/congress", function(req, res){
//   preventDefault()
// });


// Listener
app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
