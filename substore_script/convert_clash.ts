// 配合的模板 https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/config/clash/config_substore.yaml
// 脚本地址 https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/substore_script/convert_clash.js#AIRegs=&name=all

// 本脚本 可以传入2个参数：
//  name 为 substore 的订阅组合订阅名字
//  AIRegs 为 AI节点 要过滤掉的中国节点正则表达式，
//  如果直接修改脚本 可以以数组的形式传入参数 eg：["(?i)(🇭🇰|港|hk|hong ?kong)", "(?i)(🇷🇺|俄|RU|Russia)"]
//  如果 传入参数，请使用字符串形式 eg："(?i)(🇭🇰|港|hk|hong ?kong)|(?i)(🇷🇺|俄|RU|Russia)"

import nameConvert from "./module/i18n"

let { name, AIRegs } = $arguments

name ??= "all"
AIRegs ??= ["(?i)(🇭🇰|港|hk|hong ?kong)", "(?i)(🇷🇺|俄|RU|Russia)"]

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

// 根据机场信息，创建自动选择的节点集群
function Create_autoSelectListInfo(airportNodeList: AirportNodeList) {
  const nameIndexList = get_nameIndexList(airportNodeList)

  const selectProxyGroup: ProxyGroup = {
    name: `template`,
    type: "url-test",
    tolerance: 20,
    interval: 60,
    "include-all": true,
    hidden: true,
  }
  const allRegexplist: string[] = []

  const autoSelectList: ProxyGroup[] = []
  const autoSelectNameList: string[] = []
  nameIndexList.forEach((val) => {
    const autoSelect: ProxyGroup = {
      name: `template`,
      type: "url-test",
      tolerance: 20,
      interval: 60,
      "include-all": true,
      hidden: true,
    }

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

// 写入信息到 proxy—groups
function change_proxyGroups(config: Config, airportNodeList: AirportNodeList) {
  const autoSelectListInfo = Create_autoSelectListInfo(airportNodeList)

  config["proxy-groups"].forEach((element) => {
    const isAdd = ["手动选择"].some((kw) => element.proxies?.includes(kw))
    if (isAdd) {
      element.proxies?.push(...autoSelectListInfo.autoSelectNameList)
    }
  })

  config["proxy-groups"].push(...autoSelectListInfo.autoSelectList)

  // config["cccc"] = areaList
}

function save_config(config: Config) {
  $content = ProxyUtils.yaml.safeDump(config)
  return true
}

const airportNodeList = await get_airportNodeList()
let config = get_config()

add_proxies(config, airportNodeList)

extend_AIProxyGroup(config, AIRegs)
change_proxyGroups(config, airportNodeList)

save_config(config)
