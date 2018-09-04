const path=require('path');
const express=require('express');
const socketIO=require('socket.io');
const http=require('http');

const {generateMessage,generateLocationMessage}=require('./utils/message');

const publicPath=path.join(__dirname,'../public');
const port=process.env.PORT || 3000;

const app=express();
const server=http.createServer(app);
const io=socketIO(server);

io.on('connection',(socket) => {
  console.log('New User connected.');

  socket.emit('newMessage',generateMessage('Admin','Welcome to Chat room.'));

  socket.broadcast.emit('newMessage',generateMessage('Admin','New User joined.'));

  socket.on('createMessage',(message) => {
    console.log(message);
    io.emit('newMessage',generateMessage(message.from,message.text));

  });

  socket.on('createLocationMessage',(location) => {
    io.emit('newLocationMessage',generateLocationMessage('Admin',location.latitude,location.longitude));
  })

  socket.on('disconnect',() => {
    console.log('User got disconnected');
  });

});

app.use(express.static(publicPath));

server.listen(port,() => {
  console.log('Started app on',port);
})
