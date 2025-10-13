import { nameConvert, AreaList } from "../module/i18n"

export {}

let { isHidden = false, num = 1 } = $arguments

let content: Config = ProxyUtils.yaml.safeLoad($content)

const defProxyGroup: ProxyGroup = {
  name: "template",
  type: "url-test",
  tolerance: 20,
  interval: 60,
  url: "https://www.google.com/generate_204",
  "include-all": true,
  hidden: Boolean(isHidden),
}

if (content.proxies === undefined) throw new Error("配置文件中没有 proxies, 请先导入")

let pList = content.proxies

const areaList: AreaList[] = Array.from(
  pList
    .map((element) => nameConvert.getIsoCode(element.name))
    .sort((a, b) => a.index - b.index) // 排序
    .reduce((prev: Map<number, AreaList>, curr) => {
      const key = curr.index
      if (prev.has(key)) {
        const obj = prev.get(key)!
        obj.count = obj.count + 1
      } else prev.set(key, curr)

      return prev
    }, new Map())
    .values()
)

// 在最后添加一个空的元素 用于统计过滤的节点信息
if (areaList.at(-1)!.isoCode !== "") {
  areaList.push(nameConvert.getIsoCode())
  areaList.at(-1)!.count = 0
}

// 过滤count小于阈值的节点，添加到其他节点中
const filterAreaList = areaList.filter((area) => {
  if (area.count < Number(num)) {
    areaList.at(-1)!.count = areaList.at(-1)!.count + area.count
    return false
  }
  return true
})

// 提取其他节点的过滤正则表达式
const excludeFilter = filterAreaList
  .map((a) => a.regExp)
  .filter((a) => a !== "")
  .join("|")

const fixAreaList = filterAreaList.map((area) => {
  if (area.isoCode === "") area.regExp = "(?i)" + excludeFilter
  else area.regExp = "(?i)" + area.regExp
  return area
})

const newProxyGroups: ProxyGroup[] = filterAreaList.map((area) => ({
  ...defProxyGroup,
  name: `${area.flag} ${area.zhName}节点(${String(area.count)})`,
  filter: `(?i)${area.regExp}`,
}))
if (newProxyGroups.at(-1)!.filter === "(?i)") {
  delete newProxyGroups.at(-1)!.filter
  newProxyGroups.at(-1)!["exclude-filter"] = `(?i)${excludeFilter}`
}

content["proxy-groups"] = { ...content["proxy-groups"], ...newProxyGroups }
