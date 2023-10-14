

const io = require('socket.io')(8900,{
    cors:{
        origin:'http://localhost:3000'
    },
    
})
let users=[]
const addUser=(userId,socketId) => {
    !users.some(user=>user.userId === userId) && 
    users.push({userId,socketId})
}





const removeUser = (socketId) => {
    users=users.filter((user) => user.socketId !== socketId)
}


 
const getUser = (receiverId) => {
    console.log("getuser");
    console.log(users);
    return users.find((user) => user.userId == receiverId);
  };


io.on("connection",(socket) => {
    console.log("a user is connected");
    io.emit('welcome','connected')
   socket.on('addUser',userId=>{
     addUser(userId,socket.id)
     io.emit("getUsers",users)
   })
// ---------------------------------------------------------

// const getUsers=(usersArray)=>{

//   const array =usersArray.map((elem)=>{
//     return users.find((user) => user.userId == elem);
//   })

//   return array
  
// }
// ---------------------------------------------------------
//send and getMessage
socket.on('sendMessage',({senderId,receiverId,text}) => { 
    
   const user = getUser(receiverId)
  
    if(!user) return
   io.to( user.socketId).emit("getMessage", {
    senderId, 
    text,
  });
})
// ---------------------------------------------------------
// socket.on('sendPost',({senderId,receiverId})=>{
//   const users = getUsers([senderId,receiverId])
//   console.log("userdfddf",users);
//   console.log("userdfddf");

//   users?.forEach(user => {
//     if(!user){
//       console.log("ofline user");
//     }else{
//       console.log("heiiii");
//       const message="new notification"
//       io.to(user.socketId).emit("getNotice",message)
//     }
//   });

// }) 

// socket.emit("toall","allcocked")

// --------------------------------------------------------------
   socket.on("disconnect",() => {
    console.log(users,'userssss');
    console.log("a user disconnected!");
    removeUser(socket.id)
    io.emit("getUsers",users)
})
})