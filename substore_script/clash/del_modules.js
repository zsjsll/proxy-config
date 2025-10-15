/*!https://accel.bigpig.online/https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/substore_script/clash/del_modules.js#del=tun,proxy-providers

参数：
[modules] :string,'|' ',' ' ' 区分，比如 ai=tun|dns,proxies*/
var{modules:l}=$arguments,o=l.split(/[|, ]/),t=ProxyUtils.yaml.safeLoad($content);o.forEach(e=>{t[e]&&delete t[e]});$content=ProxyUtils.yaml.safeDump(t);
