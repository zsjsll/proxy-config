/*!https://accel.bigpig.online/https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/substore_script/clash/del_modules.js#del=tun,proxy-providers

参数：
[modules] :string,'|' ',' ' ' 区分，比如 ai=tun|dns,proxies*/
var{del:l=""}=$arguments,n=l.split(/[|, ]/),t=ProxyUtils.yaml.safeLoad($content);n.map(e=>{t[e]&&delete t[e]});$content=ProxyUtils.yaml.safeDump(t);
