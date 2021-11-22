import { Handler } from "mitt"

export {}
console.log('------------------ entity-base ------------------')

type TimerHandler = number

class TimerRecord
{
    
}

type HandlersMap = Map<TimerHandler, CallbackRecords>;

class TimerManager
{
    // TODO 真正的Timer逻辑还没写呢

    public delayOnce(ms : number, base : TimerBase) : TimerHandler // TODO 这里还要再记录一个entity？才能够清理对应的handler？
    {
        this.currentIdx += 1
        this.timerMap.set(this.currentIdx, base)
        return this.currentIdx;
    }


    public delete(handler : TimerHandler | HandlersMap)
    {
        if (handler instanceof Map)
        {
            handler.forEach((records, handler) => {
                this.timerMap.delete(handler);
            });
        }
        else
        {
            this.timerMap.delete(handler);
        }
    }

    private timerMap = new Map<number, TimerBase>();
    private currentIdx = 0;
}

let TimerManagerInstance = new TimerManager();

class CallbackRecords
{
    constructor(public func : string, public once = true)
    {    
    }
}

class TimerBase
{
    public delayOnce(ms : number, callback : Function) : TimerHandler
    {
        let foundFunctionName : undefined | string = undefined;

        let ClassPrototype = Object.getPrototypeOf(this);
        Object.getOwnPropertyNames(ClassPrototype).forEach(name => {
            if (ClassPrototype[name] === callback)
            {
                console.log("Found match " + name);
                foundFunctionName = name;
            }
        });

        if (!foundFunctionName)
        {
            throw new Error('Callback should be class function');
        }

        let handler = TimerManagerInstance.delayOnce(ms, this);
        this.handlers.set(handler, new CallbackRecords(foundFunctionName));
        return handler;
    }

    public onCallback(handler : TimerHandler) // TODO 如果调用了这个函数，是不是timer就记在自己这里更好？
    {
        let record = this.handlers.get(handler)
        if (record)
        {
            let f = this[record.func as keyof typeof this]
            if (f instanceof Function)
            {
                f();
            }
            else
            {
                throw new Error("Callback with no function")
            }

            if (record.once)
            {
                this.handlers.delete(handler)
            }
        }
    }

    public clearAllTimer()
    {
        TimerManagerInstance.delete(this.handlers);
    }

    // ----------------------------------------------------------------------------
    // Test func
    public delayOnce_TEST(ms : number, callback : Function)
    {
        let foundCallback = false;
        let ClassPrototype = Object.getPrototypeOf(this);
        Object.getOwnPropertyNames(ClassPrototype).forEach(name => {
            if (ClassPrototype[name] === callback)
            {
                console.log("Found match " + name);
                foundCallback = true;
            }
        });

        if (!foundCallback)
        {
            console.log("Match not found " + callback);
        }
    }
    // ----------------------------------------------------------------------------


    private handlers = new Map<TimerHandler, CallbackRecords>();
}

class Entity extends TimerBase {
    private valid = true
    
    //get isValid(){return this.valid}

    constructor(public guid : string, public debugName? : string)
    {
        super()
        if (debugName === undefined)
        {
            debugName = guid;
        }
    }

    public log(text : string) : void{
        console.log('[%s]: %s', this.debugName, text)
    }
    public test() : number{
        return 1
    }
}

let e = new Entity("1234", "hero_male")

// [Function (anonymous)]
// {}
console.log(e.log)
console.log(e.log.prototype)

// [ 'constructor' ]
// {
//   constructor: {
//     value: [Function (anonymous)],
//     writable: true,
//     enumerable: false,
//     configurable: true
//   }
// }
console.log(Object.getOwnPropertyNames(e.log.prototype))
console.log(Object.getOwnPropertyDescriptors(e.log.prototype))

// [ 'constructor', 'log', 'test' ]
// {
//   constructor: {
//     value: [Function: Entity],
//     writable: true,
//     enumerable: true,
//     configurable: true
//   },
//   log: {
//     value: [Function (anonymous)],
//     writable: true,
//     enumerable: true,
//     configurable: true
//   },
//   test: {
//     value: [Function (anonymous)],
//     writable: true,
//     enumerable: true,
//     configurable: true
//   }
// }
console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(e)))
console.log(Object.getOwnPropertyDescriptors(Object.getPrototypeOf(e)))

// Found match test
e.delayOnce_TEST(100, e.test)

// Match not found function () { }
e.delayOnce_TEST(100, ()=>{})