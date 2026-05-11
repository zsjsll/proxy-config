import json2ts from "@hacxy/json2ts"
import { HandleYaml } from "./modules/handle-yaml"

const inputPath = "../config/clash.yaml"
const outputPath = "./@types/clash-config.d.ts"

// const handleYaml = new HandleYaml(inputPath, outputPath)
// await handleYaml.load()

// const result = await json2ts(JSON.stringify(handleYaml.doc), "DefaultConfig")
// await handleYaml.save(result)

const doc = await import(inputPath)

const result = await json2ts(JSON.stringify(doc), "DefaultConfig")





// const input = jsonInputForTargetLanguage("typescript")
// await input.addSource({
//   name: "DefaultConfig",
//   samples: [JSON.stringify(clashJson)],
// })

// const inputData = new InputData()
// inputData.addInput(input)

// const result = await quicktype({
//   inputData,
//   lang: "typescript",
// }).lines.join("\n")
// await clash.save(undefined, result)

// bun -e "console.log(JSON.stringify(Bun.YAML.parse(await Bun.file('config/clash.yaml').text())))" | bunx quicktype -l ts -o clashconfig.ts -t ClashConfig
// bun -e "console.log(JSON.stringify(await import(await Bun.resolve('../config/clash.yaml',Bun.main))))"|bunx quicktype -l ts -o ./script/@types/clash-config.ts -t ClashConfig
