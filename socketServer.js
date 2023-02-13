const server = require('http').createServer();
const io = require('socket.io')(server);
const SOCKET_PORT = process.env.SOCKET_PORT || 4001;
server.listen(SOCKET_PORT, function () {
    console.log('Server listening socket at port', SOCKET_PORT);
});

io.on('connection', function (socket) {
    console.log('Socket Connected', socket.id);

    socket.on('subscribe', ( data ) => {
        console.log(data);
        socket.join(data.room);//subscribe/join a room
        //socket.room = data.room;
        socket.join(data.socketId);
        socket.to(data.room).emit('new user', { socketId: data.socketId } ); //Inform other members in the room of new user's arrival
    });

    socket.on('newUserStart', ( data ) => {
        socket.to(data.to).emit('newUserStart', { sender: data.sender } );
    });

    socket.on('pwc', ( data ) => {
        socket.to(data.to).emit('pwc', { description: data.description, sender: data.sender } );
    });

    socket.on('ice candidates', ( data ) => {
        socket.to( data.to ).emit( 'ice candidates', { candidate: data.candidate, sender: data.sender } );
    });

    socket.on('leave call', ( data ) => {
        socket.to(data.room).emit('leave call', { socketId: data.socketId } ); //Inform other members in the room of new user's arrival
        socket.disconnect(true);
    });

    socket.on('disconnect', function () {
        console.log("Socket Disconnected---->", socket.id);
        socket.disconnect(true);
    });
});