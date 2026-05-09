import { basename, dirname, extname, resolve } from "node:path"

export default class Yaml2Json {
  private readonly mainDir = dirname(Bun.main)
  private fileName = "clash.yaml"
  private inputPath: string
  private outputPath: string
  private doc: object | undefined = undefined

  public constructor(input: string, output: string) {
    this.inputPath = input
    this.outputPath = output
  }

  public async load() {
    const filePath = await Bun.resolve(this.inputPath, this.mainDir)
    this.fileName = basename(filePath)
    this.doc = Bun.YAML.parse(await Bun.file(filePath).text()) as object
    return this.doc
  }

  public async save(format = false, doc: object | string | undefined = this.doc, path = "") {
    // const fileUrl = new URL(this.output, Bun.pathToFileURL(Bun.main))

    if (doc === undefined) throw new TypeError("doc is undefined")

    let filePath = path === "" ? resolve(this.mainDir, this.outputPath) : path

    if (!extname(filePath).startsWith(".")) filePath = resolve(filePath, this.fileName)

    const space = format ? 2 : 0
    const endFix = extname(filePath)
    if ([".json", ".jsonc"].includes(endFix)) {
      await Bun.write(filePath, JSON.stringify(doc, undefined, space))
    } else if ([".ts", ".d.ts", ".mts"].includes(endFix)) {
      await Bun.write(filePath, doc.toString())
    } else {
      await Bun.write(filePath, Bun.YAML.stringify(doc, undefined, space))
    }
    console.log(`save to: ${[filePath]}`)
  }

  public search(paths: string[]) {
    if (this.doc === undefined) throw new ReferenceError("not read file !")

    const results: NodeHandle[] = []

    let previousResultsLength = results.length
    for (const [pathIndex, pathValue] of paths.entries()) {
      const keys = pathValue.split(".")
      const queue: Queue[] = [{ key: undefined, level: 0, node: this.doc, parent: undefined }]

      for (const { node, parent, key, level } of queue) {
        if (level === keys.length && parent !== undefined && key !== undefined) {
          results.push({ key, parent, value: node })
          continue
        }
        if (node === undefined || node === null || typeof node !== "object") continue

        // 获取当前层级的路径键名
        const currentKey = keys[level]
        const nextLevel = level + 1
        if (currentKey === "*") {
          // 通配符：将所有子节点加入队列
          const entries = Array.isArray(node) ? node.map((v, i) => ({ k: i, v })) : Object.entries(node).map(([k, v]) => ({ k, v }))
          for (const entry of entries) {
            queue.push({ node: entry.v, parent: node, key: entry.k, level: nextLevel })
          }
        } else if (currentKey !== undefined && !Array.isArray(node) && Object.hasOwn(node, currentKey)) {
          // 普通键：将指定子节点加入队列
          queue.push({ node: node[currentKey], parent: node, key: currentKey, level: nextLevel })
        }
        // else {

        // }
      }
      const nowResultsLength = results.length
      if (previousResultsLength === nowResultsLength) {
        throw new Error(`⚠️  not find node, in params path:
           ${Bun.inspect(paths)}
           -> ${Bun.inspect(paths.at(pathIndex))}
           -> ${Bun.inspect(keys[queue.at(-1)!.level])} ❌
           spell error ?`)
      }
      previousResultsLength = nowResultsLength
    }
    return results
  }

  public delete(nodes: NodeHandle[]) {
    nodes.forEach((node) => {
      node.parent[node.key] = undefined
    })
  }

  public change(nodes: NodeHandle[], setValue: any | ((val: any) => any)) {
    nodes.forEach((node) => {
      node.parent[node.key] = typeof setValue === "function" ? setValue(node.value) : setValue
    })
  }

  public add(nodes: NodeHandle[], addNodes: AddNode[] | ((val: any) => AddNode[])) {
    nodes.forEach((node) => {
      const newNodes = typeof addNodes === "function" ? addNodes(node.value) : addNodes
      newNodes.forEach((newNode) => (node.parent[newNode.key] = newNode.value))
    })
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

export interface AddNode {
  key: string | number
  value: any
}
