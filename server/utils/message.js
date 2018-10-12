const moment=require('moment');

const generateMessage=(from,text) => {
  return {
    from,
    text,
    createdAt:moment().valueOf()
  }
}

const generateLocationMessage=(from,latitude,longitude) => {
  return {
    from,
    url:`https://www.google.com/maps/search/?api=1&key=AIzaSyDu9wQYnTa67ehUA-b6YD9uWW8Xzzhv1BI&query=${latitude},${longitude}`,
    // url: `https://google.com/maps?q=${latitude},${longitude}`,
    createdAt:moment().valueOf()
  }
}

module.exports={generateMessage,generateLocationMessage};
