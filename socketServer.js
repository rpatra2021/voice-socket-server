const server=require("http").createServer();
const io=require("socket.io")(server);
const SOCKET_PORT=process.env.SOCKET_PORT||8080;

server.listen(SOCKET_PORT,function(){
    console.log("Server listening socket at port",SOCKET_PORT)
});

io.on("connection",function(o){
    o.on("room join",e=>{
        o.room=e.room,
        o.join(e.room),
        // o.join(e.socketId),
        o.to(o.room).emit("new joined",{socketId:e.socketId,userId:e.userId,userName:e.userName})
    }),
    o.on("old user",e=>{
        o.to(e.to).emit("old user",{sender:e.sender,userId:e.userId,userName:e.userName})
    }),
    o.on("pwc",e=>{
        o.to(e.to).emit("pwc",{description:e.description,sender:e.sender})
    }),
    o.on("ice candidates",e=>{
        o.to(e.to).emit("ice candidates",{candidate:e.candidate,sender:e.sender})
    }),
    o.on("new message",e=>{
        o.to(o.room).emit("new message",e)
    }),
    o.on("leave call",e=>{
        n()
    }),
    o.on("disconnect",function(){
        n()
    });
    const n=function(){
        o.to(o.room).emit("leave call",{socketId:o.id}),o.disconnect(!0)
    }
});