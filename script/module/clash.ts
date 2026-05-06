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

  public async save(format = false) {
    // const fileUrl = new URL(this.output, Bun.pathToFileURL(Bun.main))
    let filePath = resolve(this.runningScriptPath, this.outputPath)

    if (!extname(filePath).startsWith(".")) {
      filePath = resolve(filePath, this.fileName)
    }
    const space = format ? 2 : 0

    await Bun.write(filePath, Bun.YAML.stringify(this.doc, undefined, space))
  }

  public find(paths: string[]) {
    if (this.doc === undefined) {
      throw new Error("not read file !")
    }

    const results: nodeHandle[] = []

    while (paths.length > 0) {
      const currentPath = paths.shift()!
      const keys = currentPath.split(".")
      const queue: Queue[] = [{ key: undefined, level: 0, node: this.doc, parent: undefined }]

      while (queue.length > 0) {
        const currentQueue = queue.shift()!
        const { node, parent, key, level } = currentQueue

        if (level === keys.length) {
          if (parent !== undefined && key !== undefined) {
            results.push({ key, parent, value: node })
          }
          // 继续处理队列中的其他任务
          continue
        }

        if (node === undefined || typeof node !== "object") {
          continue
        }
        // 获取当前层级的路径键名
        const currentKey = keys[level]
        const nextLevel = level + 1
        if (currentKey === "*") {
          // 通配符：将所有子节点加入队列
          const entries = Array.isArray(node) ? node.map((v, i) => ({ k: i, v })) : Object.entries(node).map(([k, v]) => ({ k, v }))
          for (const entry of entries) {
            queue.push({ key: entry.k, level: nextLevel, node: entry.v, parent: node })
          }
        } else if (currentKey !== undefined && Object.hasOwn(node, currentKey)) {
          // 普通键：将指定子节点加入队列
          queue.push({ key: currentKey, level: nextLevel, node: node[currentKey], parent: node })
        }
      }
    }

    if (results.length === 0) {
      throw new Error("not find node")
    }
    return results
  }

  public delete(nodes: nodeHandle[]) {
    nodes.forEach((node) => {
      node.parent[node.key] = undefined
    })
  }

  public change(nodes: nodeHandle[], setValue: any | ((val: any) => any)) {
    nodes.forEach((node) => {
      node.parent[node.key] = typeof setValue === "function" ? setValue(node.value) : setValue
    })
  }

  public add(nodes: nodeHandle[], addNode: AddNode | ((val: any) => AddNode)) {
    nodes.forEach((node) => {
      const newNode = typeof addNode === "function" ? addNode(node.value) : addNode
      node.parent[newNode.key] = newNode.value
    })
  }
}

interface nodeHandle {
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

interface AddNode {
  key: string | number
  value: any
}
