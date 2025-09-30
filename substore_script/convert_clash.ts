import { registerLocale, getName as getAreaName } from "i18n-iso-countries"
import zhLocale from "i18n-iso-countries/langs/zh.json"
import enLocale from "i18n-iso-countries/langs/en.json"

registerLocale(zhLocale)
registerLocale(enLocale)

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

function getAreaList(list: AirportNodeList) {
  let areaList = list.map((v) => ProxyUtils.getISO(v.name))
  areaList = [...new Set(areaList)] //去重

  return areaList
}

function CreateAutoSelectList(airportNodeList: AirportNodeList) {
  let hasOther = false
  const areaList = getAreaList(airportNodeList).filter((v) => {
    if (v === undefined) {
      hasOther = true
      return false
    } else {
      return true
    }
  }) as string[]

  const selectProxyGroup: ProxyGroup = {
    name: `template`,
    type: "url-test",
    tolerance: 20,
    interval: 60,
    "include-all": true,
    hidden: true,
  }
  const filterNodeList: string[] = []

  const autoSelectList = areaList.map((ISOname) => {
    if (ISOname !== undefined) {
      let CNareaName = getAreaName(ISOname, "zh") as string
      CNareaName = CNareaName.includes("台湾") ? "台湾" : CNareaName
      let ENareaName = getAreaName(ISOname, "en") as string
      ENareaName = ENareaName.includes("Taiwan") ? "Taiwan" : ENareaName
      const flag = ProxyUtils.getFlag(CNareaName)
      const filterNode = `${flag}|${ISOname}|${ENareaName}|${CNareaName}|${CNareaName[0]}`
      filterNodeList.push(filterNode)
      const autoSelect = { ...selectProxyGroup }
      autoSelect.name = `${flag} ${CNareaName}节点`
      autoSelect.filter = `(?i)(${filterNode})`
      return autoSelect
    } else {
      hasOther = true
    }
  }) as ProxyGroup[]
  if (hasOther) {
    const otherSelect = { ...selectProxyGroup }
    otherSelect.name = "❓ 其他节点"
    otherSelect["exclude-filter"] = `(?i)${filterNodeList.join("|")}`
    autoSelectList.push(otherSelect)
  }

  return autoSelectList
}

function getAutoSelectListNamelist(autoSelectList: ProxyGroup[]): string[] {
  const autoSelectListNamelist = autoSelectList.map((v) => {
    return v.name
  })
  return autoSelectListNamelist
}

function changeProxyGroups(config: Config, airportNodeList: AirportNodeList) {
  const autoSelectList = CreateAutoSelectList(airportNodeList)
  const autoSelectListNamelist = getAutoSelectListNamelist(autoSelectList)
  config["proxy-groups"].push(...autoSelectList)

  config["cccc"] = autoSelectListNamelist
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
