import { registerLocale, getName as getCountryName } from "i18n-iso-countries"

import zhLocale from "i18n-iso-countries/langs/zh.json"

registerLocale(zhLocale)

let name = "all"

async function getAirportNodeList() {
  return await produceArtifact({
    name,
    type: "collection",
    platform: "ClashMeta",
    produceType: "internal",
    produceOpts: {
      "include-unsupported-proxy": true,
    },
  })
}

function getConfig() {
  return ProxyUtils.yaml.safeLoad($files[0])
}

function addProxies(config: Config, airportNodeList: AirportNodeList) {
  if (config["proxy-providers"] !== undefined) {
    delete config["proxy-providers"]
  }
  config.proxies = airportNodeList

  return true
}

function getCountryList(list: AirportNodeList) {
  let coutnryList = list.map((v) => {
    const country = ProxyUtils.getISO(v.name)
    return country === undefined ? "其他" : getCountryName(country, "zh")
  })
  coutnryList = [...new Set(coutnryList)]

  return coutnryList
}

function changeProxyGroups(config: Config, airportNodeList: AirportNodeList) {
  const coutnryList = getCountryList(airportNodeList)

  config["cccc"] = coutnryList
  config["country"] = getCountryName("TW", "zh")
}

function saveConfig(config: Config) {
  $content = ProxyUtils.yaml.safeDump(config)
  return true
}

const airportNodeList = await getAirportNodeList()
let config = getConfig()

addProxies(config, airportNodeList)
changeProxyGroups(config, airportNodeList)
saveConfig(config)
