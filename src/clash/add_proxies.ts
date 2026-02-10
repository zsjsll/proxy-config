/*!
配合的模板 https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/config/clash/config_substore.yaml
脚本地址 https://accel.bigpig.online/https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/dist/clash/add_proxies.js#name=free&fixEmoji=true&type=collection&disableAutoTest=false

本脚本 可以传入参数：
[name] 为 substore 的订阅组合订阅名字
[fixEmoji] = false 修改其他节点的emoji为❓
[type]: "subscription"|"collection" = subscription
[urls]: string  机场链接   https://a.a.a  多个链接 用 '|' ',' ' ' 区分 如果存在这个参数 [name] 将无效，并且启用 proxy-providers 的模式进行订阅

*/

import { fixArray, fixBoolean, getContent, saveContent } from "../tools/base"

let { name = "", fixEmoji = false, type = "subscription", urls = [] as string[] } = $arguments

urls = fixArray(urls)
fixEmoji = fixBoolean(fixEmoji)

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
      interval: 300,
    },
    proxy: "DIRECT",
  }

  const proxyProviders = urls.reduce((obj: { [K: string]: ProxyProvider }, url, index) => {
    let name: string = "airport"
    if (index !== 0) name = name + index
    obj[name] = { ...template, url }
    return obj
  }, {})

  content["proxy-providers"] = proxyProviders
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

saveContent(content)
