export {}

declare global {
  const $files: string[]
  let $content: string
  let $server: {
    name: string
    type: string
    server: string
    port: number
    password: string
    protocol: string
    obfs: string
    cipher: string
    "protocol-param": string
    "obfs-param": string
    id: number
    _subName: string
    _subDisplayName: string
  }

  interface ProxyGroup {
    name: string
    type: "url-test" | "select"
    tolerance?: number
    interval?: number
    "includes-all"?: boolean
    proxies?: string[]
    hidden?: boolean
    [key: string]: any
  }

  interface Config {
    proxies?: object[]
    "proxy-providers"?: object
    "proxy-groups": ProxyGroup[]
    [key: string]: any
  }
}
