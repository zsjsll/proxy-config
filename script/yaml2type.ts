// oxlint-disable func-style
import { InputData, jsonInputForTargetLanguage, quicktype } from "quicktype-core"
import Clash from "./module/clash"

const inputPath = "../config/clash.yaml"
const outputPath = "./@types/clashConfig.ts"
const clash = new Clash(inputPath, outputPath)
const clashJson = await clash.load()

const input = jsonInputForTargetLanguage("typescript")
await input.addSource({
  name: "ClashConfig",
  samples: [JSON.stringify(clashJson)],
})

const inputData = new InputData()
inputData.addInput(input)

const result = await quicktype({
  inputData,
  lang: "typescript",
})

await clash.save(undefined, result.lines.join("\n"))

// bun -e "console.log(JSON.stringify(Bun.YAML.parse(await Bun.file('config/clash.yaml').text())))" | bunx quicktype -l ts -o clashconfig.ts
// bun -e "console.log(JSON.stringify(await import(await Bun.resolve('../config/clash.yaml',Bun.main))))"|bunx quicktype -l ts -o ./script/@types/clashConfig.ts
