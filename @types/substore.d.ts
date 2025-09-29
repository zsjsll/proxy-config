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
}
