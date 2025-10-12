export {}

let { name = "airport" } = $arguments

const p = await produceArtifact({
  name: name,
  type: "collection",
  platform: "ClashMeta",
  produceType: "internal",
  produceOpts: {
    "include-unsupported-proxy": true,
  },
})

let content = ProxyUtils.yaml.safeLoad($files[0])

if (content["proxy-providers"] !== undefined) {
  delete content["proxy-providers"]
}

content = { proxies: p, ...content }

$content = ProxyUtils.yaml.safeDump(content)
