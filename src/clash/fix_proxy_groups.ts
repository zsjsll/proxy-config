/*!
// 配合的模板 https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/config/clash/config_substore.yaml
脚本地址 https://accel.bigpig.online/https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/substore_script/clash/fix_proxy_groups.js#isHidden=true&aiExclude=HK|RU|JP|OTHER&num=1&aiFilerMode=exclude&showCount=true&healthCheckInterval=300

本脚本 可以传入参数：
[isHidden]:boolen 隐藏所有自动选择的节点
[showCount]:boolen 群组后面显示总数
[aiExclude]:string[] 传入ISO,'|' ',' ' ' 区分，比如 ai=HK|RU JP,US
[num] 最小成群数量，默认为1 表示1个都成群
[aiFilerMode]:'exclude'|'include' ai节点的过滤方式， 是通过排除 还是只包括
[healthCheckInterval] = 300 进行节点检测的间隔时间（s），如果为 0 ，所有的test都会禁用，包括 proxy-group 的 url-test 都会删除
*/

import { nameConvert, AreaList } from "../tools/i18n"
import {
  fixArray,
  fixBoolean,
  fixNumber,
  getContent,
  saveContent,
} from "../tools/base"

let {
  isHidden = false,
  num = 1,
  aiExclude = ["HK", "RU"],
  aiFilerMode = "exclude",
  showCount = false,
  healthCheckInterval = 300,
} = $arguments

aiExclude = fixArray(aiExclude)
isHidden = fixBoolean(isHidden)
showCount = fixBoolean(showCount)
num = fixNumber(num)
healthCheckInterval = fixNumber(healthCheckInterval)

if (!["exclude", "include"].includes(aiFilerMode))
  throw new Error("必须给aiFilerMode 赋值 'exclude'|'include'")

let content = getContent()

const template: ProxyGroup = {
  name: "template",
  type: "url-test",
  tolerance: 50,
  interval: healthCheckInterval,
  url: "https://www.gstatic.com/generate_204",
  "include-all": true,
  hidden: isHidden,
}

if (content.proxies === undefined)
  throw new Error("配置文件中没有 proxies, 请先导入")

// 生成需要的信息
const areaList: AreaList[] = Array.from(
  content.proxies
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
if (areaList.at(-1)!.isoCode !== "OTHER") {
  areaList.push(nameConvert.getIsoCode())
  areaList.at(-1)!.count = 0
}

// 过滤count小于阈值的节点，添加到其他节点中
const fixAreaList = areaList.filter((area) => {
  if (area.count < num) {
    areaList.at(-1)!.count = areaList.at(-1)!.count + area.count
    return false
  }
  return true
})

// 提取其他节点的过滤正则表达式
const excludeFilter = fixAreaList
  .filter((a) => a.isoCode !== "OTHER")
  .map((a) => a.regExp)
  .join("|")

// 生成新的代理群组
const proxyGroups: ProxyGroup[] = fixAreaList.map((area) => {
  let name = `${area.flag} ${area.zhName}节点`
  if (showCount) name = name + `(${String(area.count)})`
  return {
    ...template,
    name,
    filter: "(?i)" + area.regExp,
  }
})
if (proxyGroups.at(-1)!.filter === "(?i)") {
  delete proxyGroups.at(-1)!.filter
  proxyGroups.at(-1)!["exclude-filter"] = "(?i)" + excludeFilter
}

// 附加到旧群组上
content["proxy-groups"] = [...content["proxy-groups"], ...proxyGroups]

// 获取 修改AI节点相关的信息
const aiAreaList = fixAreaList.filter((area) =>
  aiExclude.every((kw) => area.isoCode !== kw)
)

const aiIncludeRegExp = aiAreaList.map((area) => area.regExp).join("|")

const aiExcludeRegExp = aiExclude
  .map((v) => nameConvert.getIsoCode(v).regExp)
  .join("|")

const aiRegExp = aiFilerMode === "exclude" ? aiExcludeRegExp : aiIncludeRegExp

// const aiSum = aiFilerMode === "exclude" ? aiExcludeSum : aiIncludeSum
const aiSum = aiAreaList.reduce((prev, curr) => prev + curr.count, 0)

// 获取新建的代理群组的所有名字，便于添加到符合条件的 proxies 中
const proxyGroupNameList = proxyGroups.map(
  (newProxyGroup) => newProxyGroup.name
)
const sum = fixAreaList.reduce((prev, curr) => prev + curr.count, 0)

for (const proxyGroup of content["proxy-groups"]) {
  // 修改 AI节点 的名字(添加节点总数)
  if (proxyGroup.name.includes("AI节点")) {
    if (proxyGroup["exclude-filter"]) delete proxyGroup["exclude-filter"]
    if (showCount) proxyGroup.name = `${proxyGroup.name}(${aiSum})`
    if (aiFilerMode === "include") proxyGroup.filter = "(?i)" + aiRegExp
    if (aiFilerMode === "exclude")
      proxyGroup["exclude-filter"] = "(?i)" + aiRegExp

    // proxyGroup.hidden = isHidden
    proxyGroup.url = template.url
  }

  // 修改 proxies 中含有 AI节点 的代理群组
  if (showCount) {
    proxyGroup.proxies?.map((proxy, index) => {
      if (proxy.includes("AI节点"))
        proxyGroup.proxies![index] = `${proxy}(${aiSum})`
    })
  }

  // 修改 自动选择 的隐藏属性
  // if (proxyGroup.name.includes("自动选择")) {
  //   proxyGroup.hidden = isHidden
  // }

  // 修改含有 关键字 的代理群组的名字(添加节点总数)
  if (showCount) {
    if (["自动选择", "手动选择"].some((kw) => proxyGroup.name.includes(kw))) {
      proxyGroup.name = `${proxyGroup.name}(${String(sum)})`
    }
  }

  // 修改 proxies 中含有 关键字 的代理群组
  if (showCount) {
    proxyGroup.proxies?.map((proxy, index) => {
      if (["自动选择", "手动选择"].some((kw) => proxy.includes(kw)))
        proxyGroup.proxies![index] = `${proxy}(${String(sum)})`
    })
  }

  // 在 proxies 中含有 手动选择 的代理群组的proxies中添加 自建代理群组
  if (proxyGroup.proxies?.some((val) => val.includes("手动选择"))) {
    proxyGroup.proxies?.push(...proxyGroupNameList)
  }
}

if (healthCheckInterval === 0) {
  const names = content["proxy-groups"]
    .filter((v) => v.type === "url-test")
    .map((v) => v.name)

  content["proxy-groups"] = content["proxy-groups"].filter(
    (v) => v.type !== "url-test"
  )

  content["proxy-groups"].map((v) => {
    if (names.some((name) => v.proxies?.includes(name)))
      v.proxies = v.proxies?.filter((p) => !names.includes(p))
  })
} else {
  content["proxy-groups"].map((v) => {
    if (v.type === "url-test") v.interval = healthCheckInterval
  })
}

// 保存
saveContent(content)
