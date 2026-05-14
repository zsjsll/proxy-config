import { array } from "valibot"

const o = { a: 1, b: 2, c: 3 }

function a() {
  return { oo: o, text: JSON.stringify(o) }
}

const { oo } = a()

oo.a = 123123

console.log(o)

console.log(typeof undefined === "object")

const promise = new Promise((resolve) => {
  resolve("成功")
  // 没有调用 reject
})

function aaa() {
  promise.then((result) => console.log("then:", result)).catch((error) => console.log("catch:", error))
}

function find(fn: (...arg: string[]) => void) {
  if (typeof fn === "function") {
    fn()
  }
}

function hello(vb: any) {
  console.log(vb)
}

find(hello)

const foo = [].map(hello)

;[].forEach(hello)
