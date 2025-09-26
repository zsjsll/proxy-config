let name = "all";
async function getProxies() {
    return await produceArtifact({
        name,
        type: "collection",
        platform: "ClashMeta",
        produceType: "internal",
        produceOpts: {
            "include-unsupported-proxy": true
        }
    });
}
function getConfig() {
    return ProxyUtils.yaml.safeLoad($files[0]);
}
function addProxies(config, proxies) {
    if (config["proxy-providers"] !== undefined) {
        delete config["proxy-providers"];
    }
    config.proxies = proxies;
    return true;
}
function saveConfig(config) {
    $content = ProxyUtils.yaml.safeDump(config);
    return true;
}
const proxies = await getProxies();
let config = getConfig();
addProxies(config, proxies);
// changeProxyGroups(config, proxies)
saveConfig(config);
