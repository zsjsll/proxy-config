const obj = {
  HK: { flag: "🇭🇰", zhName: "香港", enName: "Hong Kong" },
  MO: { flag: "🇲🇴", zhName: "澳门", enName: "Macao" },
  TW: { flag: "🇹🇼", zhName: "台湾", enName: "Taiwan" },
  JP: { flag: "🇯🇵", zhName: "日本", enName: "Japan" },
  KR: { flag: "🇰🇷", zhName: "韩国", enName: "Korea" },
  SG: { flag: "🇸🇬", zhName: "新加坡", enName: "Singapore" },
  US: { flag: "🇺🇸", zhName: "美国", enName: "United States" },
  GB: { flag: "🇬🇧", zhName: "英国", enName: "United Kingdom" },
  FR: { flag: "🇫🇷", zhName: "法国", enName: "France" },
  DE: { flag: "🇩🇪", zhName: "德国", enName: "Germany" },
  AU: { flag: "🇦🇺", zhName: "澳大利亚", enName: "Australia" },
  AE: { flag: "🇦🇪", zhName: "阿联酋", enName: "Dubai" },
  AF: { flag: "🇦🇫", zhName: "阿富汗", enName: "Afghanistan" },
  AL: { flag: "🇦🇱", zhName: "阿尔巴尼亚", enName: "Albania" },
  DZ: { flag: "🇩🇿", zhName: "阿尔及利亚", enName: "Algeria" },
  AO: { flag: "🇦🇴", zhName: "安哥拉", enName: "Angola" },
  AR: { flag: "🇦🇷", zhName: "阿根廷", enName: "Argentina" },
  AM: { flag: "🇦🇲", zhName: "亚美尼亚", enName: "Armenia" },
  AT: { flag: "🇦🇹", zhName: "奥地利", enName: "Austria" },
  AZ: { flag: "🇦🇿", zhName: "阿塞拜疆", enName: "Azerbaijan" },
  BH: { flag: "🇧🇭", zhName: "巴林", enName: "Bahrain" },
  BD: { flag: "🇧🇩", zhName: "孟加拉国", enName: "Bangladesh" },
  BY: { flag: "🇧🇾", zhName: "白俄罗斯", enName: "Belarus" },
  BE: { flag: "🇧🇪", zhName: "比利时", enName: "Belgium" },
  BZ: { flag: "🇧🇿", zhName: "伯利兹", enName: "Belize" },
  BJ: { flag: "🇧🇯", zhName: "贝宁", enName: "Benin" },
  BT: { flag: "🇧🇹", zhName: "不丹", enName: "Bhutan" },
  BO: { flag: "🇧🇴", zhName: "玻利维亚", enName: "Bolivia" },
  BA: { flag: "🇧🇦", zhName: "波斯尼亚和黑塞哥维那", enName: "Bosnia and Herzegovina" },
  BW: { flag: "🇧🇼", zhName: "博茨瓦纳", enName: "Botswana" },
  BR: { flag: "🇧🇷", zhName: "巴西", enName: "Brazil" },
  VG: { flag: "🇻🇬", zhName: "英属维京群岛", enName: "British Virgin Islands" },
  BN: { flag: "🇧🇳", zhName: "文莱", enName: "Brunei" },
  BG: { flag: "🇧🇬", zhName: "保加利亚", enName: "Bulgaria" },
  BF: { flag: "🇧🇫", zhName: "布基纳法索", enName: "Burkina-faso" },
  BI: { flag: "🇧🇮", zhName: "布隆迪", enName: "Burundi" },
  KH: { flag: "🇰🇭", zhName: "柬埔寨", enName: "Cambodia" },
  CM: { flag: "🇨🇲", zhName: "喀麦隆", enName: "Cameroon" },
  CA: { flag: "🇨🇦", zhName: "加拿大", enName: "Canada" },
  CV: { flag: "🇨🇻", zhName: "佛得角", enName: "CapeVerde" },
  KY: { flag: "🇰🇾", zhName: "开曼群岛", enName: "CaymanIslands" },
  CF: { flag: "🇨🇫", zhName: "中非共和国", enName: "Central African Republic" },
  TD: { flag: "🇹🇩", zhName: "乍得", enName: "Chad" },
  CL: { flag: "🇨🇱", zhName: "智利", enName: "Chile" },
  CO: { flag: "🇨🇴", zhName: "哥伦比亚", enName: "Colombia" },
  KM: { flag: "🇰🇲", zhName: "科摩罗", enName: "Comoros" },
  CG: { flag: "🇨🇬", zhName: "刚果(布)", enName: "Congo-Brazzaville" },
  CD: { flag: "🇨🇩", zhName: "刚果(金)", enName: "Congo-Kinshasa" },
  CR: { flag: "🇨🇷", zhName: "哥斯达黎加", enName: "CostaRica" },
  HR: { flag: "🇭🇷", zhName: "克罗地亚", enName: "Croatia" },
  CY: { flag: "🇨🇾", zhName: "塞浦路斯", enName: "Cyprus" },
  CZ: { flag: "🇨🇿", zhName: "捷克", enName: "Czech Republic" },
  DK: { flag: "🇩🇰", zhName: "丹麦", enName: "Denmark" },
  DJ: { flag: "🇩🇯", zhName: "吉布提", enName: "Djibouti" },
  DO: { flag: "🇩🇴", zhName: "多米尼加共和国", enName: "Dominican Republic" },
  EC: { flag: "🇪🇨", zhName: "厄瓜多尔", enName: "Ecuador" },
  EG: { flag: "🇪🇬", zhName: "埃及", enName: "Egypt" },
  SV: { flag: "🇸🇻", zhName: "萨尔瓦多", enName: "EISalvador" },
  GQ: { flag: "🇬🇶", zhName: "赤道几内亚", enName: "Equatorial Guinea" },
  ER: { flag: "🇪🇷", zhName: "厄立特里亚", enName: "Eritrea" },
  EE: { flag: "🇪🇪", zhName: "爱沙尼亚", enName: "Estonia" },
  ET: { flag: "🇪🇹", zhName: "埃塞俄比亚", enName: "Ethiopia" },
  FJ: { flag: "🇫🇯", zhName: "斐济", enName: "Fiji" },
  FI: { flag: "🇫🇮", zhName: "芬兰", enName: "Finland" },
  GA: { flag: "🇬🇦", zhName: "加蓬", enName: "Gabon" },
  GM: { flag: "🇬🇲", zhName: "冈比亚", enName: "Gambia" },
  GE: { flag: "🇬🇪", zhName: "格鲁吉亚", enName: "Georgia" },
  GH: { flag: "🇬🇭", zhName: "加纳", enName: "Ghana" },
  GR: { flag: "🇬🇷", zhName: "希腊", enName: "Greece" },
  GL: { flag: "🇬🇱", zhName: "格陵兰", enName: "Greenland" },
  GT: { flag: "🇬🇹", zhName: "危地马拉", enName: "Guatemala" },
  GN: { flag: "🇬🇳", zhName: "几内亚", enName: "Guinea" },
  GY: { flag: "🇬🇾", zhName: "圭亚那", enName: "Guyana" },
  HT: { flag: "🇭🇹", zhName: "海地", enName: "Haiti" },
  HN: { flag: "🇭🇳", zhName: "洪都拉斯", enName: "Honduras" },
  HU: { flag: "🇭🇺", zhName: "匈牙利", enName: "Hungary" },
  IS: { flag: "🇮🇸", zhName: "冰岛", enName: "Iceland" },
  IN: { flag: "🇮🇳", zhName: "印度", enName: "India" },
  ID: { flag: "🇮🇩", zhName: "印尼", enName: "Indonesia" },
  IR: { flag: "🇮🇷", zhName: "伊朗", enName: "Iran" },
  IQ: { flag: "🇮🇶", zhName: "伊拉克", enName: "Iraq" },
  IE: { flag: "🇮🇪", zhName: "爱尔兰", enName: "Ireland" },
  IM: { flag: "🇮🇲", zhName: "马恩岛", enName: "Isle of Man" },
  IL: { flag: "🇮🇱", zhName: "以色列", enName: "Israel" },
  IT: { flag: "🇮🇹", zhName: "意大利", enName: "Italy" },
  CI: { flag: "🇨🇮", zhName: "科特迪瓦", enName: "Ivory Coast" },
  JM: { flag: "🇯🇲", zhName: "牙买加", enName: "Jamaica" },
  JO: { flag: "🇯🇴", zhName: "约旦", enName: "Jordan" },
  KZ: { flag: "🇰🇿", zhName: "哈萨克斯坦", enName: "Kazakstan" },
  KE: { flag: "🇰🇪", zhName: "肯尼亚", enName: "Kenya" },
  KW: { flag: "🇰🇼  ", zhName: "科威特", enName: "Kuwait" },
  KG: { flag: "🇰🇬", zhName: "吉尔吉斯斯坦", enName: "Kyrgyzstan" },
  LA: { flag: "🇱🇦", zhName: "老挝", enName: "Laos" },
  LV: { flag: "🇱🇻", zhName: "拉脱维亚", enName: "Latvia" },
  LB: { flag: "🇱🇧", zhName: "黎巴嫩", enName: "Lebanon" },
  LS: { flag: "🇱🇸", zhName: "莱索托", enName: "Lesotho" },
  LR: { flag: "🇱🇷", zhName: "利比里亚", enName: "Liberia" },
  LY: { flag: "🇱🇾", zhName: "利比亚", enName: "Libya" },
  LT: { flag: "🇱🇹", zhName: "立陶宛", enName: "Lithuania" },
  LU: { flag: "🇱🇺", zhName: "卢森堡", enName: "Luxembourg" },
  MK: { flag: "🇲🇰", zhName: "马其顿", enName: "Macedonia" },
  MG: { flag: "🇲🇬", zhName: "马达加斯加", enName: "Madagascar" },
  MW: { flag: "🇲🇼", zhName: "马拉维", enName: "Malawi" },
  MY: { flag: "🇲🇾", zhName: "马来", enName: "Malaysia" },
  MV: { flag: "🇲🇻", zhName: "马尔代夫", enName: "Maldives" },
  ML: { flag: "🇲🇱", zhName: "马里", enName: "Mali" },
  MT: { flag: "🇲🇹", zhName: "马耳他", enName: "Malta" },
  MR: { flag: "🇲🇷", zhName: "毛利塔尼亚", enName: "Mauritania" },
  MU: { flag: "🇲🇺", zhName: "毛里求斯", enName: "Mauritius" },
  MX: { flag: "🇲🇽", zhName: "墨西哥", enName: "Mexico" },
  MD: { flag: "🇲🇩", zhName: "摩尔多瓦", enName: "Moldova" },
  MC: { flag: "🇲🇨", zhName: "摩纳哥", enName: "Monaco" },
  MN: { flag: "🇲🇳", zhName: "蒙古", enName: "Mongolia" },
  ME: { flag: "🇲🇪", zhName: "黑山共和国", enName: "Montenegro" },
  MA: { flag: "🇲🇦", zhName: "摩洛哥", enName: "Morocco" },
  MZ: { flag: "🇲🇿", zhName: "莫桑比克", enName: "Mozambique" },
  MM: { flag: "🇲🇲", zhName: "缅甸", enName: "Myanmar(Burma)" },
  NA: { flag: "🇳🇦", zhName: "纳米比亚", enName: "Namibia" },
  NP: { flag: "🇳🇵", zhName: "尼泊尔", enName: "Nepal" },
  NL: { flag: "🇳🇱", zhName: "荷兰", enName: "Netherlands" },
  NZ: { flag: "🇳🇿", zhName: "新西兰", enName: "New Zealand" },
  NI: { flag: "🇳🇮", zhName: "尼加拉瓜", enName: "Nicaragua" },
  NE: { flag: "🇳🇪", zhName: "尼日尔", enName: "Niger" },
  NG: { flag: "🇳🇬", zhName: "尼日利亚", enName: "Nigeria" },
  KP: { flag: "🇰🇵", zhName: "朝鲜", enName: "NorthKorea" },
  NO: { flag: "🇳🇴", zhName: "挪威", enName: "Norway" },
  OM: { flag: "🇴🇲", zhName: "阿曼", enName: "Oman" },
  PK: { flag: "🇵🇰", zhName: "巴基斯坦", enName: "Pakistan" },
  PA: { flag: "🇵🇦", zhName: "巴拿马", enName: "Panama" },
  PY: { flag: "🇵🇾", zhName: "巴拉圭", enName: "Paraguay" },
  PE: { flag: "🇵🇪", zhName: "秘鲁", enName: "Peru" },
  PH: { flag: "🇵🇭", zhName: "菲律宾", enName: "Philippines" },
  PT: { flag: "🇵🇹", zhName: "葡萄牙", enName: "Portugal" },
  PR: { flag: "🇵🇷", zhName: "波多黎各", enName: "PuertoRico" },
  QA: { flag: "🇶🇦", zhName: "卡塔尔", enName: "Qatar" },
  RO: { flag: "🇷🇴", zhName: "罗马尼亚", enName: "Romania" },
  RU: { flag: "🇷🇺", zhName: "俄罗斯", enName: "Russia" },
  RW: { flag: "🇷🇼", zhName: "卢旺达", enName: "Rwanda" },
  SM: { flag: "🇸🇲", zhName: "圣马力诺", enName: "SanMarino" },
  SA: { flag: "🇸🇦", zhName: "沙特阿拉伯", enName: "SaudiArabia" },
  SN: { flag: "🇸🇳", zhName: "塞内加尔", enName: "Senegal" },
  RS: { flag: "🇷🇸", zhName: "塞尔维亚", enName: "Serbia" },
  SL: { flag: "🇸🇱", zhName: "塞拉利昂", enName: "SierraLeone" },
  SK: { flag: "🇸🇰", zhName: "斯洛伐克", enName: "Slovakia" },
  SI: { flag: "🇸🇮", zhName: "斯洛文尼亚", enName: "Slovenia" },
  SO: { flag: "🇸🇴", zhName: "索马里", enName: "Somalia" },
  ZA: { flag: "🇿🇦", zhName: "南非", enName: "SouthAfrica" },
  ES: { flag: "🇪🇸", zhName: "西班牙", enName: "Spain" },
  LK: { flag: "🇱🇰", zhName: "斯里兰卡", enName: "SriLanka" },
  SD: { flag: "🇸🇩", zhName: "苏丹", enName: "Sudan" },
  SR: { flag: "🇸🇷", zhName: "苏里南", enName: "Suriname" },
  SZ: { flag: "🇸🇿", zhName: "斯威士兰", enName: "Swaziland" },
  SE: { flag: "🇸🇪", zhName: "瑞典", enName: "Sweden" },
  CH: { flag: "🇨🇭", zhName: "瑞士", enName: "Switzerland" },
  SY: { flag: "🇸🇾", zhName: "叙利亚", enName: "Syria" },
  TJ: { flag: "🇹🇯", zhName: "塔吉克斯坦", enName: "Tajikstan" },
  TZ: { flag: "🇹🇿", zhName: "坦桑尼亚", enName: "Tanzania" },
  TH: { flag: "🇹🇭", zhName: "泰国", enName: "Thailand" },
  TG: { flag: "🇹🇬", zhName: "多哥", enName: "Togo" },
  TO: { flag: "🇹🇴", zhName: "汤加", enName: "Tonga" },
  TT: { flag: "🇹🇹", zhName: "特立尼达和多巴哥", enName: "TrinidadandTobago" },
  TN: { flag: "🇹🇳", zhName: "突尼斯", enName: "Tunisia" },
  TR: { flag: "🇹🇷", zhName: "土耳其", enName: "Turkey" },
  TM: { flag: "🇹🇲", zhName: "土库曼斯坦", enName: "Turkmenistan" },
  VI: { flag: "🇻🇮", zhName: "美属维尔京群岛", enName: "U.S.Virgin Islands" },
  UG: { flag: "🇺🇬", zhName: "乌干达", enName: "Uganda" },
  UA: { flag: "🇺🇦", zhName: "乌克兰", enName: "Ukraine" },
  UY: { flag: "🇺🇾", zhName: "乌拉圭", enName: "Uruguay" },
  UZ: { flag: "🇺🇿", zhName: "乌兹别克斯坦", enName: "Uzbekistan" },
  VE: { flag: "🇻🇪", zhName: "委内瑞拉", enName: "Venezuela" },
  VN: { flag: "🇻🇳", zhName: "越南", enName: "Vietnam" },
  YE: { flag: "🇾🇪", zhName: "也门", enName: "Yemen" },
  ZM: { flag: "🇿🇲", zhName: "赞比亚", enName: "Zambia" },
  ZW: { flag: "🇿🇼", zhName: "津巴布韦", enName: "Zimbabwe" },
  AD: { flag: "🇦🇩", zhName: "安道尔", enName: "Andorra" },
  RE: { flag: "🇷🇪", zhName: "留尼汪", enName: "Reunion" },
  PL: { flag: "🇵🇱", zhName: "波兰", enName: "Poland" },
  GU: { flag: "🇬🇺", zhName: "关岛", enName: "Guam" },
  VA: { flag: "🇻🇦", zhName: "梵蒂冈", enName: "Vatican" },
  LI: { flag: "🇱🇮", zhName: "列支敦士登", enName: "Liechtensteins" },
  CW: { flag: "🇨🇼", zhName: "库拉索", enName: "Curacao" },
  SC: { flag: "🇸🇨", zhName: "塞舌尔", enName: "Seychelles" },
  AQ: { flag: "🇦🇶", zhName: "南极", enName: "Antarctica" },
  GI: { flag: "🇬🇮", zhName: "直布罗陀", enName: "Gibraltar" },
  CU: { flag: "🇨🇺", zhName: "古巴", enName: "Cuba" },
  FO: { flag: "🇫🇴", zhName: "法罗群岛", enName: "Faroe Islands" },
  AX: { flag: "🇦🇽", zhName: "奥兰群岛", enName: "Ahvenanmaa" },
  BM: { flag: "🇧🇲", zhName: "百慕达", enName: "Bermuda" },
  TL: { flag: "🇹🇱", zhName: "东帝汶", enName: "Timor-Leste" },
}

