/*!配合的模板 https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/config/clash/config_substore.yaml
脚本地址 https://accel.bigpig.online/https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/substore_script/clash/add_proxies.js#name=free&fixEmoji&type=collection

本脚本 可以传入参数：
[name] 为 substore 的订阅组合订阅名字
[isFixEmoji]:boolen 修改其他节点的emoji为❓
[type]: "subscription"|"collection" 修改其他节点的emoji为❓
[urls]  机场链接   https://a.a.a  多个链接 用 '|' ',' ' ' 区分 如果存在这个参数 sutstore 的订阅将无效，并且启用 proxy-providers 的模式进行订阅*/
function n(e){if(typeof e=="boolean")return e;if(e==="true")return!0;if(e==="false")return!1;throw new Error(`\u4F20\u5165\u53C2\u6570\u9519\u8BEF\uFF0C${e}\u5E94\u8BE5\u4E3Aboolen`)}var{name:u="airport",fixEmoji:o=!1,type:f="subscription",urls:p}=$arguments;o=n(o);var a=await produceArtifact({name:u,type:f,platform:"ClashMeta",produceType:"internal",produceOpts:{"include-unsupported-proxy":!0}}),r=ProxyUtils.yaml.safeLoad($files[0]),c={url:"https://a.a.a/",type:"http",interval:43200,"health-check":{enable:!0,url:"https://www.gstatic.com/generate_204",interval:300},proxy:"DIRECT"};o&&a.map(e=>{e.name=e.name.replace("\u{1F3F4}\u200D\u2620\uFE0F","\u2753")});if(p){if(r["proxy-providers"])throw new Error("\u8BF7\u5148\u5220\u9664 proxy-providers");let e=p.split(/[|, ]/).reduce((t,l,s)=>{let i="airport"+s;return t[i]=c,t[i].url=l,t},{});r["proxy-providers"]=e}else r={proxies:a,...r};$content=ProxyUtils.yaml.safeDump(r);
