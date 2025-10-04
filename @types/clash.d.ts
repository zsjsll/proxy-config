export {}

declare global {
  interface ProxyGroup {
    name: string
    type?: "url-test" | "select"
    tolerance?: number
    interval?: number
    "include-all"?: boolean
    url?:string
    proxies?: string[]
    hidden?: boolean
    filter?: string
    "exclude-filter"?: string

    // [key: string]: any
  }

  interface Config {
    proxies?: object[]
    "proxy-providers"?: object
    "proxy-groups": ProxyGroup[]
    [key: string]: any
  }
}
