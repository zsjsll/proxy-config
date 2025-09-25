let name = "all"

const proxies = await produceArtifact({
  name,
  type: "collection",
  platform: "ClashMeta",
  produceType: "internal",
  produceOpts: {
    "include-unsupported-proxy": true,
  },
})

let config = ProxyUtils.yaml.safeLoad($files[0])

if (config["proxy-providers"] !== undefined) delete config["proxy-providers"]
config.proxies = proxies

$content = ProxyUtils.yaml.safeDump(config)
