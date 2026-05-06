import { basename, dirname, extname, resolve } from "node:path"

export default class ChangeConfig {
  private readonly runningScriptPath = dirname(Bun.main)
  private fileName = "clash.yaml"
  private inputPath: string
  private outputPath: string
  private doc: object | undefined = undefined

  public constructor(input: string, output: string) {
    this.inputPath = input
    this.outputPath = output
  }

  public async load() {
    const filePath = await Bun.resolve(this.inputPath, this.runningScriptPath)
    this.fileName = basename(filePath)
    this.doc = Bun.YAML.parse(await Bun.file(filePath).text()) as object
  }

  public async save() {
    // const fileUrl = new URL(this.output, Bun.pathToFileURL(Bun.main))
    let filePath = resolve(this.runningScriptPath, this.outputPath)

    if (!extname(filePath).startsWith(".")) {
      filePath = resolve(filePath, this.fileName)
    }
    await Bun.write(filePath, Bun.YAML.stringify(this.doc, undefined, 2))
  }

  // public deleteModules(modules: string[]) {
  //   if (modules.length > 0) {
  //     modules.forEach((module) => {
  //       this.doc[module] = undefined
  //     })
  //   }
  // }

  public search(path: string) {
    if (this.doc === undefined) {
      throw new Error("not read file !")
    }
    const keys = path.split(".")
    let queue: Queue[] = [{ node: this.doc, parent: undefined, key: undefined, level: 0 }]
    const results: NodeHandle[] = []

    while (keys.length > 0) {
      const current = queue.shift()!
      const { node, parent, key, level } = current

      if (level === keys.length) {
        if (parent !== undefined && key !== undefined) {
          results.push({ value: node, parent, key })
        }
        continue // 继续处理队列中的其他任务
      }

      if (node === null || typeof node !== "object") continue

      // 获取当前层级的路径键名
      const pathKey = keys[level]
      const nextLevel = level + 1

   if (pathKey === "*") {
      // 通配符：将所有子节点加入队列
      const entries = Array.isArray(node)
        ? node.map((v, i) => ({ k: i, v }))
        : Object.entries(node).map(([k, v]) => ({ k, v }));

      for (const entry of entries) {
        queue.push({ node: entry.v, parent: node, key: entry.k, level: nextLevel });
      }
    } else {
      // 普通键：将指定子节点加入队列
      if (node.hasOwnProperty(pathKey)) {
        queue.push({ node: node[pathKey], parent: node, key: pathKey, level: nextLevel });
      }
    }
  }


    }

    return results
  }
}

interface NodeHandle {
  value: any
  parent: any
  key: string | number
}

interface Queue {
  node: any
  parent: any
  key: string | number | undefined
  level: number
}
