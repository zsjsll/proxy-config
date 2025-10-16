export function fixBoolen(args: string | boolean): boolean {
  if (typeof args === "boolean") return args
  if (args === "true") return true
  if (args === "false") return false
  throw new Error(`传入参数错误，${args}应该为boolen`)
}

export function fixArray(args: string[] | string): string[] {
  if (typeof args !== "string") return args
  //  throw new Error(`传入参数错误，${args}应该为string`)
  return args.split(/[|, ]/)
}
