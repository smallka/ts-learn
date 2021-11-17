export {}
console.log('------------------ entity-base ------------------')

type TimerHandler = number

class TimerManager
{
    // TODO 真正的Timer逻辑还没写呢

    public delayOnce(ms : number, callback : Function) : TimerHandler // TODO 这里还要再记录一个entity？才能够清理对应的handler？
    {
        this.currentIdx += 1
        this.timerMap.set(this.currentIdx, callback)
        return this.currentIdx;
    }

    public delete(handler : TimerHandler | Set<TimerHandler>)
    {
        if (handler instanceof Set)
        {
            handler.forEach(element => {
                this.timerMap.delete(element);
            });
        }
        else
        {
            this.timerMap.delete(handler);
        }
    }

    private timerMap = new Map<number, Function>();
    private currentIdx = 0;
}

let TimerManagerInstance = new TimerManager();

class TimerBase
{
    public delayOnceLearn(ms : number, callback : Function)
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

    public delayOnce(ms : number, callback : Function) : TimerHandler
    {
        let foundCallback = false;

        if (!foundCallback)
        {
            throw new Error('Callback should be class function');
        }

        let handler = TimerManagerInstance.delayOnce(ms, Function);
        this.handlers.add(handler);
        return handler;
    }

    public onCallback(handler : number) // TODO 如果调用了这个函数，是不是timer就记在自己这里更好？
    {
        this.handlers.delete(handler)
    }

    public clearAllTimer()
    {
        TimerManagerInstance.delete(this.handlers);
    }

    private handlers = new Set<number>();
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
e.delayOnceLearn(100, e.test)

// Match not found function () { }
e.delayOnceLearn(100, ()=>{})