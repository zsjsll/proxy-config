import { basename, dirname, extname, resolve } from "node:path"

export class HandleYaml {
  #fileName: string
  #inputPath: string
  #outputPath: string
  #doc: string | object | undefined = undefined

  constructor(input: string, output: string) {
    const hasFileName = extname(output).startsWith(".")
    const runMainDir = dirname(Bun.main)
    this.#fileName = hasFileName ? basename(output) : basename(input)
    this.#inputPath = Bun.resolveSync(input, runMainDir)
    this.#outputPath = hasFileName ? resolve(runMainDir, output) : resolve(runMainDir, output, this.#fileName)
  }

  get fileName(): string {
    return this.#fileName
  }

  get doc() {
    return this.#doc
  }

  async load() {
    console.log("load from:", this.#inputPath)
    this.#doc = Bun.YAML.parse(await Bun.file(this.#inputPath).text()) as object
    return { fileName: this.#fileName, doc: this.#doc }
  }

  async save(text?: string, format = true) {
    this.#doc = text ?? this.#doc
    if (this.#doc === undefined) throw new ReferenceError("❌ The object cannot be read and the load() function has not been run ?")
    const space = format ? 2 : 0
    const suffix = extname(this.#outputPath).toLowerCase()
    if (suffix === ".ts") await Bun.write(this.#outputPath, this.#doc as string)

    if (suffix === ".yml" || suffix === ".yaml") {
      await Bun.write(this.#outputPath, Bun.YAML.stringify(this.#doc, undefined, space))
    }
    if (suffix === ".json" || suffix === ".jsonc") {
      await Bun.write(this.#outputPath, JSON.stringify(this.#doc, undefined, space))
    }

    console.log(`save to: ${[this.#outputPath]}`)
  }

  search(paths: string[]) {
    if (typeof this.#doc === "object") throw new ReferenceError("❌ The object cannot be read and the load() function has not been run ?")
    const results: NodeHandle[] = []

    let previousResultsLength = results.length
    for (const [pathIndex, pathValue] of paths.entries()) {
      const keys = pathValue.split(".")
      const queue: Queue[] = [{ key: undefined, level: 0, node: this.#doc, parent: undefined }]

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
      }
      const nowResultsLength = results.length
      if (previousResultsLength === nowResultsLength) {
        throw new Error(`❌ No node was found, in params path:
           ${Bun.inspect(paths)}
           -> ${Bun.inspect(paths.at(pathIndex))}
           -> ${Bun.inspect(keys[queue.at(-1)!.level])} 👈
           spell error ?`)
      }
      previousResultsLength = nowResultsLength
    }
    return results
  }

  delete(nodes: NodeHandle[]) {
    nodes.forEach((node) => {
      node.parent[node.key] = undefined
    })
  }

  change(nodes: NodeHandle[], setValue: any | ((val: any) => any)) {
    nodes.forEach((node) => {
      node.parent[node.key] = typeof setValue === "function" ? setValue(node.value) : setValue
    })
  }

  add(nodes: NodeHandle[], addNodes: AddNode[] | ((val: any) => AddNode[])) {
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
