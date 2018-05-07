const express = require('express')
const app = express()
const cors = require('cors')

const path = require('path');
const logger = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

var solver = require('./boggle_solver_scripts/Solver');

var port = 3001;

app.use(cors());
// app.use(compression());
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(expressValidator());
// app.use(cookieParser());

// app.use(express.static(path.join(__dirname, 'public')));
app.set('port', port);

app.get('/solve/:boggleString' , function(req, res, next){

	var boggle_string = req.params.boggleString;

	// console.log('query string')
	// console.log(boggle_string)

	var solution = solver.boggle(boggle_string)

	// console.log(JSON.stringify(solution))
	res.send(solution)

});  

app.listen(app.get('port'), () => console.log('Example app listening on port '+app.get('port')))