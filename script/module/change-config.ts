import { basename, dirname, extname, resolve } from "node:path"

export default class ChangeConfig {
  private readonly runningScriptPath = dirname(Bun.main)
  private fileName = "clash.yaml"
  private inputPath: string
  private outputPath: string
  private doc: Config = {} as Config

  public constructor(input: string, output: string) {
    this.inputPath = input
    this.outputPath = output
  }

  public async load() {
    const filePath = await Bun.resolve(this.inputPath, this.runningScriptPath)
    this.fileName = basename(filePath)
    this.doc = Bun.YAML.parse(await Bun.file(filePath).text()) as Config
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

  public search(path: string, fn: (key: string, val: any) => any) {
    const keys = path.split(".")

    return keys.reduce(
      (acc, key) =>
        acc.reduce((nextAcc, currentObj) => {
          if (key === "*") {
            const children = Array.isArray(currentObj) ? currentObj : Object.values(currentObj)
            // 合并到下一层候选池
            return [...nextAcc, ...children]
          }
          if (currentObj[key] !== null) {
            const f = fn(key, currentObj[key])
            currentObj[key] = f
            return [...nextAcc, currentObj[key]]
          }
          return currentObj[key]
        }, []),
      [this.doc],
    )
  }
}
