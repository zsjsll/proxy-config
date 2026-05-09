import type { Airport } from "./@types/clash-config"
import Yaml2Json, { type AddNode } from "./modules/yaml2json"

const input = "../config/clash.yaml"
const output = "../dist"

const DELETE_PROPERTY: string[] = JSON.parse(Bun.env.DELETE_PROPERTY!)
const PROVIDERS_URL: string[] = JSON.parse(Bun.env.PROVIDERS_URL!)

const CHECK_URL: string = Bun.env.CHECK_URL!

const formatStringToNumber = (val: string) => (val.includes("*") ? val.split("*").reduce((prev, curr) => (prev *= Number(curr)), 1) : Number(val))
const PROVIDERS_INTERVAL: number = formatStringToNumber(Bun.env.PROVIDERS_INTERVAL!)
const CHECK_INTERVAL: number = formatStringToNumber(Bun.env.CHECK_INTERVAL!)

const format = true

const clash = new Yaml2Json(input, output)
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
clash.change(clash.search(["proxy-groups.*.url"]), CHECK_URL)
clash.change(clash.search(["proxy-providers.*.interval"]), PROVIDERS_INTERVAL)
clash.change(clash.search(["proxy-groups.*.interval"]), CHECK_INTERVAL)

await clash.save(format)
