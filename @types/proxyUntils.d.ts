declare const ProxyUtils: {
  yaml: {
    safeLoad: (filePath: string | string[]) => Config
    safeDump: (obj: object) => string
  }

  getFlag: (serverName: string | object[]) => void
  removeFlag: (serverName: string | object[]) => void
  getISO: (serverName: string) => string
}
