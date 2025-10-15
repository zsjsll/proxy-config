/*!配合的模板 https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/config/clash/config_substore.yaml
脚本地址 https://accel.bigpig.online/https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/substore_script/clash/add_proxies.js#name=free&fixEmoji&type=collection

本脚本 可以传入参数：
[name] 为 substore 的订阅组合订阅名字
[fixEmoji]:boolen 修改其他节点的emoji为❓
[type]: "subscription"|"collection" 修改其他节点的emoji为❓
[urls]  机场链接   https://a.a.a  多个链接 用 '|' ',' ' ' 区分 如果存在这个参数 sutstore 的订阅将无效，并且启用 proxy-providers 的模式进行订阅*/
var{name:l="airport",fixEmoji:n=!1,type:c="subscription",urls:a}=$arguments,p=await produceArtifact({name:l,type:c,platform:"ClashMeta",produceType:"internal",produceOpts:{"include-unsupported-proxy":!0}}),e=ProxyUtils.yaml.safeLoad($files[0]),u={url:"https://a.a.a/",type:"http",interval:43200,"health-check":{enable:!0,url:"https://www.gstatic.com/generate_204",interval:300},proxy:"DIRECT"};n&&p.forEach(r=>{r.name=r.name.replace("\u{1F3F4}\u200D\u2620\uFE0F","\u2753")});if(a){if(e["proxy-providers"])throw new Error("\u8BF7\u5148\u5220\u9664 proxy-providers");let r=a.split(/[|, ]/).reduce((t,s,i)=>{let o="airport"+i;return t[o]=u,t[o].url=s,t},{});e["proxy-providers"]=r}else e={proxies:p,...e};$content=ProxyUtils.yaml.safeDump(e);
