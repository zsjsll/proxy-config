/*!
https://accel.bigpig.online/https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/substore_script/clash/del_modules.js#del=tun,proxy-providers

参数：
[modules] :string,'|' ',' ' ' 区分，比如 ai=tun|dns,proxies
*/

import { fixArray } from "../tools/fixparms"

let { del = [""] } = $arguments

del = fixArray(del)

let content: Config = ProxyUtils.yaml.safeLoad($content)

del.map((m) => {
  if (content[m]) delete content[m]
})

$content = ProxyUtils.yaml.safeDump(content)
