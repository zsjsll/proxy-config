import { basename, extname } from "node:path"

export default class ChangeClashConfig {
  private fileName: string
  private inputPath: string
  private outputPath: string
  private doc: Config = {} as Config

  constructor(inputPath: string, outputPath: string, doc?: Config) {
    this.inputPath = inputPath
    this.outputPath = outputPath
    this.fileName = basename(inputPath)
    if (doc === undefined) console.warn("use load() to load *.yaml")
    else this.doc = doc
  }

  async load() {
    const fileUrl = new URL(this.inputPath, Bun.pathToFileURL(Bun.main))
    const bunFile = Bun.file(fileUrl)


    try {
      if ((await bunFile.exists()) && bunFile.type === "text/yaml") {
        // this.doc = Bun.YAML.parse(await bunFile.text()) as Config
        this.doc = await import(fileUrl.href)
      } else throw new Error("inputPath not a *.yaml path")
    } catch (error) {
      console.error(error)
    }
  }

  async save() {
    const fileUrl = new URL(this.outputPath, Bun.pathToFileURL(Bun.main))

    if (extname(fileUrl.pathname).startsWith(".")) {
    } else {
      fileUrl.pathname = `${fileUrl.pathname}/${this.fileName}`
    }
    await Bun.write(fileUrl, Bun.YAML.stringify(this.doc))
  }
}
