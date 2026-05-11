const o = { a: 1, b: 2, c: 3 }

function a() {
  return { oo: o, text: JSON.stringify(o) }
}

const { oo } = a()

oo.a = 123123

console.log(o)

console.log(typeof undefined === "object")
