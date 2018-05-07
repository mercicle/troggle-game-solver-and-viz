
const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const solver = require('./boggle_solver_scripts/Solver');

const PORT = process.env.PORT || 5000;
   
// Multi-process to utilize all CPU cores.
if (cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

} else {

  const app = express();
  app.use(express.static(path.resolve(__dirname, '../react-ui/build')));
 
  app.get('/solve/:boggleString' , function(req, res){

		res.set('Content-Type', 'application/json');

		var boggle_string = req.params.boggleString;
	 
		var solution = solver.boggle(boggle_string)
 
		res.send(JSON.stringify(solution))
	 
  });  
	 
  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  });

  app.listen(PORT, function () {
    console.error(`Node cluster worker ${process.pid}: listening on port ${PORT}`);
  });
}
