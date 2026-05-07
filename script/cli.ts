import Clash from "./module/clash"

const input = "../config/clash.yaml"
const output = "../dist"

const argv = Bun.argv.slice(2)
const format = !!argv.some((v) => v === "-f")

const clash = new Clash(input, output)

await clash.load()

// cc.add(find, (val) => {

//   return { key: "airport2", value: val }
// })

// cc.change(find, 9999999)

// clash.delete(clash.find(["proxy-groups-anchor", "rule-providers-anchor", "tun"]))
clash.delete(clash.find(["proxy-groups-anchor", "rule-providers-anchor.22", "tun"]))


await clash.save(format)
