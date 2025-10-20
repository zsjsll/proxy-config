/*!https://accel.bigpig.online/https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/substore_script/clash/init_config.js

只是把文件 加载到全局变量 $content
方便后续的处理*/
var t=ProxyUtils.yaml.safeLoad($content);Object.keys(t).length===0&&(t=ProxyUtils.yaml.safeLoad($files[0]));$content=ProxyUtils.yaml.safeDump(t);
