// 配合的模板 https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/config/clash/config_substore.yaml
// 脚本地址 https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/substore_script/convert_clash.js#name=""&AIRegs=""

// 本脚本 可以传入2个参数：
//  name 为 substore 的订阅组合订阅名字
//  AIRegs 为 AI节点 上要过滤掉的中国节点正则表达式，
//  如果直接修改脚本 可以以数组的形式传入参数 eg：["(?i)(🇭🇰|港|hk|hong ?kong)", "(?i)(🇷🇺|俄|RU|Russia)"]
//  如果 传入参数，请使用字符串形式 eg："(?i)(🇭🇰|港|hk|hong ?kong)|(?i)(🇷🇺|俄|RU|Russia)"

import { registerLocale, getName as getAreaName } from "i18n-iso-countries"
import zhLocale from "i18n-iso-countries/langs/zh.json"
import enLocale from "i18n-iso-countries/langs/en.json"

const { pre_name, pre_AIRegs } = $arguments

const name = pre_name || "all"
throw new Error(pre_name)
AIRegs ||= ["(?i)(🇭🇰|港|hk|hong ?kong)", "(?i)(🇷🇺|俄|RU|Russia)"]

registerLocale(zhLocale)
registerLocale(enLocale)
async function getAirportNodeList() {
  return await produceArtifact({
    name: name || "all",
    type: "collection",
    platform: "ClashMeta",
    produceType: "internal",
    produceOpts: {
      "include-unsupported-proxy": true,
    },
  })
}
// 获取配置模板
function getConfig() {
  return ProxyUtils.yaml.safeLoad($files[0])
}
// 添加机场节点
function addProxies(config: Config, airportNodeList: AirportNodeList) {
  if (config["proxy-providers"] !== undefined) {
    delete config["proxy-providers"]
  }
  config.proxies = airportNodeList
  return true
}
// 扩展AI不能使用的地区
function extendAIProxyGroup(config: Config, regs: string[] | string) {
  config["proxy-groups"].forEach((v) => {
    if (v.name.includes("AI节点")) {
      if (regs.length !== 0) {
        if (typeof regs !== "string") {
          v["exclude-filter"] = regs.join("|")
        } else {
          v["exclude-filter"] = regs
        }
      }
    }
  })
}

const other = Symbol("other")
// 获取机场的所有节点的ISO名字
function getAreaList(list: AirportNodeList): (string | symbol)[] {
  const areaList = list.map((v) => ProxyUtils.getISO(v.name))
  const areaList_1: (string | symbol | undefined)[] = [...new Set(areaList)] //去重
  if (areaList_1.includes(undefined)) {
    areaList_1.push(other)
  }
  const areaList_2 = areaList_1.filter((v): v is string | symbol => typeof v !== "undefined")
  return areaList_2
}

function getCNName(ISOname: string) {
  let name = getAreaName(ISOname, "zh")

  if (typeof name !== "undefined") {
    name = name.includes("台湾") ? "台湾" : name
    return name
  } else {
    throw new Error(`${name}没有对应的CNName`)
  }
}

function getENName(ISOname: string) {
  let name = getAreaName(ISOname, "en")
  if (typeof name !== "undefined") {
    name = name.includes("Taiwan") ? "Taiwan" : name
    return name
  } else {
    throw new Error(`${name}没有对应的ENName`)
  }
}
// 根据机场信息，创建自动选择的节点集群
function CreateAutoSelectList(airportNodeList: AirportNodeList) {
  const areaList = getAreaList(airportNodeList)

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
    const autoSelect = { ...selectProxyGroup }
    if (typeof ISOname !== "symbol") {
      let CNName = getCNName(ISOname)
      let ENareaName = getENName(ISOname)
      const flag = ProxyUtils.getFlag(CNName)
      const filterNode = `${flag}|${CNName}|${ISOname}|${ENareaName}}`
      filterNodeList.push(filterNode)
      autoSelect.name = `${flag} ${CNName}节点`
      autoSelect.filter = `(?i)(${filterNode})`
    } else {
      autoSelect.name = "❓ 其他节点"
      autoSelect["exclude-filter"] = `(?i)${filterNodeList.join("|")}`
    }
    return autoSelect
  })

  return autoSelectList
}
// 获取 proxy—groups 上所有 auto-select 集群的 名字列表
function getAutoSelectListNamelist(autoSelectList: ProxyGroup[]): string[] {
  const autoSelectListNamelist = autoSelectList.map((v) => {
    return v.name
  })
  return autoSelectListNamelist
}
// 写入信息到 proxy—groups
function changeProxyGroups(config: Config, airportNodeList: AirportNodeList) {
  const autoSelectList = CreateAutoSelectList(airportNodeList)
  const autoSelectListNamelist = getAutoSelectListNamelist(autoSelectList)
  // const areaList = getAreaList(airportNodeList)

  config["proxy-groups"].forEach((v) => {
    const isAdd = ["节点选择", "!CN", "测试", "漏网之鱼"].some((kw) => v.name.includes(kw))
    if (isAdd) {
      v.proxies?.push(...autoSelectListNamelist)
    }
  })

  config["proxy-groups"].push(...autoSelectList)

  // config["cccc"] = areaList
}

function saveConfig(config: Config) {
  $content = ProxyUtils.yaml.safeDump(config)
  return true
}

const airportNodeList = await getAirportNodeList()
let config = getConfig()

addProxies(config, airportNodeList)

extendAIProxyGroup(config, AIRegs)
changeProxyGroups(config, airportNodeList)

saveConfig(config)
