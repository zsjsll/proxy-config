export {}

declare global {
  interface ProxyGroup {
    name: string
    type?: "url-test" | "select"
    tolerance?: number
    interval?: number
    "include-all"?: boolean
    url?: string
    proxies?: string[]
    hidden?: boolean
    filter?: string
    "exclude-filter"?: string

    // [key: string]: any
  }

  interface Config {
    proxies?: Proxies
    "proxy-providers"?: { [K: string]: ProxyProvider }
    "proxy-groups": ProxyGroup[]
    [key: string]: any
  }

  interface ProxyProvider {
    url: string
    type: "http" | "file" | "inline"
    interval: number
    "health-check": {
      enable: boolean
      url: "https://cp.cloudflare.com" | "https://www.gstatic.com/generate_204"
      interval: number
    }
    proxy: "DIRECT" | string
  }
}
