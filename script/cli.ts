import type { Airport } from "./@types/clash-config"
import { DeployGist } from "./modules/deploy-gist"
import { parseEnv } from "./modules/env-check"
import { type AddNode, HandleYaml } from "./modules/handle-yaml"

const input = "../config/clash.yaml"
const output = "../dist"

const handleYaml = new HandleYaml(input, output)
await handleYaml.load()

const env = parseEnv()

// 删除不需要的模块
if (env.DELETE_PROPERTY !== undefined) {
  handleYaml.delete(handleYaml.search(env.DELETE_PROPERTY))
}

if (env.PROVIDER_URLS !== undefined) {
  // 添加订阅 并把模板删除
  const s = handleYaml.search(["proxy-providers.airport"])
  handleYaml.add(s, (airport: Airport) => {
    const addNodes: AddNode[] = []
    for (const [i, v] of env.PROVIDER_URLS!.entries()) {
      const key = `airport${i.toString()}`
      const value = { ...airport, url: v }
      addNodes.push({ key, value })
    }
    return addNodes
  })
  handleYaml.delete(s)
}

// 修改部分参数
if (env.CHECK_URL !== undefined) handleYaml.change(handleYaml.search(["proxy-groups.*.url"]), env.CHECK_URL)
if (env.CHECK_INTERVAL !== undefined) handleYaml.change(handleYaml.search(["proxy-groups.*.interval"]), env.CHECK_INTERVAL)
if (env.PROVIDERS_INTERVAL !== undefined) handleYaml.change(handleYaml.search(["proxy-providers.*.interval"]), env.PROVIDERS_INTERVAL)

if (!env.IS_DEPLOY_TO_GIST) await handleYaml.save()

if (env.GIST_ID && env.GIST_TOKEN && env.IS_DEPLOY_TO_GIST) {
  const deployGist = new DeployGist(env.GIST_ID, env.GIST_TOKEN)
  deployGist.pushToGist(handleYaml.fileName, JSON.stringify(handleYaml.doc))
}
