import type { Airport } from "./@types/clash-config"
import { DeployGist } from "./modules/deploy-gist"
import { parseEnv } from "./modules/env-check"
import { type AddNode, Yaml } from "./modules/yaml-tools"

const input = "../config/clash.yaml"
const output = "../dist"

const yaml = new Yaml(input, output)
await yaml.load()

const env = parseEnv()

// 删除不需要的模块
if (env.DELETE_PROPERTY !== undefined) {
	yaml.delete(yaml.search(env.DELETE_PROPERTY))
}

if (env.PROVIDER_URLS !== undefined) {
	// 添加订阅 并把模板删除
	const s = yaml.search(["proxy-providers.airport"])
	yaml.add(s, (airport: Airport) => {
		const addNodes: AddNode[] = []
		for (const [i, v] of env.PROVIDER_URLS!.entries()) {
			const key = `airport${i.toString()}`
			const value = { ...airport, url: v }
			addNodes.push({ key, value })
		}
		return addNodes
	})
	yaml.delete(s)
}

// 修改部分参数
if (env.CHECK_URL) yaml.change(yaml.search(["proxy-groups.*.url"]), env.CHECK_URL)
if (env.CHECK_INTERVAL) yaml.change(yaml.search(["proxy-groups.*.interval"]), env.CHECK_INTERVAL)
if (env.PROVIDERS_INTERVAL) yaml.change(yaml.search(["proxy-providers.*.interval"]), env.PROVIDERS_INTERVAL)
if (env.RULE_PROVIDERS_PROXY_URL) yaml.change(yaml.search(["rule-providers.*.url"]), (val: string) => env.RULE_PROVIDERS_PROXY_URL + val)

if (!env.IS_DEPLOY_TO_GIST) await yaml.save()

if (env.GIST_ID && env.GIST_TOKEN && env.IS_DEPLOY_TO_GIST) {
	const deployGist = new DeployGist(env.GIST_ID, env.GIST_TOKEN)
	deployGist.pushToGist(yaml.fileName, JSON.stringify(yaml.doc))
}
