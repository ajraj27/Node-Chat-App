
const socket=io();

socket.on('connect',() => {
  const params=jQuery.deparam(window.location.search);

  socket.emit('join',params,(err) => {
    if(err){
      alert(err);
      window.location.href='/';
    }
    else{
      console.log("No error");
    }
  })
  console.log('Connected to server');

});

socket.on('newMessage',(message) => {
  const formattedTime=moment(message.createdAt).format('h:mm a');
  const template=document.querySelector('#message-template').innerHTML;
  const html=Mustache.render(template,{
    text:message.text,
    from:message.from,
    createdAt:formattedTime
  }); //return a string which has to be converted to node to be able to append in an unordered list
  const newHtml = document.createRange().createContextualFragment(html); //to convert a string to DOM node

  list.appendChild(newHtml);

});

socket.on('newLocationMessage',(message) => {
  const formattedTime=moment(message.createdAt).format('h:mm a');
  const template=document.querySelector('#location-message-template').innerHTML;
  const html=Mustache.render(template,{
    url:message.url,
    from:message.from,
    createdAt:formattedTime
  }); //return a string which has to be converted to node to be able to append in an unordered list
  const newHtml = document.createRange().createContextualFragment(html); //to convert a string to DOM node

  list.appendChild(newHtml);

})

socket.on('updateUserList',(users) => {
  let html=users.map((user) => `<li>${user}</li>`).join('');
  html=`<ol>${html}</ol>`;

  people_list.innerHTML=html;
})

socket.on('disconnect',() => {
  console.log('Disconnected from user');
})

const form=document.querySelector('.message-form');
const input=document.querySelector('[name=message]');
const list=document.querySelector('.message-list');
const positionBtn=document.querySelector('.send-location');
const people_list=document.querySelector('.people-list');

form.addEventListener('submit',function(e){
  e.preventDefault();

  socket.emit('createMessage',{
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
