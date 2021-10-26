import "./learn-typing-object"
import "./learn-typing-union"
import "./learn-typing-function"
import "./learn-mitt"
import "./learn-events"
import "./learn-events2"
import "./ecs"
import "./ecs2"

console.log("done.")

type Event = {
    a: number,
    b: string,
}
type Handler = {
    [K in keyof Event]: (event: Event[K]) => void
}
type M = Handler[keyof Event]

let m: M = function(event: string) {
    
}