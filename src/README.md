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

`https://accel.bigpig.online/https://raw.githubusercontent.com/zsjsll/proxy-config/refs/heads/dist/sub-store_file_free.json`
导入此脚本
