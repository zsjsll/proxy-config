/*!配合的模板 https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/config/clash/config_substore.yaml
脚本地址 https://accel.bigpig.online/https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/substore_script/clash/add_proxies.js#name=free&isFixEmoji=true&type=collection

本脚本 可以传入参数：
[name] 为 substore 的订阅组合订阅名字
[isFixEmoji]:boolen 修改其他节点的emoji为❓
[type]: "subscription"|"collection" 修改其他节点的emoji为❓
[urls]  机场链接   https://a.a.a  多个链接 用 '|' ',' ' ' 区分 如果存在这个参数 sutstore 的订阅将无效，并且启用 proxy-providers 的模式进行订阅*/

function s(e){if(typeof e=="boolean")return e;if(e==="true")return!0;if(e==="false")return!1;throw new Error(`\u4F20\u5165\u53C2\u6570\u9519\u8BEF\uFF0C${e}\u5E94\u8BE5\u4E3Aboolean`)}function l(e){return typeof e=="string"?e.split(/[|, ]/):e}function u(){let e=ProxyUtils.yaml.safeLoad($content);return Object.keys(e).length===0&&(e=ProxyUtils.yaml.safeLoad($files[0])),e}function f(e){$content=ProxyUtils.yaml.safeDump(e)}var{name:i="",isFixEmoji:a=!1,type:y="subscription",urls:r=[]}=$arguments;r=l(r);a=s(a);var t=u();if(r.length>0&&i!=="")throw new Error("'name', 'urls' \u4E8C\u9009\u4E00");if(r.length>0){let e={url:"https://a.a.a/",type:"http",interval:43200,"health-check":{enable:!0,url:"https://www.gstatic.com/generate_204",interval:180},proxy:"DIRECT"};if(t["proxy-providers"]?.airport){let n=r.shift();t["proxy-providers"].airport.url=n}let c=r.reduce((n,m,x)=>{let p="airport"+x;return n[p]=e,n[p].url=m,n},{});t["proxy-providers"]={...t["proxy-providers"],...c}}var o;i!==""&&(o=await produceArtifact({name:i,type:y,platform:"ClashMeta",produceType:"internal",produceOpts:{"include-unsupported-proxy":!0}}),a&&o.map(e=>{e.name=e.name.replace("\u{1F3F4}\u200D\u2620\uFE0F","\u2753")}),t={proxies:o,...t});f(t);
