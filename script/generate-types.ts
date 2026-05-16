import { InputData, jsonInputForTargetLanguage, quicktype } from "quicktype-core"
import { Yaml } from "./modules/yaml-tools"

const inputPath = "../config/clash.yaml"
const outputPath = "./@types/clash-config.d.ts"

const yaml = new Yaml(inputPath, outputPath)
await yaml.load()

const input = jsonInputForTargetLanguage("typescript")
await input.addSource({
  name: "DefaultConfig",
  samples: [JSON.stringify(yaml.doc)],
})

const inputData = new InputData()
inputData.addInput(input)

const result = await quicktype({
  inputData,
  lang: "typescript",
  rendererOptions: { "just-types": true },
})
await yaml.save(result.lines.join("\n"))

// bun -e "console.log(JSON.stringify(Bun.YAML.parse(await Bun.file('config/clash.yaml').text())))" | bunx quicktype -l ts -o clashconfig.ts -t ClashConfig
// bun -e "console.log(JSON.stringify(await import(await Bun.resolve('../config/clash.yaml',Bun.main))))"|bunx quicktype -l ts -o ./script/@types/clash-config.ts -t ClashConfig
