const a = ["1", "2", "3", "4"]

const b = ["a", "b", "c", ...(false && a)]

console.log(b)
