const o = { a: 1, b: undefined }

if (typeof o.b === "undefined") {
  console.log(123)
}

const aa = "🇭🇰 香港节点"
const b = aa.match(/^(..)/u)

console.log(b)

// // const filter = "(?i)(🇭🇰|港|hk|hong ?kong)".match(/(?<=\(..\)\().*(?=\))/)
// const filter = "(?i)(🇭🇰|港|hk|hong ?kong)".match(/^\(.*\((.*?)\)/)

// // console.log([...filter])
// console.log(filter[1])

const arr = [1, 2, 3, undefined]

const a = arr.filter((ele) => {
  if (typeof ele !== "undefined") return ele
})
console.log(a)


const c="false"
console.log(boo)
