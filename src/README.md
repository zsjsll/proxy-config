# 使用

需配合 substore 一起使用。可使用 docker 部署

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

各种substore 的脚本，具体用法可以导入此脚本

`https://accel.bigpig.online/https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/dist/sub-store_file_free.json`

## config

配置文件

## rules

自定义的规则集
