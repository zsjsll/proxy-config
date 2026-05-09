import json2ts from "@hacxy/json2ts"
import Yaml2Json from "./modules/yaml2json"

const inputPath = "../config/clash.yaml"
const outputPath = "./@types/clash-config.d.ts"
const clash = new Yaml2Json(inputPath, outputPath)
const clashJson = await clash.load()

const result = await json2ts(JSON.stringify(clashJson), "DefaultConfig")
await clash.save(undefined, result)

// const input = jsonInputForTargetLanguage("typescript")
// await input.addSource({
//   name: "ClashConfig",
//   samples: [JSON.stringify(clashJson)],
// })

// const inputData = new InputData()
// inputData.addInput(input)

// const result = await quicktype({
//   inputData,
//   lang: "typescript",
// })
// await clash.save(undefined, result.lines.join("\n"))

// bun -e "console.log(JSON.stringify(Bun.YAML.parse(await Bun.file('config/clash.yaml').text())))" | bunx quicktype -l ts -o clashconfig.ts -t ClashConfig
// bun -e "console.log(JSON.stringify(await import(await Bun.resolve('../config/clash.yaml',Bun.main))))"|bunx quicktype -l ts -o ./script/@types/clash-config.ts -t ClashConfig
