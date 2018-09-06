const socket=io();

socket.on('connect',() => {
  console.log('Connected to server');

});

socket.on('newMessage',(message)=> {
  console.log(message);
  const newItem=document.createElement('li');
  newItem.textContent=`${message.from}:${message.text}`;
  list.appendChild(newItem);
});

socket.on('newLocationMessage',(message) => {
  const newList=document.createElement('li');
  const newAnchor=document.createElement('a');
  newAnchor.textContent='My Current Location';
  newAnchor.href=message.url;
  newAnchor.target="_blank";
  newList.textContent=`${message.from}: `;
  newList.append(newAnchor);
  list.append(newList);
})

socket.on('disconnect',() => {
  console.log('Disconnected from user');
})

const form=document.querySelector('.message-form');
const input=document.querySelector('[name=message]');
const list=document.querySelector('.message-list');
const positionBtn=document.querySelector('.send-location');

form.addEventListener('submit',function(e){
  e.preventDefault();

  socket.emit('createMessage',{
    from:'user',
    text:input.value
  });

   this.reset();
});

positionBtn.addEventListener('click',() => {

    if(!navigator.geolocation){
      alert('Gelocation not supported in your browser!!');
    }

    positionBtn.disabled='disabled';
    positionBtn.textContent='Sending location...';

    navigator.geolocation.getCurrentPosition((position) => {
      positionBtn.removeAttribute('disabled');
      positionBtn.textContent='Send location';
        socket.emit('createLocationMessage',{
          'latitude':position.coords.latitude,
          'longitude':position.coords.longitude
        });
    },() => {
      alert('Unable to fetch location!!');
        positionBtn.removeAttribute('disabled');
        positionBtn.textContent='Send location';
    })

});
