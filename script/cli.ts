import Clash from "./module/clash"

const input = "../config/clash.yaml"
const output = "../dist"

const argv = Bun.argv.slice(2)
const format = Boolean(argv.some((v) => v === "-f"))

const clash = new Clash(input, output)

await clash.load()

// Cc.add(find, (val) => {

//   Return { key: "airport2", value: val }
// })

// Cc.change(find, 9999999)

// Clash.delete(clash.find(["proxy-groups-anchor", "rule-providers-anchor", "tun"]))
clash.delete(clash.find(["proxy-groups-anchor", "rule-providers-anchor", "tun"]))


await clash.save(format)
