const express = require('express')
const app = express()
const cors = require('cors')

var solver = require('./Solver');

app.use(cors());

app.get('/solve/:boggleString' , function(req, res, next){

	var boggle_string = req.params.boggleString;

	console.log('query string')
	console.log(boggle_string)

	var solution = solver.boggle(boggle_string)

	res.send(solution)

});  

app.listen(3001, () => console.log('Example app listening on port 3001!'))