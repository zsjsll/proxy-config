import type { Airport } from "./@types/clash-config"
import Clash, { type AddNode } from "./module/clash"

const input = "../config/clash.yaml"
const output = "../dist"

const DELETE_PROPERTY: string[] = JSON.parse(Bun.env.DELETE_PROPERTY!)
const PROVIDERS_URL: string[] = JSON.parse(Bun.env.PROVIDERS_URL!)

const HEALTH_CHECK_URL: string = Bun.env.HEALTH_CHECK_URL!

const formatStringToNumber = (val: string) => (val.includes("*") ? val.split("*").reduce((prev, curr) => (prev *= Number(curr)), 1) : Number(val))
const PROVIDERS_INTERVAL: number = formatStringToNumber(Bun.env.PROVIDERS_INTERVAL!)
const HEALTH_CHECK_INTERVAL: number = formatStringToNumber(Bun.env.HEALTH_CHECK_INTERVAL!)

const format = true

const clash = new Clash(input, output)
await clash.load()

// 删除不需要的模块
clash.delete(clash.search(DELETE_PROPERTY))

// clash.change(clash.search(["proxy-providers"]), (proxyProviders: ProxyProviders) => {
//   for (const [i, v] of PROVIDERS_URL.entries()) {
//     const key = `airport${i.toString()}`
//     proxyProviders[key] = { ...proxyProviders.airport, url: v }
//   }
//   proxyProviders.airport = undefined!
//   return proxyProviders
// })

// 添加订阅 并把模板删除
const s = clash.search(["proxy-providers.airport"])
clash.add(s, (airport: Airport) => {
  const addNodes: AddNode[] = []
  for (const [i, v] of PROVIDERS_URL.entries()) {
    const key = `airport${i.toString()}`
    const value = { ...airport, url: v }
    addNodes.push({ key, value })
  }
  return addNodes
})
clash.delete(s)

// 修改部分参数
// clash.change(clash.search(["proxy-providers.*.health-check.url", "proxy-groups.*.url"]), HEALTH_CHECK_URL)
// clash.change(clash.search(["proxy-providers.*.interval"]), PROVIDERS_INTERVAL)
// clash.change(clash.search(["proxy-providers.*.health-check.interval", "proxy-groups.*.interval"]), HEALTH_CHECK_INTERVAL)

await clash.save(format)
