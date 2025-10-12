declare global {
  interface SubInfo {
    name: string
    type: "subscription" | "collection"
    platform: "ClashMeta" | "sing-box"
    produceType: "internal"
    produceOpts?: {
      "include-unsupported-proxy": boolean
    }
  }

  interface Proxy {
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
    _subName: string
    _subDisplayName: string
    _collectionName: string
    _collectionDisplayName: string
  }

  type Proxies = Proxy[]

  function produceArtifact(sub: SubInfo): Promise<Proxies>
}

export {}
