// 1. Функция, возвращающая 1-й элемент массива
// Напишите функцию, которая принимает массив элементов любого типа и возвращает первый элемент массива.
//
// const getFirstElement = <T>(array: T[]): T => {
//   return array[0]
// }
//
// // Пример 1: Массив чисел
// const numbers = [1, 2, 3, 4, 5]
// console.log(getFirstElement(numbers)) // 1
//
// // Пример 2: Массив строк
// const words = ["hello", "world", "typescript"]
// console.log(getFirstElement(words)) // 'hello'


// 2. Универсальная функция фильтра массива
// Напишите дженериковую функцию filterArray, принимающую массив элементов любого типа и функцию-предикат(predicate) ✳️, и возвращающую новый массив, состоящий из элементов, удовлетворяющих условию.
//
// ✳️ Функция-предикат - функция, возвращающая булевое значение.
//
// Требования:
//
// функция должна быть дженериковой и работать с массивами любого типа;
// функция-предикат принимает элемент массива и возвращает boolean;
// если ни один элемент массива не удовлетворяет условию, функция должна возвращать пустой массив:

// const filterArray = <T>(array: T[], predicate: (value: T) => boolean): T[] => {
//   return array.filter(predicate)
// }
//
// // Пример 1: Фильтрация чисел
// const numbers = [1, 2, 3, 4, 5]
// const isEven = (num: number) => num % 2 === 0
//
// console.log(filterArray(numbers, isEven)) // [2, 4]
//
// // Пример 2: Фильтрация строк
// const words = ['hello', 'world', 'typescript']
// const startsWithT = (word: string) => word.startsWith('t')
//
// console.log(filterArray(words, startsWithT)) // ["typescript"]


// 3. Универсальная функция преобразования элементов массива
// Напишите дженериковую функцию mapArray, принимающую массив элементов любого типа и функцию-преобразователь (transform), применяющую эту функцию к каждому элементу массива, и возвращающую новый массив с результатами преобразований:
//
// const mapArray = <T, D>(array: T[], transform: (value: T) => D): D[] => {
//   return array.map(transform)
// }
//
// // Пример 1: Преобразование чисел в строки
// const numbers = [1, 2, 3, 4]
// const transformNumberToString = (num: number) => `Number: ${num}`
//
// console.log(mapArray(numbers, transformNumberToString)) // ["Number: 1", "Number: 2", "Number: 3", "Number: 4"]
//
// // Пример 2: Преобразование строк в их длины
// const words = ['hello', 'world', 'typescript']
// const getLength = (word: string) => word.length
//
// console.log(mapArray(words, getLength)) // [5, 5, 10]
//
// // Пример 3: Преобразование объектов в строки
// type Person = { name: string; age: number }
// const people: Person[] = [
//   { name: 'Agnes', age: 25 },
//   { name: 'Robert', age: 30 },
// ]
// const toDescription = (person: Person) => `${person.name} is ${person.age} years old`
//
// console.log(mapArray(people, toDescription)) // ["Agnes is 25 years old", "Robert is 30 years old"]


// 4. Реализация универсальной функции для работы с массивами с использованием дженериков (задача)
// Необходимо создать дженериковую функцию, принимающую массив любого типа и значение того же типа. Функция должна вернуть массив без изменений, если значение уже есть в массиве, а если нет - новый массив с добавленным значением.
//
// Требования:
//
// функция должна быть дженериковой и работать с массивами любого типа;
// для проверки наличия элемента в массиве используйте метод includes;
// типы массива и элемента должны быть связаны через дженерики;
// функция должна быть чистой (не должна изменять оригинальный массив):

const updateArray = <T,>(array: T[], value: T): T[] => {
  return array.includes(value) ? array : [...array, value]
}

// Строки
const stringArray = ["apple", "banana", "cherry"]
console.log(updateArray(stringArray, "banana")) // ['apple', 'banana', 'cherry']
console.log(updateArray(stringArray, "strawberry")) // ['apple', 'banana', 'cherry', 'strawberry']

// Числа
const numberArray = [1, 2, 3]
console.log(updateArray(numberArray, 2)) // [1, 2, 3]
console.log(updateArray(numberArray, 4)) // [1, 2, 3, 4]