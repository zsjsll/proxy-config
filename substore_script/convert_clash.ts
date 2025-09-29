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
  let proxyAreaList = list.map((v) => {
    let proxyArea = ProxyUtils.getISO(v.name)
    proxyArea = (proxyArea === undefined ? "其他" : getCountryName(proxyArea, "zh")) as string
    proxyArea = proxyArea.includes("台湾") ? "台湾" : proxyArea
    return proxyArea
  })
  proxyAreaList = [...new Set(proxyAreaList)] //去重

  return proxyAreaList
}

function CreateNodeAutoSelect(proxyAreaList: string[]) {
  let hasOther = false
  if (proxyAreaList.includes("其他")) {
    proxyAreaList = proxyAreaList.filter((v) => v !== "其他")
    // hasOther = true
  }

  let filterNodeList: string[] = []
  let autoSelectList = proxyAreaList.map((val) => {
    const flag = ProxyUtils.getFlag(val)

    const filterNode = `${flag}|${val}|${ProxyUtils.getISO(val)}|${val}|${val[0]}`
    filterNodeList.push(filterNode)

    const autoSelect: ProxyGroup = {
      name: `${flag} ${val}节点`,
      type: "url-test",
      tolerance: 20,
      interval: 60,
      "include-all": true,
      hidden: true,
      filter: `(?i)(${filterNode})`,
    }
    return autoSelect
  })
  let autoSelectOther: ProxyGroup[] | [] = []
  if (hasOther) {
    autoSelectOther = [
      {
        name: `❓ 其他节点`,
        type: "url-test",
        tolerance: 20,
        interval: 60,
        "include-all": true,
        hidden: true,
        "exclude-filter": `(?i)(${filterNodeList.join("|")})`,
      },
    ]
  }

  return [...autoSelectOther, ...autoSelectList]
}

function changeProxyGroups(config: Config, airportNodeList: AirportNodeList) {
  const proxyAreaList = getCountryList(airportNodeList)
  const aaa = CreateNodeAutoSelect(proxyAreaList)

  config["cccc"] = aaa
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
