/*!
配合的模板 https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/config/clash/config_substore.yaml
脚本地址 https://accel.bigpig.online/https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/substore_script/clash/change_health_check.js#interval=43200&url=https://www.gstatic.com/generate_204&healthCheckInterval=300

本脚本 可以传入参数：
[interval] =43200 节点 provider 的更新间隔
[url] = "https://www.gstatic.com/generate_204" 健康检测的 url
[healthCheckInterval] = 300 进行节点检测的间隔时间（s），如果为 0 ，所有的test都会禁用，包括 proxy-group 的 url-test 都会删除
*/

import { getContent, saveContent, fixNumber } from "../tools/base"

let {
  interval = 43200,
  url = "https://www.gstatic.com/generate_204",
  healthCheckInterval = 300,
} = $arguments

healthCheckInterval = fixNumber(healthCheckInterval)
interval = fixNumber(interval)

let content = getContent()
// 修改 providers
if (content["proxy-providers"]) {
  Object.values(content["proxy-providers"]).map((val) => {
    val.interval = interval
    val["health-check"].enable = healthCheckInterval !== 0
    val["health-check"].url = url
    val["health-check"].interval = healthCheckInterval
  })
}

// 修改 groups
content["proxy-groups"].map((v) => {
  if (v.type === "url-test") v.interval = healthCheckInterval
})
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
}

saveContent(content)
