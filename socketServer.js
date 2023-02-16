const server=require("http").createServer(),io=require("socket.io")(server),SOCKET_PORT=process.env.SOCKET_PORT||8080;server.listen(SOCKET_PORT,function(){console.log("Server listening socket at port",SOCKET_PORT)});
let userData={},chatRooms={};io.on("connection",function(c){console.log("Socket Connected",c.id);let n=!1,a=!1,r=-1;c.on("room join",e=>{var o,s,t;console.log(e),r=e.room,o=e.userId,s=e.userName,t=r,console.log("addUserFunc :",o),n||!a&&o&&(a=!0,c.username=o,userData[o]={},userData[o].socketId=c.id,userData[o].userId=o,userData[o].roomId=t,userData[o].userName=s,console.log("userData["+o+"] :",userData[o]),n=!0,a=!1),void 0===chatRooms[r]&&(chatRooms[r]={}),chatRooms[r][e.userId]={},chatRooms[r][e.userId].userId=e.userId,chatRooms[r][e.userId].userName=e.userName,console.log(chatRooms[r]),c.room=r,c.join(r),c.join(e.socketId),c.to(e.room).emit("new user",{socketId:e.socketId,chatroomUsers:chatRooms[r]})}),c.on("newUserStart",e=>{c.to(e.to).emit("newUserStart",{sender:e.sender,chatroomUsers:chatRooms[r]})}),c.on("pwc",e=>{c.to(e.to).emit("pwc",{description:e.description,sender:e.sender})}),c.on("ice candidates",e=>{c.to(e.to).emit("ice candidates",{candidate:e.candidate,sender:e.sender})}),c.on("leave call",()=>{e()}),c.on("disconnect",function(){e()});let e=function(){console.log("Socket Disconnected----\x3e",c.id),n&&(console.log("Disconnected user: ",c.username),delete userData[c.username]),-1!==r&&(delete chatRooms[r][c.username],console.log("disconnect",chatRooms[r]),c.to(r).emit("leave call",{socketId:c.id,chatroomUsers:chatRooms[r]}),r=-1),n=!1,c.disconnect(!0)}});