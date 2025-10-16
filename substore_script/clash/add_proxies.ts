/*!
配合的模板 https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/config/clash/config_substore.yaml
脚本地址 https://accel.bigpig.online/https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/substore_script/clash/add_proxies.js#name=free&fixEmoji&type=collection

本脚本 可以传入参数：
[name] 为 substore 的订阅组合订阅名字
[fixEmoji]:boolen 修改其他节点的emoji为❓
[type]: "subscription"|"collection" 修改其他节点的emoji为❓
[urls]  机场链接   https://a.a.a  多个链接 用 '|' ',' ' ' 区分 如果存在这个参数 sutstore 的订阅将无效，并且启用 proxy-providers 的模式进行订阅
*/

import { fixBoolen } from "../tools/fixparms"

let { name = "airport", fixEmoji = false, type = "subscription", urls } = $arguments

fixEmoji = fixBoolen(fixEmoji)

const pList = await produceArtifact({
  name: name,
  type: type as Type,
  platform: "ClashMeta",
  produceType: "internal",
  produceOpts: {
    "include-unsupported-proxy": true,
  },
})

let content = ProxyUtils.yaml.safeLoad($files[0])

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

if (Boolean(fixEmoji)) {
  pList.map((p) => {
    p.name = p.name.replace("🏴‍☠️", "❓")
  })
  console.log("🚀 ~ pList:", pList)
}

if (urls) {
  if (content["proxy-providers"]) throw new Error("请先删除 proxy-providers")

  const proxyProviders = urls.split(/[|, ]/).reduce((obj: { [K: string]: ProxyProvider }, url, index) => {
    const name = "airport" + index
    obj[name] = template
    obj[name].url = url
    return obj
  }, {})
  content["proxy-providers"] = proxyProviders
} else {
  content = { proxies: pList, ...content }
}

$content = ProxyUtils.yaml.safeDump(content)
