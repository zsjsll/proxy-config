/*!配合的模板 https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/config/clash/config_substore.yaml
脚本地址 https://accel.bigpig.online/https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/substore_script/clash/add_proxies.js#name=free&isFixEmoji=true&type=collection

本脚本 可以传入参数：
[name] 为 substore 的订阅组合订阅名字
[isFixEmoji]:boolen 修改其他节点的emoji为❓
[type]: "subscription"|"collection" 修改其他节点的emoji为❓
[urls]  机场链接   https://a.a.a  多个链接 用 '|' ',' ' ' 区分 如果存在这个参数 sutstore 的订阅将无效，并且启用 proxy-providers 的模式进行订阅*/
function p(r){if(typeof r=="boolean")return r;if(r==="true")return!0;if(r==="false")return!1;throw new Error(`\u4F20\u5165\u53C2\u6570\u9519\u8BEF\uFF0C${r}\u5E94\u8BE5\u4E3Aboolean`)}function a(r){return typeof r=="string"?r.split(/[|, ]/):r}var{name:f="airport",isFixEmoji:n=!1,type:c="subscription",urls:t=[]}=$arguments;t=a(t);n=p(n);var s=await produceArtifact({name:f,type:c,platform:"ClashMeta",produceType:"internal",produceOpts:{"include-unsupported-proxy":!0}}),e=ProxyUtils.yaml.safeLoad($content),m={url:"https://a.a.a/",type:"http",interval:43200,"health-check":{enable:!0,url:"https://www.gstatic.com/generate_204",interval:180},proxy:"DIRECT"};n&&s.map(r=>{r.name=r.name.replace("\u{1F3F4}\u200D\u2620\uFE0F","\u2753")});if(t.length>0){if(e["proxy-providers"])throw new Error("\u8BF7\u5148\u5220\u9664 proxy-providers");let r=t.reduce((o,l,u)=>{let i="airport"+u;return o[i]=m,o[i].url=l,o},{});e["proxy-providers"]=r}else e={proxies:s,...e};$content=ProxyUtils.yaml.safeDump(e);
