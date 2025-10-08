// 配合的模板 https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/config/clash/config_substore.yaml
// 脚本地址 https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/substore_script/convert_clash.js#name=all&ai=HK|RU|JP&num=2

// 本脚本 可以传入参数：
//  [name] 为 substore 的订阅组合订阅名字
// [ai] 传入ISO,'|' ',' ' ' 区分，比如 ai=HK|RU JP,US
// [num] 最小成群数量，默认为1 表示1个都成群

import nameConvert from "./module/i18n"

let { name, ai, num, isHide } = $arguments

name ??= "airport"
let AINodeExcludeArea = ["HK", "RU"]
let lessGroupCount = 1
let hidden = false

if (isHide) hidden = true
if (typeof ai === "string") AINodeExcludeArea = ai.split(/[|, ]/)
if (typeof num === "string") lessGroupCount = Number(num)

class Subscription {
  private readonly subInfo: SubInfo = {
    name: name,
    type: "collection",
    platform: "ClashMeta",
    produceType: "internal",
    produceOpts: {
      "include-unsupported-proxy": true,
    },
  }
  private readonly autoSelectTemplate: ProxyGroup = {
    name: `template`,
    type: "url-test",
    tolerance: 20,
    interval: 60,
    url: "https://www.google.com/generate_204",
    "include-all": true,
    hidden: hidden,
  }
  private readonly lessGroupCount: number = lessGroupCount
  private readonly proxies: Promise<AirportNodeList>
  private readonly proxyGroups: ProxyGroup[] = []
  private readonly nameList: string[] = []
  private sum: number = 0
  constructor() {
    this.proxies = this.get_Proxies()
  }

  public async get_Proxies() {
    return await produceArtifact(this.subInfo)
  }
  // 获取机场的所有节点的名字Index
  public async getAreaInfoList(): Promise<AreaInfo[]> {
    const proxies = await this.proxies

    let areaInfoList = proxies.map((element) => {
      const a = nameConvert.getIsoCode(element.name)
      const b = { ...a!, count: 1 }
      return b
    })
    // 排序
    areaInfoList = areaInfoList.sort((a, b) => {
      if (typeof a.index === "undefined") return 1
      if (typeof b.index === "undefined") return -1
      return a.index - b.index
    })

    // 转存Map
    const map = areaInfoList.reduce((prev: Map<number, (typeof areaInfoList)[number]>, curr) => {
      const key = curr.index
      if (prev.has(key)) {
        const obj = prev.get(key)!
        obj.count = obj.count + 1
      } else prev.set(key, curr)

      return prev
    }, new Map())
    const a = [...map.values()]
    // a.at(-1)!.isoCode ??= "OTHER" //给other 个名字
    // console.log(a)

    return a
  }

  public createProxyGroups(areaInfoList: AreaInfo[]) {
    const allRegexplist: string[] = []
    // const nameList: string[] = []
    // const proxyGroups: ProxyGroup[] = []
    // let sum = 0
    for (const element of areaInfoList) {
      const proxyGroup = { ...this.autoSelectTemplate }
      if (element.count < this.lessGroupCount) {
        areaInfoList.at(-1)!.count = areaInfoList.at(-1)!.count + element.count
      } else {
        if (typeof element.regExp !== "undefined") {
          proxyGroup.name = `${element.flag} ${element.zhName}节点(${String(element.count)})`
          proxyGroup.filter = `(?i)(${element.regExp})`
          allRegexplist.push(element.regExp)
          this.nameList.push(proxyGroup.name)
          this.proxyGroups.push(proxyGroup)
          this.sum = this.sum + element.count
        } else {
          proxyGroup.name = `❓ 其他节点(${String(element.count)})`
          proxyGroup["exclude-filter"] = `(?i)(${allRegexplist.join("|")})`
          this.nameList.push(proxyGroup.name)
          this.proxyGroups.push(proxyGroup)
          this.sum = this.sum + element.count
        }
      }
    }

    return this.proxyGroups
  }
}

interface AreaInfo {
  count: number
  flag?: string
  zhName?: string
  enName?: string
  index?: number
  isoCode?: string
  regExp?: string
}

class Config {
  private config: globalThis.Config
  private AINodeExcludeArea = AINodeExcludeArea
  private hidden = hidden
  // 获取配置模板
  constructor() {
    this.config = ProxyUtils.yaml.safeLoad($files[0])
  }
  public delProxyProviders() {
    if (this.config["proxy-providers"] !== undefined) {
      delete this.config["proxy-providers"]
    }
  }
  public addProxies(Subscription: AirportNodeList) {
    this.config = { proxies: Subscription, ...this.config }
  }
  // 扩展AI不能使用的地区
  public fixAIProxyGroup(areaInfoList: AreaInfo[]) {
    const aiAreaList = areaInfoList.filter((v) => this.AINodeExcludeArea.every((kw) => v.isoCode !== kw))
    const filter = aiAreaList.map((v) => v.regExp).filter((v) => typeof v !== "undefined")
    const sum = aiAreaList.reduce((prev, curr) => {
      if (typeof curr.isoCode !== "undefined") {
        console.log(curr.isoCode, curr.count)
        prev = prev + curr.count
      }
      return prev
    }, 0)

    console.log(filter)
    console.log(sum)

    this.config["proxy-groups"].forEach((v) => {
      if (v.name.includes("AI节点")) {
        v.name = `${v.name}(${String(sum)})`
        v.filter = `(?i)(${filter.join("|")})`
        console.log("---->[v.filter]<----165", v.filter)

        if (this.hidden) v.hidden = true
        if (v["exclude-filter"]) delete v["exclude-filter"]
      }

      const p = v.proxies?.map((vv) => {
        if (vv.includes("AI节点")) {
          return `${vv}(${String(sum)})`
        }
        return vv
      })
      v.proxies = p
    })
  }

  public fixProxyGroups(areaInfoList: AreaInfo[]) {
    const sum = areaInfoList.reduce((prev, curr) => {
      prev = prev + curr.count
      return prev
    }, 0)

    const f = ["自动选择", "手动选择"]

    this.config["proxy-groups"].forEach((v) => {
      if (v.name.includes("自动选择")) {
        if (this.hidden) v.hidden = true
      }

      if (f.some((kw) => v.name.includes(kw))) {
        v.name = `${v.name}(${String(sum)})`
      }

      const p = v.proxies?.map((vv) => {
        if (f.some((kw) => vv.includes(kw))) {
          return `${vv}(${String(sum)})`
        }
        return vv
      })
      v.proxies = p
    })
  }
  public changeProxyGroups(proxyGroups: ProxyGroup[]) {
    const nameList = proxyGroups.map((v) => v.name)
    this.config["proxy-groups"].forEach((v) => {
      // 在proxies中有 "手动选择"的 在最后添加上 节点选择
      if (v.proxies?.some((val) => val.includes("手动选择"))) {
        v.proxies?.push(...nameList)
      }
    })
    this.config["proxy-groups"].push(...proxyGroups)
  }

  // 写入信息
  public saveConfig() {
    $content = ProxyUtils.yaml.safeDump(this.config)
  }
}

const config = new Config()

config.delProxyProviders()
const sub = new Subscription()

const proxies = await sub.get_Proxies()
config.addProxies(proxies)

const areaInfoList = await sub.getAreaInfoList()
const proxyGroups = sub.createProxyGroups(areaInfoList)

config.fixAIProxyGroup(areaInfoList)
config.fixProxyGroups(areaInfoList)
config.changeProxyGroups(proxyGroups)

config.saveConfig()
