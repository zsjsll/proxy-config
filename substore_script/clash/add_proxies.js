// substore_script/clash/add_proxies.ts
var { name = "airport" } = $arguments;
var pList = await produceArtifact({
  name,
  type: "collection",
  platform: "ClashMeta",
  produceType: "internal",
  produceOpts: {
    "include-unsupported-proxy": true
  }
});
var content = ProxyUtils.yaml.safeLoad($files[0]);
if (content["proxy-providers"] !== void 0) {
  delete content["proxy-providers"];
}
content = { proxies: pList, ...content };
$content = ProxyUtils.yaml.safeDump(content);
