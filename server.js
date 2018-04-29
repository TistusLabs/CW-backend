var express = require('express');
var app = express();
var cors = require('cors')
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

var port = process.env.PORT || 3535;
app.use(morgan('dev'));

var mongoose = require('mongoose');
mongoose.connect(config.mongoDBConnectionString); // connect to our database

var main_router = express.Router();
main_router.get('/', function (req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});


app.use('/', main_router);
app.use('/api', require('./app/routes/profile'));
app.use('/api', require('./app/routes/inventory'));
app.use('/api', require('./app/routes/vehicle'));
app.use('/api', require('./app/routes/task'));
app.use('/api', require('./app/routes/user'));
app.use('/api', require('./app/routes/verification'));

app.listen(port);
console.log('Magic happens on port ' + port);