import type { Airport } from "./@types/clash-config"
import { DeployGist } from "./modules/deploy-gist"
import { parseEnv } from "./modules/env-check"
import Yaml2Json, { type AddNode } from "./modules/yaml2json"

const input = "../config/clash.yaml"
const output = "../dist"

const clash = new Yaml2Json(input, output)
await clash.load()

const env = parseEnv()

// 删除不需要的模块
if (env.DELETE_PROPERTY !== undefined) {
  clash.delete(clash.search(env.DELETE_PROPERTY))
}

if (env.PROVIDER_URLS !== undefined) {
  // 添加订阅 并把模板删除
  const s = clash.search(["proxy-providers.airport"])
  clash.add(s, (airport: Airport) => {
    const addNodes: AddNode[] = []
    for (const [i, v] of env.PROVIDER_URLS!.entries()) {
      const key = `airport${i.toString()}`
      const value = { ...airport, url: v }
      addNodes.push({ key, value })
    }
    return addNodes
  })
  clash.delete(s)
}

// 修改部分参数
if (env.CHECK_URL !== undefined) clash.change(clash.search(["proxy-groups.*.url"]), env.CHECK_URL)
if (env.CHECK_INTERVAL !== undefined) clash.change(clash.search(["proxy-groups.*.interval"]), env.CHECK_INTERVAL)
if (env.PROVIDERS_INTERVAL !== undefined) clash.change(clash.search(["proxy-providers.*.interval"]), env.PROVIDERS_INTERVAL)

if (!env.IS_DEPLOY) await clash.save(env.IS_FORMAT)

if (env.GIST_ID && env.GIST_TOKEN && env.IS_DEPLOY) {
  const deployGist = new DeployGist(env.GIST_ID, env.GIST_TOKEN)
  deployGist.pushToGist(clash.fileName, JSON.stringify(clash.doc))
}
