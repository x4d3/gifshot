// server.js (Express 4.0)
var express = require('express'), app = express(), path = require('path'), fs = require('fs-extra'), bodyParser = require('body-parser'), shortid = require('shortid');
// SERVER CONFIGURATION
var IMAGE_DIR = path.join(__dirname, '/../g');
fs.emptyDir('IMAGE_DIR', function (err) {
  if (!err) console.log(IMAGE_DIR + " dir was cleared.")
})


app.use(express.static(__dirname + '/../')); // set the static files location
app.set('port', (process.env.PORT || 7000));

app.use(bodyParser.json({limit: '50mb'}));

app.post('/upload', function(req, res) {
  var imageName = shortid.generate() + ".gif";
  var base64Data = req.body.image.replace(/^data:image\/gif;base64,/, "");
  var targetPath =  path.join(IMAGE_DIR, imageName);
  fs.writeFile(targetPath,  new Buffer(base64Data, 'base64'), function(err) {
     if (err) throw err;
     console.log('File Saved in: ' + targetPath);
  });

  res.send(JSON.stringify({
    imageSrc : "g/" + imageName
  }));
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});