let name = "all"

async function getProxies() {
  return await produceArtifact({
    name,
    type: "collection",
    platform: "ClashMeta",
    produceType: "internal",
    produceOpts: {
      "include-unsupported-proxy": true,
    },
  })
}

function getConfig() {
  return ProxyUtils.yaml.safeLoad($files[0])
}

function addProxies(config: Config, proxies: Proxies) {
  if (config["proxy-providers"] !== undefined) {
    delete config["proxy-providers"]
  }
  config.proxies = proxies
  return config
}

function changeProxyGroups(config: Config) {}

function saveConfig(config: Config) {
  $content = ProxyUtils.yaml.safeDump(config)
}

const proxies = await getProxies()
let config = getConfig()

config = addProxies(config, proxies)
saveConfig(config)
