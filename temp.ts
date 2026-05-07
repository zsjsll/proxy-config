const o = { a: { b: { c: 1 } }, d: 2, c: null }
const o2 = { a: { b: { c: 1 } }, d: 2, c: undefined }

const { a, d, c } = o2
console.log(c)
