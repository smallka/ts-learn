export {}
console.log("------------------ learn-mitt ------------------")

import mitt from 'mitt'

type Events = {
    foo: string;
    bar?: number;
    fight: {msg: string, num: number};
  };
  
const emitter = mitt<Events>();

emitter.on('foo', (msg) => console.log("foo " + msg.toUpperCase()));
emitter.emit('foo', 'hello');

emitter.on('bar', (num) => console.log("bar " + num?.toFixed()));
emitter.emit('bar');
emitter.emit('bar', 3.14);

emitter.on('fight', ({msg, num}) => console.log("fight " + msg.toUpperCase() + " " + num.toFixed()));
emitter.emit('fight', {msg: "alice", num: 31.4});
