// server.js (Express 4.0)
var express = require('express'),
    app = express(),
    path = require('path'),
    fs = require('fs-extra'),
    bodyParser = require('body-parser'),
    shortid = require('shortid'),
    url = require('url'),
    pg = require('pg');
// SERVER CONFIGURATION
app.use(express.static(__dirname + '/../')); // set the static files location
app.set('port', (process.env.PORT || 7000));

app.use(bodyParser.json({
    limit: '50mb'
}));

app.post('/saveBase64Image', function(req, res) {
    var imageName = shortid.generate() + ".gif";
    var base64Data = req.body.image.replace(/^data:image\/gif;base64,/, "");
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if (err) {
            console.error(err);
			done();
			res.status(500).json({ success: false, data: err});
        } else {
            client.query('insert into image values ($1, $2)', [imageName, new Buffer(base64Data, 'base64')],
                function(err, writeResult) {
					if (err) {
						console.error(err);
						res.status(500).json({ success: false, data: err});
					}else{
						res.json({imageSrc: "g/" + imageName});
					}
                });
        }
    });


});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});


app.get('/g/:fileName', function(request, response) {
    var fileName = request.params.fileName;
    console.log("get image: " + fileName);
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if (err) {
            console.error(err);
            response.send("Error " + err);
			return;
        } 
		client.query('SELECT data FROM image where name=($1)', [fileName], function(err, result) {
			done();
			if (err) {
				console.error(err);
				response.send("Error " + err);
				return;
			}
			if (result.rows.length == 1) {
				response.writeHead(200, {
					'Content-Type': 'image/gif'
				});
				response.end(result.rows[0].data, 'binary');
			} else {
				response.send("Could not find image: " + fileName);
			}
		});
    });
})