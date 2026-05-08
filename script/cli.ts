import Clash from "./module/clash"

const input = "../config/clash.yaml"
const output = "../dist"

const DELETE_PROPERTY: string[] = JSON.parse(Bun.env.DELETE_PROPERTY!)
const PROVIDERS_URL: string[] = JSON.parse(Bun.env.PROVIDERS_URL!)

const HEALTH_CHECK_URL: string = Bun.env.HEALTH_CHECK_URL!

const PROVIDERS_INTERVAL: string = Bun.env.PROVIDERS_INTERVAL!
const HEALTH_CHECK_INTERVAL: number = JSON.parse(Bun.env.HEALTH_CHECK_INTERVAL!)

// const argv = Bun.argv.slice(2)
// const format = Boolean(argv.some((v) => v === "-f"))
const format = true

const clash = new Clash(input, output)
await clash.load()

// 删除不需要的模块
clash.delete(clash.search(DELETE_PROPERTY))

clash.change(clash.search(["proxy-providers"]), (proxyProviders: ProxyProviders) => {
  for (const [i, v] of PROVIDERS_URL.entries()) {
    const key = `airport${i.toString()}`
    proxyProviders[key] = { ...proxyProviders.airport }
    proxyProviders[key].url = v
  }
  proxyProviders.airport = undefined!

  return proxyProviders
})

await clash.save(format)
