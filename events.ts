interface EventsMap {
    [event: string]: any
}

interface DefaultEvents extends EventsMap {
    [event: string]: (...args: any) => void
}

export interface Unsubscribe {
    (): void
}

export class Emitter<Events extends EventsMap > {
    events: { [E in keyof Events]?: Events[E][] } = {};

    on<K extends keyof Events>(this: this, event: K, cb: Events[K]): Unsubscribe
    {
        let e : typeof cb[] = this.events[event] || []
        e.push(cb)
        this.events[event] = e;
        return ()=>{this.events[event] = (this.events[event] as typeof cb[]).filter((i) => {return i == cb})}
    }

    emit<K extends keyof Events>(
        this: this,
        event: K,
        ...args: Parameters<Events[K]>
    ): void
    {
        let events = this.events[event];
        events?.forEach(element => {
            element(...args)
        });
    }
}

export function createEvents<
    Events extends EventsMap
    >(): Emitter<Events>
{
    return new Emitter<Events>();
}
