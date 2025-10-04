// 配合的模板 https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/config/clash/config_substore.yaml
// 脚本地址 https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/substore_script/convert_clash.js#name=all&usedef

// 本脚本 可以传入2个参数：
//  [name] 为 substore 的订阅组合订阅名字
//  [AIRegs] 为 AI节点 要过滤掉的中国节点正则表达式，传入参数，请使用字符串形式 eg："(?i)(🇭🇰|港|hk|hong ?kong)|(?i)(🇷🇺|俄|RU|Russia)"，修改脚本 可以以数组的形式传入参数 eg：["(?i)(🇭🇰|港|hk|hong ?kong)", "(?i)(🇷🇺|俄|RU|Russia)"]
// [mode]:"create"|"default" 添加后使用固定的 autoselect 群组

import nameConvert from "./module/i18n"

type Mode = "create" | "default"

let { name, AIRegs } = $arguments

let mode: Mode = $arguments.mode

mode ??= "create"
name ??= "ariport"
AIRegs ??= ["(?i)(🇭🇰|港|hk|hong ?kong)", "(?i)(🇷🇺|俄|RU|Russia)"]

const defAutoSelect: ProxyGroup = {
  name: `template`,
  type: "url-test",
  tolerance: 20,
  interval: 60,
  url: "url: https://www.google.com/generate_204",
  "include-all": true,
  // hidden: true,
}

const autoSelect = [
  { name: "🇭🇰 香港节点", filter: "(?i)(🇭🇰|港|hk|hong ?kong)" },
  { name: "🇲🇴 澳门节点", filter: "(?i)(🇲🇴|澳门|MO|Macao)" },
  { name: "🇹🇼 台湾节点", filter: "(?i)(🇹🇼|台|tw|tai ?wan)" },
  { name: "🇯🇵 日本节点", filter: "(?i)(🇯🇵|日|jp|japan)" },
  { name: "🇰🇷 韩国节点", filter: "(?i)(🇰🇷|韩|kr|korean)" },
  { name: "🇸🇬 新加坡节点", filter: "(?i)(🇸🇬|新|sg|singapore)" },
  { name: "🇺🇸 美国节点", filter: "(?i)(🇺🇸|美|us|united ?states)" },
  { name: "🇬🇧 英国节点", filter: "(?i)(🇬🇧|英|GB|United ?Kingdom)" },
  { name: "🇫🇷 法国节点", filter: "(?i)(🇫🇷|法|fr|France)" },
  { name: "🇩🇪 德国节点", filter: "(?i)(🇩🇪|德|DE|Germany)" },
  { name: "🇦🇱 澳大利亚节点", filter: "(?i)(🇦🇱|澳大利亚|澳洲|AL|Australia)" },
]

async function get_airportNodeList() {
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
// 获取配置模板
function get_config() {
  return ProxyUtils.yaml.safeLoad($files[0])
}
// 添加机场节点
function add_proxies(config: Config, airportNodeList: AirportNodeList) {
  if (config["proxy-providers"] !== undefined) {
    delete config["proxy-providers"]
  }
  config.proxies = airportNodeList
  return true
}
// 扩展AI不能使用的地区
function extend_AIProxyGroup(config: Config, regs: string[] | string) {
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

// 获取机场的所有节点的名字Index
function get_nameIndexList(list: AirportNodeList) {
  let tempSet: Set<undefined | number> = new Set()
  list.forEach((element) => {
    const nameIndex = nameConvert.get_NameIndex(element.name)
    tempSet.add(nameIndex)
  })
  const nameIndexList = [...tempSet].sort((a, b) => {
    if (typeof a === "undefined") return 1
    if (typeof b === "undefined") return -1
    return a - b
  })

  return nameIndexList
}

interface AutoSelectListInfo {
  autoSelectList: ProxyGroup[]
  autoSelectNameList: string[]
}

// 根据机场信息，创建自动选择的节点集群
function create_autoSelectListInfo(airportNodeList: AirportNodeList): AutoSelectListInfo {
  const nameIndexList = get_nameIndexList(airportNodeList)

  const allRegexplist: string[] = []
  const autoSelectList: ProxyGroup[] = []
  const autoSelectNameList: string[] = []
  nameIndexList.forEach((val) => {
    const autoSelect = { ...defAutoSelect }
    if (typeof val !== "undefined") {
      const zhName = nameConvert.get_Name(val, "zh")
      const enName = nameConvert.get_Name(val, "en")
      const flag = nameConvert.get_Name(val, "fg")
      const regexp = nameConvert.get_Name(val, "regexp")

      autoSelect.name = `${flag} ${zhName}节点`
      autoSelect.filter = `(?i)(${regexp})`
      allRegexplist.push(regexp)
      autoSelectNameList.push(autoSelect.name)
      autoSelectList.push(autoSelect)
    } else {
      autoSelect.name = "❓ 其他节点"
      autoSelect["exclude-filter"] = `(?i)${allRegexplist.join("|")}`
      autoSelectNameList.push(autoSelect.name)
      autoSelectList.push(autoSelect)
    }
  })

  return { autoSelectList, autoSelectNameList }
}

function default_AutoSelectListInfo(airportNodeList: AirportNodeList): AutoSelectListInfo {
  const temp_autoSelectList: ProxyGroup[] = autoSelect.map((e) => {
    return { ...defAutoSelect, ...e }
  })
  const nameIndexList = get_nameIndexList(airportNodeList).filter((ele) => typeof ele !== "undefined")

  const fglist = nameIndexList.map((element) => nameConvert.get_Name(element, "fg"))

  const autoSelectList = temp_autoSelectList.filter((element) => {
    const fgMatchs = element.name.match(/^(..)/u)
    if (fgMatchs !== null) {
      const fg = fgMatchs[1]
      return fglist.includes(fg)
    } else throw new Error("filter格式出错")
  })

  const allRegexplist: string[] = autoSelect.map((e) => {
    const filter = e.filter.match(/^\(.*\((.*?)\)/)

    if (filter !== null) return filter[1]
    else throw new Error("filter格式出错")
  })

  const otherAutoSelect: ProxyGroup = { ...defAutoSelect, ...{ name: "❓ 其他节点", "exclude-filter": `(?i)${allRegexplist.join("|")}` } }
  autoSelectList.push(otherAutoSelect)

  const autoSelectNameList: string[] = autoSelectList.map((e) => e.name)

  return { autoSelectNameList, autoSelectList }
}

// 写入信息到 proxy—groups
function change_proxyGroups(config: Config, autoSelectListInfo: AutoSelectListInfo) {
  config["proxy-groups"].forEach((element) => {
    // const isAdd = ["手动选择"].some((kw) => element.proxies?.includes(kw))
    const isAdd = element.proxies?.some((val) => val.includes("手动选择"))
    if (isAdd) {
      element.proxies?.push(...autoSelectListInfo.autoSelectNameList)
    }
  })

  config["proxy-groups"].push(...autoSelectListInfo.autoSelectList)

  // config["cccc"] = autoSelectListInfo.autoSelectNameList
}

function save_config(config: Config) {
  $content = ProxyUtils.yaml.safeDump(config)
  return true
}

const airportNodeList = await get_airportNodeList()
let config = get_config()

add_proxies(config, airportNodeList)

extend_AIProxyGroup(config, AIRegs)
let autoSelectListInfo: AutoSelectListInfo
if (mode === "create") autoSelectListInfo = create_autoSelectListInfo(airportNodeList)
else autoSelectListInfo = default_AutoSelectListInfo(airportNodeList)
change_proxyGroups(config, autoSelectListInfo)
save_config(config)
