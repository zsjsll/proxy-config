import Clash from "./module/change-config"

const cc = new Clash("../config/clash.yaml", "../dist")

const k = await cc.load()

cc.deleteModules(["rule-providers-anchor"])

console.log(
  cc.search("rule-providers.*.url", (k,v) => 12312124),
)
