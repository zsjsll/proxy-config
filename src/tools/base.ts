export function fixBoolean(args: string | boolean): boolean {
  if (typeof args === "boolean") return args
  if (args === "true") return true
  if (args === "false") return false
  throw new Error(`传入参数错误，${args}应该为boolean`)
}

export function fixArray(args: string[] | string): string[] {
  if (typeof args === "string") return args.split(/[|, ]/)
  return args
}

export function fixNumber(args: number | string): number {
  const num = Number(args)

  if (!Number.isNaN(num)) return num

  throw new Error(`传入参数错误，${args}应该为number`)
}

export function getContent() {
  let content = ProxyUtils.yaml.safeLoad($content)
  if (Object.keys(content).length === 0) content = ProxyUtils.yaml.safeLoad($files[0])

  return content
}

export function saveContent(content: Config) {
  $content = ProxyUtils.yaml.safeDump(content)
}
