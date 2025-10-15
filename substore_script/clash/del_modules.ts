/*!
https://accel.bigpig.online/https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/substore_script/clash/del_modules.js#del=tun

参数：
[modules] :string,'|' ',' ' ' 区分，比如 ai=tun|dns,proxies
*/

let { modules } = $arguments

const del = modules.split(/[|, ]/)

let content: Config = ProxyUtils.yaml.safeLoad($content)

del.forEach((m) => {
  if (content[m]) delete content[m]
})

$content = ProxyUtils.yaml.safeDump(content)
