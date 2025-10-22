# 使用

需配合 substore 一起使用
可使用 docker 部署

```yaml
services:
  sub-store:
    image: xream/sub-store
    container_name: sub-store
    restart: unless-stopped
    environment:
      - SUB_STORE_CRON=55 23 * * *
      - SUB_STORE_FRONTEND_BACKEND_PATH=/zi ji tian xie
    ports:
      - "3001:3001"
    volumes:
      - ./data:/opt/app/data
    tty: true
    stdin_open: true
```

# 目录结构

## clash

各种 substore 配置 clash 的脚本，具体用法可以导入此脚本 [sub-store_file_free.json](https://accel.bigpig.online/https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/dist/sub-store_file_free.json)

## config

配置文件

<a href="https://accel.bigpig.online/https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/dist/config/clash/config_substore.yaml" target="_blank" rel="noopener noreferrer">config_substore.yaml</a> **优先** 规则集通过mrs加载

<a href="https://accel.bigpig.online/https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/dist/config/clash/config_db.yaml" target="_blank" rel="noopener noreferrer">config_db.yaml</a> 规则集通过db加载

## rules

自定义的规则集

<a href="https://accel.bigpig.online/https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/dist/rules/proxy.yaml" target="_blank" rel="noopener noreferrer">proxy.yaml</a>

<a href="https://accel.bigpig.online/https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/dist/rules/direct.yaml" target="_blank" rel="noopener noreferrer">direct.yaml</a>

<a href="https://accel.bigpig.online/https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/dist/rules/reject.yaml" target="_blank" rel="noopener noreferrer">reject.yaml</a>
