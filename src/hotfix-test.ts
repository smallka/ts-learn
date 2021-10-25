
type CallbackType = (name: string) => void;

let before : CallbackType = (name) => { console.log("BeforeHotfix " + name) };
let after : CallbackType = (name) => { console.log("AfterHotfix " + name) };

let c : CallbackType = before;
c("test1")

before.prototype = after.prototype;
c("test2")

c = after;
c("test3")

// BeforeHotfix test1
// BeforeHotfix test2
// AfterHotfix test3
