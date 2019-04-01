const path=require('path');
const express=require('express');
const socketIO=require('socket.io');
const http=require('http');

const {generateMessage,generateLocationMessage}=require('./utils/message');
const {isRealString}=require('./utils/validation');

const publicPath=path.join(__dirname,'../public');
const port=process.env.PORT || 3000;

const app=express();
const server=http.createServer(app);
const io=socketIO(server);
const {Users}=require('./utils/users');
const users=new Users();

io.on('connection',(socket) => {
  console.log('New User connected.');

  socket.on('join',(params,callback) => {
    if(!isRealString(params.name) || !isRealString(params.room)){
      return callback("Name and room are required.")
    }

    if(users.getUserByName(params.name,params.room)){
      return callback("Same username already exists!!");
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id,params.name,params.room);

    io.to(params.room).emit('updateUserList',users.getUserList(params.room));
    socket.emit('newMessage',generateMessage('Admin','Welcome to Chat room.'));
    socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has joined.`));
    callback();
  })

  socket.on('createMessage',(message) => {
    const user=users.getUserById(socket.id);

    if(user && isRealString(message.text)){
      io.to(user.room).emit('newMessage',generateMessage(user.name,message.text));
    }

  });

  socket.on('createLocationMessage',(location) => {

    const user=users.getUserById(socket.id);

    if(user){
      io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,location.latitude,location.longitude));
    }

  })

  socket.on('disconnect',() => {
    const user=users.removeUser(socket.id);

    if(user){
      io.to(user.room).emit('updateUserList',users.getUserList(user.room));
      io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left.`));
    }
  });

});

app.use(express.static(publicPath));

server.listen(port,() => {
  console.log('Started app on',port);
})
