export default class ChangeClashConfig {
  private inputPath: string
  private outputPath: string

  constructor(inputPath: string, outputPath: string) {
    this.inputPath = inputPath
    this.outputPath = outputPath
  }

  load() {
    const path = new URL(this.inputPath, import.meta.url)
    console.log(process.cwd())
    console.log(import.meta.url)
    // console.log(path)
  }

  save() {}
}
