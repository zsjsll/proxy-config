import { nameConvert, AreaList } from "../tools/i18n"
import { fixArray, fixBoolean, fixNumber } from "../tools/fixparms"

let { isHidden = false, num = 1, aiExclude = ["HK", "RU"], isExt = false } = $arguments

aiExclude = fixArray(aiExclude)
isHidden = fixBoolean(isHidden)
isExt = fixBoolean(isExt)
num = fixNumber(num)

let content: Config = ProxyUtils.yaml.safeLoad($content)

const template: ProxyGroup = {
  name: "template",
  type: "url-test",
  tolerance: 50,
  interval: 180,
  url: "https://www.gstatic.com/generate_204",
  "include-all": true,
  hidden: isHidden,
}

if (content.proxies === undefined) throw new Error("配置文件中没有 proxies, 请先导入")

const areaList: AreaList[] = Array.from(
  content.proxies
    .map((element) => nameConvert.getIsoCode(element.name))
    .sort((a, b) => a.index - b.index) // 排序
    .reduce((prev: Map<number, AreaList>, curr) => {
      const key = curr.index
      if (prev.has(key)) {
        const obj = prev.get(key)!
        obj.count = obj.count + 1
      } else prev.set(key, curr)

      return prev
    }, new Map())
    .values()
)
