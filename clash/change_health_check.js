/*!配合的模板 https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/config/clash/config_substore.yaml
脚本地址 https://accel.bigpig.online/https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/dist/clash/change_health_check.js#interval=43200&url=https://www.gstatic.com/generate_204&healthCheckInterval=300

本脚本 可以传入参数：
[interval] =43200 节点 provider 的更新间隔
[url] = "https://www.gstatic.com/generate_204" 健康检测的 url
[healthCheckInterval] = 300 进行节点检测的间隔时间（s），如果为 0 ，所有的test都会禁用，包括 proxy-group 的 url-test 都会删除*/

function i(e){let t=Number(e);if(!Number.isNaN(t))return t;throw new Error(`\u4F20\u5165\u53C2\u6570\u9519\u8BEF\uFF0C${e}\u5E94\u8BE5\u4E3Anumber`)}function u(){let e=ProxyUtils.yaml.safeLoad($content);return Object.keys(e).length===0&&(e=ProxyUtils.yaml.safeLoad($files[0])),e}function s(e){$content=ProxyUtils.yaml.safeDump(e)}var{interval:l=43200,url:p="https://www.gstatic.com/generate_204",healthCheckInterval:n=300}=$arguments;n=i(n);l=i(l);var r=u();r["proxy-providers"]&&Object.values(r["proxy-providers"]).map(e=>{e.interval=l,e["health-check"].enable=n!==0,e["health-check"].url=p,e["health-check"].interval=n});r["proxy-groups"].map(e=>{e.type==="url-test"&&(e.interval=n)});if(n===0){let e=r["proxy-groups"].filter(t=>t.type==="url-test").map(t=>t.name);r["proxy-groups"]=r["proxy-groups"].filter(t=>t.type!=="url-test"),r["proxy-groups"].map(t=>{e.some(o=>t.proxies?.includes(o))&&(t.proxies=t.proxies?.filter(o=>!e.includes(o)))})}s(r);
