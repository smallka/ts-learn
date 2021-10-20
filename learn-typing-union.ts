import { DotDotDotToken } from "typescript"

export {}
console.log("------------------ learn-typing-union ------------------")

type Animal = { name: string }
type Cat = Animal & { purrs: boolean }
type Dog = Animal & { barks: boolean }
type CatOrDogOrBoth = Cat | Dog

let cat: Cat = {
    name: "cat", 
    purrs: true,
}
console.log(cat.name + " is Cat")
console.log("    purrs = " + cat.purrs)

let dog: Dog = {
    name: "dog",
    barks: true,
}
console.log(dog.name + " is Dog")
console.log("    barks = " + dog.barks)

let maybeCat: CatOrDogOrBoth = cat;
console.log(maybeCat.name + " is CatOrDogOrBoth")
console.log("    purrs = " + maybeCat.purrs)
// wrong console.log("    barks = " + (maybeCat as Dog).barks)

let mixed: CatOrDogOrBoth = {
    name: "mixed",
    purrs: true,
    barks: true,
}
console.log(mixed.name + " is CatOrDogOrBoth")
// wrong console.log("    purrs = " + mixed.purrs)
// 父类型强转子类型，慎用！
console.log("    purrs = " + (mixed as Cat).purrs)
console.log("    barks = " + (mixed as Dog).barks)

let animal: Animal = cat
console.log(animal.name + " is Animal")
// 父类型强转子类型，慎用！
console.log("    purrs = " + (animal as Cat).purrs)
console.log("    barks = " + (animal as Dog).barks)

let mixedAnimal: Animal = mixed
console.log(mixedAnimal.name + " is Animal")

// wrong let animalMixed: CatOrDogOrBoth = animal
console.log("animal is not CatOrDogOrBoth")

type Both = Cat & Dog
let both: Both = {
    name: "both",
    purrs: true,
    barks: true,
}
console.log(both.name + " is Both")

let bothMixed: CatOrDogOrBoth = both;
console.log(bothMixed.name + " is CatOrDogOrBoth")

// wrong let both: Both = mixed
console.log("mixed is not Both")

type Mouse = Animal & { squeak: boolean }
type ThreeUnion = Cat | Dog | Mouse

let mixedThree: ThreeUnion = mixed
console.log(mixedThree.name + " is ThreeUnion")
console.log("    purrs = " + (mixedThree as Cat).purrs)
// wrong console.log("    squeak = " + (mixedThree as Mouse).squeak)

let bothThree: ThreeUnion = both
console.log(bothThree.name + " is ThreeUnion")
// wrong console.log("    purrs = " + bothThree.purrs)
console.log("    purrs = " + (bothThree as Cat).purrs)

/* output
cat is Cat
    purrs = true
dog is Dog
    barks = true
cat is CatOrDogOrBoth
    purrs = true
mixed is CatOrDogOrBoth
    purrs = true
    barks = true
cat is Animal
    purrs = true
    barks = undefined
mixed is Animal
animal is not CatOrDogOrBoth
both is Both
both is CatOrDogOrBoth
mixed is not Both
mixed is ThreeUnion
    purrs = true
both is ThreeUnion
    purrs = true
*/