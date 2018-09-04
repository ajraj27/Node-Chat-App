const expect=require('expect');
const {generateMessage,generateLocationMessage}=require('./message');

describe('generateMessage',() => {
  it('should generate correct message object',() => {
    const from='Ethan Hunt';
    const text='Mission Completed!';
    const message=generateMessage(from,text);

    expect(typeof message.createdAt).toBe('number');
    expect(message.from).toBe(from);
    expect(message.text).toBe(text);
  })
});

describe('generateLocationMessage',() => {
  it('should generate correct Location message object',() => {
    const from='Ethan Hunt';
    const latitude=15;
    const longitude=16;
    const url=`https://google.com/maps?q=15,16`;
    const message=generateLocationMessage(from,latitude,longitude);

    expect(typeof message.createdAt).toBe('number');
    expect(message.from).toBe(from);
    expect(message.url).toBe(url);
  })
})
