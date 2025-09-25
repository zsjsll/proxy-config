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

/**
 * @param {Config} config
 * @param {Proxies} proxies
 */
function addProxies(config, proxies) {
  if (config["proxy-providers"] !== undefined) {
    delete config["proxy-providers"]
  }
  return { proxies, ...config }
}

/**
 * @param {Config} config
 */
function saveConfig(config) {
  $content = JSON.stringify(config, null, 2)
}

const proxies = await getProxies()
let config = getConfig()

config = addProxies(config, proxies)

saveConfig(config)
