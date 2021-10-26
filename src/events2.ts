export type Handler<T = unknown> = (argument: T) => void;

export class Emitter<Events extends Record<string, any>> {
    events: { [E in keyof Events]?: Handler<Events[E]>[] } = {};

    on<K extends keyof Events>(this: this, event: K, cb: Handler<Events[K]>): Handler<Events[K]>
    {
        this.events[event] = this.events[event] || [];
        this.events[event]!.push(cb);
        return cb;
    }
    
    off<K extends keyof Events>(this: this, event: K, cb: Handler<Events[K]>): void
    {
        let events = this.events[event];
        if (events)
        {
            this.events[event] = this.events[event]?.filter((i) => {return i != cb})
        }
    }

    emit<K extends keyof Events>(
        this: this,
        event: K,
        argument: Events[K]
    ): void
    {
        this.events[event]?.forEach(element => {
            element(argument)
        });
    }
}

export function createEvents<
    Events extends Record<string, any>
    >(): Emitter<Events>
{
    return new Emitter<Events>();
}
