const express = require('express')
const app = express()
const cors = require('cors')

var solver = require('./Solver');

var port = 3001;

app.use(cors());
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('port', port);

app.get('/solve/:boggleString' , function(req, res, next){

	var boggle_string = req.params.boggleString;

	console.log('query string')
	console.log(boggle_string)

	var solution = solver.boggle(boggle_string)

	res.send(solution)

});  

app.listen(app.get('port'), () => console.log('Example app listening on port 3001!'))