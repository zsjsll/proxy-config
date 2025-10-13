// 配合的模板 https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/config/clash/config_substore.yaml
// 脚本地址 https://accel.bigpig.online/https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/substore_script/clash/add_proxies.js#name=free&fixEmoji

// 本脚本 可以传入参数：
//  [name] 为 substore 的订阅组合订阅名字
// [fixEmoji]:boolen 修改其他节点的emoji为❓

export {}

let { name = "airport", fixEmoji = false } = $arguments

const pList = await produceArtifact({
  name: name,
  type: "collection",
  platform: "ClashMeta",
  produceType: "internal",
  produceOpts: {
    "include-unsupported-proxy": true,
  },
})

let content = ProxyUtils.yaml.safeLoad($files[0])

if (content["proxy-providers"] !== undefined) {
  delete content["proxy-providers"]
}

if (Boolean(fixEmoji)) {
  pList.forEach((p) => {
    p.name = p.name.replace("🏴‍☠️", "❓")
  })
  console.log("🚀 ~ pList:", pList)
}

content = { proxies: pList, ...content }

$content = ProxyUtils.yaml.safeDump(content)
