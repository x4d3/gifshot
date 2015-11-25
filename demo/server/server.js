// server.js (Express 4.0)
var express = require('express'),
  app = express();

// SERVER CONFIGURATION
app.use(express.static(__dirname + '/../')); // set the static files location /public/img will be /img for users

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});