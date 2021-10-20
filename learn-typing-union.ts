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
console.log("    purrs = " + (mixed as Cat).purrs)
console.log("    barks = " + (mixed as Dog).barks)

// 父类型强转子类型，慎用！
let animal: Animal = cat
console.log(animal.name + " is Animal")
console.log("    purrs = " + (animal as Cat).purrs)
console.log("    barks = " + (animal as Dog).barks)

let mixedAnimal: Animal = mixed
console.log(mixedAnimal.name + " is Animal")
// wrong let animalMixed: CatOrDogOrBoth = animal

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
*/