var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var userid = 0;

app.use(express.static(__dirname));

io.on('connection', function(socket){

	socket.on('identify', function(msg) {
		if (msg === 'viewer')
		{
			console.log('a viewer connected.');

			this.on('disconnect', function(){
				console.log('viewer disconnected.');
			});

		} 
		else if (msg === 'controller')
		{
			userid = userid + 1;
			console.log('a controller connected. userid: ' + userid);

			this.userid = userid;

			io.emit('addMario', this.userid);

			this.on('disconnect', function(){
				console.log('controller disconnected. userid: ' + this.userid);
				io.emit('destroyMario', this.userid);
			});

			this.on('move', function(msg){
				console.log('move: ' + msg.direction + ', userid: ' + this.userid);
				
				msg.userid = this.userid;

				io.emit('move', msg);
			});


		}
	});





});

http.listen(3000, function(){
	console.log('listening on *:3000');
});