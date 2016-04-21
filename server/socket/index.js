import socketIo  from 'socket.io';

export default (appServer) => {
	let io = socketIo.listen(appServer);
	io.sockets.on('connection', function(socket) {
	    socket.on('testEvent', function(data) {
	       socket.emit('testOK', 'test OK', data);
	    });

	});
};
