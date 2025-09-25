declare const $files: string[]
declare let $content: string
declare let $server: {
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

interface O {
  name: string
  type: "subscription" | "collection"
  platform: "ClashMeta" | "sing-box"
  produceType: "internal"
  produceOpts?: {
    "include-unsupported-proxy": boolean
  }
}

type Proxies = object[]

declare function produceArtifact(object: O): Promise<Proxies>

interface Proxy {
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
  "proxy-groups": Proxy[]
  [key: string]: any
}

declare const ProxyUtils: {
  yaml: {
    safeLoad: (filePath: string | string[]) => Config
    safeDump: (obj: object) => string
  }

  getFlag: (serverName: string | object[]) => void
  removeFlag: (serverName: string | object[]) => void
  getISO: (serverName: string | object[]) => void
}
