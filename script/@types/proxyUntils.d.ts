declare const ProxyUtils: {
  yaml: {
    safeLoad: (filePath: string | string[]) => Config
    safeDump: (obj: object) => string
  }

  getFlag: (serverName: string | object[]|undefined) => string
  removeFlag: (serverName: string | object[]) => void
  getISO: (serverName: string) => string|undefined
}
