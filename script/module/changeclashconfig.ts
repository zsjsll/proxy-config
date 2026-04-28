import { basename, extname } from "node:path"

export default class ChangeClashConfig {
  // private readonly metaPath: string = process.argv[1] ?? process.cwd()
  private readonly metaPath: string = Bun.main
  private fileName: string = "config.yaml"
  private inputPath: string
  private outputPath: string
  private doc: unknown = ""

  constructor(inputPath: string, outputPath: string) {
    this.inputPath = inputPath
    this.outputPath = outputPath
  }

  async load() {
    const fileUrl = new URL(this.inputPath, Bun.pathToFileURL(this.metaPath))
    const bunFile = Bun.file(fileUrl)

    try {
      if ((await bunFile.exists()) && bunFile.type === "text/yaml") {
        this.fileName = basename(fileUrl.pathname)
        return bunFile.text()
      }
      throw new Error("inputPath not a *.yaml path")
    } catch (error) {
      console.error(error)
    }
  }

  async save() {
    const fileUrl = new URL(this.outputPath, Bun.pathToFileURL(this.metaPath))

    console.log()

    if ([".yaml", ".yml"].includes(extname(fileUrl.pathname))) {
      Bun.write(fileUrl, this.doc)
    }
  }
}
