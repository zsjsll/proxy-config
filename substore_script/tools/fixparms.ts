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
