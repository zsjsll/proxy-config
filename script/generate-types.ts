import json2ts from "@hacxy/json2ts"
import { Yaml } from "./modules/yaml-tools"

const inputPath = "../config/clash.yaml"
const outputPath = "./@types/clash-config.d.ts"

const yaml = new Yaml(inputPath, outputPath)
await yaml.load()

const result = await json2ts(JSON.stringify(yaml.doc), "DefaultConfig")
await yaml.save(result)

// const inputFileRef = Yaml.getFileRef(inputPath)
// const outputFileRef = Yaml.getFileRef(outputPath)

// const doc = await import(inputFileRef.name as string)
// const result = await json2ts(JSON.stringify(doc), "DefaultConfig")
// outputFileRef.write(result)

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
