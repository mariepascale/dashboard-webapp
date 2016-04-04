console.log("Step1 - Starting Dashboard App");

// setup ========================
var express = require('express'),
    app = express(), // create our app w/ express
    http = require('http'),
    mongoose = require('mongoose'),                     // mongoose for mongodb
    morgan = require('morgan'),             // log requests to the console (express4)
    bodyParser = require('body-parser'),    // pull information from HTML POST (express4)
    methodOverride = require('method-override'); // simulate DELETE and PUT (express4)



// configure Mongodb ========================

//mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');

mongoose.connect('mongodb://localhost/myappdatabase');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());


// define model =================
var Section = mongoose.model('Section', {
    text : String
});


// routes ========================

// api ---------------------------------------------------------------------
// get all sections
app.get('/api/sections', function(req, res) {

    console.log("getting all sections");

    // use mongoose to get all sections in the database
    Section.find(function(err, sections) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(sections); // return all sections in JSON format
    });
});


// create section and send back all sections after creation
app.post('/api/sections', function(req, res) {
    // create a section, information comes from AJAX request from Angular

    console.log("creating a section");

    console.log(req.body.text);

    Section.create({
        text : req.body.text,
        done : false
    }, function(err, sections) {
        if (err)
            res.send(err);

        // get and return all the sections after you create another
        Section.find(function(err, sections) {
            if (err)
                res.send(err)
            res.json(sections);
        });
    });
});

// delete a section
app.delete('/api/sections/:section_id', function(req, res) {

   console.log("delete a section");

    Section.remove({
        _id : req.params.section_id
    }, function(err, section) {
        if (err)
            res.send(err);

        // get and return all the sections after you create another
        Section.find(function(err, sections) {
            if (err)
                res.send(err)
            res.json(sections);
        });
    });
});


// application ========================
app.get('*', function(req, res) {
  res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});


// server ========================

// Set port to listen to
app.set('port', process.env.PORT || 5000);
app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());


//init the server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
