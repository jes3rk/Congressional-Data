var path = require("path");

module.exports = function(app) {
  app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "../public/html/home.html"))
  });


  app.get("/results", function(req, res){
    res.sendFile(path.join(__dirname, "../public/html/results.html"))
  });

}