const oriAreaList = new Map(Object.entries(obj))

type OriAreaList = typeof oriAreaList

type Obj = typeof obj

type ExtraProps = {
  index: number
  isoCode: string
  regExp: string
  count: number
}
export type AreaList = Obj[keyof Obj] & ExtraProps

class ProxyNameConvert {
  private readonly areaList: AreaList[]
  constructor(areaList: OriAreaList) {
    this.areaList = this.ExIsoCodes(areaList)
  }

  private isoToFlagEmoji(areaList: string) {
    if (typeof areaList !== "string" || areaList.length !== 2) {
      throw new Error("isoCode 错误")
    }
    const code = areaList.toUpperCase()
    const OFFSET = 127397
    // 逐个字符转换并拼接
    const flag = code
      .split("")
      .map((char) => {
        const codePoint = (char.codePointAt(0) as number) + OFFSET
        // String.fromCodePoint() 将码点转回字符串（区域指示符号）
        return String.fromCodePoint(codePoint)
      })
      .join("") // 将两个区域指示符号拼接起来

    return flag
  }

  private ExIsoCodes(areaList: OriAreaList): AreaList[] {
    const extIsoCodes: AreaList[] = []
    let i = 0
    for (const [key, val] of areaList) {
      const isoCode = key
      const flag = this.isoToFlagEmoji(isoCode)
      const zhName = val.zhName
      const enName = val.enName.replace(/\s/g, ` ?`)
      const regExp = `${flag}|${isoCode}|${zhName}|${enName}`
      const index = i
      const count = 1

      i++
      extIsoCodes.push({ index, isoCode, flag, zhName, enName, regExp, count })
    }
    // return new RegExp(regExp, "gi")
    return extIsoCodes
  }

  getIsoCode(serverName: string = ""): AreaList {
    let resoult = this.areaList.find((area) => {
      const keywords = area.regExp.split("|")

      if (serverName === keywords.splice(1, 1)[0]) return true

      if (keywords.some((keyword) => serverName.includes(keyword))) return true
    })

    if (resoult === undefined)
      resoult = { index: this.areaList.length, isoCode: "OTHER", flag: "❓", zhName: "其他", enName: "Other", regExp: "❓|🏴‍☠️|其他|Other", count: 1 }
    return resoult
  }
}

export const nameConvert = new ProxyNameConvert(oriAreaList)
// const t = new ProxyNameConvert(oriAreaList)

// console.log(t.getIsoCode("ER"))
// console.log(t.getIsoCode("HK"))
// // console.log(t.getIsoCode("er"))
// console.log(t.getIsoCode("OTHER"))
