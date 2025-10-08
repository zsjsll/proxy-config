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

模板地址 https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/config/clash/config_substore.yaml
脚本地址 https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/self/substore_script/convert_clash.js#isHide&name=free&ai=HK|JP|RU


## singbox
