// substore_script/clash/add_proxies.ts
var { name = "airport", fixEmoji = false, type = "subscription" } = $arguments;
var pList = await produceArtifact({
  name,
  type,
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
if (Boolean(fixEmoji)) {
  pList.forEach((p) => {
    p.name = p.name.replace("\u{1F3F4}\u200D\u2620\uFE0F", "\u2753");
  });
}
content = { proxies: pList, ...content };
$content = ProxyUtils.yaml.safeDump(content);
