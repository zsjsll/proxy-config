# 说明

利用 github action 修改 config/clash.yaml 文件, 并把修改后的配置推送到 gist .

# 构建

项目初始化 `bun i`

构建脚本 `bun run cil`

生成 .d.ts 文件 `bun run yaml2ts`

# 环境变量

| 环境变量                 | 默认值 | 说明                           | 样式                                   |
| :----------------------- | :----: | :----------------------------- | :------------------------------------- |
| PROVIDER_URLS            |  空\*  | 机场链接                       | 2种方式 `["a","b","c"]` 或者 `a,b,c`   |
| RULE_PROVIDERS_PROXY_URL |   空   | 为 rule-providers 添加代理     | 字符串 `https://github.boki.moe/`      |
| DELETE_PROPERTY          |   空   | 需要删除的模块                 | 2种方式 `["a","b","c"]` 或者 `a,b,c`   |
| CHECK_URL                |   空   | 进行健康检测的 url 必须是      | url 格式 `https://` 开头               |
| PROVIDERS_INTERVAL       |   空   | [节点提供者] 的拉取时间间隔(s) | 使用表达式 如 `60\*60\*12` 或者 `3600` |
| CHECK_INTERVAL           |   空   | [节点组] 质量检测的时间间隔(s) | 使用表达式 如 `60\*60\*12` 或者 `3600` |
| GIST_TOKEN               |  空\*  | github 申请 GIST_TOKEN         | 字符串 `ghp_xxxx`                      |
| GIST_ID                  |   空   | url最后一部分                  | 字符串 `abcdefg`                       |
| IS_DEPLOY_TO_GIST        |   空   | 是否部署到 gist                | `true` 或者 `false`                    |

## 例子

```ini
PROVIDER_URLS = ["aaaa","bbbb","cccc"]

RULE_PROVIDERS_PROXY_URL = https://github.boki.moe/

DELETE_PROPERTY = ["tun","global_anchor"]

CHECK_URL = https://www.gstatic.com/generate_204
# CHECK_URL = https://cp.cloudflare.com

PROVIDERS_INTERVAL = 60*60*12

CHECK_INTERVAL = 60*60*24

GIST_TOKEN = ghp_xxxx

GIST_ID = abcdefg

IS_DEPLOY_TO_GIST = false

```

## 读取顺序

从左到右, 依次读取, 依次覆盖:

`.env` -> `.env.local` -> `系统环境变量` ->` 命令行临时变量: KEY=val bun run x`
