export type EventType = string | symbol;

// An event handler can take an optional event argument
// and should not return a value
export type Handler<T = unknown> = (event: T) => void;

// An array of all currently registered event handlers for a type
export type EventHandlerList<T = unknown> = Array<Handler<T>>;

// A map of event types and their corresponding event handlers.
export type EventHandlerMap<Events extends Record<EventType, unknown>> = Map<
	keyof Events,
	any
>;

export interface Emitter<Events extends Record<EventType, unknown>> {
	all: EventHandlerMap<Events>;

	on<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>): void;

	off<Key extends keyof Events>(type: Key, handler?: Handler<Events[Key]>): void;

	emit<Key extends keyof Events>(type: Key, event: Events[Key]): void;
	emit<Key extends keyof Events>(type: undefined extends Events[Key] ? Key : never): void;
}

/**
 * Mitt: Tiny (~200b) functional event emitter / pubsub.
 * @name mitt
 * @returns {Mitt}
 */
export default function mitt<Events extends Record<EventType, unknown>>(
	all?: EventHandlerMap<Events>
): Emitter<Events> {
	all = all || new Map();

	return {

		/**
		 * A Map of event names to registered handler functions.
		 */
		all,

		/**
		 * Register an event handler for the given type.
		 * @param {string|symbol} type Type of event to listen for, or `'*'` for all events
		 * @param {Function} handler Function to call in response to given event
		 * @memberOf mitt
		 */
		on<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>) {
			const handlers: EventHandlerList<Events[Key]> | undefined = all!.get(type);
			if (handlers) {
				handlers.push(handler);
			}
			else {
				all!.set(type, [handler]);
			}
		},

		/**
		 * Remove an event handler for the given type.
		 * If `handler` is omitted, all handlers of the given type are removed.
		 * @param {string|symbol} type Type of event to unregister `handler` from, or `'*'`
		 * @param {Function} [handler] Handler function to remove
		 * @memberOf mitt
		 */
		off<Key extends keyof Events>(type: Key, handler?: Handler<Events[Key]>) {
			const handlers: EventHandlerList<Events[Key]> | undefined = all!.get(type);
			if (handlers) {
				if (handler) {
					handlers.splice(handlers.indexOf(handler) >>> 0, 1);
				}
				else {
					all!.set(type, []);
				}
			}
		},

		/**
		 * Invoke all handlers for the given type.
		 * If present, `'*'` handlers are invoked after type-matched handlers.
		 *
		 * Note: Manually firing '*' handlers is not supported.
		 *
		 * @param {string|symbol} type The event type to invoke
		 * @param {Any} [evt] Any value (object is recommended and powerful), passed to each handler
		 * @memberOf mitt
		 */
		emit<Key extends keyof Events>(type: Key, evt?: Events[Key]) {
			let handlers = all!.get(type);
			if (handlers) {
				(handlers as EventHandlerList<Events[keyof Events]>)
					.slice()
					.map((handler) => {
						handler(evt!);
					});
			}
		}
	};
}