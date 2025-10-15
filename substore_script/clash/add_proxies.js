/*!
配合的模板 https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/config/clash/config_substore.yaml
脚本地址 https://accel.bigpig.online/https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/substore_script/clash/add_proxies.js#name=free&fixEmoji&type=collection

本脚本 可以传入参数：
[name] 为 substore 的订阅组合订阅名字
[fixEmoji]:boolen 修改其他节点的emoji为❓
[type]: "subscription"|"collection" 修改其他节点的emoji为❓
*/var{name:r="airport",fixEmoji:p=!1,type:a="subscription"}=$arguments,o=await produceArtifact({name:r,type:a,platform:"ClashMeta",produceType:"internal",produceOpts:{"include-unsupported-proxy":!0}}),e=ProxyUtils.yaml.safeLoad($files[0]);e["proxy-providers"]!==void 0&&delete e["proxy-providers"];p&&o.forEach(t=>{t.name=t.name.replace("\u{1F3F4}\u200D\u2620\uFE0F","\u2753")});e={proxies:o,...e};$content=ProxyUtils.yaml.safeDump(e);
