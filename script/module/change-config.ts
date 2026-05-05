import { basename, dirname, extname, resolve } from "node:path"
import clashConfig from "../../config/clash.yaml"

type ClashConfig = typeof clashConfig

export default class ChangeConfig {
  private readonly runningScriptPath = dirname(Bun.main)
  private fileName = "clash.yaml"
  private inputPath: string
  private outputPath: string
  private doc: ClashConfig = {} as ClashConfig

  public constructor(input: string, output: string) {
    this.inputPath = input
    this.outputPath = output
  }

  public async load() {
    const filePath = await Bun.resolve(this.inputPath, this.runningScriptPath)
    this.fileName = basename(filePath)
    this.doc = Bun.YAML.parse(await Bun.file(filePath).text()) as ClashConfig
  }

  public async save() {
    // const fileUrl = new URL(this.output, Bun.pathToFileURL(Bun.main))
    let filePath = resolve(this.runningScriptPath, this.outputPath)

    if (!extname(filePath).startsWith(".")) {
      filePath = resolve(filePath, this.fileName)
    }
    await Bun.write(filePath, Bun.YAML.stringify(this.doc, undefined, 2))
  }

  public deleteModules(modules: string[]) {
    if (modules.length > 0) {
      modules.forEach((module) => {
        this.doc[module] = undefined
      })
    }
  }

  public search(path: string) {
    // const keys = path.split(".")

    let result = this.doc
    let parents = []
    path.split(".").forEach((value, index, arr) => {
      if (index === arr.length - 1) {
        result[value] = 123
      }
      result = result[value]
    })

    return result
  }
}
