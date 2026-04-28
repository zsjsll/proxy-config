import YAML from "yaml"

// 读取一个较大的 YAML 文件作为测试数据
const source = await Bun.file("./config/clash.yaml").text()

// 1. 使用 parse() 直接解析成 JS 对象

console.time("parse+walk")
console.time("parse")
const obj = YAML.parse(source)
console.timeEnd("parse")
let count1 = 0
function traverseObj(o) {
  // if (Array.isArray(o)) {
  //   for (const v of o) traverseObj(v)
  // } else if (o && typeof o === "object") {
  //   for (const k in o) traverseObj(o[k])
  // } else {
  //   count1++
  // }
  o["tun"] = undefined

}
traverseObj(obj)
console.timeEnd("parse+walk")
console.log("parse 遍历节点数:", count1)

// 2. 使用 parseDocument() + visit() 遍历 AST
console.time("parseDocument+visit")
console.time("parseDocument")
const doc = YAML.parseDocument(source)
console.timeEnd("parseDocument")
let count2 = 0
// YAML.visit(doc, {
//   Pair() {
//     count2++
//   },
// })

doc.deleteIn(['tun','enable'])
// console.log(doc.toString())
console.timeEnd("parseDocument+visit")
console.log("parseDocument+visit 遍历节点数:", count2)
