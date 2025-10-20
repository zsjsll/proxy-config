/*!https://accel.bigpig.online/https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/substore_script/clash/del_modules.js#del=tun,proxy-providers

参数：
[modules] :string,'|' ',' ' ' 区分，比如 ai=tun|dns,proxies*/

function r(t){return typeof t=="string"?t.split(/[|, ]/):t}function o(){let t=ProxyUtils.yaml.safeLoad($content);return Object.keys(t).length===0&&(t=ProxyUtils.yaml.safeLoad($files[0])),t}function i(t){$content=ProxyUtils.yaml.safeDump(t)}var{del:e=[]}=$arguments;e=r(e);var n=o();e.length>0&&e.map(t=>{n[t]&&delete n[t]});i(n);
