# 构建

本项目为 substore 的 script，位于 substore_script 中，通过 esbuild 打包

项目初始化 `pnpm i`

构建脚本 `pnpm run build`
监听脚本 `pnpm run watch`

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

## clash

`https://accel.bigpig.online/https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/substore_script/clash/sub-store_file_tunnel.json`
导入此脚本
