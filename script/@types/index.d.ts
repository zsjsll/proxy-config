import type { Airport } from "./clash-config"

declare module "./clash-config.d.ts" {
  interface ProxyProviders {
    [x: string]: Airport
  }
}

declare global {
  type ProxyProviders = ClashConfig.ProxyProviders
}
