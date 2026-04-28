import { basename } from "node:path"
import { pathToFileURL } from "node:url"
import ccc from "../../config/clash.yaml"

const path = new URL("../../config/clash.yaml", import.meta.url)

console.time("t1")
pathToFileURL(import.meta.path)
console.timeEnd("t1")

console.time("t2")
Bun.pathToFileURL(import.meta.path)
console.timeEnd("t2")

const aaa = await import("../../config/clash.yaml")

console.log(ccc)
