/*!https://accel.bigpig.online/https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/substore_script/clash/del_modules.js#del=tun,proxy-providers

参数：
[modules] :string,'|' ',' ' ' 区分，比如 ai=tun|dns,proxies*/
function o(t){return typeof t!="string"?t:t.split(/[|, ]/)}var{del:e=[""]}=$arguments;e=o(e);var n=ProxyUtils.yaml.safeLoad($content);e.map(t=>{n[t]&&delete n[t]});$content=ProxyUtils.yaml.safeDump(n);
