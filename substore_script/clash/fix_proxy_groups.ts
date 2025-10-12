import nameConvert from "../module/i18n"

export {}

let { isHidden = false } = $arguments

let content: Config = ProxyUtils.yaml.safeLoad($content)

if (content.proxies === undefined) throw new Error("配置文件中没有 proxies, 请先导入")

let pList = content.proxies

let areaInfoList: AreaInfo[] = pList.map((element) => {
  const a = nameConvert.getIsoCode(element.name)
  const b = { ...a, count: 1 }
  return b
})
// 排序
areaInfoList = areaInfoList.sort((a, b) => {
  if (typeof a.index === "undefined") return 1
  if (typeof b.index === "undefined") return -1
  return a.index - b.index
})

console.log(123123123)
console.log(areaInfoList)


// // 转存Map
// const map = areaInfoList.reduce((prev: Map<number, (typeof areaInfoList)[number]>, curr) => {
//   const key = curr.index
//   if (prev.has(key)) {
//     const obj = prev.get(key)!
//     obj.count = obj.count + 1
//   } else prev.set(key, curr)

//   return prev
// }, new Map())

// const a = [...map.values()]
