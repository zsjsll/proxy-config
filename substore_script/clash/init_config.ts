/*!
https://accel.bigpig.online/https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/substore_script/clash/init_config.js

只是把文件 加载到全局变量 $content
方便后续的处理
*/

const content = ProxyUtils.yaml.safeLoad($files[0])
$content = ProxyUtils.yaml.safeDump(content)
