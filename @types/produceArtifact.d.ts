interface Sub {
  name: string
  type: "subscription" | "collection"
  platform: "ClashMeta" | "sing-box"
  produceType: "internal"
  produceOpts?: {
    "include-unsupported-proxy": boolean
  }
}

type Proxies = object[]

declare function produceArtifact(sub: Sub): Promise<Proxies>
