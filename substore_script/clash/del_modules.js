/*!https://accel.bigpig.online/https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/substore_script/clash/del_modules.js#del=tun,proxy-providers

参数：
[modules] :string,'|' ',' ' ' 区分，比如 ai=tun|dns,proxies*/
function r(e){return typeof e=="string"?e.split(/[|, ]/):e}var{del:t=[]}=$arguments;t=r(t);var n=ProxyUtils.yaml.safeLoad($content);t.length>0&&t.map(e=>{n[e]&&delete n[e]});$content=ProxyUtils.yaml.safeDump(n);
