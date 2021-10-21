import { type } from "os"
import { DotDotDotToken } from "typescript"

export {}
console.log("------------------ learn-typing-union ------------------")

// 子类型
type Animal = { name: string }
type Cat = Animal & { purrs: boolean }
type Dog = Animal & { barks: boolean }
type CatOrDogOrBoth = Cat | Dog

let cat: Cat = {
    name: "cat", 
    purrs: true,
}
let dog: Dog = {
    name: "dog",
    barks: true,
}
let mixed: CatOrDogOrBoth = {
    name: "mixed",
    purrs: true,
    barks: true,
}

console.log(cat.name + " is Cat")
console.log("    purrs = " + cat.purrs)

console.log(dog.name + " is Dog")
console.log("    barks = " + dog.barks)

// 类型推断出来是猫
let maybeCat: CatOrDogOrBoth = cat;
console.log(maybeCat.name + " is CatOrDogOrBoth")
console.log("    purrs = " + maybeCat.purrs)
// WRONG console.log("    barks = " + (maybeCat as Dog).barks)

console.log(mixed.name + " is CatOrDogOrBoth")
// WRONG console.log("    purrs = " + mixed.purrs)
// 父类型强转子类型，慎用！
console.log("    purrs as Cat = " + (mixed as Cat).purrs)
console.log("    barks as Dog = " + (mixed as Dog).barks)

let animal: Animal = cat
console.log(animal.name + " is Animal")
// 父类型强转子类型，慎用！
console.log("    purrs as Cat = " + (animal as Cat).purrs)
console.log("    barks as Dog = " + (animal as Dog).barks)

let mixedAnimal: Animal = mixed
console.log(mixedAnimal.name + " is Animal")

// WRONG let animalMixed: CatOrDogOrBoth = animal
console.log("animal is not CatOrDogOrBoth")

type Both = Cat & Dog
let both: Both = {
    name: "both",
    purrs: true,
    barks: true,
}
console.log(both.name + " is Both")
console.log("    purrs = " + both.purrs)
console.log("    barks = " + both.barks)

let bothMixed: CatOrDogOrBoth = both;
console.log(bothMixed.name + " is CatOrDogOrBoth")
// WRONG console.log("    purrs = " + bothMixed.purrs)

// WRONG let both: Both = mixed
console.log("mixed is not Both")

type Mouse = Animal & { squeak: boolean }
type ThreeUnion = Cat | Dog | Mouse

let mixedThree: ThreeUnion = mixed
console.log(mixedThree.name + " is ThreeUnion")
console.log("    purrs as Cat = " + (mixedThree as Cat).purrs)
// WRONG console.log("    squeak = " + (mixedThree as Mouse).squeak)

let bothThree: ThreeUnion = both
console.log(bothThree.name + " is ThreeUnion")
// WRONG console.log("    purrs = " + bothThree.purrs)
console.log("    purrs as Cat = " + (bothThree as Cat).purrs)

// 类型细化
type TypeA = { type: "A", p1: string, p2: number, p3: number}
type TypeB = { type: "B", p1: number, p2: string, p3: string}
function showBad(bad: TypeA | TypeB) {
    // WRONG if (typeof bad.p1 == "string")
    // WRONG if (typeof bad.p1 == "string" && typeof bad.p2 == "number")
    // RIGHT if (typeof bad.p3 == "number")
    if (bad.type == "A")
    {
        console.log(bad.p3 + 1)
    }
}

/* output
cat is Cat
    purrs = true
dog is Dog
    barks = true
cat is CatOrDogOrBoth
    purrs = true
mixed is CatOrDogOrBoth
    purrs as Cat = true
    barks as Dog = true
cat is Animal
    purrs as Cat = true
    barks as Dog = undefined
mixed is Animal
animal is not CatOrDogOrBoth
both is Both
    purrs = true
    barks = true
both is CatOrDogOrBoth
mixed is not Both
mixed is ThreeUnion
    purrs as Cat = true
both is ThreeUnion
    purrs as Cat = true
*/