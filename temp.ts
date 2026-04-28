import YAML from "yaml"

// 读取一个较大的 YAML 文件作为测试数据
const source = await Bun.file("./config/clash.yaml").text()

// 1. 使用 parse() 直接解析成 JS 对象

console.time("parse")
const obj = YAML.parse(source)
console.timeEnd("parse")

// 2. 使用 parseDocument() + visit() 遍历 AST

console.time("parseDocument")
const doc = YAML.parseDocument(source)
console.timeEnd("parseDocument")

console.time("Bun.YAML")

const a = Bun.YAML.parse(source)
console.timeEnd("Bun.YAML")

console.log(a)

let g = 123

g ||= 1235
console.log("🚀 ~ g:", g)
