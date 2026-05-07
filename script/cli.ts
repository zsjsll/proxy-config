import Clash from "./module/clash"

const input = "../config/clash.yaml"
const output = "../dist"

// const argv = Bun.argv.slice(2)
// const format = Boolean(argv.some((v) => v === "-f"))
const format = true

const clash = new Clash(input, output)

await clash.load()

clash.delete(clash.find(["proxy-groups-anchor", "rule-providers-anchor", "tun"]))

clash.change(clash.find(["proxy-providers"]), (value: any) => {
  const template = value.airport

  return { ...value, aa: { ...value.airport } }
})

await clash.save(format)
