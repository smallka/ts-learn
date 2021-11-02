export type EventHandler<T = unknown> = (argument: T) => void;

export class Emitter<Events extends Record<string, any>> {
    private events: { [E in keyof Events]?: EventHandler<Events[E]>[] } = {};

    public on<K extends keyof Events>(this: this, event: K, cb: EventHandler<Events[K]>): EventHandler<Events[K]>
    {
        this.events[event] = this.events[event] || [];
        this.events[event]!.push(cb);
        return cb;
    }
    
    public off<K extends keyof Events>(this: this, event: K, cb: EventHandler<Events[K]>): void
    {
        let events = this.events[event];
        if (events)
        {
            this.events[event] = this.events[event]?.filter((i) => {return i !== cb})
        }
    }

    public emit<K extends keyof Events>(
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
