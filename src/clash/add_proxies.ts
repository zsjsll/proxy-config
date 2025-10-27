/*!
配合的模板 https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/config/clash/config_substore.yaml
脚本地址 https://accel.bigpig.online/https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/substore_script/clash/add_proxies.js#name=free&fixEmoji=true&type=collection&disableAutoTest=false

本脚本 可以传入参数：
[name] 为 substore 的订阅组合订阅名字
[fixEmoji]:boolen 修改其他节点的emoji为❓
[type]: "subscription"|"collection"
[urls]  机场链接   https://a.a.a  多个链接 用 '|' ',' ' ' 区分 如果存在这个参数 [name] 将无效，并且启用 proxy-providers 的模式进行订阅
[disableAutoTest] 是否进行节点检测，如果false，所有的test都会禁用，包括 proxy-group 的 url-test 都会删除
*/

import { fixArray, fixBoolean, getContent, saveContent } from "../tools/base"

let {
  name = "",
  fixEmoji = false,
  type = "subscription",
  urls = [] as string[],
  disableAutoTest = false,
} = $arguments

urls = fixArray(urls)
fixEmoji = fixBoolean(fixEmoji)
disableAutoTest = fixBoolean(disableAutoTest)

let content = getContent()

if (urls.length > 0 && name !== "") throw new Error("'name', 'urls' 二选一")

if (urls.length > 0) {
  let template: ProxyProvider = {
    url: "https://a.a.a/",
    type: "http",
    interval: 43200,
    "health-check": {
      enable: true,
      url: "https://www.gstatic.com/generate_204",
      interval: 180,
    },
    proxy: "DIRECT",
  }

  if (content["proxy-providers"]?.airport) {
    const head = urls.shift()!
    content["proxy-providers"].airport.url = head
    content["proxy-providers"].airport["health-check"].enable = true
    content["proxy-providers"].airport["health-check"].interval = 180
  }

  const proxyProviders = urls.reduce(
    (obj: { [K: string]: ProxyProvider }, url, index) => {
      const name = "airport" + index
      obj[name] = template
      obj[name].url = url
      return obj
    },
    {}
  )
  content["proxy-providers"] = {
    ...content["proxy-providers"],
    ...proxyProviders,
  }
}

let pList: Proxies
if (name !== "") {
  pList = await produceArtifact({
    name: name,
    type: type as Type,
    platform: "ClashMeta",
    produceType: "internal",
    produceOpts: {
      "include-unsupported-proxy": true,
    },
  })

  if (fixEmoji) {
    pList.map((p) => {
      p.name = p.name.replace("🏴‍☠️", "❓")
    })
    console.log("🚀 ~ pList:", pList)
  }
  content = { proxies: pList, ...content }
}

if (disableAutoTest) {
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
}

saveContent(content)
