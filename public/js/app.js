const socket=io();

socket.on('connect',() => {
  console.log('Connected to server');

});

socket.on('newMessage',(message)=> {
  console.log(message);
  const newItem=document.createElement('li');
  newItem.textContent=`${message.from}:${message.text}`;
  list.appendChild(newItem);
})

socket.on('disconnect',() => {
  console.log('Disconnected from user');
})

const form=document.querySelector('.message-form');
const input=document.querySelector('[name=message]');
const list=document.querySelector('.message-list');

form.addEventListener('submit',function(e){
  e.preventDefault();

  socket.emit('createMessage',{
    from:'user',
    text:input.value
  });

   this.reset();
})
