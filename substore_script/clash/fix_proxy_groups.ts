/*!
// 配合的模板 https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/config/clash/config_substore.yaml
脚本地址 https://accel.bigpig.online/https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/substore_script/clash/fix_proxy_groups.js#isHidden&aiExclude=HK|RU|JP&num=1&isExt

本脚本 可以传入参数：
[isHidden]:boolen 隐藏所有自动选择的节点
[aiExclude] 传入ISO,'|' ',' ' ' 区分，比如 ai=HK|RU JP,US
[num] 最小成群数量，默认为1 表示1个都成群
[isExt]:boolen 是否根据 proxies 进行节点分类， 比如 [美国节点] [日本节点] 等等
*/

import { nameConvert, AreaList } from "../tools/i18n"

let { isHidden = false, num = 1, aiExclude = "HK|RU", isExt = false } = $arguments

let content: Config = ProxyUtils.yaml.safeLoad($content)

const template: ProxyGroup = {
  name: "template",
  type: "url-test",
  tolerance: 20,
  interval: 60,
  url: "https://www.gstatic.com/generate_204",
  "include-all": true,
  hidden: Boolean(isHidden),
}

if (content.proxies === undefined) throw new Error("配置文件中没有 proxies, 请先导入")

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
if (areaList.at(-1)!.isoCode !== "") {
  areaList.push(nameConvert.getIsoCode())
  areaList.at(-1)!.count = 0
}

// 过滤count小于阈值的节点，添加到其他节点中
const fixAreaList = areaList.filter((area) => {
  if (area.count < Number(num)) {
    areaList.at(-1)!.count = areaList.at(-1)!.count + area.count
    return false
  }
  return true
})

// 提取其他节点的过滤正则表达式
const excludeFilter = fixAreaList
  .map((a) => a.regExp)
  .filter((a) => a !== "")
  .join("|")

// 生成新的代理群组
const proxyGroups: ProxyGroup[] = fixAreaList.map((area) => {
  return {
    ...template,
    name: `${area.flag} ${area.zhName}节点(${String(area.count)})`,
    filter: "(?i)" + area.regExp,
  }
})
if (proxyGroups.at(-1)!.filter === "(?i)") {
  delete proxyGroups.at(-1)!.filter
  proxyGroups.at(-1)!["exclude-filter"] = "(?i)" + excludeFilter
}

// 附加到旧群组上
if (!!isExt) content["proxy-groups"] = [...content["proxy-groups"], ...proxyGroups]

// 获取 修改AI节点相关的信息
const aiAreaList = fixAreaList.filter((area) => aiExclude.split(/[|, ]/).every((kw) => area.isoCode !== kw))

const aiRegExp = aiAreaList.map((area) => area.regExp).join("|")
const aiSum = aiAreaList.reduce((prev, curr) => prev + curr.count, 0) - (fixAreaList.at(-1)!.isoCode === "" ? fixAreaList.at(-1)!.count : 0) //过滤其他节点

// 获取新建的代理群组的所有名字，便于添加到符合条件的 proxies 中
const proxyGroupNameList = proxyGroups.map((newProxyGroup) => newProxyGroup.name)
const sum = fixAreaList.reduce((prev, curr) => prev + curr.count, 0)

for (const proxyGroup of content["proxy-groups"]) {
  // 修改 AI节点 的名字(添加节点总数)
  if (proxyGroup.name.includes("AI节点")) {
    proxyGroup.name = `${proxyGroup.name}(${String(aiSum)})`
    proxyGroup.filter = "(?i)" + aiRegExp
    proxyGroup.hidden = Boolean(isHidden)
    if (proxyGroup["exclude-filter"]) delete proxyGroup["exclude-filter"]
    proxyGroup.url = template.url
  }

  // 修改 proxies 中含有 AI节点 的代理群组
  proxyGroup.proxies?.map((proxy, index) => {
    if (proxy.includes("AI节点")) proxyGroup.proxies![index] = `${proxy}(${String(aiSum)})`
  })

  // 修改 自动选择 的隐藏属性
  if (proxyGroup.name.includes("自动选择")) {
    proxyGroup.hidden = Boolean(isHidden)
  }

  // 修改含有 关键字 的代理群组的名字(添加节点总数)
  if (["自动选择", "手动选择"].some((kw) => proxyGroup.name.includes(kw))) {
    proxyGroup.name = `${proxyGroup.name}(${String(sum)})`
    proxyGroup.url = template.url
  }

  // 修改 proxies 中含有 关键字 的代理群组
  proxyGroup.proxies?.map((proxy, index) => {
    if (["自动选择", "手动选择"].some((kw) => proxy.includes(kw))) proxyGroup.proxies![index] = `${proxy}(${String(sum)})`
  })

  if (Boolean(!isExt)) continue
  // 在 proxies 中含有 手动选择 的代理群组的proxies中添加 自建代理群组
  if (isExt && proxyGroup.proxies?.some((val) => val.includes("手动选择"))) {
    proxyGroup.proxies?.push(...proxyGroupNameList)
  }
}

// 保存
$content = ProxyUtils.yaml.safeDump(content)
