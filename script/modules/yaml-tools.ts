import { basename, dirname, extname, resolve } from "node:path"
import type { BunFile } from "bun"

export class Yaml {
	#fileName: string
	#inputFileRef: BunFile
	#outputFileRef: BunFile
	#doc: object | undefined = undefined

	constructor(inputPath: string, outputPath: string) {
		const hasFileName = extname(outputPath).startsWith(".")
		this.#fileName = hasFileName ? basename(outputPath) : basename(inputPath)
		this.#inputFileRef = Yaml.getFileRef(inputPath)
		this.#outputFileRef = hasFileName ? Yaml.getFileRef(outputPath) : Yaml.getFileRef(outputPath, this.#fileName)
	}

	static getFileRef(...path: string[]) {
		const mainDir = dirname(Bun.main)
		const resolvePath = resolve(mainDir, ...path)
		return Bun.file(resolvePath)
	}

	get fileName(): string {
		return this.#fileName
	}

	get doc() {
		return this.#doc
	}

	async load(): Promise<Readonly<{ fileName: string; doc: object }>> {
		// console.log("load from:", this.#inputFileRef.name)
		this.#doc = Bun.YAML.parse(await this.#inputFileRef.text()) as object
		return { fileName: this.#fileName, doc: this.#doc }
	}

	async save(doc?: string, format = true) {
		// if (this.#doc === undefined) throw new ReferenceError("❌ The object cannot be read and the load() function has not been run ?")
		const suffix = extname(this.#outputFileRef.name as string).toLowerCase()
		if (doc) {
			await this.#outputFileRef.write(doc)
		}
		const space = format ? 2 : 0
		if (suffix === ".yml" || suffix === ".yaml") {
			await this.#outputFileRef.write(Bun.YAML.stringify(this.#doc, undefined, space))
		}
		console.log(`💾 save to: ${[this.#outputFileRef.name]}`)
	}

	search(paths: string[]) {
		if (this.#doc === undefined) throw new ReferenceError("❌ The object cannot be read and the load() function has not been run ?")
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
			newNodes.forEach((newNode) => {
				node.parent[newNode.key] = newNode.value
			})
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

if (import.meta.main) {
	const a = Yaml.getFileRef("../../config")
	console.log(a)

	const yaml = new Yaml("../../config/clash.yaml", "../../dist")
	await yaml.load()

	yaml.save()
}
